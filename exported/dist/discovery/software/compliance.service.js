"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ComplianceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceService = void 0;
exports.evaluatePolicy = evaluatePolicy;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_service_1 = require("../audit/audit.service");
const jobs_service_1 = require("../jobs/jobs.service");
const device_repository_1 = require("../store/device.repository");
const compliance_repository_1 = require("./compliance.repository");
const deployment_service_1 = require("./deployment.service");
const package_service_1 = require("./package.service");
const software_util_1 = require("./software.util");
const target_resolver_1 = require("./target.resolver");
const SYSTEM = { userId: null, name: 'system', ip: null, requestId: null };
function evaluatePolicy(policy, software) {
    const matches = software.filter((s) => (0, software_util_1.matchesGlob)(policy.appNameMatch, s.name) && (!policy.publisherMatch || (0, software_util_1.matchesGlob)(policy.publisherMatch, s.publisher)));
    const label = (s) => `${s.name}${s.version ? ' ' + s.version : ''}`;
    switch (policy.ruleType) {
        case 'banned':
            return matches.length ? { policyId: policy.id, softwareName: matches[0].name, detectedVersion: matches[0].version, detail: `Banned software present: ${matches.map(label).join(', ')}` } : null;
        case 'required':
            return matches.length ? null : { policyId: policy.id, softwareName: null, detectedVersion: null, detail: `Required software missing: ${policy.appNameMatch}` };
        case 'version_floor': {
            if (!matches.length)
                return null;
            const bad = matches.filter((s) => (0, software_util_1.compareVersions)(s.version, policy.versionValue) < 0);
            return bad.length ? { policyId: policy.id, softwareName: bad[0].name, detectedVersion: bad[0].version, detail: `${label(bad[0])} is below the minimum version ${policy.versionValue}` } : null;
        }
        case 'version_ceiling': {
            if (!matches.length)
                return null;
            const bad = matches.filter((s) => (0, software_util_1.compareVersions)(s.version, policy.versionValue) > 0);
            return bad.length ? { policyId: policy.id, softwareName: bad[0].name, detectedVersion: bad[0].version, detail: `${label(bad[0])} is above the maximum allowed version ${policy.versionValue}` } : null;
        }
        default:
            return null;
    }
}
let ComplianceService = ComplianceService_1 = class ComplianceService {
    constructor(dataSource, repo, devices, targets, jobs, packages, audit) {
        this.dataSource = dataSource;
        this.repo = repo;
        this.devices = devices;
        this.targets = targets;
        this.jobs = jobs;
        this.packages = packages;
        this.audit = audit;
        this.logger = new common_1.Logger(ComplianceService_1.name);
    }
    onModuleInit() {
        this.jobs.registerTerminalHook(async (schema, job) => this.onRemediationJob(schema, job));
    }
    validate(p, isNew) {
        if (isNew && !p.name?.trim())
            throw new common_1.BadRequestException('name is required');
        if (isNew && !p.appNameMatch?.trim())
            throw new common_1.BadRequestException('appNameMatch is required (use * as wildcard, e.g. "TeamViewer*")');
        if (p.ruleType && !['banned', 'required', 'version_floor', 'version_ceiling'].includes(p.ruleType))
            throw new common_1.BadRequestException('ruleType must be banned | required | version_floor | version_ceiling');
        const needsVersion = ['version_floor', 'version_ceiling'].includes(p.ruleType ?? '');
        if (needsVersion && !p.versionValue?.trim())
            throw new common_1.BadRequestException('versionValue is required for version_floor / version_ceiling policies');
        if (p.remediationAction === 'install' && !p.remediationPackageId)
            throw new common_1.BadRequestException("remediationAction 'install' needs a remediationPackageId (an approved package)");
        if (p.remediationAction === 'uninstall' && p.ruleType && !['banned', 'version_ceiling'].includes(p.ruleType))
            throw new common_1.BadRequestException("remediationAction 'uninstall' only makes sense for banned / version_ceiling policies");
    }
    listPolicies(schema) { return this.repo.listPolicies(schema); }
    async createPolicy(schema, actor, p) {
        this.validate(p, true);
        if (p.remediationPackageId)
            await this.packages.get(schema, String(p.remediationPackageId));
        const created = await this.repo.insertPolicy(schema, p, { userId: actor.userId, name: actor.name });
        this.evaluateAll(schema).catch((e) => this.logger.warn(`evaluate after policy create: ${e?.message}`));
        return created;
    }
    async updatePolicy(schema, id, p) {
        this.validate(p, false);
        const out = await this.repo.updatePolicy(schema, id, p);
        if (!out)
            throw new common_1.NotFoundException('Policy not found');
        this.evaluateAll(schema).catch((e) => this.logger.warn(`evaluate after policy update: ${e?.message}`));
        return out;
    }
    async deletePolicy(schema, id) {
        if (!(await this.repo.deletePolicy(schema, id)))
            throw new common_1.NotFoundException('Policy not found');
    }
    async evaluateDevice(schema, deviceId, policies) {
        const pols = policies ?? (await this.repo.listPolicies(schema, true));
        if (!pols.length)
            return { violations: 0, resolved: await this.repo.resolveExcept(schema, deviceId, []) };
        const device = (await this.devices.listDevices(schema, { selectedIds: [deviceId] }))[0];
        if (!device)
            return { violations: 0, resolved: 0 };
        const software = await this.repo.installedSoftware(schema, deviceId);
        const violating = [];
        for (const p of pols) {
            if (!this.targets.matches(device, p.scopeSelector))
                continue;
            const v = evaluatePolicy(p, software);
            if (v) {
                violating.push(p.id);
                await this.repo.upsertViolation(schema, p.id, deviceId, v.softwareName, v.detectedVersion, v.detail);
            }
        }
        const resolved = await this.repo.resolveExcept(schema, deviceId, violating);
        return { violations: violating.length, resolved };
    }
    async evaluateAll(schema) {
        const pols = await this.repo.listPolicies(schema, true);
        const ids = await this.repo.devicesWithSoftware(schema);
        let violations = 0;
        for (const id of ids) {
            try {
                violations += (await this.evaluateDevice(schema, id, pols)).violations;
            }
            catch (err) {
                this.logger.debug(`evaluate ${id}: ${err?.message}`);
            }
        }
        return { devices: ids.length, violations };
    }
    async nightly() {
        let schemas = [];
        try {
            const rows = await this.dataSource.query(`SELECT DISTINCT table_schema FROM information_schema.tables WHERE table_name = 'discovery_compliance_policy' AND table_schema LIKE 'org\\_%' ESCAPE '\\'`);
            schemas = rows.map((r) => r.table_schema);
        }
        catch {
            return;
        }
        for (const schema of schemas) {
            try {
                const expired = await this.repo.expireWaivers(schema);
                const r = await this.evaluateAll(schema);
                this.logger.log(`Compliance ${schema}: ${r.devices} device(s) evaluated, ${r.violations} violation(s), ${expired} waiver(s) expired`);
                await this.audit.record(schema, SYSTEM, { action: 'compliance.nightly', targetType: 'org', params: { ...r, waiversExpired: expired } });
            }
            catch (err) {
                this.logger.warn(`Compliance nightly ${schema}: ${err?.message}`);
            }
        }
    }
    listFindings(schema, f) { return this.repo.listFindings(schema, f); }
    findingsForDevice(schema, deviceId) { return this.repo.findingsForDevice(schema, deviceId); }
    summary(schema) { return this.repo.summary(schema); }
    async waive(schema, actor, id, reason, until) {
        if (!reason || reason.trim().length < 5)
            throw new common_1.BadRequestException('A waiver needs a reason (at least 5 characters)');
        if (until && isNaN(Date.parse(until)))
            throw new common_1.BadRequestException('until must be an ISO date');
        const f = await this.repo.getFinding(schema, id);
        if (!f)
            throw new common_1.NotFoundException('Finding not found');
        if (f.status === 'resolved')
            throw new common_1.BadRequestException('Finding is already resolved');
        return (await this.repo.setFindingStatus(schema, id, 'waived', { waiverReason: reason.trim(), waivedBy: actor.userId, waivedByName: actor.name, waivedUntil: until }));
    }
    async unwaive(schema, id) {
        const f = await this.repo.getFinding(schema, id);
        if (!f)
            throw new common_1.NotFoundException('Finding not found');
        if (f.status !== 'waived')
            throw new common_1.BadRequestException('Finding is not waived');
        return (await this.repo.setFindingStatus(schema, id, 'open'));
    }
    async remediate(schema, actor, id) {
        const f = await this.repo.getFinding(schema, id);
        if (!f)
            throw new common_1.NotFoundException('Finding not found');
        if (!['open', 'approved'].includes(f.status))
            throw new common_1.BadRequestException(`Finding is '${f.status}' — only open findings can be remediated`);
        const policy = await this.repo.getPolicy(schema, f.policyId);
        if (!policy)
            throw new common_1.NotFoundException('Policy not found');
        let job;
        if (policy.remediationAction === 'uninstall' || (policy.remediationAction === 'alert' && ['banned', 'version_ceiling'].includes(policy.ruleType))) {
            const sw = (await this.repo.installedSoftware(schema, f.deviceId)).find((s) => s.name === f.softwareName) ?? null;
            if (!sw)
                throw new common_1.BadRequestException('The offending software is no longer in the inventory — re-evaluate');
            job = await this.uninstall(schema, actor, f.deviceId, sw.id, null, { findingId: f.id });
        }
        else if (policy.remediationAction === 'install' && policy.remediationPackageId) {
            const pkg = await this.packages.get(schema, policy.remediationPackageId);
            if (pkg.status !== 'approved')
                throw new common_1.BadRequestException(`Remediation package '${pkg.name}' is ${pkg.status} — approve it first`);
            job = await this.jobs.createJob(schema, actor, {
                type: 'SOFTWARE_INSTALL', deviceId: f.deviceId, targetLabel: `${pkg.name} ${pkg.version} · remediation of '${policy.name}'`,
                payload: deployment_service_1.DeploymentService.installPayload(pkg, { findingId: f.id, rebootPolicy: 'never' }), maxAttempts: 2,
            });
        }
        else {
            throw new common_1.BadRequestException("This policy's remediation action is 'none'/'alert' with no package — set remediationAction to uninstall or install (with a package) first");
        }
        const finding = (await this.repo.setFindingStatus(schema, id, job.status === 'pending_approval' ? 'approved' : 'remediating', { remediationJobId: job.id }));
        return { finding, job };
    }
    async onRemediationJob(schema, job) {
        if (!['SOFTWARE_INSTALL', 'SOFTWARE_UNINSTALL'].includes(job.type))
            return;
        const f = await this.repo.findingByJob(schema, job.id);
        if (!f)
            return;
        if (job.status === 'succeeded') {
            await this.repo.setFindingStatus(schema, f.id, 'remediating');
            if (job.deviceId)
                this.evaluateDevice(schema, job.deviceId).catch(() => undefined);
        }
        else {
            await this.repo.setFindingStatus(schema, f.id, 'open');
        }
    }
    listProtected(schema) { return this.repo.listProtected(schema); }
    async addProtected(schema, actor, nameMatch, publisherMatch, reason) {
        if (!nameMatch?.trim())
            throw new common_1.BadRequestException('nameMatch is required (use * as wildcard)');
        return this.repo.insertProtected(schema, nameMatch, publisherMatch, reason, actor.userId);
    }
    async removeProtected(schema, id) {
        if (!(await this.repo.deleteProtected(schema, id)))
            throw new common_1.NotFoundException('Protected entry not found');
    }
    async uninstall(schema, actor, deviceId, softwareId, silentArgs, extra = {}) {
        const sw = await this.repo.installedSoftwareRow(schema, softwareId);
        if (!sw || sw.deviceId !== String(deviceId))
            throw new common_1.NotFoundException('Installed software row not found on this device');
        const prot = (0, software_util_1.isProtected)(await this.repo.listProtected(schema), sw.name, sw.publisher);
        if (prot)
            throw new common_1.BadRequestException(`'${sw.name}' is on the protected-software list (${prot.reason || prot.nameMatch}) — it cannot be uninstalled from the portal`);
        let args = silentArgs?.trim() || null;
        const isMsi = !!sw.productCode || /msiexec/i.test(sw.uninstallString ?? '');
        if (!isMsi && !args) {
            const pkgs = await this.packages.list(schema, { search: sw.name, status: 'approved' });
            const same = pkgs.find((p) => p.name.toLowerCase() === sw.name.toLowerCase() && p.silentUninstallArgs);
            args = same?.silentUninstallArgs ?? null;
            if (!args)
                throw new common_1.BadRequestException(`'${sw.name}' is not an MSI and has no known silent uninstall arguments — supply silentArgs (e.g. /S) or add the package to the repository with silentUninstallArgs`);
        }
        if (!sw.productCode && !sw.uninstallString)
            throw new common_1.BadRequestException(`'${sw.name}' has neither a product code nor an UninstallString in the inventory — it cannot be removed unattended`);
        return this.jobs.createJob(schema, actor, {
            type: 'SOFTWARE_UNINSTALL', deviceId, targetLabel: `${sw.name}${sw.version ? ' ' + sw.version : ''}`,
            payload: { softwareId: sw.id, softwareName: sw.name, version: sw.version, productCode: sw.productCode, uninstallString: sw.uninstallString, silentArgs: args, reinventory: true, ...extra },
            maxAttempts: 2,
        });
    }
};
exports.ComplianceService = ComplianceService;
__decorate([
    (0, schedule_1.Cron)('30 2 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceService.prototype, "nightly", null);
exports.ComplianceService = ComplianceService = ComplianceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        compliance_repository_1.ComplianceRepository,
        device_repository_1.DeviceRepository,
        target_resolver_1.TargetResolver,
        jobs_service_1.JobsService,
        package_service_1.PackageService,
        audit_service_1.AuditService])
], ComplianceService);
