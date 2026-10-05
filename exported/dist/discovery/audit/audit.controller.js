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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const request_context_service_1 = require("../../common/context/request-context.service");
const audit_service_1 = require("./audit.service");
const discovery_permission_guard_1 = require("../rbac/discovery-permission.guard");
const discovery_permissions_1 = require("../rbac/discovery-permissions");
let AuditController = class AuditController {
    constructor(audit, requestContext) {
        this.audit = audit;
        this.requestContext = requestContext;
    }
    resolveSchema() {
        const schema = this.requestContext.get('schema');
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
        return schema;
    }
    async list(action, actorUserId, targetType, targetId, from, to, limit, offset) {
        try {
            const schema = this.resolveSchema();
            const { rows, total } = await this.audit.list(schema, {
                action,
                actorUserId: actorUserId ? Number(actorUserId) : undefined,
                targetType,
                targetId,
                from,
                to,
                limit: limit ? Number(limit) : undefined,
                offset: offset ? Number(offset) : undefined,
            });
            return { status: true, entries: rows, total };
        }
        catch (error) {
            console.error('Discovery audit list error:', error);
            return { status: false, message: 'Failed to list audit entries', error: error?.message ?? String(error), entries: [], total: 0 };
        }
    }
    async exportCsv(q, res) {
        const schema = this.resolveSchema();
        const filters = {
            action: q.action || undefined, actorUserId: q.actorUserId ? Number(q.actorUserId) : undefined,
            targetType: q.targetType || undefined, targetId: q.targetId || undefined,
            from: q.from || undefined, to: q.to || undefined,
        };
        const entries = [];
        for (let page = 0; page < 10; page++) {
            const { rows } = await this.audit.list(schema, { ...filters, limit: 1000, offset: page * 1000 });
            entries.push(...rows);
            if (rows.length < 1000)
                break;
        }
        const esc = (v) => { const t = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
        const cols = ['id', 'createdAt', 'actorUserId', 'actorName', 'actorIp', 'action', 'targetType', 'targetId', 'targetLabel', 'result', 'error', 'jobId', 'paramsRedacted'];
        const lines = [cols.join(',')].concat(entries.map((e) => cols.map((c) => esc(e[c])).join(',')));
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="discovery-audit-${new Date().toISOString().slice(0, 10)}.csv"`);
        res.send('\uFEFF' + lines.join('\n'));
    }
};
exports.AuditController = AuditController;
__decorate([
    (0, common_1.Get)(),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Audit, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'Filterable, append-only audit trail for the discovery module' }),
    __param(0, (0, common_1.Query)('action')),
    __param(1, (0, common_1.Query)('actorUserId')),
    __param(2, (0, common_1.Query)('targetType')),
    __param(3, (0, common_1.Query)('targetId')),
    __param(4, (0, common_1.Query)('from')),
    __param(5, (0, common_1.Query)('to')),
    __param(6, (0, common_1.Query)('limit')),
    __param(7, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('export.csv'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Audit, 'EXPORT'),
    (0, swagger_1.ApiOperation)({ summary: 'Export the (filtered) audit log as CSV — up to 10,000 rows' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "exportCsv", null);
exports.AuditController = AuditController = __decorate([
    (0, swagger_1.ApiTags)('Discovery Audit'),
    (0, common_1.Controller)('discovery/audit'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard, discovery_permission_guard_1.DiscoveryPermissionGuard),
    __metadata("design:paramtypes", [audit_service_1.AuditService,
        request_context_service_1.RequestContextService])
], AuditController);
