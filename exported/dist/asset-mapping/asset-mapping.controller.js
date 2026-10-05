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
exports.AssetMappingController = void 0;
const common_1 = require("@nestjs/common");
const api_key_guard_1 = require("../auth/api-key.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
const redis_service_1 = require("../common/redis/redis.service");
const asset_mapping_service_1 = require("./asset-mapping.service");
const create_asset_mapping_dto_1 = require("./dto/create-asset-mapping.dto");
const create_technical_relationship_dto_1 = require("./dto/create-technical-relationship.dto");
const technical_relationship_query_dto_1 = require("./dto/technical-relationship-query.dto");
const create_governance_rule_dto_1 = require("./dto/create-governance-rule.dto");
const update_asset_mapping_dto_1 = require("./dto/update-asset-mapping.dto");
let AssetMappingController = class AssetMappingController {
    constructor(assetMappingService, redisService) {
        this.assetMappingService = assetMappingService;
        this.redisService = redisService;
    }
    async exportAssetsMappingToExcel(res, page = 1, limit = 10, searchQuery = '', customFiltersStr, asset_id, status) {
        let customFilters = {};
        if (customFiltersStr) {
            try {
                customFilters = JSON.parse(customFiltersStr);
            }
            catch (err) {
                throw new common_1.BadRequestException('Invalid JSON in customFilters parameter');
            }
        }
        const { data } = await this.assetMappingService.findAll(page, limit, searchQuery, customFilters, asset_id, status);
        const buffer = await this.assetMappingService.exportFilteredExcelForAssetsMapping(data);
        res.setHeader('Content-Disposition', `attachment;filename=asset-mapping.xlsx`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    }
    findSingleAsset(mapping_id) {
        return this.assetMappingService.findSingleAssetMapping(mapping_id);
    }
    getAssignmentLogsBySerial(asset_stocks_unique_id) {
        return this.assetMappingService.getAssignmentLogsBySerial(asset_stocks_unique_id);
    }
    async getSingleAssetMapping(mapping_id) {
        return this.assetMappingService.getSingleAssetMapping(mapping_id);
    }
    async assignAssets(dto, req) {
        const organizationID = req.cookies.organization_id;
        const decrypted_organizationID = (0, crypto_utils_1.decrypt)(organizationID);
        const organizationSchema = (0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema']);
        const schema = `org_${organizationSchema}`;
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            throw new common_1.HttpException('Unauthorized: No user ID found', common_1.HttpStatus.UNAUTHORIZED);
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.assetMappingService.getUserByPublicID(Number(decrypted_system_user_id));
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        const result = await this.assetMappingService.assignAssets(dto, userId, Number(decrypted_organizationID), schema, branchIds);
        try {
            await this.redisService.incr(`serials_version:${schema}`);
        }
        catch (err) {
            console.error('Failed to update serials cache version:', err);
        }
        return result;
    }
    async reassignAssets(dto, req) {
        const organizationID = req.cookies.organization_id;
        const decrypted_organizationID = (0, crypto_utils_1.decrypt)(organizationID);
        const organizationSchema = (0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema']);
        const schema = `org_${organizationSchema}`;
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            throw new common_1.HttpException('Unauthorized: No user ID found', common_1.HttpStatus.UNAUTHORIZED);
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.assetMappingService.getUserByPublicID(Number(decrypted_system_user_id));
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        const result = await this.assetMappingService.reassignAssets(dto, userId, schema, branchIds);
        try {
            await this.redisService.incr(`serials_version:${schema}`);
        }
        catch (err) {
            console.error('Failed to update serials cache version:', err);
        }
        return result;
    }
    async returnAssets(dto, req) {
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            throw new common_1.HttpException('Unauthorized: No user ID found', common_1.HttpStatus.UNAUTHORIZED);
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.assetMappingService.getUserByPublicID(Number(decrypted_system_user_id));
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        const schema = `org_${(0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema'])}`;
        const result = await this.assetMappingService.returnAssets(dto, userId, schema, branchIds);
        try {
            await this.redisService.incr(`serials_version:${schema}`);
        }
        catch (err) {
            console.error('Failed to update serials cache version:', err);
        }
        return result;
    }
    async returnScrappedAssets(dto, req) {
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            throw new common_1.HttpException('Unauthorized: No user ID found', common_1.HttpStatus.UNAUTHORIZED);
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.assetMappingService.getUserByPublicID(Number(decrypted_system_user_id));
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        const schema = `org_${(0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema'])}`;
        const result = await this.assetMappingService.returnScrappedAssets(dto, userId, schema, branchIds);
        try {
            await this.redisService.incr(`serials_version:${schema}`);
        }
        catch (err) {
            console.error('Failed to update serials cache version:', err);
        }
        return result;
    }
    async removeAssignedAssets(body, req) {
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            throw new common_1.UnauthorizedException('Unauthorized');
        }
        const decryptedId = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.assetMappingService.getUserByPublicID(Number(decryptedId));
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        const schema = `org_${(0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema'])}`;
        const result = await this.assetMappingService.removeAssignedAssets(body, userId, schema, branchIds);
        try {
            await this.redisService.incr(`serials_version:${schema}`);
        }
        catch (err) {
            console.error('Failed to update serials cache version:', err);
        }
        return {
            status: 'success',
            message: 'Assets unassigned successfully.',
            data: result,
        };
    }
    async createTechnicalRelationship(dto, req) {
        const organizationSchema = (0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema']);
        const schema = `org_${organizationSchema}`;
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            throw new common_1.HttpException('Unauthorized: No user ID found', common_1.HttpStatus.UNAUTHORIZED);
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.assetMappingService.getUserByPublicID(Number(decrypted_system_user_id));
        const result = await this.assetMappingService.createTechnicalRelationship({ ...dto, source: 'manual', agent_flag_only: false }, userId, schema);
        try {
            await this.redisService.incr(`serials_version:${schema}`);
            if (dto.relation_type === 'REL-006') {
                await this.redisService.delByPattern('software-list:*');
                await this.redisService.delByPattern('perpetualSoftwares-list:*');
            }
        }
        catch (err) {
            console.error('Failed to update serials cache version:', err);
        }
        return {
            status: 'success',
            message: 'Technical relationship created successfully.',
            data: result,
        };
    }
    async getAssetRelationships(serialId, req) {
        const organizationSchema = (0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema']);
        const schema = `org_${organizationSchema}`;
        const data = await this.assetMappingService.getAssetRelationships(Number(serialId), schema);
        return {
            status: 'success',
            data,
            total: data.length,
        };
    }
    async getRelationshipTabSummary(serialId, req) {
        const organizationSchema = (0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema']);
        const schema = `org_${organizationSchema}`;
        const data = await this.assetMappingService.getRelationshipTabSummary(Number(serialId), schema);
        return {
            status: 'success',
            data,
        };
    }
    async checkGovernanceByCategory(relationType, sourceMain, sourceSub, sourceItem, targetMain, targetSub, targetItem, req) {
        const organizationSchema = (0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema']);
        const schema = `org_${organizationSchema}`;
        const num = (v) => (v !== undefined && v !== null && v !== '' && !isNaN(Number(v)) ? Number(v) : null);
        let sourceMainId = num(sourceMain);
        if (sourceMainId === null) {
            sourceMainId = await this.assetMappingService.getSoftwareMainCategoryId(schema);
        }
        const data = await this.assetMappingService.checkGovernanceByCategory(relationType, { main_category_id: sourceMainId, sub_category_id: num(sourceSub), item_id: num(sourceItem) }, { main_category_id: num(targetMain), sub_category_id: num(targetSub), item_id: num(targetItem) }, schema);
        return { status: 'success', data };
    }
    async getEligibleTargets(queryDto, req) {
        const organizationSchema = (0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema']);
        const schema = `org_${organizationSchema}`;
        const result = await this.assetMappingService.getEligibleTargetAssets(queryDto, schema);
        return {
            status: 'success',
            data: result.items,
            total: result.total,
            limit: result.limit,
            page: result.page,
        };
    }
    async unlinkTechnicalRelationship(mappingId, req) {
        const organizationSchema = (0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema']);
        const schema = `org_${organizationSchema}`;
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            throw new common_1.HttpException('Unauthorized: No user ID found', common_1.HttpStatus.UNAUTHORIZED);
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.assetMappingService.getUserByPublicID(Number(decrypted_system_user_id));
        const result = await this.assetMappingService.unlinkTechnicalRelationship(Number(mappingId), userId, schema);
        try {
            await this.redisService.incr(`serials_version:${schema}`);
            if (result.relation_type === 'REL-006') {
                await this.redisService.delByPattern('software-list:*');
                await this.redisService.delByPattern('perpetualSoftwares-list:*');
            }
        }
        catch (err) {
            console.error('Failed to update serials cache version:', err);
        }
        return {
            status: 'success',
            message: 'Technical relationship unlinked successfully.',
            data: result,
        };
    }
    async getItemGovernanceRules(itemId, req) {
        const organizationSchema = (0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema']);
        const schema = `org_${organizationSchema}`;
        const result = await this.assetMappingService.getItemGovernanceRules(Number(itemId), schema);
        return {
            status: 'success',
            data: result,
        };
    }
    async getGovernanceMetadata(req) {
        const organizationSchema = (0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema']);
        const schema = `org_${organizationSchema}`;
        const result = await this.assetMappingService.getGovernanceMetadata(schema);
        return {
            status: 'success',
            data: result,
        };
    }
    async createGovernanceRule(dto, req) {
        const organizationSchema = (0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema']);
        const schema = `org_${organizationSchema}`;
        const result = await this.assetMappingService.createGovernanceRule(dto, schema);
        return {
            status: 'success',
            ...result,
        };
    }
    async updateGovernanceRule(governanceId, dto, req) {
        const organizationSchema = (0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema']);
        const schema = `org_${organizationSchema}`;
        const result = await this.assetMappingService.updateGovernanceRule(Number(governanceId), dto, schema);
        return {
            status: 'success',
            ...result,
        };
    }
    async deleteGovernanceRule(governanceId, req) {
        const organizationSchema = (0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema']);
        const schema = `org_${organizationSchema}`;
        const result = await this.assetMappingService.deleteGovernanceRule(Number(governanceId), schema);
        return {
            status: 'success',
            ...result,
        };
    }
    async toggleGovernanceRuleStatus(governanceId, req) {
        const organizationSchema = (0, crypto_utils_1.decrypt)(req.cookies['x-organization-schema']);
        const schema = `org_${organizationSchema}`;
        const result = await this.assetMappingService.toggleGovernanceRuleStatus(Number(governanceId), schema);
        return {
            status: 'success',
            ...result,
        };
    }
};
exports.AssetMappingController = AssetMappingController;
__decorate([
    (0, common_1.Get)('export-asset-mapping'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('customFilters')),
    __param(5, (0, common_1.Query)('asset_id')),
    __param(6, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String, Number, String]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "exportAssetsMappingToExcel", null);
__decorate([
    (0, common_1.Get)('getSingleAssetMapping'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('mapping_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AssetMappingController.prototype, "findSingleAsset", null);
__decorate([
    (0, common_1.Get)('transfer-timeline'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('asset_stocks_unique_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AssetMappingController.prototype, "getAssignmentLogsBySerial", null);
__decorate([
    (0, common_1.Get)('get-single-asset-mapping'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('mapping_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "getSingleAssetMapping", null);
__decorate([
    (0, common_1.Post)('assignAssets'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_asset_mapping_dto_1.AssignAssetsDto, Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "assignAssets", null);
__decorate([
    (0, common_1.Post)('reassignAssets'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_asset_mapping_dto_1.ReassignAssetsDto, Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "reassignAssets", null);
__decorate([
    (0, common_1.Post)('returnAssets'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_asset_mapping_dto_1.ReassignAssetsDto, Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "returnAssets", null);
__decorate([
    (0, common_1.Post)('returnScrappedAssets'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_asset_mapping_dto_1.ReturnScrapDto, Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "returnScrappedAssets", null);
__decorate([
    (0, common_1.Post)('remove-mapping-of-serial'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "removeAssignedAssets", null);
__decorate([
    (0, common_1.Post)('technical-relationship'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_technical_relationship_dto_1.CreateTechnicalRelationshipDto, Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "createTechnicalRelationship", null);
__decorate([
    (0, common_1.Get)('relationships/:serialId'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('serialId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "getAssetRelationships", null);
__decorate([
    (0, common_1.Get)('tab-summary/:serialId'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('serialId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "getRelationshipTabSummary", null);
__decorate([
    (0, common_1.Get)('governance/check'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('relation_type')),
    __param(1, (0, common_1.Query)('source_main_category_id')),
    __param(2, (0, common_1.Query)('source_sub_category_id')),
    __param(3, (0, common_1.Query)('source_item_id')),
    __param(4, (0, common_1.Query)('target_main_category_id')),
    __param(5, (0, common_1.Query)('target_sub_category_id')),
    __param(6, (0, common_1.Query)('target_item_id')),
    __param(7, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "checkGovernanceByCategory", null);
__decorate([
    (0, common_1.Get)('eligible-targets'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [technical_relationship_query_dto_1.EligibleTargetsQueryDto, Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "getEligibleTargets", null);
__decorate([
    (0, common_1.Delete)('technical-relationship/:mappingId'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('mappingId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "unlinkTechnicalRelationship", null);
__decorate([
    (0, common_1.Get)('governance/item/:itemId'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "getItemGovernanceRules", null);
__decorate([
    (0, common_1.Get)('governance/meta'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "getGovernanceMetadata", null);
__decorate([
    (0, common_1.Post)('governance'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_governance_rule_dto_1.CreateGovernanceRuleDto, Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "createGovernanceRule", null);
__decorate([
    (0, common_1.Put)('governance/:governanceId'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('governanceId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_governance_rule_dto_1.UpdateGovernanceRuleDto, Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "updateGovernanceRule", null);
__decorate([
    (0, common_1.Delete)('governance/:governanceId'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('governanceId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "deleteGovernanceRule", null);
__decorate([
    (0, common_1.Patch)('governance/:governanceId/toggle'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('governanceId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AssetMappingController.prototype, "toggleGovernanceRuleStatus", null);
exports.AssetMappingController = AssetMappingController = __decorate([
    (0, common_1.Controller)('asset-mapping'),
    __metadata("design:paramtypes", [asset_mapping_service_1.AssetMappingService,
        redis_service_1.RedisService])
], AssetMappingController);
