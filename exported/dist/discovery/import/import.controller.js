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
exports.DiscoveryImportController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const asset_items_service_1 = require("../../assets-data/asset-items/asset-items.service");
const request_context_service_1 = require("../../common/context/request-context.service");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
const import_dto_1 = require("./dto/import.dto");
const import_service_1 = require("./import.service");
const discovery_permissions_1 = require("../rbac/discovery-permissions");
let DiscoveryImportController = class DiscoveryImportController {
    constructor(discoveryImportService, requestContext, assetItemsService) {
        this.discoveryImportService = discoveryImportService;
        this.requestContext = requestContext;
        this.assetItemsService = assetItemsService;
    }
    resolveSchema() {
        const schema = this.requestContext.get('schema');
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
        return schema;
    }
    resolveOrganizationId(req) {
        const encryptedOrgId = req.cookies?.organization_id;
        if (!encryptedOrgId) {
            throw new common_1.BadRequestException('Missing organization_id cookie');
        }
        const orgId = Number((0, crypto_utils_1.decrypt)(encryptedOrgId.toString()));
        if (isNaN(orgId)) {
            throw new common_1.BadRequestException('Invalid organization ID');
        }
        return orgId;
    }
    async resolveUserId(req) {
        const systemUserId = req.cookies?.system_user_id;
        if (!systemUserId) {
            throw new common_1.BadRequestException('Missing system_user_id cookie');
        }
        const decrypted = (0, crypto_utils_1.decrypt)(systemUserId.toString());
        return this.assetItemsService.getUserByPublicID(Number(decrypted));
    }
    async suggest(dto) {
        try {
            const schema = this.resolveSchema();
            return await this.discoveryImportService.suggest(schema, dto?.deviceIds);
        }
        catch (error) {
            console.error('Discovery import suggest error:', error);
            return {
                status: false,
                message: error?.message ?? 'Failed to build import suggestions',
                error: error?.message ?? String(error),
            };
        }
    }
    async execute(dto, req) {
        try {
            const schema = this.resolveSchema();
            const organizationId = this.resolveOrganizationId(req);
            const userId = await this.resolveUserId(req);
            return await this.discoveryImportService.execute(schema, dto, organizationId, userId, req);
        }
        catch (error) {
            console.error('Discovery import execute error:', error);
            return {
                status: false,
                message: error?.message ?? 'Failed to import devices',
                error: error?.message ?? String(error),
            };
        }
    }
};
exports.DiscoveryImportController = DiscoveryImportController;
__decorate([
    (0, common_1.Post)('suggest'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Import, 'VIEW'),
    (0, swagger_1.ApiOperation)({
        summary: 'Suggest category/subcategory/item, title, dedupe status and spec->field matches for discovered devices',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_dto_1.SuggestImportDto]),
    __metadata("design:returntype", Promise)
], DiscoveryImportController.prototype, "suggest", null);
__decorate([
    (0, common_1.Post)('execute'),
    (0, discovery_permissions_1.RequireDiscovery)(discovery_permissions_1.DiscoverySub.Import, 'IMPORT'),
    (0, swagger_1.ApiOperation)({
        summary: 'Import discovered devices into the real asset database (creates assets + stock, or patches an existing discovery-linked serial when mode="update")',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_dto_1.ExecuteImportDto, Object]),
    __metadata("design:returntype", Promise)
], DiscoveryImportController.prototype, "execute", null);
exports.DiscoveryImportController = DiscoveryImportController = __decorate([
    (0, swagger_1.ApiTags)('Discovery Import'),
    (0, common_1.Controller)('discovery/import'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [import_service_1.DiscoveryImportService,
        request_context_service_1.RequestContextService,
        asset_items_service_1.AssetItemsService])
], DiscoveryImportController);
