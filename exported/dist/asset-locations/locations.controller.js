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
exports.LocationsController = void 0;
const common_1 = require("@nestjs/common");
const api_key_guard_1 = require("../auth/api-key.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
const list_view_dto_1 = require("../common/listviewDTO/list-view.dto");
const tendant_and_schema_helper_1 = require("../common/utils/tendant_and_schema.helper");
const get_grouped_location_dto_1 = require("./dto/get-grouped-location.dto");
const get_location_dto_1 = require("./dto/get-location.dto");
const locations_service_1 = require("./locations.service");
let LocationsController = class LocationsController {
    constructor(locationsService) {
        this.locationsService = locationsService;
    }
    async createNewLocation(body, req, res) {
        try {
            const organizationID = req.cookies.organization_id;
            const encryptedorganizationID = (0, crypto_utils_1.decrypt)(organizationID);
            if (!encryptedorganizationID) {
                throw new Error('Organization ID not found in cookies');
            }
            const organization_Id = Number(encryptedorganizationID);
            if (isNaN(organization_Id)) {
                throw new Error('Invalid organization ID');
            }
            const system_user_id = req.cookies.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.locationsService.getUserByPublicID(Number(decrypted_system_user_id));
            const result = await this.locationsService.addNewLocation(body, +userId, +organization_Id, req);
            return res.status(201).json(result);
        }
        catch (error) {
            console.error('Error creating location:', error);
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || 'Failed to create location',
                errors: error.response?.errors || null,
            });
        }
    }
    async getAllOrganiationLocation(dto, req) {
        try {
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            dto.schema = schema;
            dto.login_user_id = register_login_user_id;
            const system_user_id = req.cookies.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id?.toString());
            const userId = await this.locationsService.getUserByPublicID(Number(decrypted_system_user_id));
            const result = await this.locationsService.getAllAssetsLocations(dto, branchIds, +userId);
            return result;
        }
        catch (error) {
            console.error('Error in getAllOrganiationLocation:', error);
            return {
                success: false,
                message: 'An error occurred while fetching Locations',
                error: error.message,
            };
        }
    }
    async getLocationById(body, req, res) {
        try {
            const { location_id } = body;
            const result = await this.locationsService.getLocationById(+location_id);
            return res.status(200).json({
                result,
            });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async deleteLocations(body, req, res) {
        try {
            const system_user_id = req.cookies.system_user_id;
            const userId = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const ids = Array.isArray(body.location_id)
                ? body.location_id
                : [body.location_id];
            const result = await this.locationsService.deleteLocationsById(ids, +userId);
            return res.status(200).json({
                statusCode: 200,
                message: result.message,
                deletedIds: result.deletedIds,
                failed: result.failed,
            });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async getOrganizationLocationsDropdown(body, req, res) {
        try {
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const system_user_id = req.cookies.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.locationsService.getUserByPublicID(Number(decrypted_system_user_id));
            const result = await this.locationsService.getOrganizationLocationsDropdown(body, branchIds, userId);
            return res.status(200).json({ status: 'success', data: result });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async dropdownOptionsLocationTypes() {
        return await this.locationsService.optionsLocationTypes();
    }
    async exportLocationsExcel(res, dto) {
        const buffer = await this.locationsService.exportLocationsExcel(dto);
        const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename=locations-${dateStamp}.xlsx`,
        });
        res.end(buffer);
    }
    async getLocationTemplateHeaders(locationType) {
        try {
            const headers = await this.locationsService.getLocationTemplateHeaders(locationType);
            return { headers };
        }
        catch (error) {
            console.error('Error fetching location template headers:', error);
            throw new common_1.InternalServerErrorException('Failed to get location template headers');
        }
    }
    async addNewLocation(createnewlocationpayload, req) {
        try {
            const organizationID = (0, crypto_utils_1.decrypt)(req.cookies.organization_id);
            if (!organizationID) {
                throw new common_1.BadRequestException('Organization ID not found in cookies');
            }
            const organization_Id = Number(organizationID);
            if (isNaN(organization_Id)) {
                throw new common_1.BadRequestException('Invalid decrypted organization ID');
            }
            const system_user_id = req.cookies.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.locationsService.getUserByPublicID(Number(decrypted_system_user_id));
            console.log('userId:sps', userId);
            return await this.locationsService.bulkImportLocations(createnewlocationpayload, +userId, organization_Id);
        }
        catch (error) {
            console.error('Error creating location:', error);
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async updateLocation(body, req, res) {
        try {
            const { location_id, ...payload } = body;
            const system_user_id = req.cookies.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.locationsService.getUserByPublicID(Number(decrypted_system_user_id));
            const result = await this.locationsService.updateLocation({ ...payload, location_id }, +userId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error('Error updating location:', error);
            return res.status(500).json({
                message: 'Failed to update location',
                error: error.message || error,
            });
        }
    }
    async activateLocations(body, res, req) {
        try {
            const { locationIds } = body;
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                return res.status(401).json({
                    status: 401,
                    message: 'Unauthorized: No user ID found',
                });
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            if (!locationIds ||
                !Array.isArray(locationIds) ||
                locationIds.length === 0) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'locationIds must be a non-empty array',
                });
            }
            const result = await this.locationsService.activateLocations(locationIds, +decrypted_system_user_id);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            console.error('Error activating locations:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to activate locations',
                error: error.message || error,
            });
        }
    }
    async deactivateLocations(body, res, req) {
        try {
            const { locationIds } = body;
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                return res.status(401).json({
                    status: 401,
                    message: 'Unauthorized: No user ID found',
                });
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            if (!locationIds ||
                !Array.isArray(locationIds) ||
                locationIds.length === 0) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'locationIds must be a non-empty array',
                });
            }
            const result = await this.locationsService.deactivateLocations(locationIds, +decrypted_system_user_id);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            console.error('Error deactivating locations:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to deactivate locations',
                error: error.message || error,
            });
        }
    }
    async generateLocationTemplate(body, res) {
        try {
            const { location_type } = body;
            const buffer = await this.locationsService.generateLocationTemplate(location_type);
            res.setHeader('Content-Disposition', `attachment; filename=${location_type}_template.xlsx`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        }
        catch (error) {
            console.error('Error generating location template:', error);
            res.status(500).send('Failed to generate Excel template');
        }
    }
    async createBulkLocations(dtos, req) {
        const system_user_id = req.cookies.system_user_id;
        const organizationID = req.cookies.organization_id;
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id?.toString());
        const decrypted_organizationID = (0, crypto_utils_1.decrypt)(organizationID);
        if (!decrypted_organizationID) {
            console.error('❌ [Point 3] Organization ID not found in cookies');
            throw new Error('Organization ID not found in cookies');
        }
        const organization_Id = Number(decrypted_organizationID);
        if (isNaN(organization_Id)) {
            throw new Error('Invalid decrypted organization ID');
        }
        if (decrypted_system_user_id) {
            const result = await this.locationsService.bulkImportLocations(dtos, +organization_Id, +decrypted_system_user_id);
            return {
                statusCode: result.status,
                message: result.message,
                data: result.data,
            };
        }
        else {
            console.error('❌ [Point 7] Invalid or missing decrypted user ID');
            return {
                statusCode: 401,
                message: 'Unauthorized: Invalid or missing user ID.',
                data: null,
            };
        }
    }
    async getLocations(dto) {
        return this.locationsService.getLocationsWithType(dto);
    }
    async getGroupedLocations(dto) {
        return this.locationsService.getGroupedLocations(dto);
    }
    async getLocationOptions(types, branchId) {
        let parsedTypes = [];
        if (Array.isArray(types)) {
            parsedTypes = types;
        }
        else if (typeof types === 'string') {
            parsedTypes = types.split(',');
        }
        return this.locationsService.getLocationOptions(parsedTypes, branchId);
    }
    async getLocationsByParent(parent_location_id, location_type_code) {
        return await this.locationsService.getLocationsByParent(Number(parent_location_id), location_type_code);
    }
    async toggleFavoriteLocation(body, req, res) {
        try {
            const { location_mapping_id } = body;
            const system_user_id = req.cookies.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.locationsService.getUserByPublicID(Number(decrypted_system_user_id));
            const result = await this.locationsService.toggleFavoriteLocation(+location_mapping_id, +userId);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async getAllLocationTypes(dto, req) {
        try {
            const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            dto.schema = schema;
            dto.login_user_id = register_login_user_id;
            return await this.locationsService.getAllLocationTypes(dto);
        }
        catch (error) {
            console.error('Error in getAllLocationTypes:', error);
            return {
                success: false,
                message: 'An error occurred while fetching location types',
                error: error.message,
            };
        }
    }
    async createLocationType(body, req, res) {
        try {
            const system_user_id = req.cookies.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.locationsService.getUserByPublicID(Number(decrypted_system_user_id));
            const result = await this.locationsService.createLocationType(body, +userId);
            return res.status(result.status || 201).json(result);
        }
        catch (error) {
            console.error('Error creating location type:', error);
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || 'Failed to create location type',
            });
        }
    }
    async updateLocationType(body, req, res) {
        try {
            const system_user_id = req.cookies.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.locationsService.getUserByPublicID(Number(decrypted_system_user_id));
            const result = await this.locationsService.updateLocationType(body, +userId);
            return res.status(result.status || 200).json(result);
        }
        catch (error) {
            console.error('Error updating location type:', error);
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || 'Failed to update location type',
            });
        }
    }
    async deleteLocationType(body, req, res) {
        try {
            const system_user_id = req.cookies.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.locationsService.getUserByPublicID(Number(decrypted_system_user_id));
            const result = await this.locationsService.deleteLocationType(+body.type_id, +userId);
            return res.status(result.status || 200).json(result);
        }
        catch (error) {
            console.error('Error deleting location type:', error);
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || 'Failed to delete location type',
            });
        }
    }
    async getLocationsHierarchyTree(body, req, res) {
        try {
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const system_user_id = req.cookies.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id?.toString());
            const userId = await this.locationsService.getUserByPublicID(Number(decrypted_system_user_id));
            const result = await this.locationsService.getLocationsHierarchyTree(body, branchIds, +userId);
            return res.status(200).json({
                status: 'success',
                data: result,
            });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
};
exports.LocationsController = LocationsController;
__decorate([
    (0, common_1.Post)('create-new-location'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "createNewLocation", null);
__decorate([
    (0, common_1.Post)('get-all-organization-locations'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getAllOrganiationLocation", null);
__decorate([
    (0, common_1.Post)('get-locations-by-id'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getLocationById", null);
__decorate([
    (0, common_1.Post)('delete-locations-by-id'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "deleteLocations", null);
__decorate([
    (0, common_1.Post)('getOrganizationLocationsDropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getOrganizationLocationsDropdown", null);
__decorate([
    (0, common_1.Get)('get-options-for-location-types-dropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "dropdownOptionsLocationTypes", null);
__decorate([
    (0, common_1.Post)('export-locations'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_view_dto_1.ListViewDto]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "exportLocationsExcel", null);
__decorate([
    (0, common_1.Post)('get-location-template-headers'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('locationType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getLocationTemplateHeaders", null);
__decorate([
    (0, common_1.Post)('create-bulk-location'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "addNewLocation", null);
__decorate([
    (0, common_1.Post)('update-location'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.Post)('activate-locations'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "activateLocations", null);
__decorate([
    (0, common_1.Post)('deactivate-locations'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "deactivateLocations", null);
__decorate([
    (0, common_1.Post)('download-excle-location-template'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "generateLocationTemplate", null);
__decorate([
    (0, common_1.Post)('create-bulk-locations'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "createBulkLocations", null);
__decorate([
    (0, common_1.Post)('get-locations-by-type'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_location_dto_1.GetLocationsDropdownDto]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getLocations", null);
__decorate([
    (0, common_1.Post)('get-grouped-locations'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_grouped_location_dto_1.GetGroupedLocationsDto]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getGroupedLocations", null);
__decorate([
    (0, common_1.Get)('get-location-options'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('types')),
    __param(1, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getLocationOptions", null);
__decorate([
    (0, common_1.Get)('get-locations-by-parent'),
    __param(0, (0, common_1.Query)('parent_location_id')),
    __param(1, (0, common_1.Query)('location_type_code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getLocationsByParent", null);
__decorate([
    (0, common_1.Post)('toggle-favorite-location'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "toggleFavoriteLocation", null);
__decorate([
    (0, common_1.Post)('get-all-location-types'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getAllLocationTypes", null);
__decorate([
    (0, common_1.Post)('create-location-type'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "createLocationType", null);
__decorate([
    (0, common_1.Post)('update-location-type'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "updateLocationType", null);
__decorate([
    (0, common_1.Post)('delete-location-type'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "deleteLocationType", null);
__decorate([
    (0, common_1.Post)('get-locations-hierarchy-tree'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "getLocationsHierarchyTree", null);
exports.LocationsController = LocationsController = __decorate([
    (0, common_1.Controller)('locations'),
    __metadata("design:paramtypes", [locations_service_1.LocationsService])
], LocationsController);
