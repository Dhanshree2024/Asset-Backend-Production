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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const request_context_service_1 = require("../../common/context/request-context.service");
const audit_service_1 = require("../audit/audit.service");
const discovery_permission_guard_1 = require("../rbac/discovery-permission.guard");
const discovery_permissions_1 = require("../rbac/discovery-permissions");
const package_service_1 = require("./package.service");
const MAX_UPLOAD_BYTES = Number(process.env.DISCOVERY_PACKAGE_MAX_MB || 2048) * 1024 * 1024;
let PackageController = class PackageController {
    constructor(packages, audit, requestContext) {
        this.packages = packages;
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
    async list(status, search, kind) {
        try {
            return { status: true, packages: await this.packages.list(this.resolveSchema(), { status, search, kind }) };
        }
        catch (error) {
            return { status: false, message: 'Failed to list packages', error: error?.message ?? String(error), packages: [] };
        }
    }
    async get(id) {
        return { status: true, package: await this.packages.get(this.resolveSchema(), id) };
    }
    async upload(file, body, req) {
        if (!file)
            throw new common_1.BadRequestException("No file received — send multipart/form-data with a 'file' part");
        let meta;
        try {
            meta = body?.meta ? JSON.parse(body.meta) : body;
        }
        catch {
            throw new common_1.BadRequestException("'meta' must be a JSON string");
        }
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const pkg = await this.audit.wrap(schema, actor, { action: 'package.upload', targetType: 'package', targetLabel: `${meta?.name} ${meta?.version}`, params: { ...meta, fileName: file.originalname, sizeBytes: file.size } }, () => this.packages.upload(schema, actor, meta, file.path, file.originalname, file.size));
        return { status: true, package: pkg, message: 'Package uploaded — awaiting approval by another administrator' };
    }
    async update(id, body, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const pkg = await this.audit.wrap(schema, actor, { action: 'package.update', targetType: 'package', targetId: id, params: { ...body } }, () => this.packages.update(schema, id, body));
        return { status: true, package: pkg };
    }
    async approve(id, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const pkg = await this.audit.wrap(schema, actor, { action: 'package.approve', targetType: 'package', targetId: id }, () => this.packages.approve(schema, actor, id));
        return { status: true, package: pkg };
    }
    async reject(id, body, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const pkg = await this.audit.wrap(schema, actor, { action: 'package.reject', targetType: 'package', targetId: id, params: { reason: body?.reason ?? null } }, () => this.packages.reject(schema, id, body?.reason ?? null));
        return { status: true, package: pkg };
    }
    async retire(id, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        const pkg = await this.audit.wrap(schema, actor, { action: 'package.retire', targetType: 'package', targetId: id }, () => this.packages.retire(schema, id));
        return { status: true, package: pkg };
    }
    async remove(id, req) {
        const schema = this.resolveSchema();
        const actor = this.audit.actor(req);
        await this.audit.wrap(schema, actor, { action: 'package.delete', targetType: 'package', targetId: id }, () => this.packages.remove(schema, id));
        return { status: true };
    }
};
exports.PackageController = PackageController;
__decorate([
    (0, common_1.Get)(),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Packages, 'VIEW'),
    (0, swagger_1.ApiOperation)({ summary: 'List software packages' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('kind')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PackageController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Packages, 'VIEW'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PackageController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Packages, 'ADD'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload an installer (msi/exe/ps1) with its metadata; server computes SHA-256' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({ destination: path.join(os.tmpdir(), 'discovery-uploads'), filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname || '')}`) }),
        limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
        fileFilter: (_req, file, cb) => {
            const ext = path.extname(file.originalname || '').toLowerCase();
            if (!['.msi', '.exe', '.ps1'].includes(ext))
                return cb(new common_1.BadRequestException('Only .msi, .exe and .ps1 files can be uploaded'), false);
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PackageController.prototype, "upload", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Packages, 'EDIT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PackageController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Packages, 'EDIT'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a package (uploader cannot approve their own upload)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PackageController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Packages, 'EDIT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PackageController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(':id/retire'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Packages, 'EDIT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PackageController.prototype, "retire", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Packages, 'DELETE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PackageController.prototype, "remove", null);
exports.PackageController = PackageController = __decorate([
    (0, swagger_1.ApiTags)('Discovery Packages'),
    (0, common_1.Controller)('discovery/packages'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard, discovery_permission_guard_1.DiscoveryPermissionGuard),
    __metadata("design:paramtypes", [package_service_1.PackageService,
        audit_service_1.AuditService,
        request_context_service_1.RequestContextService])
], PackageController);
