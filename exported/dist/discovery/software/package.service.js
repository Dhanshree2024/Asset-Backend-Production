"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PackageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const package_repository_1 = require("./package.repository");
const SAFE_NAME = /[^A-Za-z0-9._-]/g;
let PackageService = PackageService_1 = class PackageService {
    constructor(repo) {
        this.repo = repo;
        this.logger = new common_1.Logger(PackageService_1.name);
    }
    static storageRoot() {
        return path.resolve(process.env.DISCOVERY_PACKAGE_DIR || path.join(process.cwd(), 'storage', 'discovery-packages'));
    }
    static async sha256File(file) {
        return new Promise((resolve, reject) => {
            const h = (0, crypto_1.createHash)('sha256');
            (0, fs_1.createReadStream)(file).on('data', (d) => h.update(d)).on('error', reject).on('end', () => resolve(h.digest('hex')));
        });
    }
    validateMeta(meta, fileName) {
        if (!meta?.name?.trim())
            throw new common_1.BadRequestException('name is required');
        if (!meta?.version?.trim())
            throw new common_1.BadRequestException('version is required');
        if (!['msi', 'exe', 'ps1'].includes(meta.installerType))
            throw new common_1.BadRequestException("installerType must be 'msi', 'exe' or 'ps1'");
        if (meta.kind && !['software', 'agent'].includes(meta.kind))
            throw new common_1.BadRequestException("kind must be 'software' or 'agent'");
        if (meta.kind === 'agent' && meta.installerType === 'ps1')
            throw new common_1.BadRequestException('The agent installer package must be the MSI (preferred) or the published AssetDiscoveryAgent.exe — not a script');
        const ext = path.extname(fileName).toLowerCase().replace('.', '');
        if (ext !== meta.installerType)
            throw new common_1.BadRequestException(`The uploaded file is .${ext || '?'} but installerType is ${meta.installerType}`);
        if (meta.installerType === 'exe' && meta.kind !== 'agent' && !meta.silentInstallArgs?.trim()) {
            throw new common_1.BadRequestException('EXE installers need silentInstallArgs (e.g. /S, /quiet, /VERYSILENT) — the agent never shows an installer UI');
        }
        if (meta.productCode && !/^\{[0-9A-Fa-f-]{36}\}$/.test(meta.productCode.trim())) {
            throw new common_1.BadRequestException('productCode must be an MSI GUID like {12345678-1234-1234-1234-123456789012}');
        }
        if (meta.expectedSha256 && !/^[A-Fa-f0-9]{64}$/.test(meta.expectedSha256.trim()))
            throw new common_1.BadRequestException('expectedSha256 must be 64 hex characters');
        if (meta.requireSignature && !meta.signatureSubject?.trim())
            throw new common_1.BadRequestException('requireSignature needs the expected signer subject (e.g. "CN=Contoso Ltd, O=Contoso Ltd, …")');
        const dr = meta.detectionRule;
        if (dr) {
            const ok = (dr.type === 'registry' && dr.key) || (dr.type === 'file' && dr.path) || (dr.type === 'service' && dr.name) || (dr.type === 'software' && dr.nameMatch);
            if (!ok)
                throw new common_1.BadRequestException('detectionRule must be one of registry{hive,key}, file{path}, service{name}, software{nameMatch}');
        }
    }
    async upload(schema, actor, meta, tmpPath, originalName, sizeBytes) {
        const fileName = (originalName || 'package').replace(SAFE_NAME, '_').slice(0, 160);
        try {
            this.validateMeta(meta, fileName);
            const sha256 = await PackageService_1.sha256File(tmpPath);
            if (meta.expectedSha256 && meta.expectedSha256.trim().toLowerCase() !== sha256) {
                throw new common_1.BadRequestException(`Checksum mismatch: server computed ${sha256}, you supplied ${meta.expectedSha256.trim().toLowerCase()} — upload rejected`);
            }
            const pkg = await this.repo.insert(schema, meta, { fileName, fileRef: 'pending', sizeBytes, sha256 }, { userId: actor.userId, name: actor.name });
            const dir = path.join(PackageService_1.storageRoot(), schema, pkg.id);
            await fs_1.promises.mkdir(dir, { recursive: true });
            const finalPath = path.join(dir, fileName);
            try {
                await fs_1.promises.rename(tmpPath, finalPath);
            }
            catch {
                await fs_1.promises.copyFile(tmpPath, finalPath);
                await fs_1.promises.unlink(tmpPath).catch(() => undefined);
            }
            await this.repo.setFileRef(schema, pkg.id, finalPath);
            return { ...pkg, sizeBytes };
        }
        catch (err) {
            await fs_1.promises.unlink(tmpPath).catch(() => undefined);
            throw err;
        }
    }
    list(schema, opts) { return this.repo.list(schema, opts); }
    async get(schema, id) {
        const p = await this.repo.get(schema, id);
        if (!p)
            throw new common_1.NotFoundException('Package not found');
        return p;
    }
    async update(schema, id, meta) {
        const current = await this.get(schema, id);
        if (meta.installerType && meta.installerType !== current.installerType)
            throw new common_1.BadRequestException('installerType cannot change after upload — upload a new package');
        const p = await this.repo.updateMeta(schema, id, meta);
        if (!p)
            throw new common_1.NotFoundException('Package not found');
        return p;
    }
    async approve(schema, actor, id) {
        const p = await this.get(schema, id);
        if (p.status !== 'pending_approval')
            throw new common_1.BadRequestException(`Package is '${p.status}', not pending approval`);
        if (actor.userId === null)
            throw new common_1.BadRequestException('Approver identity could not be resolved');
        if (p.createdBy !== null && p.createdBy === actor.userId)
            throw new common_1.BadRequestException('You uploaded this package — a different administrator must approve it');
        const out = await this.repo.setStatus(schema, id, 'approved', { approvedBy: actor.userId, approvedByName: actor.name });
        if (p.supersedesId)
            await this.repo.markSuperseded(schema, p.supersedesId);
        return out;
    }
    async reject(schema, id, reason) {
        const p = await this.get(schema, id);
        if (p.status !== 'pending_approval')
            throw new common_1.BadRequestException(`Package is '${p.status}', not pending approval`);
        return (await this.repo.setStatus(schema, id, 'rejected', { rejectedReason: reason }));
    }
    async retire(schema, id) {
        const p = await this.get(schema, id);
        if (!['approved', 'superseded'].includes(p.status))
            throw new common_1.BadRequestException('Only approved / superseded packages can be retired');
        return (await this.repo.setStatus(schema, id, 'retired'));
    }
    async remove(schema, id) {
        const used = await this.repo.usageCount(schema, id);
        if (used > 0)
            throw new common_1.BadRequestException(`Package is referenced by ${used} deployment(s) — retire it instead of deleting`);
        const gone = await this.repo.delete(schema, id);
        if (!gone)
            throw new common_1.NotFoundException('Package not found');
        if (gone.fileRef && gone.fileRef !== 'pending') {
            await fs_1.promises.rm(path.dirname(gone.fileRef), { recursive: true, force: true }).catch((e) => this.logger.warn(`could not delete ${gone.fileRef}: ${e?.message}`));
        }
    }
    async fileForDownload(schema, id) {
        const f = await this.repo.fileRef(schema, id);
        if (!f)
            throw new common_1.NotFoundException('Package not found');
        if (!['approved', 'superseded'].includes(f.status))
            throw new common_1.BadRequestException(`Package is '${f.status}' — only approved packages can be downloaded by agents`);
        await fs_1.promises.access(f.fileRef).catch(() => { throw new common_1.NotFoundException('Package file is missing from storage — re-upload it'); });
        return { path: f.fileRef, fileName: f.fileName, sha256: f.sha256, sizeBytes: f.sizeBytes };
    }
};
exports.PackageService = PackageService;
exports.PackageService = PackageService = PackageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [package_repository_1.PackageRepository])
], PackageService);
