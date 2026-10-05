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
exports.OrganizationalProfileController = void 0;
const common_1 = require("@nestjs/common");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
const api_key_guard_1 = require("../auth/api-key.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const delete_degination_dto_1 = require("./dto/delete-degination-dto");
const delete_department_dto_1 = require("./dto/delete-department-dto");
const department_dto_1 = require("./dto/department.dto");
const designation_dto_1 = require("./dto/designation.dto");
const update_dept_dto_1 = require("./dto/update-dept.dto");
const organizational_profile_service_1 = require("./organizational-profile.service");
const platform_express_1 = require("@nestjs/platform-express");
const fs_1 = require("fs");
const multer_1 = require("multer");
const path_1 = require("path");
const list_view_dto_1 = require("../common/listviewDTO/list-view.dto");
const restriction_ui_util_1 = require("../common/restriction/restriction-ui-util");
const tendant_and_schema_helper_1 = require("../common/utils/tendant_and_schema.helper");
const create_organizational_profile_dto_1 = require("./dto/create-organizational-profile.dto");
const notificaiton_dto_1 = require("./dtos/notificaiton.dto");
let OrganizationalProfileController = class OrganizationalProfileController {
    constructor(organizationService) {
        this.organizationService = organizationService;
    }
    async downloadVendorTemplate(req, res) {
        try {
            const buffer = await this.organizationService.generateVendorTemplate();
            res.setHeader('Content-Disposition', 'attachment; filename=vendor_template.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        }
        catch (error) {
            console.error('Error generating vendor template:', error);
            res.status(500).send('Failed to generate Excel template');
        }
    }
    async fetchOrganizationDesignation(page = 1, limit = 10, searchQuery = '', req, res) {
        try {
            const result = await this.organizationService.fetchOrganizationDesignation(searchQuery);
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
    async fetchOrganizationDesignationsDropdown(page = 1, limit = 10, searchQuery = '', req, res) {
        try {
            const result = await this.organizationService.fetchOrganizationDesignationsDropdown();
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
    async fetchDesignationsByDepartment(departmentId, res) {
        try {
            const result = await this.organizationService.fetchDesignationsByDepartment(departmentId);
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
    async getIndustryTypeValues(req, res) {
        try {
            const result = await this.organizationService.fetchIndustryTypes();
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
    async getDepartmentConfigValues(req, res, page = 1, limit = 10, searchQuery = '') {
        try {
            const result = await this.organizationService.fetchDepartmentconfig(page, limit, searchQuery);
            return res.status(200).json({ result });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async getDepartmentsWithPagination(req, res, page = 1, limit = 10, searchQuery = '') {
        try {
            const result = await this.organizationService.fetchDepartments(page, limit, searchQuery);
            return res.status(200).json({ result });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async getDesignationsWithPagination(req, res, searchQuery = '') {
        try {
            const result = await this.organizationService.fetchOrganizationDesignation(searchQuery);
            return res.status(200).json({ result });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async getDesignationsConfigValues(req, res) {
        try {
            const department_name = req.body?.department_name
                ? String(req.body.department_name).trim()
                : undefined;
            const result = await this.organizationService.fetchDesignationsconfig(department_name);
            return res.status(200).json({ result });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async setDepartmentValues(createDepartmentsDto, req) {
        try {
            const main_user_id = req.cookies.main_user_id;
            const decrypted_user_id = (0, crypto_utils_1.decrypt)(main_user_id);
            const userId = Number(decrypted_user_id);
            return this.organizationService.createDepartments(createDepartmentsDto, userId);
        }
        catch (error) {
            console.log(error);
        }
    }
    async editDepartment(id, editDto) {
        try {
            return this.organizationService.editDepartment(+id, editDto);
        }
        catch (error) {
            console.error(error);
            throw new common_1.BadRequestException('Failed to edit department');
        }
    }
    async setDesignationsValues(CreateDesignationDto) {
        try {
            return this.organizationService.createDesignations(CreateDesignationDto);
        }
        catch (error) {
            console.log(error);
        }
    }
    async editDesignation(designationId, designationName, desg_description, departmentId) {
        try {
            return await this.organizationService.editDesignation(designationId, designationName, desg_description, departmentId);
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException('Failed to edit designation.');
        }
    }
    async removeDepartmentValues(deleteDepartmentsDto) {
        return await this.organizationService.deleteDepartments(deleteDepartmentsDto);
    }
    async removeDesignationValue(deleteDesignationDto) {
        return await this.organizationService.deleteDesignation(deleteDesignationDto);
    }
    async fetchOrganizationDeparments(searchQuery = '', req, res) {
        try {
            const result = await this.organizationService.fetchOrganizationDeparments(searchQuery);
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
    async fetchOrganizationDeparmentsForDropdown(searchQuery = '', req, res) {
        try {
            const result = await this.organizationService.fetchOrganizationDepartmentsDropdown();
            return res.status(200).json({ result });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async getCategoryDropdown(req) {
        const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
        const data = await this.organizationService.getUserDropdown(branchIds);
        return {
            success: true,
            data,
        };
    }
    async exportVendorCSV() {
        return this.organizationService.exportVendorCSV();
    }
    async getAllorganizationVenders() {
        try {
            return this.organizationService.getAllorganizationVenders();
        }
        catch (error) {
            return false;
        }
    }
    async getOrganizationalProfile(req, res) {
        try {
            const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            const dto = {
                schema: schema,
                login_user_id: register_login_user_id,
            };
            const result = await this.organizationService.fetchOrganizationalProfile(dto);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async updateOrgainzationProfileValues(logoFile, payload, req) {
        console.log('payload1', payload);
        let logoPath = null;
        if (logoFile) {
            logoPath = `/uploads/${logoFile.filename}`;
        }
        else if (payload.logoPreviewBase64 &&
            payload.logoPreviewBase64?.startsWith('data:image')) {
            const matches = payload.logoPreviewBase64.match(/^data:image\/(\w+);base64,(.+)$/);
            if (matches) {
                const ext = matches[1];
                const base64Data = matches[2];
                const orgId = req.cookies?.organization_id
                    ? parseInt((0, crypto_utils_1.decrypt)(req.cookies.organization_id))
                    : 'unknown';
                const filename = `org-${orgId}-${Date.now()}.${ext}`;
                const uploadDir = (0, path_1.join)(process.cwd(), 'uploads');
                if (!(0, fs_1.existsSync)(uploadDir)) {
                    (0, fs_1.mkdirSync)(uploadDir, { recursive: true });
                }
                const filePath = (0, path_1.join)(uploadDir, filename);
                (0, fs_1.writeFileSync)(filePath, Buffer.from(base64Data, 'base64'));
                logoPath = `/uploads/${filename}`;
                if (payload.is_new_image_uploaded && logoPath) {
                    payload.logo = logoPath;
                }
                else {
                    if (logoPath) {
                        try {
                            const fileToDelete = (0, path_1.join)(process.cwd(), logoPath);
                            (0, fs_1.unlinkSync)(fileToDelete);
                            console.log(`Unused logo deleted: ${fileToDelete}`);
                        }
                        catch (err) {
                            console.error('Failed to delete unused logo:', err);
                        }
                    }
                    delete payload.logo;
                }
            }
        }
        if (payload.is_new_image_uploaded && logoPath) {
            console.log('is_new_image_uploaded1', payload.is_new_image_uploaded);
            payload.logo = logoPath;
        }
        else {
            console.log('is_new_image_uploaded2', payload.is_new_image_uploaded);
            delete payload.logo;
        }
        console.log('payload.logo', payload.logo);
        const mappedpayload = {
            organization_profile_id: payload.organization_profile_id,
            user_id: payload.user_id,
            organization_name: payload.organizationName,
            industry_type_name: payload.industryType,
            gst_no: payload.gstNumber ?? '',
            mobile_number: payload.contactNumber,
            email: payload.email ?? '',
            website_url: payload.website,
            financial_year: payload.financialYear,
            base_currency: payload.baseCurrency,
            dateformat: payload.dateFormat,
            time_zone: payload.timeZone,
            landmark: payload.hqAddressFields?.landmark,
            street: payload.hqAddressFields?.street ?? '',
            city: payload.hqAddressFields?.city ?? '',
            state: payload.hqAddressFields?.state ?? '',
            pincode: payload.hqAddressFields?.postalCode ?? '',
            country: payload.hqAddressFields?.country ?? '',
            organization_location_name: payload.hqAddress ?? '',
            organization_address: payload.hqAddress ?? '',
            established_date: payload.establishedDate
                ? new Date(payload.establishedDate)
                : undefined,
            users_designation: payload.designation_id,
            users_first_name: payload.primaryContactName?.split(' ')[0],
            users_middle_name: payload.primaryContactName?.split(' ')[1] ?? '',
            users_last_name: payload.primaryContactName?.split(' ')[2] ?? '',
            users_business_email: payload.primaryContactEmail,
            users_phone_number: payload.primaryContactPhone,
            billingContactName: payload.billingContactName,
            billingContactEmail: payload.billingContactEmail,
            billingContactPhone: payload.billingContactPhone,
            themeMode: payload.themeMode,
            customThemeColor: payload.customThemeColor,
            company_act_enabled: payload.company_act_enabled,
            it_act_enabled: payload.it_act_enabled,
        };
        if (payload.is_new_image_uploaded && logoPath) {
            console.log('payload.is_new_image_uploaded && logoPath', payload.is_new_image_uploaded && logoPath);
            mappedpayload.org_profile_image_address = logoPath;
            mappedpayload.logo = logoPath;
        }
        const organizationID = req.cookies.organization_id;
        const decryptedOrgId = (0, crypto_utils_1.decrypt)(organizationID);
        if (!decryptedOrgId) {
            throw new Error('Organization ID not found in cookies');
        }
        const organization_Id = Number(decryptedOrgId);
        if (isNaN(organization_Id)) {
            throw new Error('Invalid decrypted organization ID');
        }
        const result = await this.organizationService.updateOrgainzationProfileValues(mappedpayload, organization_Id);
        return {
            statusCode: 200,
            message: 'Update successful',
            data: result,
        };
    }
    async getCounts(req) {
        let branchIds = [];
        let schema = null;
        let register_login_user_id = null;
        try {
            const meta = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            schema = meta?.schema || null;
            register_login_user_id = meta?.register_login_user_id || null;
            branchIds = meta?.branchIds || [];
        }
        catch (e) {
            console.warn('Could not extract organization metadata from cookies in fetchCount:', e?.message);
        }
        if (!branchIds?.length) {
            try {
                branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            }
            catch {
                branchIds = [];
            }
        }
        console.log('branchIds', branchIds);
        return this.organizationService.getCounts(branchIds, schema, register_login_user_id);
    }
    async getDashboardCounts() {
        return this.organizationService.getDashboardCounts();
    }
    async fetchDepartmentWiseCounts() {
        return this.organizationService.getDepartmentWiseAssetCounts();
    }
    async fetchStatusWiseCounts() {
        return this.organizationService.getStatusWiseAssetCounts();
    }
    async fetchSingleVendorsData(body, res) {
        const vendorId = Number(body.vendor_id);
        if (!vendorId) {
            return res
                .status(400)
                .json({ status: 400, message: 'Vendor ID is required' });
        }
        const response = await this.organizationService.fetchSingleVendorsData(vendorId);
        return res.status(response.status).json(response);
    }
    async fetchOrganizationVendors(req, res) {
        try {
            const result = await this.organizationService.fetchOrganizationVendors();
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
    async getOrganizationVendors1(dto, req) {
        try {
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            dto.schema = schema;
            dto.login_user_id = register_login_user_id;
            const result = await this.organizationService.getAllVendors2(dto, branchIds);
            return result;
        }
        catch (error) {
            console.error('Error in getOrganizationVendors1:', error);
            return {
                success: false,
                message: 'An error occurred while fetching vendors',
                error: error.message,
            };
        }
    }
    async getOrganizationVendorsDropdown(body, req, res) {
        try {
            const result = await this.organizationService.getOrganizationVendorsDropdown(body);
            return res.status(200).json({ status: 'success', data: result });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                statusCode: error.status || 500,
                message: error.message || 'Internal server error.',
            });
        }
    }
    async generateProjectCode() {
        const code = await this.organizationService.generateNextVendorCode();
        return {
            success: true,
            code,
        };
    }
    async createNewVendor(payload, req, res) {
        try {
            const system_user_id = req.cookies.system_user_id;
            const decrypted_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            const userId = await this.organizationService.getUserByPublicID(Number(decrypted_user_id));
            const result = await this.organizationService.createNewVendor(payload, userId);
            return res.status(result.status).json(result);
        }
        catch (error) {
            console.error('Controller Error:', error);
            return res
                .status(500)
                .json({ status: 500, message: 'Failed to create vendor' });
        }
    }
    async getDepartmentsFromVendors(req, res) {
        try {
            const result = await this.organizationService.getDepartmentsFromVendors();
            return res.status(200).json(result);
        }
        catch (error) {
            console.error('Controller Error:', error);
            return res
                .status(500)
                .json({ status: 500, message: 'Failed to fetch departments' });
        }
    }
    async updateVendorData(updatepayload, req, res) {
        try {
            const updatedVendors = await this.organizationService.updateVendorData(updatepayload);
            return res.status(common_1.HttpStatus.OK).json({
                status: common_1.HttpStatus.OK,
                message: 'Vendor updated successfully',
                data: updatedVendors.data,
            });
        }
        catch (error) {
            return res.status(error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
            });
        }
    }
    async deleteVendorData(body, req, res) {
        console.log('Received vendor_ids:', body.vendor_ids);
        const deletedVendors = await this.organizationService.deleteVendorData(body);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message: 'Vendor deletion processed.',
            data: deletedVendors,
        });
    }
    async activateVendors(body, res, req) {
        try {
            const { vendorIds } = body;
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                return res.status(401).json({
                    status: 401,
                    message: 'Unauthorized: No user ID found',
                });
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            if (!vendorIds || !Array.isArray(vendorIds) || vendorIds.length === 0) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'vendorIds must be a non-empty array',
                });
            }
            const result = await this.organizationService.activateVendors(vendorIds, +decrypted_system_user_id);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            console.error('Error activating vendors:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to activate vendors',
                error: error.message || error,
            });
        }
    }
    async deactivateVendors(body, res, req) {
        try {
            const { vendorIds } = body;
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                return res.status(401).json({
                    status: 401,
                    message: 'Unauthorized: No user ID found',
                });
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            if (!vendorIds || !Array.isArray(vendorIds) || vendorIds.length === 0) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'vendorIds must be a non-empty array',
                });
            }
            const result = await this.organizationService.deactivateVendors(vendorIds, +decrypted_system_user_id);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            console.error('Error deactivating vendors:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to deactivate vendors',
                error: error.message || error,
            });
        }
    }
    async bulkCreateVendors(dtos, req) {
        const system_user_id = req.cookies.system_user_id;
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.organizationService.getUserIdByRegisterLoginId(+decrypted_system_user_id);
        if (userId) {
            const result = await this.organizationService.bulkCreateVendors(dtos, +userId);
            return {
                statusCode: result.status,
                message: result.message,
                data: result.data,
            };
        }
        else {
            return {
                statusCode: 401,
                message: 'Unauthorized: Invalid or missing user ID.',
                data: null,
            };
        }
    }
    async exportOrganizationVendorsExcel(res, body) {
        const buffer = await this.organizationService.exportOrganizationVendorsExcel(body);
        const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename=organization-vendors-${dateStamp}.xlsx`,
        });
        res.end(buffer);
    }
    async findPincodeviaStateAndCity(pincode) {
        const result = await this.organizationService.findPincodeviaStateAndCity(pincode);
        if (result) {
            return { city: result.city, state: result.state };
        }
        return { city: '', state: '' };
    }
    async getWeeklyOverview() {
        return this.organizationService.getWeeklyOverview();
    }
    async getAllLoginUserMyAssetData(dto, req) {
        try {
            console.log('DTO:', dto);
            let user_id = dto.user_id;
            if (typeof user_id === 'string') {
                user_id = Number(user_id);
            }
            if (user_id && typeof user_id === 'string') {
                user_id = parseInt(user_id, 10);
            }
            console.log('Extracted user_id:', user_id);
            if (!user_id) {
                return {
                    success: false,
                    message: 'user_id is required. Please provide user_id in request.',
                };
            }
            const result = await this.organizationService.getAllLoginUserMyAssetData(dto, user_id);
            return result;
        }
        catch (error) {
            console.error('Error in getAllLoginUserMyAssetData:', error);
            return {
                success: false,
                message: 'An error occurred while fetching user assets',
                error: error.message,
            };
        }
    }
    async exportMyAssetsToExcel(res, dto) {
        try {
            let user_id = dto.user_id;
            if (typeof user_id === 'string') {
                user_id = Number(user_id);
            }
            if (!user_id) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'user_id is required.',
                });
            }
            const buffer = await this.organizationService.exportFilteredExcelForMyAssets(dto, user_id);
            const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=my-assets-${dateStamp}.xlsx`,
            });
            res.end(buffer);
        }
        catch (error) {
            console.error('Error in exportMyAssetsToExcel:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'An error occurred while exporting user assets',
                error: error.message,
            });
        }
    }
    async saveAssetIdSettings(payload, req) {
        console.log('payload', payload);
        const main_user_id = req.cookies.main_user_id;
        const decrypted_user_id = (0, crypto_utils_1.decrypt)(main_user_id);
        const userId = decrypted_user_id;
        const response = await this.organizationService.saveAssetIdSettings(payload, +userId);
        return {
            success: true,
            message: 'Asset ID settings saved successfully',
            data: response,
        };
    }
    async updateBarcodeSetting(payload, req) {
        const main_user_id = req.cookies.main_user_id;
        const decrypted_user_id = (0, crypto_utils_1.decrypt)(main_user_id);
        const userId = decrypted_user_id;
        const response = await this.organizationService.updateBarcodeSetting(payload, +userId);
        return {
            success: true,
            message: 'Barcode setting updated successfully',
            data: response,
        };
    }
    async updateQrcodeSetting(payload, req) {
        const main_user_id = req.cookies.main_user_id;
        const decrypted_user_id = (0, crypto_utils_1.decrypt)(main_user_id);
        const userId = decrypted_user_id;
        const response = await this.organizationService.updateQrcodeSetting(payload, +userId);
        return {
            success: true,
            message: 'Barcode setting updated successfully',
            data: response,
        };
    }
    async getAssetIdSettings(scope, req) {
        const userId = req.user?.id || 1;
        return this.organizationService.getAssetIdSettings(scope, userId);
    }
    async getAssetIdTemplates(req) {
        const userId = req.user?.id || 1;
        return this.organizationService.findAllTemplates(userId);
    }
    async saveQRCodeSettings(payload, req) {
        console.log('payload', payload);
        const serialId = payload.serialId;
        const userId = req.user?.id || 1;
        const response = await this.organizationService.saveQRCodeSettings(payload, userId);
        return {
            success: true,
            message: 'QR Code settings saved successfully',
            data: response,
        };
    }
    async getQRCodeSettings(req) {
        const userId = req.user?.id || 1;
        const response = await this.organizationService.getQRCodeSettings(userId);
        if (!response) {
            return {
                success: false,
                message: 'No QR Code settings found for this user',
                data: null,
            };
        }
        return {
            success: true,
            message: 'QR Code settings fetched successfully',
            data: response,
        };
    }
    async userSpecificSidebarPrefrances(payload, req) {
        const system_user_id = req.cookies.system_user_id;
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.organizationService.getUserByPublicID(Number(decrypted_system_user_id));
        const response = await this.organizationService.userSpecificSidebarPrefrances(payload, userId);
        return {
            success: true,
            message: ' Sidebar Preferances updated successfully',
            data: response,
        };
    }
    async updateThemePreferences(payload, req) {
        const system_user_id = req.cookies.system_user_id;
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.organizationService.getUserByPublicID(Number(decrypted_system_user_id));
        const response = await this.organizationService.updateThemePreferences(payload, userId);
        return {
            success: true,
            message: 'Theme preferences updated successfully.',
            data: response,
        };
    }
    async getLoginUserSidebarPreferances(payload, req) {
        const system_user_id = req.cookies.system_user_id;
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const userId = await this.organizationService.getUserByPublicID(Number(decrypted_system_user_id));
        const response = await this.organizationService.getLoginUserSidebarPreferances(userId);
        return {
            success: true,
            message: ' Sidebar Preferances fetched successfully',
            data: response,
        };
    }
    async updateothersettings(payload, req) {
        console.log('payload', payload);
        const ORGANIZATION_PROFILE_ID = 1;
        const response = await this.organizationService.updateOtherSettingPref(payload, +ORGANIZATION_PROFILE_ID);
        return {
            success: true,
            message: ' other settings updated successfully',
            data: response,
        };
    }
    async saveSidebarPreferances(payload, req) {
        console.log('payload', payload);
        const userId = req.user?.id || 1;
        const response = await this.organizationService.saveSidebarPreferances(payload, userId);
        return {
            success: true,
            message: ' Sidebar Preferances updated successfully',
            data: response,
        };
    }
    async getSidebarPreferances(req) {
        const userId = req.user?.id || 1;
        const response = await this.organizationService.getSidebarPreferances(userId);
        return response;
    }
    async addSidebarFavouriteToUser(payload, req) {
        try {
            console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
            const main_user_id = req.cookies.main_user_id;
            const decrypted_user_id = (0, crypto_utils_1.decrypt)(main_user_id);
            const userId = decrypted_user_id;
            console.log('userId', userId);
            if (!userId)
                throw new common_1.UnauthorizedException();
            const response = await this.organizationService.addFavourateMenuToUser(payload, +userId);
            return {
                status: 'success',
                message: 'Favorites updated successfully',
                data: response,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.InternalServerErrorException('Failed to update favorites');
        }
    }
    async getSidebarFavouriteOfLoginUser(req) {
        try {
            const main_user_id = req.cookies?.main_user_id;
            if (!main_user_id) {
                throw new common_1.UnauthorizedException('Missing user cookie');
            }
            const decrypted_user_id = (0, crypto_utils_1.decrypt)(main_user_id);
            if (!decrypted_user_id || isNaN(+decrypted_user_id)) {
                throw new common_1.UnauthorizedException('Invalid user');
            }
            const response = await this.organizationService.getFavourateMenuOfUser(+decrypted_user_id);
            return {
                status: 'success',
                message: 'Favorites fetched successfully',
                data: response,
            };
        }
        catch {
            throw new common_1.InternalServerErrorException('Failed to fetch favorites');
        }
    }
    async disableDepartment(deleteAssetOwnershipStatusDto, req, res) {
        const deletedStatus = await this.organizationService.disableDepartment(deleteAssetOwnershipStatusDto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message: 'Ownership status disabled successfully',
            data: deletedStatus,
        });
    }
    async enableDepartment(deleteAssetOwnershipStatusDto, req, res) {
        const deletedStatus = await this.organizationService.enableDepartment(deleteAssetOwnershipStatusDto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message: 'Ownership status activated successfully',
            data: deletedStatus,
        });
    }
    async disableDesignation(deleteAssetOwnershipStatusDto, req, res) {
        const deletedStatus = await this.organizationService.disableDesignation(deleteAssetOwnershipStatusDto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message: 'Ownership status disabled successfully',
            data: deletedStatus,
        });
    }
    async enableDesignation(deleteAssetOwnershipStatusDto, req, res) {
        const deletedStatus = await this.organizationService.enableDesignation(deleteAssetOwnershipStatusDto);
        return res.status(common_1.HttpStatus.OK).json({
            status: common_1.HttpStatus.OK,
            message: 'Ownership status activated successfully',
            data: deletedStatus,
        });
    }
    async checkAssetRestrictionByFeature(req, body, res) {
        try {
            const organizationID = req.cookies.organization_id;
            const encryptedorganizationID = (0, crypto_utils_1.decrypt)(organizationID);
            if (!encryptedorganizationID) {
                throw new Error('Orgnaization ID not found in cookies');
            }
            const orgId = Number(encryptedorganizationID);
            const { featureId } = body;
            if (!orgId || !featureId) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Organization ID (from cookie) or featureId is missing',
                });
            }
            console.log('My orgId:', orgId);
            const restriction = await this.organizationService.getRestrictionByFeatureIdForUI(orgId, featureId);
            if (!restriction) {
                return res.status(common_1.HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'No restriction found for this feature in organization',
                });
            }
            return res.status(common_1.HttpStatus.OK).json({
                success: true,
                message: 'Fetched feature restriction successfully',
                data: restriction,
            });
        }
        catch (error) {
            console.error('❌ Error fetching feature restriction:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Failed to fetch feature restriction',
            });
        }
    }
    async checkRestrictions(req, body, res) {
        try {
            const organizationID = req.cookies.organization_id;
            const encryptedorganizationID = (0, crypto_utils_1.decrypt)(organizationID);
            if (!encryptedorganizationID) {
                throw new Error('Orgnaization ID not found in cookies');
            }
            const orgId = Number(encryptedorganizationID);
            const { featureId } = body;
            const data = await restriction_ui_util_1.RestrictionUIUtil.checkRestrictionForUI(orgId, featureId);
            return res.status(common_1.HttpStatus.OK).json({
                success: true,
                message: 'Restriction fetched successfully',
                data,
            });
        }
        catch (error) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message,
            });
        }
    }
    async getAllOrgBranches(dto, req) {
        try {
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            dto.schema = schema;
            dto.login_user_id = register_login_user_id;
            const result = await this.organizationService.getOrganizationBranchesList(dto, branchIds);
            return result;
        }
        catch (error) {
            console.error('Error in getAllOrgBranches:', error);
            return {
                success: false,
                message: 'An error occurred while fetching branches',
                error: error.message,
            };
        }
    }
    async editOrgBranchById(body, req) {
        const organizationID = (0, crypto_utils_1.decrypt)(req.cookies.organization_id);
        const system_user_id = (0, crypto_utils_1.decrypt)(req.cookies.system_user_id);
        if (!organizationID)
            throw new common_1.BadRequestException('Organization ID not found');
        const organization_Id = Number(organizationID);
        if (isNaN(organization_Id))
            throw new common_1.BadRequestException('Invalid organization ID');
        if (!body.branch_id)
            throw new common_1.BadRequestException('Branch ID is required');
        const branch = await this.organizationService.updateBranch1(Number(body.branch_id), body, organization_Id, +system_user_id, req);
        return {
            statusCode: common_1.HttpStatus.OK,
            success: true,
            message: 'Branch updated successfully',
            data: branch,
        };
    }
    async getOrgBranchById(branchId, req) {
        console.log('branchId', branchId);
        if (!branchId) {
            return {
                success: false,
                message: 'Branch ID is required',
                data: null,
            };
        }
        const branch = await this.organizationService.getBranchById(branchId, req);
        if (!branch) {
            return {
                success: false,
                message: 'Branch not found',
                data: null,
            };
        }
        return {
            success: true,
            message: 'Branch fetched successfully',
            data: branch,
        };
    }
    async deleteOrgBranch(body, req, res) {
        try {
            console.log('body', body);
            const encryptedOrgId = req.cookies.organization_id;
            const organizationId = (0, crypto_utils_1.decrypt)(encryptedOrgId);
            if (!organizationId) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Organization ID not found in cookies',
                });
            }
            const branchIds = Array.isArray(body.branch_id)
                ? body.branch_id
                : [body.branch_id];
            const result = await this.organizationService.deleteBranchById(branchIds, Number(organizationId), req);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            console.error('❌ Error deleting branch:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Failed to delete branch',
            });
        }
    }
    async activateOrgBranch(body, req, res) {
        console.log('body1', body);
        const branch_ids = body.branchIds;
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            return {
                status: 401,
                message: 'Unauthorized: No branch ID found',
            };
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        try {
            if (!branch_ids || branch_ids.length === 0) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'branch-ids must be a non-empty array',
                });
            }
            const result = await this.organizationService.activateBranches(branch_ids, +decrypted_system_user_id);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            console.error('Error activating branches:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to activate branches',
                error: error.message || error,
            });
        }
    }
    async deactivateOrgBranch(body, req, res) {
        console.log('body2', body);
        const branch_ids = body.branchIds;
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            return res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                status: 'error',
                message: 'Unauthorized: No system user ID found',
            });
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        try {
            if (!branch_ids || branch_ids.length === 0) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'branch-ids must be a non-empty array',
                });
            }
            const result = await this.organizationService.deactivateBranches(branch_ids, +decrypted_system_user_id);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            console.error('Error deactivating branches:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to deactivate branches',
                error: error.message || error,
            });
        }
    }
    async createPrimaryOrgBranch(body, req) {
        console.log('body', body);
    }
    async bulkImportBranches(dtos, req, res) {
        try {
            const organizationID = req.cookies?.organization_id;
            const encryptedorganizationID = (0, crypto_utils_1.decrypt)(organizationID);
            if (!encryptedorganizationID) {
                throw new Error('Orgnaization ID not found in cookies');
            }
            const orgId = Number(encryptedorganizationID);
            const system_user_id = req.cookies.system_user_id;
            if (!system_user_id) {
                return {
                    statusCode: 401,
                    message: 'Unauthorized: Missing user ID.',
                    data: null,
                };
            }
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            if (!decrypted_system_user_id) {
                return {
                    statusCode: 401,
                    message: 'Unauthorized: Invalid user ID.',
                    data: null,
                };
            }
            const result = await this.organizationService.bulkImportBranches(dtos, +orgId, +decrypted_system_user_id);
            console.log('POINT:1', result);
            res.cookie('branch_access', JSON.stringify(result.data.branch_access), {
                httpOnly: false,
                sameSite: 'lax',
                path: '/',
            });
            console.log('POINT:2');
            console.log('🍪 GET:', req.cookies.branch_access);
            return result;
        }
        catch (error) {
            console.error('Bulk import error:', error);
            return {
                statusCode: 500,
                message: 'Internal Server Error during branch import',
                error: error.message,
            };
        }
    }
    async downloadBranchImportTemplate(req, res) {
        try {
            const buffer = await this.organizationService.downloadBranchImportTemplate();
            res.setHeader('Content-Disposition', 'attachment; filename=branch_template.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        }
        catch (error) {
            console.error('Error generating Branch template:', error);
            res.status(500).send('Failed to generate Excel template');
        }
    }
    async exportOrganizationBranches(res, dto) {
        const buffer = await this.organizationService.exportOrganizationBranchesExcel(dto);
        const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename=organization-branches-${dateStamp}.xlsx`,
        });
        res.end(buffer);
    }
    async getOrganizationBranchesForDropdown(req) {
        try {
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const dropdownBranches = await this.organizationService.getAllBranchesforDropdown(branchIds);
            return {
                status: true,
                message: 'Branches fetched successfully',
                data: dropdownBranches,
            };
        }
        catch (error) {
            return {
                status: false,
                message: 'Failed to fetch branches',
                error: error.message || error,
            };
        }
    }
    async getLocationTypeOptions(type) {
        return await this.organizationService.getLocationTypeOptions(type);
    }
    async createNewOrgBranch(payload, req, res) {
        try {
            console.log('POINT:1');
            const organizationID = req.cookies.organization_id;
            const decrypted_organizationID = (0, crypto_utils_1.decrypt)(organizationID);
            console.log('POINT:2');
            const system_user_id = req.cookies.system_user_id;
            const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
            console.log('POINT:3');
            const role_id_raw = req.cookies.role_id;
            console.log('role_id_raw', role_id_raw);
            const role_id = role_id_raw ? (0, crypto_utils_1.decrypt)(role_id_raw.toString()) : null;
            console.log('POINT:4');
            console.log('decrypted_system_user_id:', decrypted_system_user_id, 'role_id:', role_id);
            if (!decrypted_organizationID) {
                throw new common_1.BadRequestException('Organization ID not found in cookies');
            }
            const organization_Id = Number(decrypted_organizationID);
            if (isNaN(organization_Id)) {
                throw new common_1.BadRequestException('Invalid decrypted organization ID');
            }
            console.log('POINT:4');
            const branch = await this.organizationService.createBranch(payload, organization_Id, Number(decrypted_system_user_id), req);
            const actualUserId = await this.organizationService.getUserByPublicID(Number(decrypted_system_user_id));
            const isSuperAdmin = Number(actualUserId) === 1 && Number(role_id) === 1;
            console.log('actualUserId:', actualUserId, 'isSuperAdmin:', isSuperAdmin, 'branch.branch_id:', branch.branch_id);
            if (isSuperAdmin && branch.branch_id) {
                let currentAccess = [];
                try {
                    const raw = req.cookies.branch_access;
                    console.log('raw branch_access cookie:', raw);
                    if (raw) {
                        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                        currentAccess = Array.isArray(parsed) ? parsed : [];
                    }
                }
                catch {
                    currentAccess = [];
                }
                if (!currentAccess.includes(branch.branch_id)) {
                    currentAccess.push(branch.branch_id);
                }
                const secure = process.env.NODE_ENV === 'production';
                const cookieValue = JSON.stringify(currentAccess);
                res.setHeader('Set-Cookie', `branch_access=${cookieValue}; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Lax; HttpOnly${secure ? '; Secure' : ''}`);
                console.log('✅ branch_access cookie updated:', currentAccess);
            }
            return res.status(common_1.HttpStatus.CREATED).json({
                statusCode: common_1.HttpStatus.CREATED,
                success: true,
                message: 'Branch created successfully',
                data: branch,
            });
        }
        catch (error) {
            console.error('Error creating branch:', error);
            if (error instanceof common_1.HttpException) {
                const status = error.getStatus();
                const response = error.getResponse();
                const message = typeof response === 'string'
                    ? response
                    : response?.message || error.message;
                return res
                    .status(status)
                    .json({ statusCode: status, success: false, message });
            }
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'An unexpected error occurred while creating the branch',
                error: error?.message || error,
            });
        }
    }
    async getOrganizationUsers(dto, req) {
        try {
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const { schema, register_login_user_id } = (0, tendant_and_schema_helper_1.getOrganizationMetadata)(req);
            dto.schema = schema;
            dto.login_user_id = register_login_user_id;
            const result = await this.organizationService.fetchOrganizationUsers2(dto, branchIds);
            return result;
        }
        catch (error) {
            console.error('Error in getOrganizationUsers:', error);
            return {
                success: false,
                message: 'An error occurred while fetching users',
                error: error.message,
            };
        }
    }
    async fetchSingleUsersData(body, res) {
        const { user_id } = body;
        if (!user_id) {
            return res
                .status(400)
                .json({ success: false, message: 'user_id is required' });
        }
        const response = await this.organizationService.fetchSingleUsersData(+user_id);
        return res.status(response.status).json(response);
    }
    async fetchSingleUsersProfile(body, res) {
        const { user_id } = body;
        if (!user_id) {
            return res
                .status(400)
                .json({ success: false, message: 'user_id is required' });
        }
        const response = await this.organizationService.fetchSingleUsersProfile(+user_id);
        return res.status(response.status).json(response);
    }
    async fetchAllUsers(branch_id, department_id) {
        try {
            return await this.organizationService.fetchAllUsers2(branch_id, department_id);
        }
        catch (error) {
            return false;
        }
    }
    async uploadUserProfileImage(file, res) {
        const result = await this.organizationService.uploadUserProfileImage(file);
        return res.status(result.status).json(result);
    }
    async createNewUser(payload, req) {
        const organizationID = req.cookies.organization_id;
        const encryptedorganizationID = (0, crypto_utils_1.decrypt)(organizationID);
        if (!encryptedorganizationID) {
            throw new Error('Organization ID not found in cookies');
        }
        const organization_Id = Number(encryptedorganizationID);
        if (isNaN(organization_Id)) {
            throw new Error('Invalid decrypted user ID');
        }
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            return { status: 401, message: 'Unauthorized: No user ID found' };
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        const newUser = await this.organizationService.createNewUser(payload, organization_Id, +decrypted_system_user_id);
        return newUser;
    }
    reinviteUser(payload, req) {
        console.log('REINVITE:payload', payload);
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            return {
                status: 401,
                message: 'Unauthorized: No user ID found',
            };
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        return this.organizationService.reinviteUser(+payload.userLoginId, +decrypted_system_user_id);
    }
    async updateUserManagementData(payload, req, res) {
        console.log('payload', payload);
        try {
            const updatedUser = await this.organizationService.updateUserManagementData(payload);
            return res.status(common_1.HttpStatus.OK).json({
                status: common_1.HttpStatus.OK,
                message: 'User updated successfully',
                data: updatedUser.data,
            });
        }
        catch (error) {
            return res.status(error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
            });
        }
    }
    async activateUsers(body, res, req) {
        const user_ids = body.userIds;
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            return {
                status: 401,
                message: 'Unauthorized: No user ID found',
            };
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        try {
            if (!user_ids || user_ids.length === 0) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'user_ids must be a non-empty array',
                });
            }
            const result = await this.organizationService.activateUsers(user_ids, +decrypted_system_user_id);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            console.error('Error activating users:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to activate users',
                error: error.message || error,
            });
        }
    }
    async deactivateUsers(body, res, req) {
        const user_ids = body.userIds;
        const system_user_id = req.cookies.system_user_id;
        if (!system_user_id) {
            return {
                status: 401,
                message: 'Unauthorized: No user ID found',
            };
        }
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        console.log('deactivate-users', user_ids);
        try {
            if (!user_ids || user_ids.length === 0) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    status: 'error',
                    message: 'user_ids must be a non-empty array',
                });
            }
            const result = await this.organizationService.deactivateUsers(user_ids, +decrypted_system_user_id);
            return res.status(common_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            console.error('Error deactivating users:', error);
            return res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: 'error',
                message: 'Failed to deativate users',
                error: error.message || error,
            });
        }
    }
    async deleteUserManagementData(body, req, res) {
        const organizationID = req.cookies.organization_id;
        const encryptedorganizationID = (0, crypto_utils_1.decrypt)(organizationID);
        if (!encryptedorganizationID) {
            throw new Error('Orgnaization ID not found in cookies');
        }
        const organization_Id = Number(encryptedorganizationID);
        const userIds = Array.isArray(body.userIds) ? body.userIds : [body.userIds];
        const result = await this.organizationService.deleteUserManagementData(userIds, +organization_Id);
        return res.status(common_1.HttpStatus.OK).json(result);
    }
    async exportUsersToExcel(res, dto) {
        const buffer = await this.organizationService.exportFilteredExcelForUsers(dto);
        const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        res.set({
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename=users-${dateStamp}.xlsx`,
        });
        res.end(buffer);
    }
    async resetPasswordByAdmin(userId, req) {
        const system_user_id = req.cookies.system_user_id;
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        if (!decrypted_system_user_id) {
            throw new common_1.UnauthorizedException('Invalid session');
        }
        return await this.organizationService.sendResetPasswordEmailByAdmin(Number(userId), Number(decrypted_system_user_id));
    }
    async changeUserPasswordByAdmin(dto, req) {
        const system_user_id = req.cookies.system_user_id;
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
        if (!decrypted_system_user_id) {
            throw new common_1.UnauthorizedException('Invalid session');
        }
        return await this.organizationService.changeUserPasswordByAdmin(Number(dto.userId), dto.newPassword, Boolean(dto.sendEmailNotification), Number(decrypted_system_user_id));
    }
    async generateUserTemplate(req, res) {
        try {
            const branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
            const buffer = await this.organizationService.generateUserTemplate(branchIds);
            res.setHeader('Content-Disposition', 'attachment; filename=user_template.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.send(buffer);
        }
        catch (error) {
            console.error('Error generating vendor template:', error);
            res.status(500).send('Failed to generate Excel template');
        }
    }
    async bulkCreateUser(dtos, req) {
        const system_user_id = req.cookies.system_user_id;
        const organizationID = req.cookies.organization_id;
        const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id?.toString());
        const encryptedorganizationID = (0, crypto_utils_1.decrypt)(organizationID);
        if (!encryptedorganizationID) {
            console.error('❌ [Point 3] Organization ID not found in cookies');
            throw new Error('Organization ID not found in cookies');
        }
        const organization_Id = Number(encryptedorganizationID);
        if (isNaN(organization_Id)) {
            throw new Error('Invalid decrypted organization ID');
        }
        console.log('📦 [Point 4] DTO sample:', dtos?.[0]);
        if (decrypted_system_user_id) {
            return await this.organizationService.bulkCreateUsers(dtos, organization_Id, +decrypted_system_user_id);
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
    async sidebarCount() {
        return this.organizationService.manageAssetsSidebarCount();
    }
    async createNotification(dto) {
        console.log('🚀 API HIT: /create-notification');
        console.log('📦 Request Body:', dto);
        const tenantId = dto.organization_id;
        console.log('🏢 Organization ID received from Billing:', tenantId);
        const result = await this.organizationService.createNotification(dto, tenantId);
        return result;
    }
    async getTenantUserId(req) {
        const mainUserEncrypted = req.cookies?.main_user_id;
        const orgId = req.cookies?.organization_id;
        console.log('✅ Cookies received:', req.cookies);
        if (!orgId) {
            throw new common_1.HttpException('Required cookie organization_id is missing', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!mainUserEncrypted) {
            throw new common_1.HttpException('Required cookie main_user_id is missing', common_1.HttpStatus.BAD_REQUEST);
        }
        const tenantId = Number((0, crypto_utils_1.decrypt)(orgId));
        console.log('🔑 Tenant ID from cookie:', tenantId);
        if (isNaN(tenantId)) {
            throw new common_1.HttpException('Invalid organization_id value in cookie', common_1.HttpStatus.BAD_REQUEST);
        }
        const tenantUserId = Number((0, crypto_utils_1.decrypt)(mainUserEncrypted));
        console.log('🔑 Tenant User ID from cookie:', tenantUserId);
        if (isNaN(tenantUserId)) {
            throw new common_1.HttpException('Invalid main_user_id value in cookie', common_1.HttpStatus.BAD_REQUEST);
        }
        return { tenantUserId };
    }
    async getNotifications(recipientId, req) {
        const orgEncrypted = req.cookies?.organization_id;
        console.log('🍪 Cookies:', req.cookies);
        if (!orgEncrypted) {
            throw new common_1.HttpException('organization_id cookie missing', common_1.HttpStatus.BAD_REQUEST);
        }
        const organizationId = Number((0, crypto_utils_1.decrypt)(orgEncrypted));
        console.log('🏢 Organization ID:', organizationId);
        console.log('👤 Recipient ID:', recipientId);
        return this.organizationService.getNotifications(recipientId, organizationId);
    }
    async getUnreadCount(recipientId, req) {
        const orgEncrypted = req.cookies?.organization_id;
        if (!orgEncrypted) {
            throw new common_1.HttpException('organization_id cookie missing', common_1.HttpStatus.BAD_REQUEST);
        }
        const organizationId = Number((0, crypto_utils_1.decrypt)(orgEncrypted));
        console.log('🏢 Organization ID:', organizationId);
        console.log('👤 Recipient ID:', recipientId);
        return this.organizationService.getUnreadCount(recipientId, organizationId);
    }
    async markAsRead(req, body) {
        const orgEncrypted = req.cookies?.organization_id;
        if (!orgEncrypted) {
            throw new common_1.HttpException('organization_id missing', common_1.HttpStatus.BAD_REQUEST);
        }
        const organizationId = Number((0, crypto_utils_1.decrypt)(orgEncrypted));
        const result = await this.organizationService.markAsRead(organizationId, body.ids);
        return {
            success: true,
            updatedCount: result,
        };
    }
    async ipdateUserProfileImage(file, user_id, res) {
        const result = await this.organizationService.saveAndUpdateUserProfileImage(Number(user_id), file);
        return res.status(result.status).json(result);
    }
    async clear(req, body) {
        const orgEncrypted = req.cookies?.organization_id;
        const organizationId = Number((0, crypto_utils_1.decrypt)(orgEncrypted));
        return this.organizationService.clearNotifications(organizationId, body.id);
    }
    async updateDepreciationSettings(dto, req) {
        const organizationID = req.cookies.organization_id;
        const decryptedOrgId = (0, crypto_utils_1.decrypt)(organizationID);
        if (!decryptedOrgId) {
            throw new Error('Organization ID not found in cookies');
        }
        const organization_Id = Number(decryptedOrgId);
        const result = await this.organizationService.updateDepreciationSettings(dto, organization_Id);
        return {
            statusCode: 200,
            message: 'Depreciation settings updated successfully',
            data: result,
        };
    }
};
exports.OrganizationalProfileController = OrganizationalProfileController;
__decorate([
    (0, common_1.Get)('download-vendor-template'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "downloadVendorTemplate", null);
__decorate([
    (0, common_1.Get)('getOrganizationDesignation'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "fetchOrganizationDesignation", null);
__decorate([
    (0, common_1.Get)('getOrganizationDesignationDropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "fetchOrganizationDesignationsDropdown", null);
__decorate([
    (0, common_1.Get)('getDesignationsByDepartment'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('department_id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "fetchDesignationsByDepartment", null);
__decorate([
    (0, common_1.Get)('fetchindustrytype'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getIndustryTypeValues", null);
__decorate([
    (0, common_1.Get)('fetchDepartmentconfig'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number, Number, String]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getDepartmentConfigValues", null);
__decorate([
    (0, common_1.Get)('fetchDepartments'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number, Number, String]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getDepartmentsWithPagination", null);
__decorate([
    (0, common_1.Get)('fetchDesignations'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getDesignationsWithPagination", null);
__decorate([
    (0, common_1.Post)('fetchDesignationsconfig'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getDesignationsConfigValues", null);
__decorate([
    (0, common_1.Post)('setDepartments'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [department_dto_1.CreateDepartmentsDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "setDepartmentValues", null);
__decorate([
    (0, common_1.Post)('editDepartment'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_dept_dto_1.EditDepartmentDto]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "editDepartment", null);
__decorate([
    (0, common_1.Post)('setDesignations'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [designation_dto_1.CreateDesignationDto]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "setDesignationsValues", null);
__decorate([
    (0, common_1.Post)('editDesignation'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Body)('designation_name')),
    __param(2, (0, common_1.Body)('desg_description')),
    __param(3, (0, common_1.Body)('departmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "editDesignation", null);
__decorate([
    (0, common_1.Post)('removeDepartments'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_department_dto_1.DeleteDepartmentsDto]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "removeDepartmentValues", null);
__decorate([
    (0, common_1.Post)('removeDesignation'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_degination_dto_1.DeleteDesignationsDto]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "removeDesignationValue", null);
__decorate([
    (0, common_1.Get)('getOrganizationDepartments'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "fetchOrganizationDeparments", null);
__decorate([
    (0, common_1.Get)('getOrganizationDepartmentsForDropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "fetchOrganizationDeparmentsForDropdown", null);
__decorate([
    (0, common_1.Get)('users-for-dropdown-of-filter'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getCategoryDropdown", null);
__decorate([
    (0, common_1.Get)('exportVendorCSV'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "exportVendorCSV", null);
__decorate([
    (0, common_1.Get)('getAllorganizationVenders'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getAllorganizationVenders", null);
__decorate([
    (0, common_1.Get)('fetchOrganizationProfile'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getOrganizationalProfile", null);
__decorate([
    (0, common_1.Post)('updateOrganizationalProfile'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logoPreviewBase64', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const orgId = req.cookies?.organization_id
                    ? parseInt((0, crypto_utils_1.decrypt)(req.cookies.organization_id))
                    : 'unknown';
                const timestamp = Date.now();
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `org-${orgId}-${timestamp}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowed = [
                'image/png',
                'image/jpeg',
                'image/jpg',
                'image/svg+xml',
            ];
            if (!allowed.includes(file.mimetype)) {
                return cb(new Error('Only PNG, JPG, JPEG, SVG files allowed'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "updateOrgainzationProfileValues", null);
__decorate([
    (0, common_1.Get)('fetchCount'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getCounts", null);
__decorate([
    (0, common_1.Get)('fetchDashboardCount'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getDashboardCounts", null);
__decorate([
    (0, common_1.Get)('fetchDepartmentWiseCounts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "fetchDepartmentWiseCounts", null);
__decorate([
    (0, common_1.Get)('fetchStatusWiseCounts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "fetchStatusWiseCounts", null);
__decorate([
    (0, common_1.Post)('fetch-single-vendor-data'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "fetchSingleVendorsData", null);
__decorate([
    (0, common_1.Get)('getOrganizationVendors'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "fetchOrganizationVendors", null);
__decorate([
    (0, common_1.Post)('get-all-Organization-Vendors'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getOrganizationVendors1", null);
__decorate([
    (0, common_1.Post)('getOrganizationVendorsDropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getOrganizationVendorsDropdown", null);
__decorate([
    (0, common_1.Get)('generate-vendor-code'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "generateProjectCode", null);
__decorate([
    (0, common_1.Post)('insert-new-vendor'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "createNewVendor", null);
__decorate([
    (0, common_1.Get)('get-departments-from-vendors'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getDepartmentsFromVendors", null);
__decorate([
    (0, common_1.Post)('update-vendor-data'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "updateVendorData", null);
__decorate([
    (0, common_1.Post)('delete-vendor-data'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "deleteVendorData", null);
__decorate([
    (0, common_1.Post)('activate-vendors'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "activateVendors", null);
__decorate([
    (0, common_1.Post)('deactivate-vendors'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "deactivateVendors", null);
__decorate([
    (0, common_1.Post)('bulk-import-vendor'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "bulkCreateVendors", null);
__decorate([
    (0, common_1.Post)('export-organization-vendors'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "exportOrganizationVendorsExcel", null);
__decorate([
    (0, common_1.Get)('pincode-state-city/:pincode'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('pincode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "findPincodeviaStateAndCity", null);
__decorate([
    (0, common_1.Get)('overview'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getWeeklyOverview", null);
__decorate([
    (0, common_1.Post)('get-all-my-asset-data-for-login-user'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getAllLoginUserMyAssetData", null);
__decorate([
    (0, common_1.Post)('export-my-assets-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_view_dto_1.ListViewDto]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "exportMyAssetsToExcel", null);
__decorate([
    (0, common_1.Post)('save-asset-id-settings'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "saveAssetIdSettings", null);
__decorate([
    (0, common_1.Post)('asset-id-settings-barcode'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "updateBarcodeSetting", null);
__decorate([
    (0, common_1.Post)('asset-id-settings-qrcode'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "updateQrcodeSetting", null);
__decorate([
    (0, common_1.Get)('asset-id-settings'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('scope')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getAssetIdSettings", null);
__decorate([
    (0, common_1.Get)('asset-id-templates'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getAssetIdTemplates", null);
__decorate([
    (0, common_1.Post)('save-QR-code-settings'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "saveQRCodeSettings", null);
__decorate([
    (0, common_1.Get)('get-QR-code-settings'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getQRCodeSettings", null);
__decorate([
    (0, common_1.Post)('update-sidebar-preferances-user-specific'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "userSpecificSidebarPrefrances", null);
__decorate([
    (0, common_1.Post)('update-theme-preferences'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "updateThemePreferences", null);
__decorate([
    (0, common_1.Get)('get-login-sidebar-preferances'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getLoginUserSidebarPreferances", null);
__decorate([
    (0, common_1.Post)('update-other-settings'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "updateothersettings", null);
__decorate([
    (0, common_1.Post)('save-sidebar-preferances'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "saveSidebarPreferances", null);
__decorate([
    (0, common_1.Get)('get-sidebar-preferances'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getSidebarPreferances", null);
__decorate([
    (0, common_1.Post)('add-sidebar-favourite-to-login-user'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "addSidebarFavouriteToUser", null);
__decorate([
    (0, common_1.Get)('get-sidebar-favourite-of-login-user'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getSidebarFavouriteOfLoginUser", null);
__decorate([
    (0, common_1.Post)('disable-department'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_department_dto_1.DeleteDepartmentsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "disableDepartment", null);
__decorate([
    (0, common_1.Post)('enable-department'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_department_dto_1.DeleteDepartmentsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "enableDepartment", null);
__decorate([
    (0, common_1.Post)('disable-designation'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_degination_dto_1.DeleteDesignationsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "disableDesignation", null);
__decorate([
    (0, common_1.Post)('enable-designation'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_degination_dto_1.DeleteDesignationsDto, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "enableDesignation", null);
__decorate([
    (0, common_1.Post)('check-asset-restriction-by-feature-ui'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "checkAssetRestrictionByFeature", null);
__decorate([
    (0, common_1.Post)('check-restrictions'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "checkRestrictions", null);
__decorate([
    (0, common_1.Post)('getOrganizationBranches'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getAllOrgBranches", null);
__decorate([
    (0, common_1.Post)('edit-org-branch-by-id'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "editOrgBranchById", null);
__decorate([
    (0, common_1.Post)('get-org-branch-by-id'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('branch_id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getOrgBranchById", null);
__decorate([
    (0, common_1.Post)('delete-org-branch'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "deleteOrgBranch", null);
__decorate([
    (0, common_1.Post)('activate-org-branch'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "activateOrgBranch", null);
__decorate([
    (0, common_1.Post)('deactivate-org-branch'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "deactivateOrgBranch", null);
__decorate([
    (0, common_1.Post)('create-primary-org-branch'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "createPrimaryOrgBranch", null);
__decorate([
    (0, common_1.Post)('import-excle-for-branches'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "bulkImportBranches", null);
__decorate([
    (0, common_1.Get)('download-excle-for-branches-import'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "downloadBranchImportTemplate", null);
__decorate([
    (0, common_1.Post)('export-orgnization-branches'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_view_dto_1.ListViewDto]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "exportOrganizationBranches", null);
__decorate([
    (0, common_1.Get)('getOrganizationBranches-for-dropdown'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getOrganizationBranchesForDropdown", null);
__decorate([
    (0, common_1.Get)('get-location-type-options'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getLocationTypeOptions", null);
__decorate([
    (0, common_1.Post)('create-new-branch'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "createNewOrgBranch", null);
__decorate([
    (0, common_1.Post)('get-all-orgnization-users'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_view_dto_1.ListViewDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getOrganizationUsers", null);
__decorate([
    (0, common_1.Post)('fetch-single-user-data'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "fetchSingleUsersData", null);
__decorate([
    (0, common_1.Post)('fetch-single-user-profile'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "fetchSingleUsersProfile", null);
__decorate([
    (0, common_1.Get)('fetchAllUsers'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('branch_id')),
    __param(1, (0, common_1.Query)('department_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "fetchAllUsers", null);
__decorate([
    (0, common_1.Post)('upload-user-profile-image'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profile_image')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "uploadUserProfileImage", null);
__decorate([
    (0, common_1.Post)('insert-new-user'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "createNewUser", null);
__decorate([
    (0, common_1.Post)('reinvite-user'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OrganizationalProfileController.prototype, "reinviteUser", null);
__decorate([
    (0, common_1.Post)('update-user-management-data'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "updateUserManagementData", null);
__decorate([
    (0, common_1.Post)('activate-users'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "activateUsers", null);
__decorate([
    (0, common_1.Post)('deactivate-users'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "deactivateUsers", null);
__decorate([
    (0, common_1.Post)('delete-user-management-data'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "deleteUserManagementData", null);
__decorate([
    (0, common_1.Post)('export-users-excel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_view_dto_1.ListViewDto]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "exportUsersToExcel", null);
__decorate([
    (0, common_1.Post)('reset-password-by-admin'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "resetPasswordByAdmin", null);
__decorate([
    (0, common_1.Post)('change-user-password-by-admin'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "changeUserPasswordByAdmin", null);
__decorate([
    (0, common_1.Get)('download-user-excle-import-template'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "generateUserTemplate", null);
__decorate([
    (0, common_1.Post)('bulk-excle-import-user'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "bulkCreateUser", null);
__decorate([
    (0, common_1.Get)('get-manage-assets-counts-for-sidebar'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "sidebarCount", null);
__decorate([
    (0, common_1.Post)('create-notification'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notificaiton_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "createNotification", null);
__decorate([
    (0, common_1.Get)('tenant-user-id'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getTenantUserId", null);
__decorate([
    (0, common_1.Get)('in-app'),
    __param(0, (0, common_1.Query)('recipient_id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)('in-app/unread-count'),
    __param(0, (0, common_1.Query)('recipient_id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Post)('mark-read'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Post)('update-user-profile-image'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profile_image')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('user_id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "ipdateUserProfileImage", null);
__decorate([
    (0, common_1.Post)('clear-all'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "clear", null);
__decorate([
    (0, common_1.Post)('updateDepreciationSettings'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_organizational_profile_dto_1.UpdateDepreciationSettingsDto, Object]),
    __metadata("design:returntype", Promise)
], OrganizationalProfileController.prototype, "updateDepreciationSettings", null);
exports.OrganizationalProfileController = OrganizationalProfileController = __decorate([
    (0, common_1.Controller)('organizational-profile'),
    __metadata("design:paramtypes", [organizational_profile_service_1.OrganizationService])
], OrganizationalProfileController);
