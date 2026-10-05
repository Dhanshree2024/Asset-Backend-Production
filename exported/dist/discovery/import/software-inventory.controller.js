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
exports.SoftwareInventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_guard_1 = require("../../auth/api-key.guard");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const asset_items_service_1 = require("../../assets-data/asset-items/asset-items.service");
const request_context_service_1 = require("../../common/context/request-context.service");
const crypto_utils_1 = require("../../common/encryption_decryption/crypto-utils");
const redis_service_1 = require("../../common/redis/redis.service");
const software_inventory_service_1 = require("./software-inventory.service");
let SoftwareInventoryController = class SoftwareInventoryController {
    constructor(softwareInventory, requestContext, assetItemsService, redisService) {
        this.softwareInventory = softwareInventory;
        this.requestContext = requestContext;
        this.assetItemsService = assetItemsService;
        this.redisService = redisService;
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
        if (!encryptedOrgId)
            throw new common_1.BadRequestException('Missing organization_id cookie');
        const orgId = Number((0, crypto_utils_1.decrypt)(encryptedOrgId.toString()));
        if (isNaN(orgId))
            throw new common_1.BadRequestException('Invalid organization ID');
        return orgId;
    }
    async resolveUserId(req) {
        const systemUserId = req.cookies?.system_user_id;
        if (!systemUserId)
            throw new common_1.BadRequestException('Missing system_user_id cookie');
        return this.assetItemsService.getUserByPublicID(Number((0, crypto_utils_1.decrypt)(systemUserId.toString())));
    }
    async bustCaches(schema) {
        try {
            await this.redisService.incr(`serials_version:${schema}`);
            await this.redisService.delByPattern('software-list:*');
            await this.redisService.delByPattern('perpetualSoftwares-list:*');
        }
        catch (err) {
            console.error('software-inventory: cache invalidation failed', err);
        }
    }
    async listForSerial(serialId) {
        try {
            const schema = this.resolveSchema();
            const data = await this.softwareInventory.listForSerial(schema, Number(serialId));
            return { status: true, data };
        }
        catch (error) {
            return { status: false, message: error?.message ?? 'Failed to load discovered software', data: null };
        }
    }
    async suggestOne(serialId, softwareKey) {
        try {
            const schema = this.resolveSchema();
            const data = await this.softwareInventory.suggestOneForSerial(schema, Number(serialId), String(softwareKey || ''));
            return { status: true, data };
        }
        catch (error) {
            return { status: false, message: error?.message ?? 'Failed to build suggestion', data: null };
        }
    }
    async track(serialId, body, req) {
        try {
            const schema = this.resolveSchema();
            const organizationId = this.resolveOrganizationId(req);
            const userId = await this.resolveUserId(req);
            const result = await this.softwareInventory.trackFromSerial(schema, Number(serialId), body ?? {}, organizationId, userId, req);
            await this.bustCaches(schema);
            const ok = result.status === 'TRACKED' || (result.status === 'NOT_TRACKED' && body?.maintainInventory === false);
            return { status: ok, data: result, message: result.message };
        }
        catch (error) {
            return { status: false, message: error?.message ?? 'Failed to track software' };
        }
    }
    async untrack(decisionId, req) {
        try {
            const schema = this.resolveSchema();
            const userId = await this.resolveUserId(req);
            const data = await this.softwareInventory.untrack(schema, Number(decisionId), userId);
            await this.bustCaches(schema);
            return { status: true, data };
        }
        catch (error) {
            return { status: false, message: error?.message ?? 'Failed to untrack software' };
        }
    }
};
exports.SoftwareInventoryController = SoftwareInventoryController;
__decorate([
    (0, common_1.Get)('serial/:serialId'),
    (0, swagger_1.ApiOperation)({ summary: 'Discovered software for a host serial with inventory-tracking flags (Software tab)' }),
    __param(0, (0, common_1.Param)('serialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SoftwareInventoryController.prototype, "listForSerial", null);
__decorate([
    (0, common_1.Get)('serial/:serialId/suggest'),
    (0, swagger_1.ApiOperation)({ summary: 'Match / seat / governance suggestion for one discovered software (Track software dialog)' }),
    __param(0, (0, common_1.Param)('serialId')),
    __param(1, (0, common_1.Query)('softwareKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SoftwareInventoryController.prototype, "suggestOne", null);
__decorate([
    (0, common_1.Post)('serial/:serialId/track'),
    (0, swagger_1.ApiOperation)({ summary: 'Track now — create/use a software seat and link it INSTALLED_ON this host' }),
    __param(0, (0, common_1.Param)('serialId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SoftwareInventoryController.prototype, "track", null);
__decorate([
    (0, common_1.Post)('decision/:decisionId/untrack'),
    (0, swagger_1.ApiOperation)({ summary: 'Untrack — unlink the INSTALLED_ON edge and mark the software as not mapped' }),
    __param(0, (0, common_1.Param)('decisionId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SoftwareInventoryController.prototype, "untrack", null);
exports.SoftwareInventoryController = SoftwareInventoryController = __decorate([
    (0, swagger_1.ApiTags)('Discovery Software Inventory'),
    (0, common_1.Controller)('discovery/software-inventory'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [software_inventory_service_1.SoftwareInventoryService,
        request_context_service_1.RequestContextService,
        asset_items_service_1.AssetItemsService,
        redis_service_1.RedisService])
], SoftwareInventoryController);
