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
exports.OrganizationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const auth_service_1 = require("../auth/auth.service");
const mail_config_service_1 = require("../common/mail/mail-config.service");
const mail_service_1 = require("../common/mail/mail.service");
const register_organization_entity_1 = require("../organization_register/entities/register-organization.entity");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const typeorm_2 = require("typeorm");
const XlsxPopulate = __importStar(require("xlsx-populate"));
const database_service_1 = require("../dynamic-schema/database.service");
const branches_entity_1 = require("./entity/branches.entity");
const department_entity_1 = require("./entity/department.entity");
const designations_entity_1 = require("./entity/designations.entity");
const organizational_profile_entity_1 = require("./entity/organizational-profile.entity");
const organizational_user_entity_1 = require("./entity/organizational-user.entity");
const organizational_vendors_entity_1 = require("./entity/organizational-vendors.entity");
const department_config_entity_1 = require("./public_schema_entity/department-config.entity");
const designations_config_entity_1 = require("./public_schema_entity/designations-config.entity");
const industry_types_entity_1 = require("./public_schema_entity/industry-types.entity");
const fs = __importStar(require("fs"));
const fs_1 = require("fs");
const path_1 = __importStar(require("path"));
const asset_depreciation_service_1 = require("../asset-depreciation/asset-depreciation.service");
const locations_service_1 = require("../asset-locations/locations.service");
const asset_mapping_entity_1 = require("../asset-mapping/entities/asset-mapping.entity");
const asset_stock_serials_entity_1 = require("../assets-data/stocks/entities/asset_stock_serials.entity");
const v_asset_stock_serials_view_entity_1 = require("../assets-data/stocks/entities/v-asset-stock-serials-view.entity");
const stock_summary_refresh_service_1 = require("../assets-data/stocks/stock-summary-refresh.service");
const branch_access_1 = require("../branch-access/branch-access");
const request_context_service_1 = require("../common/context/request-context.service");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
const keyset_pagination_1 = require("../common/pagination/keyset-pagination");
const dropdown_cache_service_1 = require("../common/redis/dropdown-cache.service");
const dropdown_entities_1 = require("../common/redis/dropdown-entities");
const redis_service_1 = require("../common/redis/redis.service");
const restriction_util_1 = require("../common/restriction/restriction-util");
const usage_util_1 = require("../common/usage/usage-util");
const location_transfers_entity_1 = require("../location-transfer/entities/location-transfers.entity");
const maintenance_entity_1 = require("../manage-asset/entities/maintenance.entity");
const roles_permission_entity_1 = require("../roles_permissions/entities/roles_permission.entity");
const cache_service_helper_1 = require("../utils/cache-service-helper");
const typeorm_3 = require("typeorm");
const entity_lookup_service_1 = require("./entity-lookup.service");
const asset_id_settings_entity_1 = require("./entity/asset-id-settings.entity");
const location_branch_mapping_entity_1 = require("./entity/location-branch-mapping.entity");
const location_types_entity_1 = require("./entity/location-types.entity");
const locations_entity_1 = require("./entity/locations.entity");
const orgnization_stats_entity_1 = require("./entity/orgnization-stats.entity");
const other_settings_entity_1 = require("./entity/other-settings.entity");
const casbin_rule_entity_1 = require("./entity/policy-builder/casbin-rule.entity");
const qr_code_settings_entity_1 = require("./entity/qr-code-settings.entity");
const asset_limitation_entity_1 = require("./public_schema_entity/asset-limitation.entity");
const in_app_notifications_entity_1 = require("./public_schema_entity/in_app_notifications.entity");
const pincode_entity_1 = require("./public_schema_entity/pincode.entity");
const branch_asset_counts_view_1 = require("./viewentity/branch-asset-counts.view");
const location_asset_counts_view_1 = require("./viewentity/location-asset-counts.view");
const vendor_asset_count_view_1 = require("./viewentity/vendor-asset-count.view");
const roles_permissions_service_1 = require("../roles_permissions/roles_permissions.service");
let OrganizationService = class OrganizationService {
    constructor(dataSource, databaseService, redisService, mailService, mailConfigService, authService, EntityLookupService, notificationHelper, rolesService, locationsService, userRepository, locationTransfer, registerUser, registerOrganization, vendorRepository, branchRepository, departmentRepository, locationBranchMappingRepository, rolesPermissionRepository, assetViewRepo, designationsRepository, locationRepository, pincodesRepository, orgStatRepository, qrCodeSettingRepo, assetMappingRepository, assetMaintenanceRepository, assetIdSettingsRepo, locationAssetCountsView, otherSettingsEntityRepo, assetLimitRepo, organizationalProfileRepo, assetStockSerialsRepository, inRepo, depViewService, dropdownCache, requestContext, stockSummaryRefresh) {
        this.dataSource = dataSource;
        this.databaseService = databaseService;
        this.redisService = redisService;
        this.mailService = mailService;
        this.mailConfigService = mailConfigService;
        this.authService = authService;
        this.EntityLookupService = EntityLookupService;
        this.notificationHelper = notificationHelper;
        this.rolesService = rolesService;
        this.locationsService = locationsService;
        this.userRepository = userRepository;
        this.locationTransfer = locationTransfer;
        this.registerUser = registerUser;
        this.registerOrganization = registerOrganization;
        this.vendorRepository = vendorRepository;
        this.branchRepository = branchRepository;
        this.departmentRepository = departmentRepository;
        this.locationBranchMappingRepository = locationBranchMappingRepository;
        this.rolesPermissionRepository = rolesPermissionRepository;
        this.assetViewRepo = assetViewRepo;
        this.designationsRepository = designationsRepository;
        this.locationRepository = locationRepository;
        this.pincodesRepository = pincodesRepository;
        this.orgStatRepository = orgStatRepository;
        this.qrCodeSettingRepo = qrCodeSettingRepo;
        this.assetMappingRepository = assetMappingRepository;
        this.assetMaintenanceRepository = assetMaintenanceRepository;
        this.assetIdSettingsRepo = assetIdSettingsRepo;
        this.locationAssetCountsView = locationAssetCountsView;
        this.otherSettingsEntityRepo = otherSettingsEntityRepo;
        this.assetLimitRepo = assetLimitRepo;
        this.organizationalProfileRepo = organizationalProfileRepo;
        this.assetStockSerialsRepository = assetStockSerialsRepository;
        this.inRepo = inRepo;
        this.depViewService = depViewService;
        this.dropdownCache = dropdownCache;
        this.requestContext = requestContext;
        this.stockSummaryRefresh = stockSummaryRefresh;
    }
    sanitizeValue(value, type) {
        if (value === undefined)
            return undefined;
        if (value === null)
            return null;
        if (type === 'string')
            return value.toString();
        if (type === 'number') {
            const n = Number(value);
            return isNaN(n) ? null : n;
        }
        if (type === 'boolean')
            return value ? 1 : 0;
        return value;
    }
    sanitizeValue2(value, type) {
        if (value === undefined)
            return undefined;
        if (value === null)
            return null;
        if (type === 'string') {
            const str = value.toString().trim();
            return str === '' ? null : str;
        }
        if (type === 'number') {
            const n = Number(value);
            return isNaN(n) || n <= 0 ? null : n;
        }
        if (type === 'boolean') {
            return value ? 1 : 0;
        }
        return value;
    }
    async getUserDropdown(branchIds = []) {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.USER, { branchIds }, async () => {
            const qb = this.userRepository
                .createQueryBuilder('user')
                .where('user.is_deleted = :isDeleted', { isDeleted: 0 })
                .andWhere('user.is_active = :isActive', { isActive: 1 });
            (0, branch_access_1.applyBranchFilter)({
                qb,
                entityKey: 'User',
                branchIds,
            });
            const users = await qb.getMany();
            return users.map((user) => ({
                label: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim(),
                value: user.user_id,
                is_active: user.is_active,
            }));
        });
    }
    async getCounts(branchIds = [], schema, register_user_login) {
        const counts = {
            users: 0,
            assets: 0,
            departments: 0,
            branches: 0,
            locations: 0,
        };
        const cacheKey = (0, cache_service_helper_1.buildListCacheKey)({
            prefix: 'orgnizationprofile-getcounts:*',
            schema: schema,
            login_user_id: register_user_login,
        });
        const cached = await this.redisService.get(cacheKey);
        console.log('CACHED:', cached);
        if (cached) {
            console.log('REDIS HIT:ORGNIZATION COUNT');
            if (cached != null) {
                return cached;
            }
        }
        console.log('REDIS MISS:ORGNIZATION COUNT');
        try {
            const userQb = this.dataSource
                .getRepository('users')
                .createQueryBuilder('user')
                .where('user.is_active = :isActive', { isActive: 1 });
            (0, branch_access_1.applyBranchFilter)({ qb: userQb, entityKey: 'User', branchIds });
            counts.users = await userQb.getCount();
        }
        catch (error) {
            console.error('Error fetching user count:', error.message);
        }
        try {
            counts.departments = await this.dataSource
                .getRepository('departments')
                .createQueryBuilder('department')
                .where('department.is_active = :isActive', { isActive: 1 })
                .getCount();
        }
        catch (error) {
            console.error('Error fetching department count:', error.message);
        }
        try {
            let assetsResult;
            if (branchIds?.length) {
                const placeholders = branchIds.map((_, i) => `$${i + 1}`).join(',');
                assetsResult = await this.dataSource.query(`SELECT COALESCE(SUM(asset_count), 0)::bigint AS count
             FROM v_branch_asset_counts
            WHERE branch_id IN (${placeholders})`, branchIds);
            }
            else {
                assetsResult = await this.dataSource.query(`SELECT COALESCE(SUM(asset_count), 0)::bigint AS count
             FROM v_branch_asset_counts`);
            }
            counts.assets = Number(assetsResult?.[0]?.count || 0);
        }
        catch (error) {
            console.error('Error fetching asset serial count:', error.message);
        }
        try {
            const branchQb = this.dataSource
                .getRepository('branches')
                .createQueryBuilder('branch')
                .where('branch.is_active = :isActive', { isActive: 1 });
            (0, branch_access_1.applyBranchFilter)({ qb: branchQb, entityKey: 'Branch', branchIds });
            counts.branches = await branchQb.getCount();
        }
        catch (error) {
            console.error('Error fetching branch count:', error.message);
        }
        try {
            const locationQb = this.dataSource
                .getRepository(locations_entity_1.Locations)
                .createQueryBuilder('location')
                .where('location.is_active = :isActive', {
                isActive: 1,
            })
                .andWhere('location.is_deleted = :isDeleted', {
                isDeleted: 0,
            });
            if (branchIds?.length) {
                locationQb
                    .innerJoin(location_branch_mapping_entity_1.LocationBranchMapping, 'lbm', `
        lbm.location_id = location.location_id
        AND lbm.is_active = 1
        AND lbm.is_deleted = 0
        `)
                    .andWhere('lbm.branch_id IN (:...branchIds)', { branchIds });
            }
            const result = await locationQb
                .select('COUNT(DISTINCT location.location_id)', 'count')
                .getRawOne();
            counts.locations = Number(result?.count || 0);
        }
        catch (error) {
            console.error('Error fetching locations count:', error.message);
        }
        const response = {
            status: 'success',
            message: 'Counts retrieved successfully.',
            data: counts,
        };
        await this.redisService.set(cacheKey, response, 300);
        return response;
    }
    async getDashboardCounts() {
        const counts = {
            users: 0,
            assets: 0,
            departments: 0,
            branches: 0,
            locations: 0,
            itAssets: 0,
            nonItAssets: 0,
            inUseAssets: 0,
            availableAssets: 0,
            maintenanceAssets: 0,
        };
        try {
            counts.users = await this.dataSource
                .getRepository('users')
                .createQueryBuilder('user')
                .where('user.is_active = :isActive', { isActive: 1 })
                .getCount();
        }
        catch (e) {
            console.error('Users count error:', e.message);
        }
        try {
            counts.departments = await this.dataSource
                .getRepository('departments')
                .createQueryBuilder('department')
                .where('department.is_active = :isActive', { isActive: 1 })
                .getCount();
        }
        catch (e) {
            console.error('Departments count error:', e.message);
        }
        try {
            counts.assets = await this.dataSource
                .getRepository('asset_mapping')
                .createQueryBuilder('am')
                .where('am.is_active = :isActive', { isActive: 1 })
                .andWhere('am.is_deleted = :isDeleted', { isDeleted: 0 })
                .getCount();
        }
        catch (e) {
            console.error('Assets count error:', e.message);
        }
        try {
            counts.itAssets = await this.dataSource
                .getRepository('asset_mapping')
                .createQueryBuilder('am')
                .where('am.asset_is_active = :isActive', { isActive: 1 })
                .andWhere('am.asset_is_deleted = :isDeleted', { isDeleted: 0 })
                .andWhere('am.asset_main_category_id = :catId', { catId: 1 })
                .getCount();
        }
        catch (e) {
            console.error('IT Assets count error:', e.message);
        }
        try {
            counts.nonItAssets = await this.dataSource
                .getRepository('asset_mapping')
                .createQueryBuilder('am')
                .where('am.is_active = :isActive', { isActive: 1 })
                .andWhere('am.is_deleted = :isDeleted', { isDeleted: 0 })
                .andWhere('am.asset_main_category_id = :catId', { catId: 2 })
                .getCount();
        }
        catch (e) {
            console.error('Non-IT Assets count error:', e.message);
        }
        try {
            counts.inUseAssets = await this.dataSource
                .getRepository('asset_mapping')
                .createQueryBuilder('am')
                .where('am.is_active = :isActive', { isActive: 1 })
                .andWhere('am.is_deleted = :isDeleted', { isDeleted: 0 })
                .andWhere('am.status_type_id = :statusId', { statusId: 7 })
                .getCount();
        }
        catch (e) {
            console.error('In-use assets count error:', e.message);
        }
        try {
            counts.availableAssets = await this.dataSource
                .getRepository('asset_mapping')
                .createQueryBuilder('am')
                .where('am.is_active = :isActive', { isActive: 1 })
                .andWhere('am.is_deleted = :isDeleted', { isDeleted: 0 })
                .andWhere('am.status_type_id = :statusId', { statusId: 1 })
                .getCount();
        }
        catch (e) {
            console.error('Available assets count error:', e.message);
        }
        try {
            counts.maintenanceAssets = await this.dataSource
                .getRepository('asset_mapping')
                .createQueryBuilder('am')
                .where('am.is_active = :isActive', { isActive: 1 })
                .andWhere('am.is_deleted = :isDeleted', { isDeleted: 0 })
                .andWhere('am.status_type_id = :statusId', { statusId: 6 })
                .getCount();
        }
        catch (e) {
            console.error('Maintenance assets count error:', e.message);
        }
        try {
            counts.branches = await this.dataSource
                .getRepository('branches')
                .createQueryBuilder('branch')
                .where('branch.is_active = :isActive', { isActive: 1 })
                .getCount();
        }
        catch (e) {
            console.error('Branches count error:', e.message);
        }
        try {
            counts.locations = await this.dataSource
                .getRepository(locations_entity_1.Locations)
                .createQueryBuilder('location')
                .where('location.is_active = :isActive', { isActive: 1 })
                .andWhere('location.is_deleted = :isDeleted', { isDeleted: 0 })
                .getCount();
        }
        catch (e) {
            console.error('Locations count error:', e.message);
        }
        return {
            status: 'success',
            message: 'Counts retrieved successfully.',
            data: counts,
        };
    }
    async getDepartmentWiseAssetCounts() {
        try {
            const data = await this.assetMappingRepository
                .createQueryBuilder('mapping')
                .select('mapping.department_id', 'departmentId')
                .addSelect('COUNT(mapping.mapping_id)', 'count')
                .where('mapping.is_active = :isActive', { isActive: 1 })
                .andWhere('mapping.is_deleted = :isDeleted', { isDeleted: 0 })
                .andWhere('mapping.department_id IS NOT NULL')
                .groupBy('mapping.department_id')
                .getRawMany();
            const departments = await this.departmentRepository
                .createQueryBuilder('department')
                .where('department.is_active = :isActive', { isActive: 1 })
                .getMany();
            const departmentCounts = departments.map((dept) => {
                const record = data.find((d) => Number(d.departmentId) === dept.department_id);
                return {
                    department_name: dept.department_name,
                    count: Number(record?.count || 0),
                };
            });
            return {
                status: 'success',
                message: 'Department-wise counts retrieved successfully',
                data: departmentCounts,
            };
        }
        catch (error) {
            console.error(error);
            return {
                status: 'error',
                message: 'Failed to fetch department-wise counts',
                data: [],
            };
        }
    }
    async getStatusWiseAssetCounts() {
        try {
            const data = await this.assetMappingRepository
                .createQueryBuilder('mapping')
                .leftJoin('mapping.status', 'status')
                .select('status.status_type_name', 'statusName')
                .addSelect('COUNT(mapping.mapping_id)', 'count')
                .where('mapping.is_active = :isActive', { isActive: 1 })
                .andWhere('mapping.is_deleted = :isDeleted', { isDeleted: 0 })
                .groupBy('status.status_type_name')
                .getRawMany();
            const formattedStatusCounts = data.map((row) => ({
                statusName: row.statusName || 'Unknown',
                count: Number(row.count),
            }));
            return {
                status: 'success',
                message: 'Status-wise counts retrieved successfully',
                data: formattedStatusCounts,
            };
        }
        catch (error) {
            console.error('Status count error:', error);
            return {
                status: 'error',
                message: 'Failed to fetch status-wise counts',
                data: [],
            };
        }
    }
    async updateOrgainzationProfileValues(dto, organization_Id) {
        console.log('');
        const { alternative_contact, mobile_number, established_date, organization_profile_id, user_id, ...updates } = dto;
        const organization = await this.dataSource
            .getRepository(organizational_profile_entity_1.OrganizationalProfile)
            .findOne({ where: { tenant_org_id: organization_Id } });
        if (!organization) {
            throw new Error('Organization profile not found.');
        }
        organization.mobile_number = mobile_number;
        if (established_date) {
            organization.established_date = new Date(established_date);
        }
        if (!organization) {
            throw new Error('Organization profile not found.');
        }
        const previousFy = organization.financial_year;
        const orgUpdates = [
            'organization_name',
            'industry_type_name',
            'gst_no',
            'pan_number',
            'mobile_number',
            'org_alt_contact_number',
            'email',
            'website_url',
            'financial_year',
            'esi_number',
            'pf_number',
            'lin_number',
            'tan_number',
            'base_currency',
            'time_zone',
            'city',
            'country',
            'pincode',
            'state',
            'dateformat',
            'alternative_contact',
            'established_date',
            'street',
            'landmark',
            'billingContactName',
            'billingContactEmail',
            'billingContactPhone',
            'customThemeColor',
            'themeMode',
            'it_act_enabled',
            'company_act_enabled',
        ];
        for (const key of orgUpdates) {
            if (updates[key] !== undefined) {
                organization[key] = updates[key];
            }
        }
        if (updates.logo) {
            organization.logo = updates.logo;
            organization.org_profile_image_address = updates.logo;
        }
        await this.dataSource
            .getRepository(organizational_profile_entity_1.OrganizationalProfile)
            .save(organization);
        await this.redisService.delByPattern('organization-profile:*');
        if (updates.financial_year && updates.financial_year !== previousFy) {
            await this.depViewService.forceRefreshNow(organization_Id);
        }
        else {
            this.depViewService.scheduleRefresh(organization_Id);
        }
        return {
            message: 'Organization profile and user data updated successfully.',
            organization,
        };
    }
    async fetchIndustryTypes() {
        try {
            const result = await this.dataSource
                .getRepository(industry_types_entity_1.IndustryTypes)
                .createQueryBuilder('industry')
                .where('industry.is_active = :isActive', { isActive: true })
                .andWhere('industry.is_deleted = :isDeleted', { isDeleted: false })
                .getMany();
            if (!result || result.length === 0) {
                throw new common_1.BadRequestException('No organizational profiles found with the specified criteria.');
            }
            return {
                status: 'success',
                message: 'Industry types retrieved successfully.',
                data: result,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(`Error fetching industry types: ${error.message}`);
        }
    }
    getLogoAsBase64(logoPath) {
        try {
            const relativePath = logoPath.replace('/uploads', 'uploads');
            const filePath = (0, path_1.join)(process.cwd(), relativePath);
            if (!(0, fs_1.existsSync)(filePath))
                return null;
            const fileBuffer = (0, fs_1.readFileSync)(filePath);
            const ext = filePath.split('.').pop()?.toLowerCase();
            const mime = ext === 'jpg' ? 'jpeg' : ext;
            return `data:image/${mime};base64,${fileBuffer.toString('base64')}`;
        }
        catch (err) {
            console.error('Failed to convert logo to base64:', err);
            return null;
        }
    }
    async fetchOrganizationalProfile(dto) {
        try {
            const cacheKey = (0, cache_service_helper_1.buildListCacheKey)({
                prefix: 'organization-profile',
                schema: dto.schema,
                login_user_id: dto.login_user_id,
            });
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                console.log('REDIS HIT:ORGNIZATION PROFILE');
                return cached;
            }
            console.log('REDIS MISS:ORGNIZATION PROFILE');
            const result = await this.dataSource
                .getRepository(organizational_profile_entity_1.OrganizationalProfile)
                .createQueryBuilder('organization')
                .leftJoin('organization.users', 'user', 'user.is_primary_user = :isPrimary', { isPrimary: 'Y' })
                .leftJoin('organization.industry_type', 'industry_type')
                .leftJoin('user.user_designation', 'designation')
                .leftJoin('user.user_role', 'role')
                .select([
                'organization.organization_profile_id',
                'organization.org_name',
                'organization.mobile_number',
                'organization.email',
                'organization.organization_address',
                'organization.street',
                'organization.city',
                'organization.state',
                'organization.pincode',
                'organization.landmark',
                'organization.country',
                'organization.established_date',
                'organization.website_url',
                'organization.financial_year',
                'organization.base_currency',
                'organization.dateformat',
                'organization.time_zone',
                'organization.company_act_enabled',
                'organization.it_act_enabled',
                'organization.gst_no',
                'organization.logo',
                'organization.org_profile_image_address',
                'organization.billingContactName',
                'organization.billingContactPhone',
                'organization.billingContactEmail',
                'organization.themeMode',
                'organization.customThemeColor',
                'user.user_id',
                'user.first_name',
                'user.last_name',
                'user.phone_number',
                'user.users_business_email',
                'user.department_id',
                'user.designation_id',
                'user.role_id',
                'user.organization_id',
                'designation.designation_name',
                'role.role_name',
                'industry_type.industryName',
            ])
                .getOne();
            if (!result) {
                throw new common_1.BadRequestException('No organizational profiles found with the specified criteria.');
            }
            const logoPath = result.logo ?? result.org_profile_image_address ?? null;
            const logoPreviewBase64 = logoPath
                ? this.getLogoAsBase64(logoPath)
                : null;
            const primaryUser = result.users?.[0];
            const data = {
                organization_profile_id: result.organization_profile_id,
                user_id: primaryUser?.user_id ?? null,
                industry_type_id: result.industry_type_id ?? null,
                department_id: primaryUser?.department_id ?? null,
                designation_id: primaryUser?.designation_id ?? null,
                role_id: primaryUser?.role_id ?? null,
                role_name: primaryUser?.user_role?.role_name ?? null,
                organization_id: primaryUser?.organization_id ?? null,
                organizationName: result.org_name ?? null,
                contactNumber: result.mobile_number ?? primaryUser?.phone_number ?? null,
                email: result.email ?? primaryUser?.users_business_email ?? null,
                hqAddress: result.organization_address ?? null,
                hqAddressFields: {
                    street: result.street ?? null,
                    city: result.city ?? null,
                    state: result.state ?? null,
                    postalCode: result.pincode ?? null,
                    landmark: result.landmark ?? null,
                    country: result.country ?? null,
                },
                industryType: result.industry_type?.industryName ?? null,
                establishedDate: result.established_date
                    ? new Date(result.established_date).toISOString().split('T')[0]
                    : null,
                website: result.website_url ?? null,
                financialYear: result.financial_year ?? null,
                baseCurrency: result.base_currency ?? null,
                dateFormat: result.dateformat ?? null,
                timeZone: result.time_zone ?? null,
                company_act_enabled: result.company_act_enabled ?? null,
                it_act_enabled: result.it_act_enabled ?? null,
                gstNumber: result.gst_no ?? null,
                primaryContactName: `${primaryUser?.first_name ?? ''} ${primaryUser?.last_name ?? ''}`.trim() ||
                    null,
                primaryContactEmail: primaryUser?.users_business_email ?? null,
                primaryContactPhone: primaryUser?.phone_number ?? null,
                primaryContactRole: primaryUser?.user_designation?.designation_name ?? null,
                billingContactName: result.billingContactName ?? null,
                billingContactEmail: result.billingContactEmail ?? null,
                billingContactPhone: result.billingContactPhone ?? null,
                themeMode: result.themeMode ?? null,
                customThemeColor: result.customThemeColor ?? null,
                logo: result.logo ?? result.org_profile_image_address ?? null,
                logoPreviewBase64,
            };
            const response = {
                status: 'success',
                message: 'Organizational profiles retrieved successfully.',
                data,
            };
            await this.redisService.set(cacheKey, response, 300);
            return response;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Error fetching organizational profiles:', error?.message, error?.stack);
            throw new common_1.InternalServerErrorException('An error occurred while fetching organizational profiles.');
        }
    }
    async manageAssetsSidebarCount() {
        const [transferPending,] = await Promise.all([
            this.locationTransfer.count({
                where: { transfer_status: 16, is_active: 1, is_deleted: 0 },
            }),
        ]);
        const totalPending = transferPending;
        return {
            totalPending,
            breakdown: {
                transfer: transferPending,
            },
        };
    }
    async fetchDesignationsconfig(department_name) {
        try {
            const query = this.dataSource
                .getRepository(designations_config_entity_1.DesignationsConfig)
                .createQueryBuilder('d')
                .leftJoin('d.parentDepartment', 'dept')
                .where('d.is_active = :isActive', { isActive: true })
                .andWhere('d.is_deleted = :isDeleted', { isDeleted: false });
            if (department_name) {
                query.andWhere('TRIM(LOWER(dept.department_name)) = TRIM(LOWER(:department_name))', { department_name });
            }
            const result = await query.getMany();
            return {
                status: 'success',
                message: 'public designations retrieved successfully.',
                data: result || [],
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(`Error fetching public designations types: ${error.message}`);
        }
    }
    async createDesignations(CreateDesignationDto) {
        const { newDesignationNames = [], existingDesignationNames = [], departmentId, desg_description, } = CreateDesignationDto;
        const trimmedNewNames = newDesignationNames.map((name) => name.trim());
        const trimmedExistingNames = existingDesignationNames.map((name) => name.trim());
        const designationNamesToProcess = [
            ...trimmedExistingNames,
            ...trimmedNewNames,
        ];
        if (designationNamesToProcess.length === 0) {
            return { success: false, message: 'No designations provided' };
        }
        try {
            const designationsRepository = this.dataSource.getRepository(designations_entity_1.Designations);
            const departmentRepository = this.dataSource.getRepository(department_entity_1.Department);
            const allDesignations = await designationsRepository.find();
            const existingNamesInDb = allDesignations.map((des) => des.designation_name.trim().toLowerCase());
            const seen = new Set();
            const newDesignationsToSave = designationNamesToProcess
                .filter((name) => {
                const lowerTrimmed = name.toLowerCase();
                const isDuplicate = existingNamesInDb.includes(lowerTrimmed) || seen.has(lowerTrimmed);
                if (!isDuplicate)
                    seen.add(lowerTrimmed);
                return !isDuplicate;
            })
                .map((name) => ({
                designation_name: name.trim(),
                parent_department: departmentId || null,
                desg_description: desg_description?.trim() || '',
            }));
            let savedDesignations = [];
            if (newDesignationsToSave.length > 0) {
                savedDesignations = await designationsRepository.save(newDesignationsToSave);
            }
            if (savedDesignations.length > 0) {
                await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.DESIGNATION);
                this.redisService.delByPattern('organization-designation:*');
                this.redisService.delByPattern('organization-department:*');
                this.redisService.delByPattern('orgnizationprofile-getcounts:*');
                return {
                    success: true,
                    message: 'New designations added',
                    data: savedDesignations,
                };
            }
            else {
                return { success: false, message: 'All designations already exist' };
            }
        }
        catch (error) {
            console.error('Error saving designations:', error);
            throw new common_1.BadRequestException('Error saving designations.');
        }
    }
    async editDesignation(designationId, newName, newDescription, departmentId) {
        if (!designationId || !newName?.trim()) {
            throw new common_1.BadRequestException('Invalid designation ID or name');
        }
        const designationRepo = this.dataSource.getRepository(designations_entity_1.Designations);
        const departmentRepo = this.dataSource.getRepository(department_entity_1.Department);
        const existing = await designationRepo.findOneBy({
            designation_id: designationId,
        });
        if (!existing)
            throw new common_1.BadRequestException('Designation not found');
        const nameExists = await designationRepo
            .createQueryBuilder('d')
            .where('LOWER(d.designation_name) = LOWER(:name)', {
            name: newName.trim(),
        })
            .andWhere('d.designation_id != :id', { id: designationId })
            .getOne();
        if (nameExists)
            throw new common_1.BadRequestException('Designation name already in use');
        existing.parent_department = departmentId;
        existing.designation_name = newName.trim();
        existing.desg_description = newDescription?.trim() || null;
        const updated = await designationRepo.save(existing);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.DESIGNATION);
        return {
            success: true,
            message: 'Designation updated successfully',
            data: updated,
        };
    }
    async deleteDesignation(deleteDesignationDto) {
        const { designation_id } = deleteDesignationDto;
        if (!designation_id) {
            throw new common_1.BadRequestException('No designation ID provided');
        }
        const designation = await this.designationsRepository.findOne({
            where: { designation_id },
        });
        if (!designation) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'Designation not found',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        const employeeCount = await this.dataSource.getRepository(organizational_user_entity_1.User).count({
            where: { designation_id, is_deleted: 0 },
        });
        if (employeeCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete designation '${designation.designation_name}' because it has ${employeeCount} employee(s) assigned.`);
        }
        designation.is_active = 0;
        designation.is_deleted = 1;
        await this.designationsRepository.save(designation);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.DESIGNATION);
        return {
            status: common_1.HttpStatus.OK,
            message: `Designation '${designation.designation_name}' has been deactivated and marked as deleted`,
        };
    }
    async fetchOrganizationDesignation(searchQuery = '') {
        try {
            const cacheKey = `organization-designation:${searchQuery}`;
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                console.log('REDIS HIT:ORGNIZATION DESIGNATION');
                return cached;
            }
            console.log('REDIS MISS:ORGNIZATION DESIGNATION');
            const queryBuilder = this.dataSource
                .getRepository(designations_entity_1.Designations)
                .createQueryBuilder('designation')
                .leftJoin('users', 'user', 'user.designation_id = designation.designation_id AND user.is_deleted = 0')
                .leftJoin('designation.parentDepartment', 'parentDepartment')
                .select([
                'designation.designation_id',
                'designation.designation_name',
                'designation.desg_description',
                'designation.is_active',
                'designation.is_deleted',
                'designation.created_at',
                'designation.updated_at',
                'designation.parent_department',
                'parentDepartment.department_name',
                'COUNT(user.user_id) AS user_count',
            ])
                .where('designation.is_deleted = :isDeleted', { isDeleted: 0 })
                .groupBy('designation.designation_id')
                .addGroupBy('designation.designation_name')
                .addGroupBy('designation.desg_description')
                .addGroupBy('designation.is_active')
                .addGroupBy('designation.is_deleted')
                .addGroupBy('designation.created_at')
                .addGroupBy('designation.updated_at')
                .addGroupBy('designation.parent_department')
                .addGroupBy('parentDepartment.department_id')
                .addGroupBy('parentDepartment.department_name');
            if (searchQuery?.trim()) {
                queryBuilder.andWhere('designation.designation_name ILIKE :search', {
                    search: `%${searchQuery}%`,
                });
            }
            const { raw, entities } = await queryBuilder
                .orderBy('designation.designation_name', 'ASC')
                .getRawAndEntities();
            const response = entities.map((designation, index) => ({
                ...designation,
                user_count: Number(raw[index]?.user_count || 0),
                parent_department_name: raw[index]?.department_name || null,
                created_at: raw[index]?.created_at || null,
                updated_at: raw[index]?.updated_at || null,
            }));
            const finalresponse = {
                status: 'success',
                message: response.length > 0
                    ? 'Designation retrieved successfully.'
                    : 'No designations found.',
                data: response,
                total: response.length,
            };
            await this.redisService.set(cacheKey, finalresponse, 300);
            return finalresponse;
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(`Error fetching designations: ${error.message}`);
        }
    }
    async fetchOrganizationDesignationsDropdown(searchQuery = '') {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.DESIGNATION, { variant: 'all', searchQuery }, async () => {
            try {
                const result = await this.dataSource
                    .createQueryBuilder()
                    .select([
                    'd.designation_id AS designation_id',
                    'd.designation_name AS designation_name',
                ])
                    .from(designations_entity_1.Designations, 'd')
                    .where('d.is_deleted = 0')
                    .andWhere('d.is_active = 1')
                    .andWhere(searchQuery ? 'd.designation_name ILIKE :search' : 'TRUE', {
                    search: `%${searchQuery}%`,
                })
                    .orderBy('d.designation_name', 'ASC')
                    .getRawMany();
                return {
                    status: 'success',
                    message: 'Designations retrieved successfully.',
                    data: result,
                };
            }
            catch (error) {
                console.error(error);
                throw new common_1.BadRequestException(`Error fetching designations: ${error.message}`);
            }
        });
    }
    async fetchDesignationsByDepartment(departmentId) {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.DESIGNATION, { variant: 'byDepartment', departmentId }, async () => {
            try {
                const result = await this.dataSource
                    .createQueryBuilder()
                    .select([
                    'd.designation_id AS designation_id',
                    'd.designation_name AS designation_name',
                ])
                    .from(designations_entity_1.Designations, 'd')
                    .where('d.is_deleted = 0')
                    .andWhere('d.is_active = 1')
                    .andWhere('d.parent_department = :deptId', { deptId: departmentId })
                    .orderBy('d.designation_name', 'ASC')
                    .getRawMany();
                return {
                    status: 'success',
                    message: 'Designations fetched successfully.',
                    data: result,
                };
            }
            catch (error) {
                console.error(error);
                throw new common_1.BadRequestException(`Error fetching designations: ${error.message}`);
            }
        });
    }
    async deleteDepartments(deleteDepartmentsDto) {
        const { departmentId } = deleteDepartmentsDto;
        if (!departmentId) {
            throw new common_1.BadRequestException('No department ID provided');
        }
        const departmentRepository = this.dataSource.getRepository(department_entity_1.Department);
        const department = await departmentRepository.findOne({
            where: { department_id: departmentId },
        });
        if (!department) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'No matching department found',
            }, common_1.HttpStatus.NOT_FOUND);
        }
        department.is_active = 0;
        department.is_deleted = 1;
        await departmentRepository.save(department);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.DEPARTMENT);
        this.redisService.delByPattern('organization-deparments:*');
        this.redisService.delByPattern('organization-designation:*');
        this.redisService.delByPattern('orgnizationprofile-getcounts:*');
        return {
            status: common_1.HttpStatus.OK,
            message: `Department "${department.department_name}" has been deactivated and marked as deleted.`,
        };
    }
    async disableDepartment(deleteAssetOwnershipStatusDto) {
        const { departmentId } = deleteAssetOwnershipStatusDto;
        const existingDepartment = await this.departmentRepository.findOne({
            where: { department_id: departmentId },
        });
        if (!existingDepartment) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: `Ownership status with ID ${departmentId} not found`,
            }, common_1.HttpStatus.NOT_FOUND);
        }
        const designationCount = await this.dataSource
            .getRepository(designations_entity_1.Designations)
            .count({
            where: { parent_department: departmentId, is_deleted: 0 },
        });
        if (designationCount > 0) {
            throw new common_1.BadRequestException(`Cannot disable department "${existingDepartment.department_name}" because it has ${designationCount} designation(s).`);
        }
        existingDepartment.is_active = 0;
        await this.departmentRepository.save(existingDepartment);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.DEPARTMENT);
        this.redisService.delByPattern('organization-deparments:*');
        this.redisService.delByPattern('organization-designation:*');
        this.redisService.delByPattern('orgnizationprofile-getcounts:*');
        return {
            status: common_1.HttpStatus.OK,
            message: `Ownership status with ID ${departmentId} has been disabled`,
        };
    }
    async enableDepartment(deleteAssetOwnershipStatusDto) {
        const { departmentId } = deleteAssetOwnershipStatusDto;
        const existingOwnershipStatus = await this.departmentRepository.findOne({
            where: { department_id: departmentId },
        });
        if (!existingOwnershipStatus) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: `Ownership status with ID ${departmentId} not found`,
            }, common_1.HttpStatus.NOT_FOUND);
        }
        existingOwnershipStatus.is_active = 1;
        existingOwnershipStatus.is_deleted = 0;
        await this.departmentRepository.save(existingOwnershipStatus);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.DEPARTMENT);
        this.redisService.delByPattern('organization-deparments:*');
        this.redisService.delByPattern('organization-designation:*');
        this.redisService.delByPattern('orgnizationprofile-getcounts:*');
        return {
            status: common_1.HttpStatus.OK,
            message: `Ownership status with ID ${departmentId} has been enabled`,
        };
    }
    async disableDesignation(deleteAssetOwnershipStatusDto) {
        const { designation_id } = deleteAssetOwnershipStatusDto;
        const existingOwnershipStatus = await this.designationsRepository.findOne({
            where: { designation_id },
        });
        if (!existingOwnershipStatus) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: `Ownership status with ID ${designation_id} not found`,
            }, common_1.HttpStatus.NOT_FOUND);
        }
        const employeeCount = await this.dataSource.getRepository(organizational_user_entity_1.User).count({
            where: { designation_id, is_deleted: 0 },
        });
        if (employeeCount > 0) {
            throw new common_1.BadRequestException(`Cannot disable designation '${existingOwnershipStatus.designation_name}' because it has ${employeeCount} employee(s) assigned.`);
        }
        existingOwnershipStatus.is_active = 0;
        await this.designationsRepository.save(existingOwnershipStatus);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.DESIGNATION);
        return {
            status: common_1.HttpStatus.OK,
            message: `Ownership status with ID ${designation_id} has been disabled`,
        };
    }
    async enableDesignation(deleteAssetOwnershipStatusDto) {
        const { designation_id } = deleteAssetOwnershipStatusDto;
        const existingOwnershipStatus = await this.designationsRepository.findOne({
            where: { designation_id },
        });
        if (!existingOwnershipStatus) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: `Ownership status with ID ${designation_id} not found`,
            }, common_1.HttpStatus.NOT_FOUND);
        }
        existingOwnershipStatus.is_active = 1;
        existingOwnershipStatus.is_deleted = 0;
        await this.designationsRepository.save(existingOwnershipStatus);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.DESIGNATION);
        return {
            status: common_1.HttpStatus.OK,
            message: `Ownership status with ID ${designation_id} has been enabled`,
        };
    }
    async fetchOrganizationDeparments(searchQuery = '') {
        try {
            const cacheKey = `organization-deparments:${searchQuery}`;
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                console.log('REDIS HIT:ORGNIZATION DEPARTMENTS');
                return cached;
            }
            console.log('REDIS MISS:ORGNIZATION DEPARTMENTS');
            console.time('DEPT-1');
            const qb = this.dataSource
                .createQueryBuilder()
                .select('d.*')
                .addSelect('u.first_name', 'departmentHead_first_name')
                .addSelect('u.last_name', 'departmentHead_last_name')
                .addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(*)')
                    .from(organizational_user_entity_1.User, 'user')
                    .where('user.department_id = d.department_id')
                    .andWhere('user.is_active = 1')
                    .andWhere('user.is_deleted = 0');
            }, 'employeeCount')
                .addSelect((subQuery) => {
                return subQuery
                    .select(`
            json_agg(
              json_build_object(
                'designation_id', des.designation_id,
                'designation_name', des.designation_name,
                'desg_description', des.desg_description,
                'parent_department', des.parent_department,
                'parent_department_name', d.department_name, 
                'created_at', des.created_at,
                'updated_at', des.updated_at,
                'is_active', des.is_active,
                'is_deleted',des.is_deleted,
                'employee_count', (
                  SELECT COUNT(*)
                  FROM users usr
                  WHERE usr.designation_id = des.designation_id
                  AND usr.is_active = 1
                  AND usr.is_deleted = 0
                )
              )
            )
          `)
                    .from(designations_entity_1.Designations, 'des')
                    .where('des.parent_department = d.department_id')
                    .andWhere('des.is_deleted = 0')
                    .andWhere('des.is_active = 1');
            }, 'designations')
                .from(department_entity_1.Department, 'd')
                .leftJoin('users', 'u', 'u.user_id = d.department_head_id')
                .where('d.is_deleted = 0');
            console.timeEnd('DEPT-1');
            if (searchQuery && searchQuery.trim() !== '') {
                qb.andWhere('d.department_name ILIKE :search', {
                    search: `%${searchQuery}%`,
                });
            }
            qb.orderBy('d.department_name', 'ASC');
            console.time('DB_QUERY');
            const rawResult = await qb.getRawMany();
            console.timeEnd('DB_QUERY');
            console.log('Departments:', rawResult.length);
            console.log('Total Designations:', rawResult.reduce((sum, row) => sum + (row.designations?.length || 0), 0));
            if (!rawResult || rawResult.length === 0) {
                throw new common_1.BadRequestException('No departments found.');
            }
            console.time('DATA_MAPPING');
            const result = rawResult.map((r) => ({
                departmentId: r.department_id,
                departmentName: r.department_name,
                dept_description: r.dept_description,
                departmentHeadId: r.department_head_id,
                departmentHeadName: [
                    r.departmentHead_first_name,
                    r.departmentHead_last_name,
                ]
                    .filter(Boolean)
                    .join(' '),
                createdAt: r.created_at,
                updatedAt: r.updated_at,
                deleted: r.is_deleted,
                active: r.is_active,
                employeeCount: Number(r.employeeCount) || 0,
                designationCount: Array.isArray(r.designations)
                    ? r.designations.length
                    : 0,
                designations: r.designations || [],
            }));
            console.timeEnd('DATA_MAPPING');
            console.time('DEPT-POINT4');
            if (!rawResult || rawResult.length === 0) {
                return {
                    status: 'success',
                    message: 'No departments available.',
                    data: [],
                    pagination: {
                        totalItems: 0,
                    },
                };
            }
            console.timeEnd('DEPT-POINT4');
            const response = {
                status: 'success',
                message: 'Departments retrieved successfully.',
                data: result,
                pagination: {
                    totalItems: result.length,
                },
            };
            await this.redisService.set(cacheKey, response, 300);
            return response;
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(`Error fetching departments: ${error.message}`);
        }
    }
    async fetchOrganizationDepartmentsDropdown(searchQuery = '') {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.DEPARTMENT, { variant: 'fetchOrganization', searchQuery }, async () => {
            try {
                const result = await this.dataSource
                    .getRepository(department_entity_1.Department)
                    .createQueryBuilder('d')
                    .where('d.is_deleted = 0')
                    .andWhere('d.is_active = 1')
                    .andWhere(searchQuery ? 'd.department_name ILIKE :search' : 'TRUE', {
                    search: `%${searchQuery}%`,
                })
                    .orderBy('d.department_name', 'ASC')
                    .getMany();
                return {
                    status: 'success',
                    message: 'Departments retrieved successfully.',
                    data: result,
                };
            }
            catch (error) {
                console.error(error);
                throw new common_1.BadRequestException(`Error fetching departments: ${error.message}`);
            }
        });
    }
    async getDepartmentDropdown() {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.DEPARTMENT, { variant: 'label-value' }, async () => {
            const departments = await this.departmentRepository.find({
                where: { is_active: 1, is_deleted: 0 },
            });
            return departments.map((dept) => ({
                label: dept.department_name,
                value: dept.department_id,
            }));
        });
    }
    async createDepartments(createDepartmentsDto, userId) {
        const { departmentIds, newDepartmentNames = [], existingDepartmentNames = [], departmentHeadId, dept_description = '', } = createDepartmentsDto;
        console.log('createDepartmentsDto:1', createDepartmentsDto);
        const trimmedNewNames = newDepartmentNames.map((name) => name.trim());
        const trimmedExistingNames = existingDepartmentNames.map((name) => name.trim());
        const departmentNamesToProcess = [
            ...trimmedExistingNames,
            ...trimmedNewNames,
        ];
        if (departmentNamesToProcess.length === 0) {
            return { success: false, message: 'No departments provided' };
        }
        try {
            const departmentRepository = this.dataSource.getRepository(department_entity_1.Department);
            const userRepository = this.dataSource.getRepository(organizational_user_entity_1.User);
            const allDepartments = await departmentRepository.find();
            const existingNamesInDb = allDepartments.map((dept) => dept.department_name.trim().toLowerCase());
            const seen = new Set();
            const newDepartmentsToSave = [];
            for (const name of departmentNamesToProcess) {
                const lowerTrimmed = name.trim().toLowerCase();
                const isDuplicate = existingNamesInDb.includes(lowerTrimmed) || seen.has(lowerTrimmed);
                if (!isDuplicate) {
                    seen.add(lowerTrimmed);
                    const department = {
                        department_name: name.trim(),
                        dept_description,
                    };
                    if (departmentHeadId) {
                        const head = await userRepository.findOne({
                            where: { user_id: departmentHeadId },
                        });
                        if (head)
                            department.departmentHead = head;
                    }
                    newDepartmentsToSave.push(department);
                }
            }
            if (newDepartmentsToSave.length > 0) {
                const savedDepartments = await departmentRepository.save(newDepartmentsToSave);
                const totalDepartments = await departmentRepository.count();
                await this.recordMetric('total_departments', totalDepartments);
                const DEPARTMENT_CREATION_EVENT_ID = 43;
                const createdUser = await userRepository.findOne({
                    where: { user_id: userId },
                });
                console.log('createDepartmentsDto:1 createdUser', createdUser);
                for (const department of savedDepartments) {
                    const contextData = {
                        department: {
                            department_name: department.department_name,
                            created_by: `${createdUser?.first_name ?? ''} ${createdUser?.last_name ?? ''}`.trim(),
                        },
                    };
                    const recipients = [];
                    if (createdUser?.users_business_email) {
                        recipients.push({
                            recipient_type: 'user',
                            recipient_id: String(createdUser.user_id),
                            recipient_email: createdUser.users_business_email,
                        });
                    }
                    await this.notificationHelper.triggerEventNotification({
                        eventId: DEPARTMENT_CREATION_EVENT_ID,
                        contextData,
                        recipients,
                        meta: {
                            trace_id: `department-${department.department_id}`,
                        },
                    });
                }
                await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.DEPARTMENT);
                this.redisService.delByPattern('organization-deparments:*');
                this.redisService.delByPattern('organization-designation:*');
                this.redisService.delByPattern('orgnizationprofile-getcounts:*');
                return {
                    success: true,
                    message: 'New departments added',
                    data: savedDepartments,
                };
            }
            else {
                return { success: false, message: 'Department already exists' };
            }
        }
        catch (error) {
            console.error('Error saving departments:', error);
            throw new common_1.BadRequestException('Error saving departments.');
        }
    }
    async editDepartment(id, dto) {
        const repo = this.dataSource.getRepository(department_entity_1.Department);
        const existing = await repo.findOne({
            where: { department_id: id, is_deleted: 0 },
            relations: ['departmentHead'],
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Department with ID ${id} not found`);
        }
        if (dto.departmentName)
            existing.department_name = dto.departmentName.trim();
        if (dto.dept_description)
            existing.dept_description = dto.dept_description.trim();
        if (dto.departmentHeadId) {
            const userRepo = this.dataSource.getRepository(organizational_user_entity_1.User);
            const head = await userRepo.findOne({
                where: { user_id: dto.departmentHeadId },
            });
            if (!head)
                throw new common_1.BadRequestException('Invalid department head ID');
            existing.departmentHead = head;
        }
        if (dto.active !== undefined)
            existing.is_active = dto.active;
        if (dto.deleted !== undefined)
            existing.is_deleted = dto.deleted;
        existing.updated_at = new Date();
        const saved = await repo.save(existing);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.DEPARTMENT);
        this.redisService.delByPattern('organization-deparments:*');
        this.redisService.delByPattern('organization-designation:*');
        this.redisService.delByPattern('orgnizationprofile-getcounts:*');
        return {
            success: true,
            message: 'Department updated successfully',
            data: saved,
        };
    }
    async fetchDepartmentconfig(page, limit, searchQuery) {
        try {
            const queryBuilder = this.dataSource
                .getRepository(department_config_entity_1.DepartmentConifg)
                .createQueryBuilder('departmentconfig')
                .where('departmentconfig.is_active = :isActive', { isActive: true })
                .andWhere('departmentconfig.is_deleted = :isDeleted', {
                isDeleted: false,
            });
            if (searchQuery && searchQuery.trim() !== '') {
                queryBuilder.andWhere('departmentconfig.department_name ILIKE :search', { search: `%${searchQuery}%` });
            }
            const [result, total] = await queryBuilder
                .orderBy('departmentconfig.department_name', 'ASC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            if (!result || result.length === 0) {
                throw new common_1.BadRequestException('No departments found with the specified criteria.');
            }
            return {
                status: 'success',
                message: 'Departments retrieved successfully.',
                data: result,
                total,
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(`Error fetching departments: ${error.message}`);
        }
    }
    async fetchDepartments(page, limit, searchQuery) {
        try {
            const queryBuilder = this.dataSource
                .getRepository(department_entity_1.Department)
                .createQueryBuilder('department')
                .where('department.active = :isActive', { isActive: true })
                .andWhere('department.deleted = :isDeleted', { isDeleted: false });
            if (searchQuery && searchQuery.trim() !== '') {
                queryBuilder.andWhere('department.department_name ILIKE :search', {
                    search: `%${searchQuery}%`,
                });
            }
            const [result, total] = await queryBuilder
                .orderBy('department.created_at', 'DESC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return {
                status: 'success',
                message: result.length
                    ? 'Departments retrieved successfully.'
                    : 'No departments found.',
                data: result,
                total,
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(`Error fetching departments: ${error.message}`);
        }
    }
    async getAllorganizationVenders() {
        try {
            let whereCondition = { is_active: 1, is_deleted: 0 };
            const [results, total] = await this.vendorRepository
                .createQueryBuilder('vendors')
                .where(whereCondition)
                .orderBy('vendors.vendor_name', 'ASC')
                .getManyAndCount();
            return {
                data: results,
                total,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(`Error fetching vendors: ${error.message}`);
        }
    }
    async deleteVendorData(deleteVendorDto) {
        const { vendor_ids } = deleteVendorDto;
        if (!Array.isArray(vendor_ids) || vendor_ids.length === 0) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'No vendor IDs provided',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const deletedVendors = [];
        const failedVendors = [];
        for (const id of vendor_ids) {
            try {
                const existingVendor = await this.vendorRepository.findOne({
                    where: { vendor_id: id },
                });
                if (!existingVendor) {
                    failedVendors.push({
                        vendor_id: id,
                        message: `Vendor with ID ${id} not found`,
                    });
                    continue;
                }
                const assetResult = await this.vendorRepository
                    .createQueryBuilder('vendors')
                    .addSelect((subQ) => subQ
                    .select('COUNT(serial.asset_stocks_unique_id)')
                    .from('asset_stock_serials', 'serial')
                    .leftJoin('stocks', 'stock', 'stock.stock_id = serial.stock_id')
                    .leftJoin('asset_procurements', 'ap', 'ap.stock_id = stock.stock_id')
                    .where('ap.vendor_id = :vendorId', { vendorId: id })
                    .andWhere('serial.is_deleted = 0'), 'asset_count')
                    .where('vendors.vendor_id = :vendorId', { vendorId: id })
                    .getRawOne();
                const totalAssets = Number(assetResult?.asset_count || 0);
                if (totalAssets > 0) {
                    failedVendors.push({
                        vendor_id: id,
                        message: `Vendor cannot be deleted. ${totalAssets} assets are linked to this vendor.`,
                    });
                    continue;
                }
                existingVendor.is_active = 0;
                existingVendor.is_deleted = 1;
                await this.vendorRepository.save(existingVendor);
                deletedVendors.push({
                    vendor_id: id,
                    message: `Vendor with ID ${id} has been deactivated and deleted`,
                });
            }
            catch (error) {
                failedVendors.push({
                    vendor_id: id,
                    message: `Error deleting vendor ID ${id}`,
                });
            }
        }
        if (deletedVendors.length > 0) {
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.VENDOR);
            await this.redisService.delByPattern('orgnization-vendors:*');
        }
        return {
            status: common_1.HttpStatus.OK,
            message: 'Bulk vendor delete operation completed.',
            data: {
                deleted: deletedVendors,
                failed: failedVendors,
            },
        };
    }
    async fetchSingleVendorsData(vendor_id) {
        if (!vendor_id) {
            throw new common_1.BadRequestException('Vendor ID is required');
        }
        try {
            const vendorsData = await this.vendorRepository
                .createQueryBuilder('vendors')
                .select('vendors')
                .where('vendors.vendor_id = :vendor_id', { vendor_id })
                .andWhere('vendors.is_deleted = :is_deleted', { is_deleted: 0 })
                .getOne();
            console.log('vendorsData', vendorsData);
            if (!vendorsData) {
                return {
                    status: 404,
                    message: `Vendor with ID ${vendor_id} not found or inactive`,
                    data: null,
                };
            }
            return {
                status: 200,
                message: 'Vendor fetched successfully',
                data: vendorsData,
            };
        }
        catch (error) {
            return {
                status: 500,
                message: 'An error occurred while fetching the Vendor',
                error: error.message,
            };
        }
    }
    async exportVendorCSV() {
        try {
            const vendors = await this.vendorRepository.find({
                where: { is_active: 1, is_deleted: 0 },
                relations: ['added_by_user'],
            });
            return vendors.map((vendor) => {
                const fullName = vendor.added_by_user?.first_name && vendor.added_by_user?.last_name
                    ? `${vendor.added_by_user.first_name} ${vendor.added_by_user.last_name}`
                    : 'N/A';
                console.log('fullName', fullName);
                return {
                    'Vendor Name': vendor.vendor_name,
                    'GST No.': vendor.vendor_gst_no,
                    Street: vendor.vendor_street,
                    Landmark: vendor.vendor_landmark,
                    City: vendor.vendor_city,
                    State: vendor.vendor_state,
                    Country: vendor.vendor_country,
                    Pincode: vendor.vendor_pincode,
                    'Contact Number': vendor.vendor_contact_number,
                    Email: vendor.vendor_email,
                    'Primary Contact Person': vendor.vendor_primary_contact,
                    'Alternative Contact': vendor.vendor_alternative_contact_number || '',
                    'Created By': fullName,
                    'Created At': vendor.created_at
                        ? new Date(vendor.created_at).toLocaleDateString()
                        : '',
                    'Updated At': vendor.updated_at
                        ? new Date(vendor.updated_at).toLocaleDateString()
                        : '',
                };
            });
        }
        catch (error) {
            console.error('Error exporting vendor CSV data:', error);
            throw new Error('An error occurred while exporting vendor data.');
        }
    }
    async generateNextVendorCode() {
        const latest = await this.vendorRepository
            .createQueryBuilder('vendor')
            .select('vendor.vendor_id')
            .orderBy('vendor.vendor_id', 'DESC')
            .getOne();
        const nextId = latest ? latest.vendor_id + 1 : 1;
        return `VN${nextId.toString().padStart(3, '0')}`;
    }
    async getDepartmentsFromVendors() {
        const data = await this.vendorRepository
            .createQueryBuilder('vendor')
            .select('DISTINCT vendor.vendor_department', 'department')
            .where('vendor.is_deleted = 0')
            .andWhere('vendor.vendor_department IS NOT NULL')
            .getRawMany();
        return data.map((d) => ({
            value: d.department,
            label: d.department,
        }));
    }
    async createNewVendor(payload, userId) {
        try {
            if (payload.vendor_email) {
                const existingEmail = await this.vendorRepository.findOne({
                    where: { vendor_email: payload.vendor_email },
                });
                if (existingEmail) {
                    return {
                        status: 409,
                        message: `Vendor email '${payload.vendor_email}' already exists`,
                    };
                }
            }
            if (payload.vendor_contact_number) {
                const existingMobileNumber = await this.vendorRepository.findOne({
                    where: { vendor_contact_number: payload.vendor_contact_number },
                });
                if (existingMobileNumber) {
                    return {
                        status: 409,
                        message: `Vendor contact number '${payload.vendor_contact_number}' already exists`,
                    };
                }
            }
            if (payload.vendor_gst_status?.trim() === 'Registered') {
                const gstNo = payload.vendor_gst_no?.trim();
                const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
                if (!gstNo) {
                    return {
                        status: 400,
                        message: 'GST number is required for registered vendors',
                    };
                }
                if (!gstRegex.test(gstNo.toUpperCase())) {
                    return { status: 400, message: 'Invalid GST number format' };
                }
            }
            const newVendor = this.vendorRepository.create({
                vendor_code: payload.vendor_code,
                vendor_name: payload.vendor_name?.trim() || null,
                vendor_gst_no: payload.vendor_gst_status === 'Unregistered'
                    ? null
                    : payload.vendor_gst_no?.trim() || null,
                vendor_display_name: payload.vendor_display_name?.trim() || null,
                vendor_contact_number: payload.vendor_contact_number
                    ? String(payload.vendor_contact_number).trim()
                    : null,
                vendor_alternative_contact_number: payload.vendor_alternative_contact_number
                    ? String(payload.vendor_alternative_contact_number).trim()
                    : null,
                vendor_email: payload.vendor_email?.trim() || null,
                vendor_primary_contact: payload.vendor_primary_contact?.trim() || null,
                vendor_street: payload.vendor_street?.trim() || null,
                vendor_landmark: payload.vendor_landmark?.trim() || null,
                vendor_country: payload.vendor_country?.trim() || null,
                vendor_city: payload.vendor_city?.trim() || null,
                vendor_state: payload.vendor_state?.trim() || null,
                vendor_pincode: payload.vendor_pincode
                    ? String(payload.vendor_pincode).trim()
                    : null,
                vendor_first_name: payload.vendor_first_name?.trim() || null,
                vendor_middle_name: payload.vendor_middle_name?.trim() || null,
                vendor_last_name: payload.vendor_last_name?.trim() || null,
                vendor_gst_status: payload.vendor_gst_status?.trim() || null,
                vendor_department: payload.vendor_department?.trim() || null,
                vendor_degination: payload.vendor_degination?.trim() || null,
            });
            const savedVendor = await this.vendorRepository.save(newVendor);
            const VENDOR_CREATION_EVENT_ID = 44;
            const createdUser = await this.userRepository.findOne({
                where: { user_id: userId },
            });
            const contextData = {
                vendor: {
                    vendor_name: savedVendor.vendor_name,
                    created_by: `${createdUser?.first_name ?? ''} ${createdUser?.last_name ?? ''}`.trim(),
                },
            };
            const recipients = [];
            if (createdUser?.users_business_email) {
                recipients.push({
                    recipient_type: 'user',
                    recipient_id: String(createdUser.user_id),
                    recipient_email: createdUser.users_business_email,
                });
            }
            await this.notificationHelper.triggerEventNotification({
                eventId: VENDOR_CREATION_EVENT_ID,
                contextData,
                recipients,
                meta: {
                    trace_id: `VENDOR_CREATE_${savedVendor.vendor_id}`,
                },
            });
            await this.redisService.delByPattern('orgnization-vendors:*');
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.VENDOR);
            return {
                status: 201,
                message: 'Vendor created successfully',
                data: savedVendor,
            };
        }
        catch (error) {
            console.error('Error creating vendor:', error);
            return { status: 500, message: 'Internal server error' };
        }
    }
    async updateVendorData(updatePayload) {
        const { vendor_id, vendor_name, vendor_gst_no, vendor_alternative_contact_number, vendor_contact_number, vendor_email, vendor_primary_contact, vendor_street, vendor_landmark, vendor_city, vendor_state, vendor_country, vendor_pincode, vendor_first_name, vendor_middle_name, vendor_last_name, vendor_gst_status, vendor_department, vendor_degination, vendor_display_name, } = updatePayload;
        const existingVendor = await this.vendorRepository.findOne({
            where: { vendor_id },
        });
        if (!existingVendor) {
            throw new common_1.HttpException(`Vendor with ID ${vendor_id} not found`, common_1.HttpStatus.NOT_FOUND);
        }
        if (vendor_email) {
            const duplicateEmail = await this.vendorRepository.findOne({
                where: { vendor_email },
            });
            if (duplicateEmail && duplicateEmail.vendor_id !== vendor_id) {
                throw new common_1.HttpException(`Vendor email '${vendor_email}' already exists`, common_1.HttpStatus.CONFLICT);
            }
        }
        if (vendor_contact_number) {
            const duplicateContact = await this.vendorRepository.findOne({
                where: { vendor_contact_number },
            });
            if (duplicateContact && duplicateContact.vendor_id !== vendor_id) {
                throw new common_1.HttpException(`Vendor contact number '${vendor_contact_number}' already exists`, common_1.HttpStatus.CONFLICT);
            }
        }
        existingVendor.vendor_name = vendor_name;
        existingVendor.vendor_gst_no = vendor_gst_no || '';
        existingVendor.vendor_alternative_contact_number =
            vendor_alternative_contact_number;
        existingVendor.vendor_email = vendor_email;
        existingVendor.vendor_primary_contact = vendor_primary_contact;
        existingVendor.vendor_contact_number = vendor_contact_number;
        existingVendor.vendor_street = vendor_street;
        existingVendor.vendor_landmark = vendor_landmark;
        existingVendor.vendor_city = vendor_city;
        existingVendor.vendor_country = vendor_country;
        existingVendor.vendor_state = vendor_state;
        existingVendor.vendor_pincode = vendor_pincode;
        existingVendor.vendor_first_name = vendor_first_name;
        existingVendor.vendor_middle_name = vendor_middle_name;
        existingVendor.vendor_last_name = vendor_last_name;
        existingVendor.vendor_gst_status = vendor_gst_status;
        existingVendor.vendor_department = vendor_department;
        existingVendor.vendor_degination = vendor_degination;
        existingVendor.vendor_display_name = vendor_display_name;
        const updatedVendor = await this.vendorRepository.save(existingVendor);
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.VENDOR);
        await this.redisService.delByPattern('orgnization-vendors:*');
        return {
            status: common_1.HttpStatus.OK,
            message: 'Vendor updated successfully',
            data: updatedVendor,
        };
    }
    async activateVendors(vendorIds, systemUserId) {
        const results = [];
        const vendorsToActivate = [];
        for (const id of vendorIds) {
            const vendor = await this.vendorRepository.findOne({
                where: { vendor_id: id, is_deleted: 0 },
            });
            if (!vendor) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Vendor not found or deleted.',
                    name: `ID ${id}`,
                });
                continue;
            }
            if (vendor.is_active) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Vendor is already active.',
                    name: vendor.vendor_name,
                });
                continue;
            }
            vendorsToActivate.push(vendor);
            results.push({
                id,
                status: 'success',
                name: vendor.vendor_name,
            });
        }
        if (vendorsToActivate.length > 0) {
            await this.vendorRepository
                .createQueryBuilder()
                .update()
                .set({ is_active: 1 })
                .where('vendor_id IN (:...ids)', {
                ids: vendorsToActivate.map((v) => v.vendor_id),
            })
                .execute();
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.VENDOR);
            await this.redisService.delByPattern('orgnization-vendors:*');
        }
        const successful = results.filter((r) => r.status === 'success');
        let message = '';
        if (successful.length === 1) {
            message = `Vendor ${successful[0].name} marked as active .`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} vendors marked as active .`;
        }
        else {
            message = 'No vendors were marked as active.';
        }
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async deactivateVendors(vendorIds, systemUserId) {
        const results = [];
        const vendorsToDeactivate = [];
        for (const id of vendorIds) {
            const vendor = await this.vendorRepository.findOne({
                where: { vendor_id: id, is_deleted: 0 },
            });
            if (!vendor) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Vendor not found or deleted.',
                    name: `ID ${id}`,
                });
                continue;
            }
            if (!vendor.is_active) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Vendor is already inactive.',
                    name: vendor.vendor_name,
                });
                continue;
            }
            vendorsToDeactivate.push(vendor);
            results.push({
                id,
                status: 'success',
                name: vendor.vendor_name,
            });
        }
        if (vendorsToDeactivate.length > 0) {
            await this.vendorRepository
                .createQueryBuilder()
                .update()
                .set({ is_active: 0 })
                .where('vendor_id IN (:...ids)', {
                ids: vendorsToDeactivate.map((v) => v.vendor_id),
            })
                .execute();
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.VENDOR);
            await this.redisService.delByPattern('orgnization-vendors:*');
            const VENDOR_DEACTIVATION_EVENT_ID = 21;
            if (vendorsToDeactivate.length > 0) {
                const updatedUser = await this.userRepository.findOne({
                    where: { register_user_login_id: systemUserId },
                });
                for (const vendor of vendorsToDeactivate) {
                    const contextData = {
                        vendor,
                        updatedUser: {
                            first_name: updatedUser?.first_name,
                            last_name: updatedUser?.last_name,
                        },
                    };
                    const recipients = [];
                    if (updatedUser?.users_business_email) {
                        recipients.push({
                            recipient_type: 'user',
                            recipient_id: String(updatedUser.user_id),
                            recipient_email: updatedUser.users_business_email,
                        });
                    }
                    await this.notificationHelper.triggerEventNotification({
                        eventId: VENDOR_DEACTIVATION_EVENT_ID,
                        contextData,
                        recipients,
                        meta: {
                            trace_id: `vendor-${vendor.vendor_id}`,
                        },
                    });
                }
            }
        }
        const successful = results.filter((r) => r.status === 'success');
        let message = '';
        if (successful.length === 1) {
            message = `Vendor ${successful[0].name} marked as inactive.`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} vendors marked as inactive.`;
        }
        else {
            message = 'No vendors were marked as inactive.';
        }
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async generateVendorTemplate() {
        try {
            const workbook = await XlsxPopulate.fromBlankAsync();
            const mainSheet = workbook.sheet(0);
            mainSheet.name('Vendor_Template');
            const dataSheet = workbook.addSheet('Data');
            const instructions = [
                'Instructions:',
                '1. Fill in the fields starting from row 7.',
                '2. Dropdown fields: Department, State, Country.',
                '3. Do not edit the header row (Row 6).',
                '4. Red highlighted headers are required fields.',
            ];
            instructions.forEach((text, idx) => {
                mainSheet
                    .cell(idx + 1, 1)
                    .value(text)
                    .style({ bold: true, fontColor: '0000FF' });
            });
            const headers = [
                { label: 'Vendor Name', required: true },
                { label: 'GST Number', required: false },
                { label: 'First Name', required: true },
                { label: 'Middle Name', required: false },
                { label: 'Last Name', required: false },
                { label: 'Designation', required: false },
                { label: 'Department', required: false },
                { label: 'Email', required: false },
                { label: 'Phone', required: false },
                { label: 'Street Address', required: false },
                { label: 'Postal Code', required: false },
                { label: 'City', required: false },
                { label: 'State', required: false },
                { label: 'Country', required: false },
            ];
            const columnWidths = [
                28,
                20,
                20,
                20,
                20,
                25,
                25,
                30,
                20,
                30,
                18,
                20,
                25,
                20,
            ];
            columnWidths.forEach((w, i) => {
                mainSheet.column(i + 1).width(w);
            });
            headers.forEach((item, index) => {
                const cell = mainSheet.cell(6, index + 1);
                cell.value(item.label).style({ bold: true });
                if (item.required) {
                    cell.style({ fill: 'FFCCCC' });
                }
            });
            const states = [
                'Andhra Pradesh',
                'Arunachal Pradesh',
                'Assam',
                'Bihar',
                'Chhattisgarh',
                'Goa',
                'Gujarat',
                'Haryana',
                'Himachal Pradesh',
                'Jharkhand',
                'Karnataka',
                'Kerala',
                'Madhya Pradesh',
                'Maharashtra',
                'Manipur',
                'Meghalaya',
                'Mizoram',
                'Nagaland',
                'Odisha',
                'Punjab',
                'Rajasthan',
                'Sikkim',
                'Tamil Nadu',
                'Telangana',
                'Tripura',
                'Uttarakhand',
                'Uttar Pradesh',
                'West Bengal',
            ];
            const countries = ['India'];
            const departments = [
                'Sales',
                'Procurement',
                'Marketing',
                'Information-Technology',
                'Human-Resources',
                'Customer-Service',
                'Finance',
                'Operations',
            ];
            states.forEach((item, i) => dataSheet.cell(i + 1, 1).value(item));
            countries.forEach((item, i) => dataSheet.cell(i + 1, 2).value(item));
            departments.forEach((item, i) => dataSheet.cell(i + 1, 3).value(item));
            const startRow = 7;
            const maxRow = 5000;
            mainSheet.range(`G${startRow}:G${maxRow}`).dataValidation({
                type: 'list',
                formula1: `Data!$C$1:$C$${departments.length}`,
                allowBlank: true,
                showErrorMessage: true,
                errorTitle: 'Invalid Selection',
                error: 'Please select only from dropdown values',
            });
            mainSheet.range(`M${startRow}:M${maxRow}`).dataValidation({
                type: 'list',
                formula1: `Data!$A$1:$A$${states.length}`,
                allowBlank: true,
                showErrorMessage: true,
                errorTitle: 'Invalid Selection',
                error: 'Please select only from dropdown values',
            });
            mainSheet.range(`N${startRow}:N${maxRow}`).dataValidation({
                type: 'list',
                formula1: `Data!$B$1:$B$${countries.length}`,
                allowBlank: true,
                showErrorMessage: true,
                errorTitle: 'Invalid Selection',
                error: 'Please select only from dropdown values',
            });
            dataSheet.hidden(true);
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('Error generating vendor template:', error);
            throw new Error('Failed to generate Excel vendor template');
        }
    }
    async getUserIdByRegisterLoginId(registerUserLoginId) {
        const user = await this.userRepository.findOne({
            where: {
                register_user_login_id: registerUserLoginId,
                is_deleted: 0,
                is_active: 1,
            },
            select: ['user_id'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user.user_id;
    }
    async bulkCreateVendors(dtos, userId) {
        const successVendors = [];
        const errorVendors = [];
        let count = 0;
        const vendorNames = dtos.map((d) => d.vendor_name).filter(Boolean);
        const vendorEmails = dtos.map((d) => d.vendor_email).filter(Boolean);
        const vendorContacts = dtos
            .map((d) => d.vendor_contact_number)
            .filter(Boolean);
        let existingVendors = [];
        const conditions = [];
        const params = {};
        if (vendorNames.length > 0) {
            conditions.push('vendor.vendor_name IN (:...names)');
            params.names = vendorNames;
        }
        if (vendorEmails.length > 0) {
            conditions.push('vendor.vendor_email IN (:...emails)');
            params.emails = vendorEmails;
        }
        if (vendorContacts.length > 0) {
            conditions.push('vendor.vendor_contact_number IN (:...contacts)');
            params.contacts = vendorContacts;
        }
        if (vendorNames.length > 0 ||
            vendorEmails.length > 0 ||
            vendorContacts.length > 0) {
            existingVendors = await this.vendorRepository
                .createQueryBuilder('vendor')
                .where(new typeorm_2.Brackets((qb) => {
                if (vendorNames.length > 0) {
                    qb.where('vendor.vendor_name IN (:...names)', {
                        names: vendorNames,
                    });
                }
                if (vendorEmails.length > 0) {
                    qb.orWhere('vendor.vendor_email IN (:...emails)', {
                        emails: vendorEmails,
                    });
                }
                if (vendorContacts.length > 0) {
                    qb.orWhere('vendor.vendor_contact_number IN (:...contacts)', {
                        contacts: vendorContacts,
                    });
                }
            }))
                .andWhere('vendor.is_deleted = 0')
                .getMany();
        }
        const existingNames = new Set(existingVendors.map((v) => v.vendor_name));
        const existingEmails = new Set(existingVendors.map((v) => v.vendor_email));
        const existingContacts = new Set(existingVendors.map((v) => v.vendor_contact_number));
        const lastVendor = await this.vendorRepository
            .createQueryBuilder('vendor')
            .select('vendor.vendor_code')
            .orderBy('vendor.vendor_id', 'DESC')
            .getOne();
        let lastNumber = 0;
        if (lastVendor?.vendor_code) {
            const match = lastVendor.vendor_code.match(/\d+$/);
            lastNumber = match ? parseInt(match[0], 10) : 0;
        }
        const payloads = [];
        for (const dto of dtos) {
            count++;
            try {
                if (existingNames.has(dto.vendor_name)) {
                    throw new common_1.HttpException(`Vendor name '${dto.vendor_name}' already exists.`, common_1.HttpStatus.CONFLICT);
                }
                if (dto.vendor_email && existingEmails.has(dto.vendor_email)) {
                    throw new common_1.HttpException(`Vendor email '${dto.vendor_email}' already exists.`, common_1.HttpStatus.CONFLICT);
                }
                if (dto.vendor_contact_number &&
                    existingContacts.has(dto.vendor_contact_number)) {
                    throw new common_1.HttpException(`Vendor contact number '${dto.vendor_contact_number}' already exists.`, common_1.HttpStatus.CONFLICT);
                }
                dto.vendor_gst_status = dto.vendor_gst_no
                    ? 'Registered'
                    : 'Unregistered';
                if (dto.vendor_gst_status === 'Registered') {
                    const gstNo = dto.vendor_gst_no?.trim();
                    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
                    if (!gstNo) {
                        throw new common_1.HttpException('GST number is required for registered vendors', common_1.HttpStatus.BAD_REQUEST);
                    }
                    if (!gstRegex.test(gstNo.toUpperCase())) {
                        throw new common_1.HttpException('Invalid GST number format', common_1.HttpStatus.BAD_REQUEST);
                    }
                }
                lastNumber++;
                dto.vendor_code = `VN${lastNumber.toString().padStart(3, '0')}`;
                console.log('dto after:', dto);
                payloads.push({
                    vendor_code: dto.vendor_code,
                    vendor_name: dto.vendor_name?.trim() || null,
                    vendor_display_name: dto.vendor_display_name?.trim() || null,
                    vendor_gst_no: dto.vendor_gst_status === 'Unregistered'
                        ? null
                        : dto.vendor_gst_no?.trim() || null,
                    vendor_gst_status: dto.vendor_gst_status?.trim() || null,
                    vendor_email: dto.vendor_email?.trim() || null,
                    vendor_contact_number: dto.vendor_contact_number || null,
                    vendor_alternative_contact_number: dto.vendor_alternative_contact_number?.trim() || null,
                    vendor_primary_contact: dto.vendor_primary_contact?.trim() || null,
                    vendor_street: dto.vendor_street?.trim() || null,
                    vendor_landmark: dto.vendor_landmark?.trim() || null,
                    vendor_city: dto.vendor_city?.trim() || null,
                    vendor_state: dto.vendor_state?.trim() || null,
                    vendor_country: dto.vendor_country?.trim() || null,
                    vendor_pincode: dto.vendor_pincode || null,
                    vendor_first_name: dto.vendor_first_name?.trim() || null,
                    vendor_middle_name: dto.vendor_middle_name?.trim() || null,
                    vendor_last_name: dto.vendor_last_name?.trim() || null,
                    vendor_department: dto.vendor_department?.trim() || null,
                    vendor_degination: dto.vendor_degination?.trim() || null,
                    created_by: userId,
                    updated_by: null,
                    is_deleted: 0,
                });
            }
            catch (err) {
                errorVendors.push({
                    ...dto,
                    reason: err.message || 'Unknown error',
                });
            }
        }
        let insertedVendors = [];
        if (payloads.length > 0) {
            const result = await this.vendorRepository
                .createQueryBuilder()
                .insert()
                .into('vendors')
                .values(payloads)
                .returning('*')
                .execute();
            insertedVendors = result.raw;
            successVendors.push(...insertedVendors);
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.VENDOR);
            await this.redisService.delByPattern('orgnization-vendors:*');
        }
        const vendorImportSchema = [
            { key: 'vendor_name' },
            { key: 'vendor_code' },
            { key: 'vendor_gst_no' },
            { key: 'vendor_first_name' },
            { key: 'vendor_middle_name' },
            { key: 'vendor_last_name' },
            { key: 'vendor_degination' },
            { key: 'vendor_department' },
            { key: 'vendor_email' },
            { key: 'vendor_contact_number' },
            { key: 'vendor_street' },
            { key: 'vendor_pincode' },
            { key: 'vendor_city' },
            { key: 'vendor_state' },
            { key: 'vendor_country' },
        ];
        const successVendorsMapped = successVendors.map((v) => {
            const mapped = {};
            vendorImportSchema.forEach((col) => {
                mapped[col.key] = v[col.key] ?? null;
            });
            return mapped;
        });
        return {
            status: successVendorsMapped.length
                ? common_1.HttpStatus.CREATED
                : common_1.HttpStatus.CONFLICT,
            message: successVendorsMapped.length && errorVendors.length
                ? 'Bulk vendors created with some conflicts.'
                : successVendorsMapped.length
                    ? 'All vendors created successfully.'
                    : 'No vendors created. All entries had conflicts or invalid data.',
            data: {
                created_count: successVendorsMapped.length,
                created_records: successVendorsMapped,
                error_records: errorVendors,
            },
        };
    }
    async fetchOrganizationVendors() {
        try {
            const result = await this.vendorRepository
                .createQueryBuilder('vendors')
                .select([
                'vendors.vendor_id',
                'vendors.vendor_name',
                'vendors.vendor_primary_contact',
                'vendors.vendor_email',
                'vendors.vendor_contact_number',
                'vendors.vendor_gst_no',
                'vendors.is_deleted',
                'vendors.is_active',
            ])
                .where('vendors.is_active = :active', { active: 1 })
                .andWhere('vendors.is_deleted = :deleted', { deleted: 0 })
                .orderBy('vendors.vendor_name', 'ASC')
                .getRawMany();
            return {
                status: 'success',
                message: result.length > 0
                    ? 'Vendors retrieved successfully.'
                    : 'No organizational vendors found.',
                data: result,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(`Error fetching vendors: ${error.message}`);
        }
    }
    async getAllVendors2(dto, branchIds = []) {
        try {
            const cacheKey = (0, cache_service_helper_1.buildListCacheKey)({
                prefix: 'orgnization-vendors',
                dto: dto,
                schema: dto.schema,
                login_user_id: dto.login_user_id,
            });
            console.log(cacheKey);
            console.time('REDIS-GET');
            const cached = await this.redisService.get(cacheKey);
            console.timeEnd('REDIS-GET');
            if (cached) {
                console.log('REDIS HIT VENDORS');
                return cached;
            }
            console.log('REDIS MISS VENDORS');
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const knownTotalRaw = dto?.knownTotal ?? dto?.known_total;
            const knownTotalVal = knownTotalRaw != null && !Number.isNaN(Number(knownTotalRaw))
                ? Number(knownTotalRaw)
                : null;
            const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
            const direction = d.direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = Boolean(d.jumpToLast || dto.isLastPageMode);
            if (jumpToLast) {
                dto.isLastPageMode = true;
            }
            const jumpPage = d.page ? Number(d.page) : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
            const applySearchAndFilters = (qb) => {
                searchArray.forEach((s, index) => {
                    if (!s.values?.length)
                        return;
                    const value = s.values
                        .map((v) => v.trim())
                        .filter(Boolean)
                        .join(' ');
                    if (!value)
                        return;
                    qb.andWhere(`(
            vendors.vendor_name ILIKE :search${index}
            OR vendors.vendor_code ILIKE :search${index}
            OR vendors.vendor_email ILIKE :search${index}
            OR vendors.vendor_gst_no ILIKE :search${index}
            OR vendors.vendor_contact_number ILIKE :search${index}
            OR CAST(vendors.vendor_id AS TEXT) ILIKE :search${index}
          )`, { [`search${index}`]: `%${value}%` });
                });
                const intColumns = ['vendor_id', 'is_active', 'is_deleted'];
                const filtersMap = {};
                filters.forEach((f) => {
                    filtersMap[f.column] = f.values || [];
                });
                if (filtersMap.is_active?.length) {
                    qb.andWhere('vendors.is_active IN (:...activeVals)', {
                        activeVals: filtersMap.is_active.map(Number),
                    });
                }
                Object.keys(filtersMap).forEach((key) => {
                    if (key === 'is_active')
                        return;
                    if (!filtersMap[key]?.length)
                        return;
                    const isInt = intColumns.includes(key);
                    const values = filtersMap[key].map((v) => (isInt ? Number(v) : v));
                    if (isInt) {
                        qb.andWhere(`vendors.${key} IN (:...${key})`, { [key]: values });
                    }
                    else {
                        qb.andWhere(new typeorm_2.Brackets((qb2) => {
                            values.forEach((val, idx) => {
                                qb2.orWhere(`vendors.${key} ILIKE :${key}_${idx}`, {
                                    [`${key}_${idx}`]: `%${val}%`,
                                });
                            });
                        }));
                    }
                });
                if (branchIds && branchIds.length > 0) {
                    const validBranchIds = branchIds.filter((id) => id > 0);
                    if (validBranchIds.length > 0) {
                    }
                }
            };
            const buildBaseQuery = (qb) => {
                return qb
                    .select([
                    'vendors.vendor_id',
                    'vendors.vendor_code',
                    'vendors.vendor_name',
                    'vendors.vendor_first_name',
                    'vendors.vendor_last_name',
                    'vendors.vendor_email',
                    'vendors.vendor_contact_number',
                    'vendors.vendor_gst_no',
                    'vendors.vendor_gst_status',
                    'vendors.vendor_display_name',
                    'vendors.vendor_city',
                    'vendors.vendor_state',
                    'vendors.vendor_country',
                    'vendors.vendor_pincode',
                    'vendors.vendor_street',
                    'vendors.vendor_landmark',
                    'vendors.vendor_primary_contact',
                    'vendors.vendor_alternative_contact_number',
                    'vendors.is_active',
                    'vendors.created_at',
                ])
                    .leftJoin(vendor_asset_count_view_1.VendorAssetCountView, 'vac', 'vac.vendor_id = vendors.vendor_id')
                    .addSelect('COALESCE(vac.asset_count, 0)', 'vendors_asset_count')
                    .where('vendors.is_deleted = :deleted', { deleted: 0 });
            };
            const countKey = 'vendors-count:' +
                JSON.stringify({ search: searchArray, filters, branchIds });
            const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => {
                const countQb = buildBaseQuery(this.vendorRepository.createQueryBuilder('vendors'));
                applySearchAndFilters(countQb);
                return countQb.getCount();
            }, 30, knownTotalVal);
            const qb = buildBaseQuery(this.vendorRepository.createQueryBuilder('vendors'));
            applySearchAndFilters(qb);
            const sortableMap = {
                vendor_id: 'vendors.vendor_id',
                vendor_code: 'vendors.vendor_code',
                vendor_name: 'vendors.vendor_name',
                vendor_email: 'vendors.vendor_email',
                vendor_contact_number: 'vendors.vendor_contact_number',
                vendor_gst_no: 'vendors.vendor_gst_no',
                is_active: 'vendors.is_active',
                created_at: 'vendors.created_at',
                asset_count: 'vac.asset_count',
            };
            const idColumn = 'vendor_id';
            const idDbColumn = 'vendors.vendor_id';
            const defaultSort = { column: 'vendor_id', order: 'DESC' };
            if (dto.getAll === true) {
                (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'next',
                });
                const result = await qb.getRawAndEntities();
                const mergedRows = result.entities.map((v, i) => ({
                    ...v,
                    asset_count: Number(result.raw[i]?.vendors_asset_count || 0),
                }));
                const total = mergedRows.length;
                const response = {
                    success: true,
                    message: total
                        ? 'Vendors fetched successfully'
                        : 'No vendors found',
                    data: mergedRows,
                    meta: {
                        total,
                        totalPages: 1,
                        currentPage: 1,
                        limit: total,
                        count: total,
                        hasNextPage: false,
                        hasPrevPage: false,
                        startCursor: null,
                        endCursor: null,
                        nextCursor: null,
                        prevCursor: null,
                    },
                };
                await this.redisService.set(cacheKey, response, 30);
                return response;
            }
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'prev',
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'next',
                });
                (0, keyset_pagination_1.applyOffsetRaw)(qb, jumpPage, limit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: cursorToken,
                    direction,
                });
            }
            const result = usingOffset
                ? await qb.getRawAndEntities()
                : await qb.limit(limit + 1).getRawAndEntities();
            const mergedRows = result.entities.map((v, i) => ({
                ...v,
                asset_count: Number(result.raw[i]?.vendors_asset_count || 0),
            }));
            const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
            let data;
            let meta;
            if (usingOffset) {
                data = mergedRows;
                const first = data[0];
                const last = data[data.length - 1];
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page: {
                        data,
                        startCursor: first
                            ? (0, keyset_pagination_1.encodeCursor)({
                                v: first[plan.sortColumn] ?? null,
                                id: first[idColumn],
                            })
                            : null,
                        endCursor: last
                            ? (0, keyset_pagination_1.encodeCursor)({
                                v: last[plan.sortColumn] ?? null,
                                id: last[idColumn],
                            })
                            : null,
                        hasNextPage: jumpPage < totalPages,
                        hasPrevPage: jumpPage > 1,
                    },
                    limit,
                    total,
                    currentPage: jumpPage,
                });
            }
            else {
                const page = (0, keyset_pagination_1.finalizePage)({
                    rows: mergedRows,
                    limit,
                    plan,
                    idColumn,
                    hadCursor: !!cursorToken,
                });
                data = page.data;
                if (jumpToLast) {
                    page.hasNextPage = false;
                    page.hasPrevPage = total > data.length;
                }
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page,
                    limit,
                    total,
                    currentPage: jumpToLast ? totalPages : 1,
                });
            }
            const response = {
                success: true,
                message: data.length
                    ? 'Vendors fetched successfully'
                    : 'No vendors found',
                data,
                meta,
            };
            console.time('REDIS-SET');
            await this.redisService.set(cacheKey, response, 300);
            console.timeEnd('REDIS-SET');
            return response;
        }
        catch (error) {
            console.error('getAllVendors ERROR:', error);
            throw error;
        }
    }
    async getOrganizationVendorsDropdown(payload) {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.VENDOR, { search: payload?.search }, async () => {
            try {
                const { search } = payload;
                const query = this.vendorRepository
                    .createQueryBuilder('vendors')
                    .select([
                    'vendors.vendor_id',
                    'vendors.vendor_name',
                    'vendors.vendor_display_name',
                ])
                    .where('vendors.is_deleted = :deleted', { deleted: 0 })
                    .andWhere('vendors.is_active = :active', { active: 1 });
                if (search && search.trim() !== '') {
                    query.andWhere(`(TRIM(vendors.vendor_name) ILIKE :search OR TRIM(vendors.vendor_display_name) ILIKE :search)`, { search: `%${search.trim()}%` });
                }
                const data = await query
                    .orderBy('vendors.vendor_name', 'ASC')
                    .getMany();
                return data.map((v) => ({
                    label: v.vendor_display_name || v.vendor_name,
                    value: v.vendor_id,
                }));
            }
            catch (error) {
                throw new common_1.BadRequestException(`Error fetching vendor dropdown: ${error.message}`);
            }
        });
    }
    async exportOrganizationVendorsExcel(payload) {
        const { gststatus, status = [], search, sortField = 'vendor_name', sortOrder = 'ASC', selectedIds, } = payload;
        const query = this.vendorRepository
            .createQueryBuilder('vendors')
            .select([
            'vendors.vendor_id',
            'vendors.vendor_code',
            'vendors.vendor_name',
            'vendors.vendor_first_name',
            'vendors.vendor_last_name',
            'vendors.vendor_email',
            'vendors.vendor_contact_number',
            'vendors.vendor_primary_contact',
            'vendors.vendor_gst_no',
            'vendors.vendor_gst_status',
            'vendors.is_active',
            'vendors.is_deleted',
            'vendors.created_at',
        ])
            .leftJoin(vendor_asset_count_view_1.VendorAssetCountView, 'vac', 'vac.vendor_id = vendors.vendor_id')
            .addSelect('COALESCE(vac.asset_count, 0)', 'vendors_asset_count')
            .where('vendors.is_deleted = :deleted', { deleted: 0 });
        if (status.length > 0 && !status.includes('All')) {
            const isActiveValues = status.map((s) => (s === 'Active' ? 1 : 0));
            query.andWhere('vendors.is_active IN (:...isActiveValues)', {
                isActiveValues,
            });
        }
        if (gststatus && gststatus !== 'All') {
            query.andWhere('vendors.vendor_gst_status = :gststatus', { gststatus });
        }
        if (search && search.trim() !== '') {
            query.andWhere(`(
        TRIM(vendors.vendor_code) ILIKE :search OR
        TRIM(vendors.vendor_name) ILIKE :search OR
        TRIM(vendors.vendor_email) ILIKE :search OR 
        TRIM(vendors.vendor_contact_number) ILIKE :search OR 
        TRIM(vendors.vendor_gst_no) ILIKE :search OR
        TRIM(vendors.vendor_gst_status) ILIKE :search OR
        TRIM(vendors.vendor_first_name) ILIKE :search OR
        TRIM(vendors.vendor_last_name) ILIKE :search
      )`, { search: `%${search.trim()}%` });
        }
        if (selectedIds && selectedIds.length > 0) {
            query.andWhere('vendors.vendor_id IN (:...selectedIds)', { selectedIds });
        }
        const sortableMap = {
            vendor_id: 'vendors.vendor_id',
            vendor_code: 'vendors.vendor_code',
            vendor_name: 'vendors.vendor_name',
            vendor_email: 'vendors.vendor_email',
            vendor_contact_number: 'vendors.vendor_contact_number',
            vendor_primary_contact: 'vendors.vendor_primary_contact',
            vendor_gst_no: 'vendors.vendor_gst_no',
            is_active: 'vendors.is_active',
            created_at: 'vendors.created_at',
            asset_count: 'vac.asset_count',
        };
        (0, keyset_pagination_1.buildKeyset)({
            qb: query,
            columnMap: sortableMap,
            sort: [{ column: sortField, order: sortOrder }],
            defaultSort: { column: 'vendor_id', order: 'DESC' },
            idColumn: 'vendor_id',
            idDbColumn: 'vendors.vendor_id',
            cursor: null,
            direction: 'next',
        });
        const results = await query.getMany();
        const workbook = await XlsxPopulate.fromBlankAsync();
        const sheet = workbook.sheet(0).name('Vendors');
        const headers = [
            'Sr No',
            'Vendor Code',
            'Vendor Name',
            'First Name',
            'Last Name',
            'Email',
            'Mobile',
            'GST No',
            'GST Status',
            'Status',
            'Created At',
        ];
        headers.forEach((h, i) => sheet
            .cell(1, i + 1)
            .value(h)
            .style({ bold: true }));
        results.forEach((vendor, index) => {
            const row = index + 2;
            sheet.cell(row, 1).value(index + 1);
            sheet.cell(row, 2).value(vendor.vendor_code || '');
            sheet.cell(row, 3).value(vendor.vendor_name || '');
            sheet.cell(row, 4).value(vendor.vendor_first_name || '');
            sheet.cell(row, 5).value(vendor.vendor_last_name || '');
            sheet.cell(row, 6).value(vendor.vendor_email || '');
            sheet.cell(row, 7).value(vendor.vendor_contact_number || '');
            sheet.cell(row, 8).value(vendor.vendor_gst_no || '');
            sheet.cell(row, 9).value(vendor.vendor_gst_status || '');
            sheet.cell(row, 10).value(vendor.is_active ? 'Active' : 'Inactive');
            sheet
                .cell(row, 11)
                .value(vendor.created_at
                ? new Date(vendor.created_at).toLocaleDateString()
                : '');
        });
        headers.forEach((h, i) => sheet.column(i + 1).width(h.length + 10));
        return await workbook.outputAsync();
    }
    async deleteUserManagementData(userIds, orgId) {
        if (!Array.isArray(userIds) || userIds.length === 0) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'No user IDs provided',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const deletedUsers = [];
        const failedUsers = [];
        let deletedUserName = null;
        for (const user_id of userIds) {
            try {
                const existingUser = await this.userRepository.findOne({
                    where: { user_id },
                });
                if (!existingUser) {
                    failedUsers.push({
                        user_id,
                        message: `User with ID ${user_id} not found`,
                    });
                    continue;
                }
                if (existingUser.role_id === 1) {
                    console.warn(`Super admin delete blocked for user ${user_id}`);
                    failedUsers.push({
                        user_id,
                        message: 'Super admin user cannot be deleted',
                    });
                    continue;
                }
                if (userIds.length === 1) {
                    deletedUserName = `${existingUser.first_name}${existingUser.last_name ? ' ' + existingUser.last_name : ''}`;
                }
                existingUser.is_active = 0;
                existingUser.is_deleted = 1;
                existingUser.updated_at = new Date();
                await this.userRepository.save(existingUser);
                console.log('REDIS UPDATE:USER-DELETE');
                await this.redisService.delByPattern('organization-users:*');
                this.redisService.delByPattern('orgnizationprofile-getcounts:*');
                const existingUserLogin = await this.dataSource
                    .getRepository(register_user_login_entity_1.RegisterUserLogin)
                    .findOne({
                    where: { user_id: existingUser.register_user_login_id },
                });
                if (existingUserLogin) {
                    existingUserLogin.is_active = 0;
                    existingUserLogin.is_deleted = 1;
                    await this.dataSource
                        .getRepository(register_user_login_entity_1.RegisterUserLogin)
                        .save(existingUserLogin);
                }
                deletedUsers.push({
                    user_id,
                    message: `User with ID ${user_id} deleted successfully`,
                });
            }
            catch (error) {
                failedUsers.push({
                    user_id,
                    message: `Error deleting user ${user_id}: ${error.message}`,
                });
            }
        }
        const totalUsers = await this.userRepository.count({
            where: {
                organization_id: orgId,
                is_deleted: 0,
            },
        });
        await this.recordMetric('total_users', totalUsers);
        const enableFeatureRestriction = process.env.ENABLE_FEATURE_RESTRICTION === 'true';
        const featureIdForUserCreation = 3;
        if (enableFeatureRestriction && deletedUsers.length > 0) {
            try {
                const decrementCount = deletedUsers.length;
                await usage_util_1.UsageUtil.updateUsageCountInBothPortals(orgId, featureIdForUserCreation, `decrement:${decrementCount}`);
                console.log(`✅ User usage count decremented by ${decrementCount}`);
            }
            catch (updateError) {
                console.error('⚠️ Failed to decrement user usage count:', updateError.message);
            }
        }
        if (deletedUsers.length > 0) {
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.USER);
        }
        const message = userIds.length === 1 && deletedUserName
            ? `"${deletedUserName}" deleted successfully`
            : `${deletedUsers.length} users deleted successfully`;
        return {
            status: common_1.HttpStatus.OK,
            message,
            data: {
                totalDeleted: deletedUsers.length,
                totalFailed: failedUsers.length,
                deleted: deletedUsers,
                failed: failedUsers,
            },
        };
    }
    async getUserByPublicID(public_user_id) {
        console.log('LOG:1-A', public_user_id);
        const schema = this.requestContext.get('schema');
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Organization schema could not be resolved for this request',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const rows = await this.dataSource.query(`SELECT user_id FROM ${schema}.users WHERE register_user_login_id = $1 LIMIT 1`, [public_user_id]);
        console.log('userExists', rows?.[0]);
        if (!rows?.length) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.BAD_REQUEST, message: 'Invalid user ID' }, common_1.HttpStatus.BAD_REQUEST);
        }
        return Number(rows[0].user_id);
    }
    async getPublicUserID(private_user_id) {
        console.log('LOG:1-A private_user_id:', private_user_id);
        const userExists = await this.dataSource.getRepository(organizational_user_entity_1.User).findOne({
            where: { user_id: private_user_id },
            select: {
                user_id: true,
                register_user_login_id: true,
            },
        });
        console.log('LOG:1-B userExists:', userExists);
        if (!userExists) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.BAD_REQUEST, message: 'Invalid private user ID' }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (!userExists.register_user_login_id) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Public user ID not linked',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        console.log('LOG:1-C public_user_id:', userExists.register_user_login_id);
        return userExists.register_user_login_id;
    }
    async getUserByPublicIDForBranch(public_user_id, queryRunner) {
        const userExists = await queryRunner.manager.query(`SELECT user_id 
     FROM users 
     WHERE register_user_login_id = $1 
     LIMIT 1`, [public_user_id]);
        console.log('public user id in asset', public_user_id);
        if (!userExists || userExists.length === 0) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.BAD_REQUEST, message: 'Invalid user ID' }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            return userExists[0].user_id;
        }
    }
    async fetchOrganizationRoles() {
        const roles = await this.rolesPermissionRepository.find({
            where: {
                is_active: true,
                is_deleted: false,
            },
            select: ['role_id', 'role_name'],
            order: { role_name: 'ASC' },
        });
        return {
            status: 'success',
            message: 'Roles retrieved successfully.',
            data: roles,
        };
    }
    async fetchAllUsers2(branch_id, department_id) {
        try {
            let query = this.dataSource
                .getRepository(organizational_user_entity_1.User)
                .createQueryBuilder('users')
                .leftJoinAndSelect('users.user_role', 'user_role')
                .where('users.is_active = 1')
                .andWhere('users.is_deleted = 0');
            if (branch_id) {
                query = query.andWhere('users.branch_id = :branch_id', { branch_id });
            }
            if (department_id) {
                query = query.andWhere('users.department_id = :department_id', {
                    department_id,
                });
            }
            const result = await query.orderBy('users.first_name', 'ASC').getMany();
            if (!result || result.length === 0) {
                return { message: 'No users found.', data: [] };
            }
            return { message: 'Users fetched successfully', data: result };
        }
        catch (error) {
            console.error('Error fetching users:', error);
            throw new common_1.BadRequestException(`Error fetching Users: ${error.message}`);
        }
    }
    async getAllOrganizationBranches() {
        try {
            const branches = await this.branchRepository
                .createQueryBuilder('branch')
                .select([
                'branch.branch_id AS branch_id',
                'branch.branch_name AS branch_name',
            ])
                .where('branch.is_active = :isActive', { isActive: 1 })
                .andWhere('branch.is_deleted = :isDeleted', { isDeleted: 0 })
                .orderBy('branch.branch_name', 'ASC')
                .getRawMany();
            const branchOptions = branches.map((b) => ({
                value: String(b.branch_id),
                label: b.branch_name,
            }));
            return {
                status: 200,
                message: 'Branches retrieved successfully',
                data: branchOptions,
            };
        }
        catch (error) {
            console.error('Error fetching branches:', error);
            throw new common_1.BadRequestException(`Error fetching branches: ${error.message}`);
        }
    }
    async getAllDepartmentAndItsDegination() {
        try {
            const rawResult = await this.dataSource
                .createQueryBuilder()
                .select('d.department_id', 'departmentId')
                .addSelect('d.department_name', 'departmentName')
                .addSelect((subQuery) => {
                return subQuery
                    .select(`json_agg(
                    json_build_object(
                      'designationId', des.designation_id,
                      'designationName', des.designation_name
                    )
                  )`)
                    .from(designations_entity_1.Designations, 'des')
                    .where('des.parent_department = d.department_id')
                    .andWhere('des.is_active = 1')
                    .andWhere('des.is_deleted = 0');
            }, 'designations')
                .from(department_entity_1.Department, 'd')
                .where('d.is_active = 1')
                .andWhere('d.is_deleted = 0')
                .orderBy('d.department_name', 'ASC')
                .getRawMany();
            const result = rawResult.map((r) => ({
                value: r.departmentId,
                label: r.departmentName,
                children: r.designations || [],
            }));
            return {
                status: 'success',
                message: 'Departments for dropdown retrieved successfully.',
                data: result,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(`Error fetching departments for dropdown: ${error.message}`);
        }
    }
    async generateUserTemplate(branchIds) {
        try {
            const branches = await this.getAllBranchesforDropdown(branchIds);
            const departmentResponse = await this.getAllDepartmentAndItsDegination();
            const departments = departmentResponse.data || [];
            const SUPER_ADMIN_ID = 1;
            const rolesResponse = await this.rolesService.getAllOrganizationRoles();
            const roles = (rolesResponse.data || []).filter((r) => r.value !== SUPER_ADMIN_ID);
            console.log('roles:1', roles);
            const workbook = await XlsxPopulate.fromBlankAsync();
            const mainSheet = workbook.sheet(0);
            mainSheet.name('User_Template');
            const dataSheet = workbook.addSheet('Data');
            function toExcelSafeName(name) {
                return name
                    .replace(/[^A-Za-z0-9]/g, '_')
                    .replace(/_+/g, '_')
                    .replace(/^_+|_+$/g, '');
            }
            function colToLetter(col) {
                let letter = '';
                while (col > 0) {
                    const r = (col - 1) % 26;
                    letter = String.fromCharCode(65 + r) + letter;
                    col = Math.floor((col - 1) / 26);
                }
                return letter;
            }
            const instructions = [
                'Instructions:',
                '1. Fill in the fields starting from row 8.',
                '2. Use dropdown values where available. Column Colour Mean Red = Required ,Orange = Required + Dropdown , SkyBlue = Dropdown Only',
                '3. Designation depends on selected Department.',
                '4. Do not edit the header row (Row 7).',
            ];
            instructions.forEach((text, idx) => {
                mainSheet
                    .cell(idx + 1, 1)
                    .value(text)
                    .style({
                    bold: true,
                    fontColor: '0000FF',
                });
            });
            const HEADER_ROW = 7;
            const DATA_ROW = 8;
            const MAX_ROWS = 3000;
            const headers = [
                { label: 'First Name', required: true },
                { label: 'Middle Name', required: false },
                { label: 'Last Name', required: false },
                { label: 'Email Address', required: true },
                { label: 'Phone Number', required: false },
                { label: 'Employee ID', required: false },
                { label: 'Branch', required: true },
                { label: 'Department', required: false },
                { label: 'Designation', required: false },
                { label: 'Role', required: true },
                { label: 'Is User Department Head (yes/no)', required: false },
            ];
            [20, 20, 20, 30, 20, 20, 20, 25, 25, 20, 30].forEach((w, i) => mainSheet.column(i + 1).width(w));
            headers.forEach((h, i) => {
                const cell = mainSheet.cell(HEADER_ROW, i + 1);
                cell.value(h.label).style({
                    bold: true,
                    horizontalAlignment: 'center',
                });
                const dropdownColumns = [
                    'Branch',
                    'Department',
                    'Designation',
                    'Role',
                    'Is User Department Head (yes/no)',
                ];
                const isDropdown = dropdownColumns.includes(h.label);
                if (h.required && isDropdown) {
                    cell.style({
                        fill: 'FFD580',
                    });
                }
                else if (h.required) {
                    cell.style({
                        fill: 'FFCCCC',
                    });
                }
                else if (isDropdown) {
                    cell.style({
                        fill: 'CCECFF',
                    });
                }
            });
            const departmentNames = departments.map((d) => d.label.trim());
            const designationMap = {};
            departments.forEach((d) => {
                designationMap[d.label.trim()] =
                    d.children?.map((c) => c.designationName.trim()) || [];
            });
            branches.forEach((b, i) => dataSheet.cell(i + 1, 1).value(b.label));
            departmentNames.forEach((d, i) => dataSheet.cell(i + 1, 2).value(d));
            roles.forEach((r, i) => dataSheet.cell(i + 1, 3).value(r.label));
            let col = 5;
            for (const dept of Object.keys(designationMap)) {
                const list = designationMap[dept];
                if (!list.length)
                    continue;
                const safe = toExcelSafeName(dept);
                const colLetter = colToLetter(col);
                dataSheet.cell(1, col).value(safe);
                list.forEach((des, i) => dataSheet.cell(i + 2, col).value(des));
                workbook.definedName(safe, `Data!$${colLetter}$2:$${colLetter}$${list.length + 1}`);
                col++;
            }
            if (branches.length > 0) {
                mainSheet.range(`G${DATA_ROW}:G${MAX_ROWS}`).dataValidation({
                    type: 'list',
                    formula1: `Data!$A$1:$A$${branches.length}`,
                    allowBlank: true,
                    showErrorMessage: true,
                    errorTitle: 'Invalid Selection',
                    error: 'Please select only from dropdown values',
                });
            }
            if (departmentNames.length > 0) {
                mainSheet.range(`H${DATA_ROW}:H${MAX_ROWS}`).dataValidation({
                    type: 'list',
                    formula1: `Data!$B$1:$B$${departmentNames.length}`,
                    allowBlank: true,
                    showErrorMessage: true,
                    errorTitle: 'Invalid Selection',
                    error: 'Please select only from dropdown values',
                });
            }
            if (roles.length > 0) {
                mainSheet.range(`J${DATA_ROW}:J${MAX_ROWS}`).dataValidation({
                    type: 'list',
                    formula1: `Data!$C$1:$C$${roles.length}`,
                    allowBlank: true,
                    showErrorMessage: true,
                    errorTitle: 'Invalid Selection',
                    error: 'Please select only from dropdown values',
                });
            }
            if (Object.keys(designationMap).length > 0) {
                for (let r = DATA_ROW; r <= MAX_ROWS; r++) {
                    mainSheet.cell(`I${r}`).dataValidation({
                        type: 'list',
                        allowBlank: true,
                        showErrorMessage: true,
                        errorTitle: 'Invalid Selection',
                        error: 'Please select only from dropdown values',
                        formula1: `=IF($H${r}="","",
            INDIRECT(
              SUBSTITUTE(
                SUBSTITUTE(
                  SUBSTITUTE(
                    SUBSTITUTE(
                      SUBSTITUTE(
                        SUBSTITUTE($H${r}," ","_"),"/","_"
                      ),"(","_"
                    ),")",""
                  ),"__","_"
                ),"__","_"
              )
            )
          )`,
                    });
                }
            }
            mainSheet.range(`K${DATA_ROW}:K${MAX_ROWS}`).dataValidation({
                type: 'list',
                formula1: `"yes,no"`,
                allowBlank: true,
                showErrorMessage: true,
                errorTitle: 'Invalid Selection',
                error: 'Please select only from dropdown values',
            });
            const colMap = {};
            headers.forEach((h, idx) => {
                colMap[h.label] = colToLetter(idx + 1);
            });
            for (let r = DATA_ROW; r <= MAX_ROWS; r++) {
                mainSheet.cell(`${colMap['First Name']}${r}`).dataValidation({
                    type: 'custom',
                    formula1: `=LEN(${colMap['First Name']}${r})>0`,
                    showErrorMessage: true,
                    errorTitle: 'Required',
                    error: 'First Name is required',
                });
                mainSheet.cell(`${colMap['Email Address']}${r}`).dataValidation({
                    type: 'custom',
                    formula1: `=OR(${colMap['Email Address']}${r}="",ISNUMBER(FIND("@",${colMap['Email Address']}${r})))`,
                    showErrorMessage: true,
                    errorTitle: 'Invalid Email',
                    error: 'Enter a valid email address',
                });
                mainSheet.cell(`${colMap['Phone Number']}${r}`).dataValidation({
                    type: 'whole',
                    operator: 'greaterThanOrEqual',
                    formula1: '0',
                    allowBlank: false,
                    showErrorMessage: true,
                    errorTitle: 'Invalid Phone Number',
                    error: 'Phone number must be numeric',
                });
                mainSheet.cell(`${colMap['Phone Number']}${r}`).dataValidation({
                    type: 'textLength',
                    operator: 'equal',
                    formula1: '10',
                    showErrorMessage: true,
                    errorTitle: 'Invalid Phone Length',
                    error: 'Phone number must be 10 digits',
                });
                mainSheet.cell(`${colMap['Role']}${r}`).dataValidation({
                    type: 'custom',
                    formula1: `=LEN(${colMap['Role']}${r})>0`,
                    showErrorMessage: true,
                    errorTitle: 'Required',
                    error: 'Role is required',
                });
            }
            dataSheet.hidden(true);
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('❌ Error generating user template:', error);
            throw new Error('Failed to generate Excel user template');
        }
    }
    async exportFilteredExcelForUsers(dto) {
        try {
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const selectedIds = dto.selectedIds || [];
            const excludeIds = dto.excludeIds || [];
            const isSelectAll = dto.isSelectAll || false;
            const query = this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.user_role', 'role')
                .leftJoinAndSelect('user.user_department', 'department')
                .leftJoinAndSelect('user.user_designation', 'designation')
                .leftJoinAndMapOne('user.branchList', branches_entity_1.Branch, 'branch', 'branch.branch_id = user.branch_id')
                .leftJoinAndSelect('user.location', 'location')
                .leftJoinAndSelect('user.userLogintable', 'publicLogin')
                .where('user.is_deleted = 0');
            if (isSelectAll) {
                if (excludeIds.length) {
                    const numericExcludeIds = excludeIds.map(Number).filter((n) => !isNaN(n));
                    if (numericExcludeIds.length) {
                        query.andWhere('user.user_id NOT IN (:...numericExcludeIds)', { numericExcludeIds });
                    }
                }
            }
            else if (selectedIds.length) {
                const numericSelectedIds = selectedIds.map(Number).filter((n) => !isNaN(n));
                if (numericSelectedIds.length) {
                    query.andWhere('user.user_id IN (:...numericSelectedIds)', { numericSelectedIds });
                }
            }
            searchArray.forEach((s, index) => {
                if (!s.values?.length)
                    return;
                const value = s.values
                    .map((v) => String(v).trim())
                    .filter(Boolean)
                    .join(' ');
                if (!value)
                    return;
                query.andWhere(`(
          user.first_name ILIKE :s${index} OR
          user.last_name ILIKE :s${index} OR
          user.users_business_email ILIKE :s${index} OR
          user.phone_number ILIKE :s${index} OR
          role.role_name ILIKE :s${index} OR
          branch.branch_name ILIKE :s${index} OR
          CAST(user.emp_id AS TEXT) ILIKE :s${index}
        )`, { [`s${index}`]: `%${value}%` });
            });
            for (const f of filters) {
                if (!Array.isArray(f.values) || f.values.length === 0)
                    continue;
                const values = f.values
                    .map((v) => String(v).trim())
                    .filter((v) => v && v.toLowerCase() !== 'all');
                if (!values.length)
                    continue;
                switch (f.column) {
                    case 'status': {
                        const statusValues = [];
                        if (values.includes('1') || values.includes('Active'))
                            statusValues.push(1);
                        if (values.includes('2') || values.includes('Inactive'))
                            statusValues.push(0);
                        if (statusValues.length === 1) {
                            query.andWhere('user.is_active = :isActive', {
                                isActive: statusValues[0],
                            });
                        }
                        break;
                    }
                    case 'role_id':
                    case 'role':
                        query.andWhere('user.role_id IN (:...roleIds)', {
                            roleIds: values.map(Number),
                        });
                        break;
                    case 'department_id':
                    case 'department':
                        query.andWhere('user.department_id IN (:...deptIds)', {
                            deptIds: values.map(Number),
                        });
                        break;
                    case 'branch_id':
                    case 'branch':
                        query.andWhere('user.branch_id IN (:...branchIds)', {
                            branchIds: values.map(Number),
                        });
                        break;
                }
            }
            const sortableMap = {
                user_name: 'user.first_name',
                first_name: 'user.first_name',
                last_name: 'user.last_name',
                users_business_email: 'user.users_business_email',
                email: 'user.users_business_email',
                phone_number: 'user.phone_number',
                phone: 'user.phone_number',
                emp_id: 'user.emp_id',
                is_active: 'user.is_active',
                status: 'user.is_active',
                created_at: 'user.created_at',
                role: 'role.role_name',
                role_id: 'role.role_name',
                department: 'department.department_name',
                department_id: 'department.department_name',
                branch: 'branch.branch_name',
                branch_id: 'branch.branch_name',
            };
            if (sortArray.length > 0) {
                sortArray.forEach((s) => {
                    if (!s.column)
                        return;
                    const dbCol = sortableMap[s.column] || (s.column.includes('.') ? s.column : `user.${s.column}`);
                    query.addOrderBy(dbCol, s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
                });
            }
            else {
                query.orderBy('user.first_name', 'ASC');
            }
            const users = await query.getMany();
            const userIds = users.map((u) => u.user_id);
            const assetCountMap = {};
            if (userIds.length) {
                const assetCounts = await this.assetMappingRepository
                    .createQueryBuilder('am')
                    .select('am.target_id', 'user_id')
                    .addSelect('COUNT(am.mapping_id)', 'count')
                    .where('am.target_type = :type', {
                    type: asset_mapping_entity_1.AssignTargetType.USER,
                })
                    .andWhere('am.target_id IN (:...userIds)', { userIds })
                    .andWhere('am.is_deleted = 0')
                    .andWhere('am.is_active = 1')
                    .groupBy('am.target_id')
                    .getRawMany();
                assetCounts.forEach((row) => {
                    assetCountMap[Number(row.user_id)] = Number(row.count);
                });
            }
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Users');
            const headers = [
                'Sr. No.',
                'First Name',
                'Middle Name',
                'Last Name',
                'Email',
                'Phone',
                'Branch',
                'Location',
                'Department',
                'Designation',
                'Role',
                'Asset Count',
                'Status',
                'Created At',
                'Last Login',
            ];
            headers.forEach((header, index) => {
                sheet
                    .cell(1, index + 1)
                    .value(header)
                    .style({ bold: true });
            });
            users.forEach((user, index) => {
                sheet.cell(index + 2, 1).value(index + 1);
                sheet.cell(index + 2, 2).value(user.first_name || '');
                sheet.cell(index + 2, 3).value(user.middle_name || '');
                sheet.cell(index + 2, 4).value(user.last_name || '');
                sheet.cell(index + 2, 5).value(user.users_business_email || '');
                sheet.cell(index + 2, 6).value(user.phone_number || '');
                sheet
                    .cell(index + 2, 7)
                    .value(user.branchList?.branch_name || '');
                sheet.cell(index + 2, 8).value(user.location?.location_name || '');
                sheet
                    .cell(index + 2, 9)
                    .value(user.user_department?.department_name || '');
                sheet
                    .cell(index + 2, 10)
                    .value(user.user_designation?.designation_name || '');
                sheet.cell(index + 2, 11).value(user.user_role?.role_name || '');
                sheet.cell(index + 2, 12).value(assetCountMap[user.user_id] || 0);
                sheet.cell(index + 2, 13).value(user.is_active ? 'Active' : 'Inactive');
                sheet
                    .cell(index + 2, 14)
                    .value(user.created_at ? new Date(user.created_at).toLocaleString() : '');
                sheet
                    .cell(index + 2, 15)
                    .value(user.last_login ? new Date(user.last_login).toLocaleString() : '');
            });
            headers.forEach((_, i) => sheet.column(i + 1).width(headers[i].length + 10));
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('Error exporting users:', error);
            throw new common_1.BadRequestException(`Error exporting users: ${error.message}`);
        }
    }
    async sendResetPasswordEmailByAdmin(userId, decrypted_system_user_id) {
        const user = await this.userRepository.findOne({
            where: { user_id: userId },
        });
        if (!user || !user.register_user_login_id) {
            throw new common_1.NotFoundException('User not found');
        }
        const loginUser = await this.registerUser.findOne({
            where: { user_id: user.register_user_login_id },
        });
        if (!loginUser) {
            throw new common_1.NotFoundException('Login user record not found');
        }
        const org = await this.registerOrganization.findOne({
            where: { organization_id: loginUser.organization_id },
        });
        const admin = await this.authService.fetchUserLoginProfile(Number(decrypted_system_user_id));
        const resetUrl = `${process.env.CLIENT_ORIGIN_URL}/set-forgot-password?userId=${loginUser.user_id}`;
        await this.registerUser.update({ user_id: loginUser.user_id }, { passwordReset: 'Y' });
        const notificationData = {
            loginUser,
            admin,
            org,
            resetUrl,
        };
        this.sendResetPasswordNotificationAsync(notificationData).catch((err) => console.error('Reset password notification error (non-blocking):', err));
        return {
            status: common_1.HttpStatus.OK,
            message: `Reset password email sent to ${loginUser.business_email}`,
        };
    }
    async sendResetPasswordNotificationAsync(notificationData) {
        const { loginUser, admin, org, resetUrl } = notificationData;
        try {
            const recipients = [
                {
                    recipient_type: 'user',
                    recipient_id: String(loginUser.user_id),
                    recipient_email: loginUser.business_email,
                    recipient_contact: loginUser.phone_number,
                },
            ];
            const EVENT_ID = 36;
            const contextData = {
                updatedUser: {
                    first_name: loginUser.first_name,
                    last_name: loginUser.last_name,
                    redirection_link: resetUrl,
                    users_business_email: loginUser.business_email,
                },
                adminUser: {
                    first_name: admin.first_name,
                    last_name: admin.last_name,
                },
                organization: {
                    name: org?.organization_name,
                },
            };
            console.log('📧 Sending reset password notification:', {
                email: loginUser.business_email,
                userId: loginUser.user_id,
                eventId: EVENT_ID,
            });
            await this.notificationHelper.triggerEventNotification({
                eventId: EVENT_ID,
                contextData,
                recipients,
                meta: { trace_id: `RESET_PASSWORD_${loginUser.user_id}` },
            });
            console.log(`✅ Reset password notification sent to ${loginUser.business_email}`);
        }
        catch (err) {
            console.error(`Failed to send reset password notification for user ${loginUser?.user_id}:`, err);
        }
    }
    async changeUserPasswordByAdmin(userId, newPassword, sendEmailNotification, decrypted_system_user_id) {
        if (!userId || !newPassword) {
            throw new common_1.BadRequestException('User ID and new password are required');
        }
        const admin = await this.authService.fetchUserLoginProfile(Number(decrypted_system_user_id));
        if (!admin) {
            throw new common_1.UnauthorizedException('Admin session is invalid or user not found');
        }
        const isAdminUser = admin.is_primary_user === 'Y' ||
            admin.is_primary_user === '1' ||
            admin.role_name === 'Admin' ||
            admin.role_name === 'Super Admin' ||
            admin.user_role?.role_name?.toLowerCase()?.includes('admin');
        if (!isAdminUser) {
            throw new common_1.ForbiddenException('Only Admin and Super Admin roles are authorized to change user passwords.');
        }
        let user = await this.userRepository.findOne({
            where: { user_id: userId },
        });
        let loginUser = null;
        if (user && user.register_user_login_id) {
            loginUser = await this.registerUser.findOne({
                where: { user_id: user.register_user_login_id },
            });
        }
        else {
            loginUser = await this.registerUser.findOne({
                where: { user_id: userId },
            });
        }
        if (!loginUser) {
            throw new common_1.NotFoundException('User login record not found');
        }
        if (loginUser.is_deleted === 1) {
            throw new common_1.NotFoundException('User account has been deleted.');
        }
        if (Number(loginUser.is_active) !== 1) {
            throw new common_1.BadRequestException('Cannot change password for a deactivated user. Please activate the user account first.');
        }
        if (loginUser.invite_status === register_user_login_entity_1.InviteStatus.INVITED) {
            throw new common_1.BadRequestException('User has not accepted the invitation yet. Please resend the invitation link instead.');
        }
        if (loginUser.invite_status === register_user_login_entity_1.InviteStatus.EXPIRED) {
            throw new common_1.BadRequestException('User invitation has expired. Please resend an invitation link to set up credentials.');
        }
        if (loginUser.invite_status === register_user_login_entity_1.InviteStatus.REVOKED) {
            throw new common_1.BadRequestException('User invitation has been revoked.');
        }
        if (loginUser.is_primary_user === 'Y' && admin.is_primary_user !== 'Y') {
            throw new common_1.ForbiddenException('Only Primary Administrators can change the password of another Primary Administrator.');
        }
        if (loginUser.password && typeof loginUser.password === 'string') {
            const isSameAsCurrent = await bcrypt.compare(newPassword, loginUser.password);
            if (isSameAsCurrent) {
                throw new common_1.BadRequestException('New password cannot be the same as your current password. Please choose a different password.');
            }
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.registerUser.update({ user_id: loginUser.user_id }, {
            password: hashedPassword,
            passwordSet: true,
            verified: true,
            passwordReset: 'N',
            force_password_change: false,
            invite_status: register_user_login_entity_1.InviteStatus.ACCEPTED,
            invite_expires_at: null,
            refreshToken: null,
        });
        await this.redisService.delByPattern('organization-users:*');
        const org = await this.registerOrganization.findOne({
            where: { organization_id: loginUser.organization_id },
        });
        if (org && org.organization_schema_name) {
            const orgSchema = `org_${org.organization_schema_name}`;
            try {
                await this.userRepository.query(`UPDATE ${orgSchema}.users SET password = $1, updated_at = NOW() WHERE register_user_login_id = $2`, [hashedPassword, loginUser.user_id]);
            }
            catch (schemaErr) {
                console.error('Error updating tenant schema user password:', schemaErr);
            }
        }
        if (sendEmailNotification && loginUser.business_email) {
            this.sendPasswordUpdatedNotificationAsync({
                loginUser,
                admin,
                org,
                newPassword,
            }).catch((err) => console.error('Password update notification error (non-blocking):', err));
        }
        return {
            status: common_1.HttpStatus.OK,
            message: `Password updated successfully for ${loginUser.first_name || 'user'}`,
        };
    }
    async sendPasswordUpdatedNotificationAsync(notificationData) {
        const { loginUser, admin, org, newPassword } = notificationData;
        try {
            const recipients = [
                {
                    recipient_type: 'user',
                    recipient_id: String(loginUser.user_id),
                    recipient_email: loginUser.business_email,
                    recipient_contact: loginUser.phone_number,
                },
            ];
            const EVENT_ID = 62;
            const contextData = {
                updatedUser: {
                    first_name: loginUser.first_name,
                    last_name: loginUser.last_name,
                    username: loginUser.username || loginUser.business_email,
                    users_business_email: loginUser.business_email,
                    new_password: newPassword,
                },
                subscription: {
                    organizationName: org?.organization_name || 'Asset Management',
                },
                adminUser: {
                    first_name: admin?.first_name || 'Admin',
                    last_name: admin?.last_name || '',
                },
                organization: {
                    name: org?.organization_name || 'Asset Management',
                    organizationName: org?.organization_name || 'Asset Management',
                },
            };
            await this.notificationHelper.triggerEventNotification({
                eventId: EVENT_ID,
                contextData,
                recipients,
                meta: { trace_id: `PASSWORD_UPDATE_${loginUser.user_id}` },
            });
            console.log(`📧 Password update notification sent to ${loginUser.business_email}`);
        }
        catch (err) {
            console.error(`Failed to send password update notification for user ${loginUser?.user_id}:`, err);
        }
    }
    async fetchOrganizationUsers2(dto, branchIds = []) {
        console.time('TOTAL-USERS-SERVICE');
        if (dto?.jumpToLast) {
            dto.isLastPageMode = true;
        }
        try {
            const cacheKey = (0, cache_service_helper_1.buildListCacheKey)({
                prefix: 'organization-users',
                dto: dto,
                schema: dto.schema,
                login_user_id: dto.login_user_id,
            });
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                console.log('✅ USERS CACHE HIT');
                return cached;
            }
            console.log('❌ USERS CACHE MISS');
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const knownTotalRaw = dto?.knownTotal ?? dto?.known_total;
            const knownTotalVal = knownTotalRaw != null && !Number.isNaN(Number(knownTotalRaw))
                ? Number(knownTotalRaw)
                : null;
            const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
            const direction = d.direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = Boolean(d.jumpToLast || dto.isLastPageMode);
            if (jumpToLast) {
                dto.isLastPageMode = true;
            }
            const jumpPage = d.page ? Number(d.page) : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
            const applySearchAndFilters = (qb) => {
                searchArray.forEach((s, index) => {
                    if (!s.values?.length)
                        return;
                    const value = s.values
                        .map((v) => v.trim())
                        .filter(Boolean)
                        .join(' ');
                    if (!value)
                        return;
                    qb.andWhere(`(
            user.first_name ILIKE :search${index}
            OR user.last_name ILIKE :search${index}
            OR user.users_business_email ILIKE :search${index}
            OR user.phone_number ILIKE :search${index}
            OR user.emp_id ILIKE :search${index}
            OR role.role_name ILIKE :search${index}
            OR branch.branch_name ILIKE :search${index}
          )`, { [`search${index}`]: `%${value}%` });
                });
                for (const f of filters) {
                    if (!Array.isArray(f.values) || !f.values.length)
                        continue;
                    const values = f.values
                        .map((v) => String(v).trim())
                        .filter((v) => v && v.toLowerCase() !== 'all');
                    if (!values.length)
                        continue;
                    switch (f.column) {
                        case 'status': {
                            const statusValues = [];
                            if (values.includes('1'))
                                statusValues.push(1);
                            if (values.includes('2'))
                                statusValues.push(0);
                            if (statusValues.length === 1) {
                                qb.andWhere('user.is_active = :isActive', {
                                    isActive: statusValues[0],
                                });
                            }
                            break;
                        }
                        case 'role_id':
                            qb.andWhere('user.role_id IN (:...roleIds)', {
                                roleIds: values.map(Number),
                            });
                            break;
                        case 'department_id':
                            qb.andWhere('user.department_id IN (:...deptIds)', {
                                deptIds: values.map(Number),
                            });
                            break;
                        case 'branch_id':
                            qb.andWhere('user.branch_id IN (:...branchIdsFilter)', {
                                branchIdsFilter: values.map(Number),
                            });
                            break;
                    }
                }
                if (branchIds.length) {
                    qb.andWhere('user.branch_id IN (:...branchIds)', { branchIds });
                }
            };
            const buildBaseQuery = (qb) => {
                return qb
                    .select([
                    'user.user_id',
                    'user.first_name',
                    'user.last_name',
                    'user.users_business_email',
                    'user.phone_number',
                    'user.last_login',
                    'user.emp_id',
                    'user.is_active',
                    'user.created_at',
                    'user.role_id',
                    'user.department_id',
                    'user.branch_id',
                    'role.role_id',
                    'role.role_name',
                    'department.department_id',
                    'department.department_name',
                    'designation.designation_id',
                    'designation.designation_name',
                    'branch.branch_id',
                    'branch.branch_name',
                    'location.location_id',
                    'location.location_name',
                    'publicLogin.invite_status',
                    'publicLogin.invite_expires_at',
                    'publicLogin.passwordSet',
                ])
                    .leftJoin('user.user_role', 'role')
                    .leftJoin('user.user_department', 'department')
                    .leftJoin('user.user_designation', 'designation')
                    .leftJoin('user.user_branch', 'branch')
                    .leftJoin('user.location', 'location')
                    .leftJoin('user.userLogintable', 'publicLogin')
                    .where('user.is_deleted = 0');
            };
            console.time('COUNT-QUERY');
            const countKey = 'organization-users-count:' +
                JSON.stringify({ search: searchArray, filters, branchIds });
            const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => {
                const countQb = buildBaseQuery(this.userRepository.createQueryBuilder('user'));
                applySearchAndFilters(countQb);
                return countQb.getCount();
            }, 30, knownTotalVal);
            console.timeEnd('COUNT-QUERY');
            console.time('QB-BUILD');
            const qb = buildBaseQuery(this.userRepository.createQueryBuilder('user'));
            applySearchAndFilters(qb);
            console.timeEnd('QB-BUILD');
            const sortableMap = {
                user_name: 'user.first_name',
                first_name: 'user.first_name',
                last_name: 'user.last_name',
                users_business_email: 'user.users_business_email',
                email: 'user.users_business_email',
                phone_number: 'user.phone_number',
                phone: 'user.phone_number',
                emp_id: 'user.emp_id',
                is_active: 'user.is_active',
                created_at: 'user.created_at',
                role: 'role.role_name',
                role_id: 'role.role_name',
                department: 'department.department_name',
                department_id: 'department.department_name',
                branch: 'branch.branch_name',
                branch_id: 'branch.branch_name',
            };
            const idColumn = 'user_id';
            const idDbColumn = 'user.user_id';
            const defaultSort = { column: 'first_name', order: 'ASC' };
            const sortValueResolvers = {
                user_name: (u) => u.first_name ?? null,
                first_name: (u) => u.first_name ?? null,
                last_name: (u) => u.last_name ?? null,
                users_business_email: (u) => u.users_business_email ?? null,
                email: (u) => u.users_business_email ?? null,
                phone_number: (u) => u.phone_number ?? null,
                phone: (u) => u.phone_number ?? null,
                emp_id: (u) => u.emp_id ?? null,
                is_active: (u) => u.is_active ?? null,
                created_at: (u) => u.created_at ?? null,
                role: (u) => u.user_role?.role_name ?? null,
                role_id: (u) => u.user_role?.role_name ?? null,
                department: (u) => u.user_department?.department_name ?? null,
                department_id: (u) => u.user_department?.department_name ?? null,
                branch: (u) => u.user_branch?.branch_name ?? null,
                branch_id: (u) => u.user_branch?.branch_name ?? null,
            };
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'prev',
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'next',
                });
                (0, keyset_pagination_1.applyOffsetRaw)(qb, jumpPage, limit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: cursorToken,
                    direction,
                });
            }
            const entities = usingOffset
                ? await qb.getMany()
                : await qb.limit(limit + 1).getMany();
            console.time('ASSET-COUNT-QUERY');
            const userIds = entities.map((u) => u.user_id);
            const assetCountMap = {};
            if (userIds.length > 0) {
                const assetCounts = await this.assetMappingRepository
                    .createQueryBuilder('am')
                    .select('am.target_id', 'user_id')
                    .addSelect('COUNT(am.mapping_id)', 'count')
                    .where('am.target_type = :type', { type: asset_mapping_entity_1.AssignTargetType.USER })
                    .andWhere('am.target_id IN (:...userIds)', { userIds })
                    .andWhere('am.is_deleted = 0')
                    .andWhere('am.is_active = 1')
                    .groupBy('am.target_id')
                    .getRawMany();
                assetCounts.forEach((row) => {
                    assetCountMap[Number(row.user_id)] = Number(row.count);
                });
            }
            console.timeEnd('ASSET-COUNT-QUERY');
            console.time('RESPONSE-MAPPING');
            const resolveSortValue = sortValueResolvers[plan.sortColumn] ??
                ((u) => u[plan.sortColumn] ?? null);
            const mergedRows = entities.map((user) => {
                const inviteStatus = user.userLogintable?.invite_status;
                const inviteExpiresAt = user.userLogintable?.invite_expires_at
                    ? new Date(user.userLogintable.invite_expires_at)
                    : null;
                const isExpiredByDate = inviteExpiresAt && inviteExpiresAt < new Date();
                let effectiveInviteStatus = inviteStatus;
                if (inviteStatus === register_user_login_entity_1.InviteStatus.INVITED && isExpiredByDate) {
                    effectiveInviteStatus = register_user_login_entity_1.InviteStatus.EXPIRED;
                }
                const isAccepted = effectiveInviteStatus === register_user_login_entity_1.InviteStatus.ACCEPTED;
                let user_state = 'ACTIVE';
                if (user.is_active === 0) {
                    user_state = 'INACTIVE';
                }
                else if (isAccepted) {
                    user_state = 'ACTIVE';
                }
                else if (effectiveInviteStatus === register_user_login_entity_1.InviteStatus.EXPIRED) {
                    user_state = 'EXPIRED';
                }
                else if (effectiveInviteStatus === register_user_login_entity_1.InviteStatus.INVITED) {
                    user_state = 'INVITED';
                }
                return {
                    ...user,
                    user_state,
                    invite_status: effectiveInviteStatus,
                    invite_expires_at: inviteExpiresAt,
                    canReinvite: !isAccepted && (user_state === 'INVITED' || user_state === 'EXPIRED'),
                    asset_count: assetCountMap[user.user_id] || 0,
                    [plan.sortColumn]: resolveSortValue(user),
                };
            });
            console.timeEnd('RESPONSE-MAPPING');
            const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
            let data;
            let meta;
            if (usingOffset) {
                data = mergedRows;
                const firstRow = data[0];
                const lastRow = data[data.length - 1];
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page: {
                        data,
                        startCursor: firstRow
                            ? (0, keyset_pagination_1.encodeCursor)({
                                v: firstRow[plan.sortColumn] ?? null,
                                id: firstRow[idColumn],
                            })
                            : null,
                        endCursor: lastRow
                            ? (0, keyset_pagination_1.encodeCursor)({
                                v: lastRow[plan.sortColumn] ?? null,
                                id: lastRow[idColumn],
                            })
                            : null,
                        hasNextPage: jumpPage < totalPages,
                        hasPrevPage: jumpPage > 1,
                    },
                    limit,
                    total,
                    currentPage: jumpPage,
                });
            }
            else {
                const page = (0, keyset_pagination_1.finalizePage)({
                    rows: mergedRows,
                    limit,
                    plan,
                    idColumn,
                    hadCursor: !!cursorToken,
                });
                data = page.data;
                if (jumpToLast) {
                    page.hasNextPage = false;
                    page.hasPrevPage = total > data.length;
                }
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page,
                    limit,
                    total,
                    currentPage: jumpToLast ? totalPages : 1,
                });
            }
            const response = {
                success: true,
                message: data.length
                    ? 'Users retrieved successfully.'
                    : 'No users found.',
                data,
                meta,
            };
            await this.redisService.set(cacheKey, response, 300);
            console.timeEnd('TOTAL-USERS-SERVICE');
            return response;
        }
        catch (error) {
            console.error('fetchOrganizationUsers ERROR:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async fetchSingleUsersData(user_id) {
        if (!user_id)
            throw new common_1.BadRequestException('User ID is required');
        try {
            const user = await this.userRepository.findOne({
                where: { user_id, is_active: 1, is_deleted: 0 },
                relations: [
                    'user_role',
                    'user_designation',
                    'user_department',
                    'location',
                ],
            });
            if (!user) {
                return {
                    status: 404,
                    message: `User with ID ${user_id} not found or inactive`,
                    data: null,
                };
            }
            let branchArray = [];
            const branchesValue = user.branches;
            if (Array.isArray(branchesValue)) {
                branchArray = branchesValue;
            }
            else if (typeof branchesValue === 'string' &&
                branchesValue.trim() !== '') {
                branchArray = branchesValue.replace(/[{}]/g, '').split(',').map(Number);
            }
            let branches = [];
            if (branchArray.length > 0) {
                branches = await this.branchRepository
                    .createQueryBuilder('branch')
                    .where('branch.branch_id IN (:...branchIds)', {
                    branchIds: branchArray,
                })
                    .select(['branch.branch_id', 'branch.branch_name'])
                    .getMany();
            }
            const formattedUser = {
                ...user,
                branch: branches.map((b) => b.branch_id),
            };
            return {
                status: 200,
                message: 'User fetched successfully',
                data: formattedUser,
            };
        }
        catch (error) {
            return {
                status: 500,
                message: 'An error occurred while fetching the user',
                error: error.message,
            };
        }
    }
    async fetchSingleUsersProfile(user_id) {
        if (!user_id)
            throw new common_1.BadRequestException('User ID is required');
        try {
            const user = await this.userRepository.findOne({
                where: { user_id, is_active: 1, is_deleted: 0 },
                relations: [
                    'user_role',
                    'user_branch',
                    'user_designation',
                    'user_department',
                    'userLogintable',
                    'location',
                ],
            });
            if (!user) {
                return {
                    status: 404,
                    message: `User with ID ${user_id} not found or inactive`,
                    data: null,
                };
            }
            const branchAccess = await this.branchRepository
                .createQueryBuilder('branch')
                .select(['branch.branch_id', 'branch.branch_name'])
                .where('branch.branch_id = ANY(:branchIds)', {
                branchIds: user.branch_access,
            })
                .getMany();
            const casbinRules = await this.dataSource
                .getRepository(casbin_rule_entity_1.CasbinRule)
                .createQueryBuilder('cr')
                .leftJoin('modules', 'module', 'module.id = CAST(cr.v1 AS INTEGER)')
                .where('cr.v0 = :role', { role: user.role_id.toString() })
                .andWhere('cr.isAllowed = true')
                .select(['cr.v1 AS module_id', 'module.module_name AS module_name'])
                .getRawMany();
            const permissions = [
                ...new Set(casbinRules.map((r) => r.module_name).filter(Boolean)),
            ];
            const formattedUser = {
                ...user,
                branch_access: branchAccess.map((b) => ({
                    branch_id: b.branch_id,
                    branch_name: b.branch_name,
                })),
                permissions,
            };
            return {
                status: 200,
                message: 'User fetched successfully',
                data: formattedUser,
            };
        }
        catch (error) {
            console.log('Error in fetchSingleUsersProfile:', error);
            return {
                status: 500,
                message: 'An error occurred while fetching the user',
                error: error.message,
            };
        }
    }
    async uploadUserProfileImage(file) {
        try {
            const uploadDir = path_1.default.join(process.cwd(), 'uploads', 'user-profile');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const fileName = `user-${Date.now()}-${file.originalname}`;
            const fullPath = path_1.default.join(uploadDir, fileName);
            fs.writeFileSync(fullPath, file.buffer);
            const dbPath = `/uploads/user-profile/${fileName}`;
            return {
                status: common_1.HttpStatus.OK,
                message: 'Profile image uploaded successfully',
                data: { profile_image: dbPath },
            };
        }
        catch (error) {
            console.error('Error uploading profile image:', error);
            throw error;
        }
    }
    async createNewUser(payload, organizationId, createdBy) {
        const userId = await this.getUserByPublicID(createdBy);
        const featureIdForUserCreation = 3;
        const enableFeatureRestriction = process.env.ENABLE_FEATURE_RESTRICTION === 'true';
        const isInviteFlow = payload.invite_user === true;
        const forceReset = payload.force_password_change_first_login === true;
        let maxUsers = null;
        let totalUsers = 0;
        if (enableFeatureRestriction) {
            const { assetRestriction, billingRestriction } = await restriction_util_1.RestrictionUtil.checkRestrictionAndLimitation(organizationId, featureIdForUserCreation);
            if (billingRestriction?.value) {
                maxUsers = Number(billingRestriction.value);
            }
            else if (assetRestriction?.overrideValue) {
                maxUsers = Number(assetRestriction.overrideValue);
            }
            if (maxUsers !== null) {
                totalUsers = await this.userRepository.count({
                    where: { organization_id: organizationId, is_deleted: 0 },
                });
                if (totalUsers >= maxUsers) {
                    throw new common_1.HttpException(`User creation limit reached — max ${maxUsers}`, common_1.HttpStatus.FORBIDDEN);
                }
            }
        }
        const primaryUserLogin = await this.registerUser.findOne({
            where: {
                organization_id: organizationId,
                is_primary_user: 'Y',
                is_deleted: 0,
            },
        });
        if (!primaryUserLogin) {
            throw new common_1.HttpException('Primary user not found for this organization.', common_1.HttpStatus.BAD_REQUEST);
        }
        const orgBillingId = primaryUserLogin.org_billing_id;
        if (payload.phone_number) {
            const [existingUser, existingPublicUser] = await Promise.all([
                this.userRepository.findOne({
                    where: { phone_number: payload.phone_number },
                }),
                this.registerUser.findOne({
                    where: { phone_number: payload.phone_number },
                }),
            ]);
            if (existingUser || existingPublicUser) {
                throw new common_1.ConflictException(`Phone number '${payload.phone_number}' already exists.`);
            }
        }
        if (payload.emp_id) {
            const existingEmp = await this.userRepository.findOne({
                where: { emp_id: payload.emp_id, organization_id: organizationId },
            });
            if (existingEmp) {
                throw new common_1.ConflictException(`Employee ID '${payload.emp_id}' already exists.`);
            }
        }
        const existingEmailPublic = await this.registerUser.findOne({
            where: { business_email: payload.users_business_email },
        });
        if (existingEmailPublic) {
            throw new common_1.ConflictException(`Email '${payload.users_business_email}' already exists.`);
        }
        let hashedPassword = null;
        if (payload.password) {
            hashedPassword = await this.hashPassword(payload.password);
        }
        const INVITATION_LINK_EXPIRES_AT = new Date(Date.now() + 48 * 60 * 60 * 1000);
        let notificationData = null;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        let savedUserLogin;
        let savedUser;
        try {
            const registerRepo = queryRunner.manager.getRepository(this.registerUser.target);
            const userRepo = queryRunner.manager.getRepository(this.userRepository.target);
            if (!isInviteFlow && payload.password && !forceReset) {
                savedUserLogin = await registerRepo.save(registerRepo.create({
                    first_name: payload.first_name,
                    last_name: payload.last_name,
                    business_email: payload.users_business_email,
                    phone_number: payload.phone_number,
                    organization_id: organizationId,
                    org_billing_id: orgBillingId,
                    password: hashedPassword,
                    invite_status: register_user_login_entity_1.InviteStatus.ACCEPTED,
                    invite_expires_at: null,
                    verified: true,
                    passwordSet: true,
                    passwordReset: 'N',
                    is_primary_user: 'N',
                    organization: { organization_id: organizationId },
                }));
            }
            else if (!isInviteFlow && payload.password && forceReset) {
                savedUserLogin = await registerRepo.save(registerRepo.create({
                    first_name: payload.first_name,
                    last_name: payload.last_name,
                    business_email: payload.users_business_email,
                    phone_number: payload.phone_number,
                    organization_id: organizationId,
                    org_billing_id: orgBillingId,
                    password: hashedPassword,
                    invite_status: register_user_login_entity_1.InviteStatus.ACCEPTED,
                    invite_expires_at: null,
                    force_password_change: true,
                    verified: true,
                    passwordSet: false,
                    passwordReset: 'Y',
                    is_primary_user: 'N',
                    organization: { organization_id: organizationId },
                }));
            }
            else if (isInviteFlow && payload.password && !forceReset) {
                savedUserLogin = await registerRepo.save(registerRepo.create({
                    first_name: payload.first_name,
                    last_name: payload.last_name,
                    business_email: payload.users_business_email,
                    phone_number: payload.phone_number,
                    organization_id: organizationId,
                    org_billing_id: orgBillingId,
                    password: hashedPassword,
                    invite_status: register_user_login_entity_1.InviteStatus.INVITED,
                    invite_expires_at: INVITATION_LINK_EXPIRES_AT,
                    verified: true,
                    passwordSet: true,
                    passwordReset: 'N',
                    is_primary_user: 'N',
                    organization: { organization_id: organizationId },
                }));
            }
            else if (isInviteFlow && payload.password && forceReset) {
                savedUserLogin = await registerRepo.save(registerRepo.create({
                    first_name: payload.first_name,
                    last_name: payload.last_name,
                    business_email: payload.users_business_email,
                    phone_number: payload.phone_number,
                    organization_id: organizationId,
                    org_billing_id: orgBillingId,
                    password: hashedPassword,
                    invite_status: register_user_login_entity_1.InviteStatus.INVITED,
                    invite_expires_at: INVITATION_LINK_EXPIRES_AT,
                    verified: true,
                    passwordSet: false,
                    passwordReset: 'Y',
                    is_primary_user: 'N',
                    organization: { organization_id: organizationId },
                }));
            }
            else if (isInviteFlow && !payload.password) {
                savedUserLogin = await registerRepo.save(registerRepo.create({
                    first_name: payload.first_name,
                    last_name: payload.last_name,
                    business_email: payload.users_business_email,
                    phone_number: payload.phone_number,
                    organization_id: organizationId,
                    org_billing_id: orgBillingId,
                    invite_status: register_user_login_entity_1.InviteStatus.INVITED,
                    invite_expires_at: INVITATION_LINK_EXPIRES_AT,
                    password: null,
                    verified: false,
                    passwordReset: 'Y',
                    is_primary_user: 'N',
                    organization: { organization_id: organizationId },
                }));
            }
            let profileImagePath = null;
            if (payload.documents?.[0]?.base64) {
                try {
                    const uploadDir = path_1.default.join(process.cwd(), 'uploads', 'user-profile');
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }
                    const base64String = payload.documents[0].base64.replace(/^data:[^;]+;base64,/, '');
                    const ext = (payload.documents[0].type || 'image/png').split('/')[1] || 'png';
                    const fileName = `user-${Date.now()}.${ext}`;
                    const fullPath = path_1.default.join(uploadDir, fileName);
                    fs.writeFileSync(fullPath, Buffer.from(base64String, 'base64'));
                    profileImagePath = `/uploads/user-profile/${fileName}`;
                    console.log('✅ Profile image saved:', profileImagePath);
                }
                catch (err) {
                    console.error('⚠️ Failed to save profile image:', err.message);
                }
            }
            const DEFAULT_ROLE_ID = 4;
            const branchId = payload.branch_id ? Number(payload.branch_id) : null;
            const branchAccessSet = new Set([
                ...(payload.branch_access || []).map(Number),
            ]);
            if (branchId)
                branchAccessSet.add(branchId);
            const newUser = userRepo.create({
                profile_image: profileImagePath || payload.profile_image || null,
                emp_id: payload.emp_id || null,
                created_by: userId,
                first_name: payload.first_name,
                middle_name: payload.middle_name || '',
                last_name: payload.last_name,
                users_business_email: payload.users_business_email,
                phone_number: payload.phone_number,
                branch_id: branchId,
                role_id: payload.role_id ? Number(payload.role_id) : DEFAULT_ROLE_ID,
                designation_id: payload.designation_id
                    ? Number(payload.designation_id)
                    : null,
                department_id: payload.department_id
                    ? Number(payload.department_id)
                    : null,
                location_id: payload.location_id ? Number(payload.location_id) : null,
                street: payload.street || null,
                landmark: payload.landmark || null,
                country: payload.country || null,
                city: payload.city || null,
                state: payload.state || null,
                zip: payload.zip || null,
                branch_access: Array.from(branchAccessSet) || null,
                organization_id: organizationId,
                register_user_login_id: savedUserLogin.user_id,
                is_department_head: payload.is_department_head || null,
            });
            savedUser = await userRepo.save(newUser);
            if (enableFeatureRestriction) {
                const totalUsersAfterInsert = await userRepo.count({
                    where: { organization_id: organizationId, is_deleted: 0 },
                });
                await usage_util_1.UsageUtil.updateUsageCountInBothPortals(organizationId, featureIdForUserCreation, totalUsersAfterInsert.toString());
            }
            const creatorUser = await userRepo.findOne({
                where: { user_id: userId },
            });
            notificationData = {
                savedUser,
                creatorUser,
                isInviteFlow,
                forceReset,
                payload,
            };
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
        console.log('REDIS UPDATE:USER-ADD');
        await this.redisService.delByPattern('organization-users:*');
        this.redisService.delByPattern('orgnizationprofile-getcounts:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.USER);
        if (notificationData && notificationData.isInviteFlow) {
            this.sendUserInviteNotificationsAsync(notificationData).catch((err) => console.error('Notification error (non-blocking):', err));
        }
        return {
            status: common_1.HttpStatus.CREATED,
            message: 'User created successfully',
            data: { user: savedUser },
        };
    }
    async sendUserInviteNotificationsAsync(notificationData) {
        const { savedUser, creatorUser, isInviteFlow, forceReset, payload } = notificationData;
        try {
            const recipients = [
                {
                    recipient_type: 'user',
                    recipient_id: String(savedUser.user_id),
                    recipient_email: savedUser.users_business_email,
                    recipient_contact: savedUser.phone_number,
                },
            ];
            const EVENT_ID = payload.password && !forceReset ? 9 : 41;
            const contextData = {
                updatedUser: {
                    first_name: savedUser.first_name,
                    last_name: savedUser.last_name,
                    phone_number: savedUser.phone_number,
                    created_by: `${creatorUser.first_name} ${creatorUser.last_name}`,
                    redirection_link: payload.password && !forceReset
                        ? `${process.env.CLIENT_ORIGIN_URL}/sign-in`
                        : `${process.env.CLIENT_ORIGIN_URL}/set-forgot-password?userId=${savedUser.register_user_login_id}`,
                    users_business_email: savedUser.users_business_email,
                    temp_password: payload.password || null,
                },
            };
            console.log('📧 Sending user invite notification:', contextData);
            await this.notificationHelper.triggerEventNotification({
                eventId: EVENT_ID,
                contextData,
                recipients,
                meta: { trace_id: `USER_CREATE_${savedUser.user_id}` },
            });
            console.log(`✅ Notification sent for user ${savedUser.user_id}`);
        }
        catch (err) {
            console.error(`Failed notification for user ${savedUser?.user_id}:`, err);
        }
    }
    async reinviteUser(userLoginId, requestedBy) {
        console.log('[STEP 1] input:', userLoginId);
        const public_user_id = await this.getPublicUserID(userLoginId);
        console.log('[STEP 2] public id:', public_user_id);
        if (!public_user_id) {
            console.log('[STEP 2 FAILED]');
            throw new common_1.NotFoundException('User not found');
        }
        const userLogin = await this.registerUser.findOne({
            where: { user_id: public_user_id },
        });
        console.log('[STEP 3] user found:', userLogin);
        if (!userLogin) {
            throw new common_1.NotFoundException('User not found');
        }
        console.log('[STEP 4] invite status:', userLogin.invite_status);
        if (userLogin.passwordSet === true || userLogin.invite_status === register_user_login_entity_1.InviteStatus.ACCEPTED) {
            console.log('[STEP 4 BLOCKED] already accepted');
            throw new common_1.BadRequestException('User already accepted invite');
        }
        userLogin.invite_status = register_user_login_entity_1.InviteStatus.INVITED;
        userLogin.invite_expires_at = new Date(Date.now() + 48 * 60 * 60 * 1000);
        console.log('[STEP 5] updating invite');
        await this.registerUser.save(userLogin);
        const creatorUser = await this.userRepository.findOne({
            where: { user_id: requestedBy },
        });
        this.sendReinviteNotificationAsync({
            userLogin,
            creatorUser,
        }).catch((err) => console.error('Reinvite notification error:', err));
        console.log('REDIS UPDATE:USER-ADD');
        await this.redisService.delByPattern('organization-users:*');
        console.log('[STEP 6] notification queued');
        return {
            status: common_1.HttpStatus.OK,
            message: 'Invitation sent again successfully',
        };
    }
    async sendReinviteNotificationAsync(payload) {
        try {
            const INVITATION_EVENT_ID = 61;
            const { userLogin, creatorUser } = payload;
            const recipients = [
                {
                    recipient_type: 'user',
                    recipient_id: String(userLogin.user_id),
                    recipient_email: userLogin.business_email,
                    recipient_contact: userLogin.phone_number,
                },
            ];
            const contextData = {
                updatedUser: {
                    first_name: userLogin.first_name,
                    last_name: userLogin.last_name,
                    phone_number: userLogin.phone_number,
                    created_by: creatorUser
                        ? `${creatorUser.first_name} ${creatorUser.last_name}`
                        : 'System',
                    redirection_link: `${process.env.CLIENT_ORIGIN_URL}` +
                        `/set-forgot-password?userId=${userLogin.user_id}`,
                    users_business_email: userLogin.business_email,
                    temp_password: null,
                },
            };
            await this.notificationHelper.triggerEventNotification({
                eventId: INVITATION_EVENT_ID,
                contextData,
                recipients,
                meta: {
                    trace_id: `USER_INVITE_${userLogin.user_id}`,
                },
            });
            console.log(`[SUCCESS] Reinvite email sent to user ${userLogin.user_id}`);
        }
        catch (err) {
            console.error(`[FAILED] Reinvite notification for user ${payload.userLogin.user_id}`, err);
        }
    }
    async updateUserManagementData(payload) {
        const { userId: user_id, first_name, emp_id, middle_name, last_name, phone_number, users_business_email, role_id, department_id, designation_id, branch_id, location_id, branch, street, landmark, city, state, country, zip, is_active, is_department_head, branch_access, } = payload;
        if (!user_id || !first_name) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'User ID and first name are required',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const existingUser = await this.userRepository.findOne({
            where: { user_id },
            relations: ['userLogintable'],
        });
        if (!existingUser) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: `User with ID ${user_id} not found`,
            }, common_1.HttpStatus.NOT_FOUND);
        }
        const existingUserLogin = existingUser.userLogintable;
        if (!existingUserLogin) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: `User login details not found for user ID ${user_id}`,
            }, common_1.HttpStatus.NOT_FOUND);
        }
        if (emp_id) {
            const empIdInUse = await this.userRepository.findOne({
                where: { emp_id: emp_id, user_id: (0, typeorm_2.Not)(user_id) },
            });
            if (empIdInUse) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.CONFLICT,
                    message: `Employee ID '${emp_id}' is already in use`,
                }, common_1.HttpStatus.CONFLICT);
            }
        }
        const sanitizedEmail = this.sanitizeValue2(users_business_email, 'string');
        const sanitizedPhone = this.sanitizeValue2(phone_number, 'string');
        if (sanitizedEmail) {
            const emailInUsePrivate = await this.userRepository.findOne({
                where: { users_business_email: sanitizedEmail, user_id: (0, typeorm_2.Not)(user_id) },
            });
            if (emailInUsePrivate) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.CONFLICT,
                    message: `Email '${sanitizedEmail}' is already in use`,
                }, common_1.HttpStatus.CONFLICT);
            }
        }
        if (sanitizedPhone) {
            const phoneInUsePrivate = await this.userRepository.findOne({
                where: { phone_number: sanitizedPhone, user_id: (0, typeorm_2.Not)(user_id) },
            });
            if (phoneInUsePrivate) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.CONFLICT,
                    message: `Phone number '${sanitizedPhone}' is already in use`,
                }, common_1.HttpStatus.CONFLICT);
            }
        }
        const sanitizedBranchId = this.sanitizeValue2(branch_id, 'number');
        let finalBranchAccess = existingUser.branch_access;
        if (Array.isArray(branch_access)) {
            const branchAccessSet = new Set(branch_access
                .map((b) => this.sanitizeValue2(b, 'number'))
                .filter((b) => b !== null));
            if (sanitizedBranchId) {
                branchAccessSet.add(sanitizedBranchId);
            }
            finalBranchAccess =
                branchAccessSet.size > 0 ? Array.from(branchAccessSet) : null;
        }
        let profileImagePath = existingUser.profile_image || null;
        if (payload.documents?.[0]?.base64) {
            try {
                const uploadDir = path_1.default.join(process.cwd(), 'uploads', 'user-profile');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const base64String = payload.documents[0].base64.replace(/^data:[^;]+;base64,/, '');
                const ext = (payload.documents[0].type || 'image/png').split('/')[1] || 'png';
                const fileName = `user-${Date.now()}.${ext}`;
                const fullPath = path_1.default.join(uploadDir, fileName);
                fs.writeFileSync(fullPath, Buffer.from(base64String, 'base64'));
                profileImagePath = `/uploads/user-profile/${fileName}`;
                console.log('✅ Profile image saved:', profileImagePath);
            }
            catch (err) {
                console.error('⚠️ Failed to save profile image:', err.message);
            }
        }
        Object.assign(existingUser, {
            profile_image: profileImagePath,
            first_name: this.sanitizeValue2(first_name, 'string'),
            middle_name: this.sanitizeValue2(middle_name, 'string'),
            last_name: this.sanitizeValue2(last_name, 'string'),
            users_business_email: sanitizedEmail,
            phone_number: sanitizedPhone,
            role_id: this.sanitizeValue2(role_id, 'number'),
            department_id: this.sanitizeValue2(department_id, 'number'),
            designation_id: this.sanitizeValue2(designation_id, 'number'),
            branches: Array.isArray(branch)
                ? branch.map((b) => this.sanitizeValue(b, 'number')).filter(Boolean)
                : null,
            branch_id: sanitizedBranchId,
            branch_access: finalBranchAccess,
            location_id: this.sanitizeValue2(location_id, 'number'),
            street: this.sanitizeValue2(street, 'string'),
            landmark: this.sanitizeValue2(landmark, 'string'),
            city: this.sanitizeValue2(city, 'string'),
            state: this.sanitizeValue2(state, 'string'),
            country: this.sanitizeValue2(country, 'string'),
            zip: this.sanitizeValue2(zip, 'string'),
            is_active: this.sanitizeValue2(is_active, 'boolean'),
            is_department_head: this.sanitizeValue2(is_department_head, 'boolean'),
            emp_id: this.sanitizeValue2(emp_id, 'string'),
            updated_at: new Date(),
        });
        const updatedUser = await this.userRepository.save(existingUser);
        Object.assign(existingUserLogin, {
            first_name: this.sanitizeValue2(first_name, 'string'),
            last_name: this.sanitizeValue2(last_name, 'string'),
            business_email: sanitizedEmail,
            phone_number: sanitizedPhone,
        });
        const updatedUserLogin = await this.registerUser.save(existingUserLogin);
        console.log('REDIS UPDATE:USER-UPDATE');
        await this.redisService.delByPattern('organization-users:*');
        await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.USER);
        return {
            status: common_1.HttpStatus.OK,
            message: 'User updated successfully',
            data: { user: updatedUser, userLogin: updatedUserLogin },
        };
    }
    async activateUsers(userIds, systemUserId) {
        const updated = [];
        const failed = [];
        let activatedUserName = null;
        for (const id of userIds) {
            try {
                const user = await this.userRepository.findOne({
                    where: { user_id: id, is_deleted: 0 },
                });
                if (!user) {
                    failed.push({ user_id: id, message: 'User not found or deleted' });
                    continue;
                }
                if (userIds.length === 1) {
                    activatedUserName = `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`;
                }
                user.is_active = 1;
                await this.userRepository.save(user);
                if (user.register_user_login_id) {
                    await this.registerUser.update({ user_id: user.register_user_login_id }, { is_active: 1 });
                }
                updated.push({ user_id: id, status: 'activated' });
            }
            catch (error) {
                failed.push({ user_id: id, message: error.message });
            }
        }
        const message = userIds.length === 1 && activatedUserName
            ? `"${activatedUserName}" marked as active.`
            : `${updated.length} users marked as active.`;
        console.log('REDIS UPDATE:USER-ACTIVE');
        await this.redisService.delByPattern('organization-users:*');
        this.redisService.delByPattern('orgnizationprofile-getcounts:*');
        if (updated.length > 0) {
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.USER);
        }
        return {
            status: 'success',
            message,
            data: { updated, failed },
        };
    }
    async deactivateUsers(userIds, systemUserId) {
        const updated = [];
        const failed = [];
        let deactivatedUserName = null;
        const USER_DEACTIVATION_EVENT_ID = 35;
        const updatedUser = await this.userRepository.findOne({
            where: { register_user_login_id: systemUserId },
        });
        for (const id of userIds) {
            try {
                const user = await this.userRepository.findOne({
                    where: { user_id: id, is_deleted: 0 },
                });
                if (!user) {
                    failed.push({ user_id: id, message: 'User not found or deleted' });
                    continue;
                }
                if (userIds.length === 1) {
                    deactivatedUserName = `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`;
                }
                user.is_active = 0;
                await this.userRepository.save(user);
                if (user.register_user_login_id) {
                    await this.registerUser.update({ user_id: user.register_user_login_id }, { is_active: 0 });
                }
                updated.push({ user_id: id, status: 'deactivated' });
                const contextData = {
                    updatedUser: {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        user_id: `${updatedUser?.first_name ?? ''} ${updatedUser?.last_name ?? ''}`.trim(),
                    },
                };
                const recipients = [];
                if (user?.users_business_email) {
                    recipients.push({
                        recipient_type: 'user',
                        recipient_id: String(user.user_id),
                        recipient_email: user.users_business_email,
                    });
                }
                await this.notificationHelper.triggerEventNotification({
                    eventId: USER_DEACTIVATION_EVENT_ID,
                    contextData,
                    recipients,
                    meta: {
                        trace_id: `user-${user.user_id}`,
                    },
                });
                console.log('REDIS UPDATE:USER-DEACTIVE');
                await this.redisService.delByPattern('organization-users:*');
                this.redisService.delByPattern('orgnizationprofile-getcounts:*');
            }
            catch (error) {
                failed.push({ user_id: id, message: error.message });
            }
        }
        if (updated.length > 0) {
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.USER);
        }
        const message = userIds.length === 1 && deactivatedUserName
            ? ` User "${deactivatedUserName}" marked as inactive `
            : `${updated.length} users marked as inactive`;
        return {
            status: 'success',
            message,
            data: { updated, failed },
        };
    }
    sanitize(value) {
        return value === '' || value === undefined ? null : value;
    }
    async getLocationTypeOptions(type) {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.LOCATION_TYPE, { type }, async () => {
            return await this.dataSource.transaction(async (manager) => {
                const where = {
                    is_deleted: 0,
                    is_active: 1,
                };
                if (type === 'occupancy') {
                    where.is_occupancy_type = true;
                }
                else if (type === 'location') {
                    where.is_location = true;
                }
                const data = await manager.find(location_types_entity_1.LocationType, {
                    where,
                    order: {
                        sort_order: 'ASC',
                    },
                });
                return data.map((item) => ({
                    value: item.type_code,
                    label: item.type_name,
                    type_id: item.type_id,
                    type_code: item.type_code,
                    sort_order: item.sort_order,
                    is_location: item.is_location,
                    is_occupancy_type: item.is_occupancy_type,
                    root_location_types: null,
                    config: null,
                }));
            });
        });
    }
    async createBranch(payload, organizationId, createdBy, req) {
        let count = 1;
        console.log('branch add:', payload);
        const userId = await this.getUserByPublicID(createdBy);
        console.log('SPS', count++);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        const schemaName = req?.cookies['x-organization-schema'];
        let fullSchemaName = 'public';
        if (schemaName) {
            try {
                const decryptedSchemaName = (0, crypto_utils_1.decrypt)(schemaName);
                if (decryptedSchemaName)
                    fullSchemaName = `org_${decryptedSchemaName}`;
            }
            catch (error) {
                console.error('Error decrypting schema name:', error.message);
            }
        }
        console.log('SPS', count++);
        const featureIdForBranchCreation = 1;
        const enableFeatureRestriction = process.env.ENABLE_FEATURE_RESTRICTION === 'true';
        let maxBranches = null;
        let totalBranches = 0;
        if (enableFeatureRestriction) {
            console.log('🔐 Feature restriction validation is ENABLED.');
            console.log('userIdABC', userId);
            const { assetRestriction, billingRestriction } = await restriction_util_1.RestrictionUtil.checkRestrictionAndLimitation(organizationId, featureIdForBranchCreation);
            console.log('🔹 Asset Restriction:', JSON.stringify(assetRestriction, null, 2));
            console.log('🔹 Billing Restriction:', JSON.stringify(billingRestriction, null, 2));
            console.log('SPS', count++);
            if (billingRestriction?.value) {
                maxBranches = Number(billingRestriction.value);
            }
            else if (assetRestriction?.overrideValue) {
                maxBranches = Number(assetRestriction.overrideValue);
            }
            console.log('SPS', count++);
            if (maxBranches !== null && !isNaN(maxBranches)) {
                const countResult = await queryRunner.manager.query(`SELECT COUNT(*) FROM ${fullSchemaName}.branches WHERE is_deleted = 0`);
                totalBranches = Number(countResult[0].count);
                console.log('📊 Max Branches Allowed:', maxBranches);
                console.log('📈 Current Total Branches:', totalBranches);
                if (totalBranches >= maxBranches) {
                    throw new common_1.HttpException(`🚫 Branch creation limit reached — you can only create up to ${maxBranches} branches.`, common_1.HttpStatus.FORBIDDEN);
                }
            }
        }
        else {
            console.log('⚙️ Feature restriction validation is DISABLED — skipping restriction check.');
        }
        console.log('SPS', count++);
        await queryRunner.startTransaction();
        let committed = false;
        try {
            if (!/^org_[A-Za-z0-9_]+$/.test(fullSchemaName)) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Organization schema could not be resolved for this request',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            await queryRunner.query(`SET LOCAL search_path TO ${fullSchemaName}`);
            console.log('SPS', count++);
            console.log('POINT:3');
            console.log('Created By:=', createdBy);
            console.log('userId:=', userId);
            console.log('🌿 createBranch called with:', payload);
            console.log('🏢 Organization ID:', organizationId);
            const locationTypeRows = await queryRunner.manager.query(`SELECT type_id, type_code
       FROM ${fullSchemaName}.location_types
       WHERE type_code = ANY($1) AND is_deleted = 0`, [
                [
                    'campus',
                    'area',
                    'building',
                    'shed',
                    'warehouse',
                    'floor',
                    'wing',
                    'section',
                    'room',
                    'cabin',
                    'workstation',
                    'server_room',
                    'storage',
                    'desk',
                    'branch',
                    'head_office'
                ],
            ]);
            const typeIdMap = {};
            for (const t of locationTypeRows) {
                typeIdMap[t.type_code] = Number(t.type_id);
            }
            console.log('📍 typeIdMap loaded:', typeIdMap);
            const userRows = await queryRunner.manager.query(`SELECT * FROM ${fullSchemaName}.users WHERE user_id = $1`, [userId]);
            const user = userRows[0];
            const sendNotification = async (name, locationId, typeCode) => {
                try {
                    await this.notificationHelper.triggerEventNotification({
                        eventId: 42,
                        contextData: {
                            location: {
                                location_name: name,
                                branch_name: savedBranch.branch_name,
                                created_by: `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim(),
                            },
                        },
                        recipients: user?.users_business_email
                            ? [
                                {
                                    recipient_type: 'user',
                                    recipient_id: String(user.user_id),
                                    recipient_email: user.users_business_email,
                                },
                            ]
                            : [],
                        meta: {
                            trace_id: `LOCATION_${typeCode.toUpperCase()}_${locationId}`,
                        },
                    });
                }
                catch (err) {
                    console.error(`⚠️ ${typeCode} notification failed:`, err.message);
                }
            };
            const insertLocation = async (name, typeCode, parentPath, parentLocationId) => {
                const normalizedName = name.trim();
                const typeId = typeIdMap[typeCode] ?? null;
                const existing = await queryRunner.query(`
    SELECT location_id, path
    FROM ${fullSchemaName}.asset_locations
    WHERE lower(location_name) = lower($1)
      AND location_type_code = $2
      AND COALESCE(parent_location_id, 0) = COALESCE($3, 0)
      AND is_deleted = 0
    LIMIT 1
    `, [normalizedName, typeCode, parentLocationId]);
                if (existing.length > 0) {
                    console.log(`♻️ Reusing existing ${typeCode}: ${normalizedName}`);
                    return {
                        locationId: Number(existing[0].location_id),
                        path: existing[0].path,
                        isNew: false,
                    };
                }
                const result = await queryRunner.query(`
    INSERT INTO ${fullSchemaName}.asset_locations
    (
      location_name,
      is_active,
      is_deleted,
      created_by,
      location_type_code,
      location_type_entity_id,
      location_type_id,
      parent_location_id
    )
     VALUES ($1, 1, 0, $2, $3, $4, $5, $6)
    RETURNING location_id
    `, [normalizedName, userId, typeCode, typeId, typeId, parentLocationId]);
                const locationId = Number(result[0].location_id);
                const path = `${parentPath ?? ''}/${locationId}/`;
                await queryRunner.query(`
    UPDATE ${fullSchemaName}.asset_locations
    SET path = $1
    WHERE location_id = $2
    `, [path, locationId]);
                console.log(`✅ Created new ${typeCode}: ${normalizedName}`);
                return {
                    locationId,
                    path,
                    isNew: true,
                };
            };
            const existingBranch = await queryRunner.manager.query(`SELECT branch_id FROM ${fullSchemaName}.branches
       WHERE branch_name = $1 AND is_deleted = 0 LIMIT 1`, [payload.branch_name?.trim()]);
            if (existingBranch.length > 0) {
                throw new common_1.ConflictException(`Branch name '${payload.branch_name}' already exists.`);
            }
            const lastCountResult = await queryRunner.manager.query(`SELECT COUNT(*) FROM ${fullSchemaName}.branches`);
            const lastCount = Number(lastCountResult[0].count);
            const branchCode = `BR-${String(lastCount + 1).padStart(3, '0')}`;
            console.log('SPS', count++);
            const newBranch = queryRunner.manager.create(branches_entity_1.Branch, {
                branch_code: branchCode,
                branch_name: payload.branch_name,
                contact_number: this.sanitize(payload.contact_number),
                branch_email: this.sanitize(payload.branch_email),
                branch_street: this.sanitize(payload.branch_street),
                branch_landmark: this.sanitize(payload.branch_landmark),
                city: this.sanitize(payload.city),
                state: this.sanitize(payload.state),
                pincode: this.sanitize(payload.pincode),
                country: this.sanitize(payload.country),
                city_id: this.sanitize(payload.city_id),
                country_id: this.sanitize(payload.country_id),
                location_id: this.sanitize(payload.location_id),
                gst_no: this.sanitize(payload.gstNo),
                alternative_contact_number: this.sanitize(payload.alternative_contact_number),
                occupancy_type_code: payload.occupancy_type?.trim() || null,
                established_date: this.sanitize(payload.established_date) ?? new Date(),
                created_by: userId ?? null,
                is_active: 1,
                is_deleted: 0,
            });
            const savedBranch = await queryRunner.manager.save(newBranch);
            console.log('SPS', count++);
            const insertMappingOnly = async (locationId, typeCode) => {
                console.log('insertMappingOnly called');
                const typeId = typeIdMap[typeCode];
                console.log({
                    locationId,
                    typeCode,
                    typeId,
                    branchId: savedBranch.branch_id,
                });
                if (!locationId) {
                    throw new Error('locationId missing');
                }
                if (!typeId) {
                    throw new Error(`typeId missing for ${typeCode}`);
                }
                const existing = await queryRunner.query(`SELECT 1
     FROM ${fullSchemaName}.location_branch_mapping
     WHERE location_id = $1
       AND branch_id = $2
       AND is_deleted = 0
     LIMIT 1`, [locationId, savedBranch.branch_id]);
                console.log('existing mapping', existing);
                if (existing.length > 0)
                    return;
                await queryRunner.query(`INSERT INTO ${fullSchemaName}.location_branch_mapping
     (location_id, branch_id, type_id, is_active, is_deleted)
     VALUES ($1, $2, $3, 1, 0)`, [locationId, savedBranch.branch_id, typeId]);
                console.log('mapping inserted');
            };
            if (payload.occupancy_type === 'campus') {
                const createdCampusNames = new Set();
                for (const campus of payload.campuses || []) {
                    const name = campus.campus_name?.trim();
                    if (!name)
                        continue;
                    const normalized = name.toLowerCase();
                    if (createdCampusNames.has(normalized))
                        continue;
                    createdCampusNames.add(normalized);
                    if (campus.is_new || !campus.campus_id) {
                        const { locationId } = await insertLocation(name, 'campus', null, null);
                        await insertMappingOnly(locationId, 'campus');
                        await sendNotification(name, locationId, 'campus');
                    }
                    else {
                        await insertMappingOnly(campus.campus_id, 'campus');
                    }
                }
            }
            if (payload.occupancy_type === 'building') {
                let campusLocationId = null;
                let campusPath = null;
                const campusObj = payload.campuses?.[0];
                if (campusObj) {
                    if (campusObj.is_new && campusObj.campus_name?.trim()) {
                        const result = await insertLocation(campusObj.campus_name.trim(), 'campus', null, null);
                        campusLocationId = result.locationId;
                        campusPath = result.path;
                        await insertMappingOnly(campusLocationId, 'campus');
                        await sendNotification(campusObj.campus_name.trim(), campusLocationId, 'campus');
                    }
                    else if (campusObj.campus_id) {
                        campusLocationId = Number(campusObj.campus_id);
                        await insertMappingOnly(campusLocationId, 'campus');
                        const pathRow = await queryRunner.query(`SELECT path FROM ${fullSchemaName}.asset_locations
         WHERE location_id = $1 AND is_deleted = 0 LIMIT 1`, [campusLocationId]);
                        campusPath = pathRow[0]?.path ?? null;
                    }
                }
                for (const building of payload.buildings || []) {
                    const name = building.building_name?.trim();
                    if (!name)
                        continue;
                    if (building.is_new || !building.building_id) {
                        const { locationId } = await insertLocation(name, 'building', campusPath ?? null, campusLocationId ?? null);
                        await insertMappingOnly(locationId, 'building');
                        await sendNotification(name, locationId, 'building');
                    }
                    else {
                        await insertMappingOnly(Number(building.building_id), 'building');
                    }
                }
            }
            if (payload.occupancy_type === 'floor') {
                let campusLocationId = null;
                let campusPath = null;
                const campusObj = payload.campuses?.[0];
                if (campusObj) {
                    if (campusObj.is_new && campusObj.campus_name?.trim()) {
                        const result = await insertLocation(campusObj.campus_name.trim(), 'campus', null, null);
                        campusLocationId = result.locationId;
                        campusPath = result.path;
                        await insertMappingOnly(campusLocationId, 'campus');
                        await sendNotification(campusObj.campus_name.trim(), campusLocationId, 'campus');
                    }
                    else if (campusObj.campus_id) {
                        campusLocationId = Number(campusObj.campus_id);
                        await insertMappingOnly(campusLocationId, 'campus');
                        const pathRow = await queryRunner.query(`SELECT path FROM ${fullSchemaName}.asset_locations
         WHERE location_id = $1 AND is_deleted = 0 LIMIT 1`, [campusLocationId]);
                        campusPath = pathRow[0]?.path ?? null;
                    }
                }
                let buildingLocationId = null;
                let buildingPath = null;
                const buildingObj = payload.buildings?.[0];
                if (buildingObj) {
                    if (buildingObj.is_new && buildingObj.building_name?.trim()) {
                        const result = await insertLocation(buildingObj.building_name.trim(), 'building', campusPath ?? null, campusLocationId ?? null);
                        buildingLocationId = result.locationId;
                        buildingPath = result.path;
                        await insertMappingOnly(buildingLocationId, 'building');
                        await sendNotification(buildingObj.building_name.trim(), buildingLocationId, 'building');
                    }
                    else if (buildingObj.building_id) {
                        buildingLocationId = Number(buildingObj.building_id);
                        await insertMappingOnly(buildingLocationId, 'building');
                        const pathRow = await queryRunner.query(`SELECT path FROM ${fullSchemaName}.asset_locations
         WHERE location_id = $1 AND is_deleted = 0 LIMIT 1`, [buildingLocationId]);
                        buildingPath = pathRow[0]?.path ?? null;
                    }
                }
                for (const floor of payload.floors || []) {
                    const floorLabel = floor.floor_label?.trim();
                    if (!floorLabel)
                        continue;
                    if (floor.is_new || !floor.floor_id) {
                        const { locationId: floorLocationId, path: floorPath } = await insertLocation(floorLabel, 'floor', buildingPath ?? campusPath ?? null, buildingLocationId ?? campusLocationId ?? null);
                        await insertMappingOnly(floorLocationId, 'floor');
                        await sendNotification(floorLabel, floorLocationId, 'floor');
                        if (floor.room_no?.trim()) {
                            const roomLabel = floor.room_no.trim();
                            const { locationId: roomLocationId } = await insertLocation(roomLabel, 'room', floorPath, floorLocationId);
                            await insertMappingOnly(roomLocationId, 'room');
                            await sendNotification(roomLabel, roomLocationId, 'room');
                        }
                    }
                    else {
                        await insertMappingOnly(Number(floor.floor_id), 'floor');
                    }
                }
            }
            if (payload.occupancy_type === 'coworking') {
                for (const coworking of payload.coworking || []) {
                    let campusLocationId = null;
                    let campusPath = null;
                    if (coworking.campus?.is_new &&
                        coworking.campus?.campus_name?.trim()) {
                        const campusName = coworking.campus.campus_name.trim();
                        const result = await insertLocation(campusName, 'campus', null, savedBranch.branch_id);
                        campusLocationId = result.locationId;
                        campusPath = result.path;
                        await insertMappingOnly(campusLocationId, 'campus');
                        await sendNotification(campusName, campusLocationId, 'campus');
                    }
                    let buildingLocationId = null;
                    let buildingPath = null;
                    if (coworking.building?.is_new &&
                        coworking.building?.building_name?.trim()) {
                        const name = coworking.building.building_name.trim();
                        const result = await insertLocation(name, 'building', campusPath ?? null, campusLocationId ?? savedBranch.branch_id);
                        buildingLocationId = result.locationId;
                        buildingPath = result.path;
                        await insertMappingOnly(buildingLocationId, 'building');
                        await sendNotification(name, buildingLocationId, 'building');
                    }
                    let roomLocationId = null;
                    let roomPath = null;
                    if (coworking.room?.is_new && coworking.room?.room_name?.trim()) {
                        const name = coworking.room.room_name.trim();
                        const result = await insertLocation(name, 'room', buildingPath ?? campusPath ?? null, buildingLocationId ?? campusLocationId ?? savedBranch.branch_id);
                        roomLocationId = result.locationId;
                        roomPath = result.path;
                        await insertMappingOnly(roomLocationId, 'room');
                        await sendNotification(name, roomLocationId, 'room');
                    }
                    for (const desk of coworking.desks || []) {
                        const deskLabel = desk.desk_label?.trim() || desk.desk_name?.trim();
                        if (!deskLabel)
                            continue;
                        const { locationId: deskLocationId } = await insertLocation(deskLabel, 'desk', roomPath ?? buildingPath ?? campusPath ?? null, roomLocationId ??
                            buildingLocationId ??
                            campusLocationId ??
                            savedBranch.branch_id);
                        await insertMappingOnly(deskLocationId, 'desk');
                        await sendNotification(deskLabel, deskLocationId, 'desk');
                        console.log(`✅ Desk created: ${deskLabel} → location_id ${deskLocationId}`);
                    }
                }
            }
            console.log('🔍 Fallback check — occupancy_type:', payload.occupancy_type, '| matched known types?', ['campus', 'building', 'floor', 'coworking'].includes(payload.occupancy_type), '| occupancy_location_name:', payload.occupancy_location_name, '| branch_name:', payload.branch_name);
            if (payload.occupancy_type &&
                !['campus', 'building', 'floor', 'coworking'].includes(payload.occupancy_type)) {
                const fallbackName = payload.occupancy_location_name?.trim() ||
                    payload.branch_name?.trim();
                console.log('🔍 fallbackName resolved to:', fallbackName);
                if (fallbackName) {
                    const typeCode = payload.occupancy_type;
                    console.log('🔍 About to insertLocation with typeCode:', typeCode, '| typeIdMap has it?', typeIdMap[typeCode]);
                    const { locationId } = await insertLocation(fallbackName, typeCode, null, null);
                    await insertMappingOnly(locationId, typeCode);
                    await sendNotification(fallbackName, locationId, typeCode);
                }
            }
            console.log('savedBranch', savedBranch);
            try {
                const result = await queryRunner.manager.query(`UPDATE ${fullSchemaName}.users
         SET branch_id = (
           SELECT b.branch_id
           FROM ${fullSchemaName}.branches b
           WHERE b.is_active = 1 AND b.is_deleted = 0
           ORDER BY b.branch_id ASC
           LIMIT 1
         )
         WHERE role_id = 1
           AND is_deleted = 0
           AND is_active = 1
           AND branch_id IS NULL`);
                console.log('✅ Updated rows:', result?.rowCount || 0);
            }
            catch (error) {
                console.error('⚠️ Error updating super admin branch_id:', error.message);
            }
            try {
                const primaryUser = await queryRunner.manager.query(`SELECT user_id, branch_access
         FROM ${fullSchemaName}.users
         WHERE user_id = 1 LIMIT 1`);
                if (primaryUser.length > 0) {
                    const existingAccess = primaryUser[0].branch_access || [];
                    if (!existingAccess.includes(savedBranch.branch_id)) {
                        await queryRunner.manager.query(`UPDATE ${fullSchemaName}.users
             SET branch_access = array_append(COALESCE(branch_access, '{}'), $1)
             WHERE user_id = 1`, [savedBranch.branch_id]);
                        console.log(`✅ branch_id ${savedBranch.branch_id} added to user_id=1 branch_access`);
                    }
                    else {
                        console.log(`ℹ️ branch_id ${savedBranch.branch_id} already exists in user_id=1 branch_access`);
                    }
                }
            }
            catch (err) {
                console.error('⚠️ Failed to update branch_access for user_id=1:', err.message);
            }
            let profileImagePath = null;
            if (payload.documents?.[0]?.base64) {
                try {
                    const uploadDir = path_1.default.join(process.cwd(), 'uploads', 'user-profile');
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }
                    const base64Data = payload.documents[0].base64;
                    const mimeType = payload.documents[0].type || 'image/jpeg';
                    const ext = mimeType.split('/')[1] || 'jpg';
                    const fileName = `user-${Date.now()}.${ext}`;
                    const fullPath = path_1.default.join(uploadDir, fileName);
                    const base64String = base64Data.replace(/^data:[^;]+;base64,/, '');
                    fs.writeFileSync(fullPath, Buffer.from(base64String, 'base64'));
                    profileImagePath = `/uploads/user-profile/${fileName}`;
                }
                catch (err) {
                    console.error('⚠️ Failed to save profile image:', err.message);
                }
            }
            if (enableFeatureRestriction) {
                const countResult = await queryRunner.manager.query(`SELECT COUNT(*) FROM ${fullSchemaName}.branches WHERE is_deleted = 0`);
                totalBranches = Number(countResult[0].count);
                try {
                    await usage_util_1.UsageUtil.updateUsageCountInBothPortals(organizationId, featureIdForBranchCreation, totalBranches.toString());
                    console.log('✅ Usage count updated successfully in both portals.');
                }
                catch (updateError) {
                    console.error('⚠️ Failed to update usage count:', updateError.message);
                }
            }
            else {
                console.log('⚙️ Skipping usage count update since feature restriction is disabled.');
            }
            const BRANCH_CREATED_EVENT_ID = 13;
            try {
                const contextData = {
                    branch: { ...savedBranch },
                };
                const recipients = [];
                if (user?.users_business_email) {
                    recipients.push({
                        recipient_type: 'user',
                        recipient_id: String(user.user_id),
                        recipient_email: user.users_business_email,
                    });
                }
                await this.notificationHelper.triggerEventNotification({
                    eventId: BRANCH_CREATED_EVENT_ID,
                    contextData,
                    recipients,
                    meta: { trace_id: savedBranch.branch_code },
                });
                console.log('✅ Branch creation notification sent.');
            }
            catch (err) {
                console.error('⚠️ Failed to send branch notification:', err.message);
            }
            await queryRunner.commitTransaction();
            committed = true;
            try {
                this.redisService.delByPattern('organization-branches:*');
                this.redisService.delByPattern('organization-branches-count:*');
                this.redisService.delByPattern('orgnizationprofile-getcounts:*');
                this.refreshStockSummaryFromContext();
                await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.BRANCH);
            }
            catch (cacheErr) {
                console.error('⚠️ Branch saved, but post-commit cache invalidation failed:', cacheErr?.message ?? cacheErr);
            }
            return savedBranch;
        }
        catch (error) {
            if (!committed) {
                try {
                    await queryRunner.rollbackTransaction();
                }
                catch (rollbackErr) {
                    console.error('⚠️ Rollback failed:', rollbackErr?.message ?? rollbackErr);
                }
            }
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    refreshStockSummaryFromContext() {
        try {
            const encryptedOrg = this.requestContext.get('organization_id');
            if (!encryptedOrg)
                return;
            const orgId = Number((0, crypto_utils_1.decrypt)(encryptedOrg));
            if (orgId && !isNaN(orgId)) {
                this.stockSummaryRefresh.scheduleRefresh(orgId);
            }
        }
        catch (err) {
            console.error('[StockSummaryRefresh] context resolve failed:', err);
        }
    }
    async getBranchById(branch_id, req) {
        if (!branch_id)
            throw new common_1.BadRequestException('Branch ID is required');
        const schemaName = req?.cookies['x-organization-schema'];
        let fullSchemaName = 'public';
        if (schemaName) {
            try {
                const decrypted = (0, crypto_utils_1.decrypt)(schemaName);
                if (decrypted)
                    fullSchemaName = `org_${decrypted}`;
            }
            catch (err) {
                console.error('Schema decrypt error:', err.message);
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.query(`SET search_path TO ${fullSchemaName}`);
            const branch = await queryRunner.manager.findOne(branches_entity_1.Branch, {
                where: { branch_id, is_deleted: 0 },
            });
            if (!branch)
                throw new common_1.NotFoundException(`Branch ${branch_id} not found`);
            const occupancy_type = branch.occupancy_type_code ?? null;
            const loc = queryRunner.manager.getRepository(locations_entity_1.Locations);
            const mappingCount = await queryRunner.manager.query(`SELECT COUNT(*) FROM ${fullSchemaName}.location_branch_mapping
       WHERE branch_id = $1 AND is_deleted = 0`, [branch_id]);
            const can_change_occupancy = Number(mappingCount[0].count) === 0;
            const sharedRows = await queryRunner.manager.query(`SELECT location_id
       FROM ${fullSchemaName}.location_branch_mapping
       WHERE branch_id != $1 AND is_deleted = 0
         AND location_id IN (
           SELECT location_id FROM ${fullSchemaName}.location_branch_mapping
           WHERE branch_id = $1 AND is_deleted = 0
         )`, [branch_id]);
            const shared_locations = sharedRows.map((r) => Number(r.location_id));
            const locked_locations = [];
            const response = {
                branch_name: branch.branch_name,
                contact_number: branch.contact_number,
                branch_email: branch.branch_email,
                branch_street: branch.branch_street,
                branch_landmark: branch.branch_landmark,
                city: branch.city,
                state: branch.state,
                pincode: branch.pincode,
                country: branch.country,
                is_active: branch.is_active,
                occupancy_type,
                campuses: [],
                buildings: [],
                floors: [],
                restrictions: {
                    can_change_occupancy,
                    shared_locations,
                    locked_locations,
                },
            };
            const byType = async (type_code) => {
                return await queryRunner.manager.query(`
    SELECT al.*
    FROM ${fullSchemaName}.location_branch_mapping lbm
    INNER JOIN ${fullSchemaName}.asset_locations al
      ON al.location_id = lbm.location_id
    WHERE lbm.branch_id = $1
      AND lbm.is_deleted = 0
      AND al.is_deleted = 0
      AND al.location_type_code = $2
    ORDER BY al.location_id ASC
    `, [branch_id, type_code]);
            };
            if (occupancy_type === 'campus') {
                const campuses = await byType('campus');
                response.campuses = campuses.map((c) => ({
                    campus_id: c.location_id,
                    location_id: c.location_id,
                    temp_id: null,
                    campus_name: c.location_name,
                    is_new: false,
                }));
            }
            if (occupancy_type === 'building') {
                const [campuses, buildings] = await Promise.all([
                    byType('campus'),
                    byType('building'),
                ]);
                response.campuses = campuses.map((c) => ({
                    campus_id: c.location_id,
                    location_id: c.location_id,
                    temp_id: null,
                    campus_name: c.location_name,
                    is_new: false,
                }));
                response.buildings = buildings.map((b) => ({
                    building_id: b.location_id,
                    location_id: b.location_id,
                    temp_id: null,
                    campus_id: b.parent_location_id ?? null,
                    building_name: b.location_name,
                    is_new: false,
                    is_shared: shared_locations.includes(b.location_id),
                    is_locked: locked_locations.includes(b.location_id),
                }));
            }
            if (occupancy_type === 'floor') {
                const [campuses, buildings, floors] = await Promise.all([
                    byType('campus'),
                    byType('building'),
                    byType('floor'),
                ]);
                response.campuses = campuses.map((c) => ({
                    campus_id: c.location_id,
                    location_id: c.location_id,
                    temp_id: null,
                    campus_name: c.location_name,
                    is_new: false,
                }));
                response.buildings = buildings.map((b) => ({
                    building_id: b.location_id,
                    location_id: b.location_id,
                    temp_id: null,
                    campus_id: b.parent_location_id ?? null,
                    building_name: b.location_name,
                    is_new: false,
                    is_shared: shared_locations.includes(b.location_id),
                    is_locked: locked_locations.includes(b.location_id),
                }));
                response.floors = floors.map((f) => ({
                    floor_id: f.location_id,
                    location_id: f.location_id,
                    temp_id: null,
                    building_id: f.parent_location_id ?? null,
                    campus_id: null,
                    floor_no: f.location_floor ?? '',
                    floor_label: f.location_name ?? '',
                    is_new: false,
                    is_locked: locked_locations.includes(f.location_id),
                }));
            }
            return response;
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateBranch1(branchId, payload, organizationId, updatedBy, req) {
        console.log('branch payload', payload);
        if (!branchId)
            throw new common_1.BadRequestException('Branch ID is required');
        const userId = await this.getUserByPublicID(updatedBy);
        const schemaName = req?.cookies['x-organization-schema'];
        let fullSchemaName = 'public';
        if (schemaName) {
            try {
                const decrypted = (0, crypto_utils_1.decrypt)(schemaName);
                if (decrypted)
                    fullSchemaName = `org_${decrypted}`;
            }
            catch (err) {
                console.error('Schema decrypt error:', err.message);
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`SET search_path TO ${fullSchemaName}`);
            const branch = await queryRunner.manager.findOne(branches_entity_1.Branch, {
                where: { branch_id: branchId, is_deleted: 0 },
            });
            if (!branch)
                throw new common_1.NotFoundException(`Branch ${branchId} not found`);
            if (payload.branch_name?.trim()) {
                const duplicate = await queryRunner.manager.findOne(branches_entity_1.Branch, {
                    where: { branch_name: payload.branch_name.trim(), is_deleted: 0 },
                });
                if (duplicate && duplicate.branch_id !== branchId) {
                    throw new common_1.ConflictException(`Branch name '${payload.branch_name}' already exists.`);
                }
            }
            const occupancy_type = payload.occupancy_type?.trim() ?? branch.occupancy_type_code;
            if (occupancy_type !== branch.occupancy_type_code) {
                const mappingCount = await queryRunner.manager.query(`SELECT COUNT(*) FROM ${fullSchemaName}.location_branch_mapping
         WHERE branch_id = $1 AND is_deleted = 0`, [branchId]);
                if (Number(mappingCount[0].count) > 0) {
                    throw new common_1.ConflictException('Occupancy type cannot be changed after locations are mapped.');
                }
            }
            const typeRows = await queryRunner.manager.query(`SELECT type_id, type_code FROM ${fullSchemaName}.location_types
       WHERE type_code = ANY($1) AND is_deleted = 0`, [['campus', 'building', 'floor', 'room']]);
            const typeIdMap = {};
            for (const t of typeRows)
                typeIdMap[t.type_code] = Number(t.type_id);
            branch.branch_name =
                this.sanitizeValue(payload.branch_name, 'string') ?? branch.branch_name;
            branch.contact_number =
                this.sanitizeValue(payload.contact_number, 'string') ??
                    branch.contact_number;
            branch.branch_email = payload.branch_email ?? branch.branch_email;
            branch.branch_street = payload.branch_street ?? branch.branch_street;
            branch.branch_landmark =
                payload.branch_landmark ?? branch.branch_landmark;
            branch.city = this.sanitize(payload.city) ?? branch.city;
            branch.state = payload.state ?? branch.state;
            branch.pincode =
                this.sanitizeValue(payload.pincode, 'number') ?? branch.pincode;
            branch.country =
                this.sanitizeValue(payload.country, 'string') ?? branch.country;
            branch.occupancy_type_code = occupancy_type;
            if (payload.is_active !== undefined) {
                branch.is_active = payload.is_active ? 1 : 0;
            }
            const savedBranch = await queryRunner.manager.save(branch);
            const upsertLocation = async (opts) => {
                const typeId = typeIdMap[opts.type_code] ?? null;
                if (opts.location_id) {
                    await queryRunner.query(`UPDATE ${fullSchemaName}.asset_locations
       SET location_name  = $1,
           location_floor = COALESCE($2, location_floor),
           updated_by     = $3,
           updated_at     = NOW()
       WHERE location_id = $4
         AND is_deleted = 0`, [opts.name, opts.floor_no ?? null, userId, opts.location_id]);
                    if (opts.address) {
                        await queryRunner.query(`UPDATE ${fullSchemaName}.asset_locations
         SET location_street_address = COALESCE($1, location_street_address),
             location_city           = COALESCE($2, location_city),
             location_state          = COALESCE($3, location_state),
             location_landmark       = COALESCE($4, location_landmark),
             pincode                 = COALESCE($5, pincode),
             country                 = COALESCE($6, country),
             updated_by              = $7,
             updated_at              = NOW()
         WHERE location_id = $8
           AND is_deleted = 0`, [
                            opts.address.branch_street ?? null,
                            opts.address.city ?? null,
                            opts.address.state ?? null,
                            opts.address.branch_landmark ?? null,
                            opts.address.pincode ?? null,
                            opts.address.country ?? null,
                            userId,
                            opts.location_id,
                        ]);
                    }
                    const existingMapping = await queryRunner.query(`SELECT 1
       FROM ${fullSchemaName}.location_branch_mapping
       WHERE location_id = $1
         AND branch_id = $2
         AND is_deleted = 0
       LIMIT 1`, [opts.location_id, branchId]);
                    if (existingMapping.length === 0) {
                        await queryRunner.query(`INSERT INTO ${fullSchemaName}.location_branch_mapping
         (
           location_id,
           branch_id,
           type_id,
           is_active,
           is_deleted
         )
         VALUES ($1, $2, $3, 1, 0)`, [opts.location_id, branchId, typeId]);
                    }
                    const pathRow = await queryRunner.query(`SELECT path
       FROM ${fullSchemaName}.asset_locations
       WHERE location_id = $1`, [opts.location_id]);
                    return {
                        location_id: opts.location_id,
                        path: pathRow[0]?.path ?? '',
                    };
                }
                const result = await queryRunner.query(`INSERT INTO ${fullSchemaName}.asset_locations
     (
       location_name,
       location_floor,
       is_active,
       is_deleted,
       created_by,
       location_type_code,
       location_type_entity_id,
       parent_location_id
     )
     VALUES ($1, $2, 1, 0, $3, $4, $5, $6)
     RETURNING location_id`, [
                    opts.name,
                    opts.floor_no ?? null,
                    userId,
                    opts.type_code,
                    typeId,
                    opts.parent_location_id,
                ]);
                const location_id = Number(result[0].location_id);
                const path = `${opts.parent_path ?? ''}/${location_id}/`;
                await queryRunner.query(`UPDATE ${fullSchemaName}.asset_locations
     SET path = $1
     WHERE location_id = $2`, [path, location_id]);
                await queryRunner.query(`INSERT INTO ${fullSchemaName}.location_branch_mapping
     (
       location_id,
       branch_id,
       type_id,
       is_active,
       is_deleted
     )
     VALUES ($1, $2, $3, 1, 0)`, [location_id, branchId, typeId]);
                return {
                    location_id,
                    path,
                };
            };
            const softDeleteLocation = async (location_id) => {
                await queryRunner.query(`UPDATE ${fullSchemaName}.location_branch_mapping
     SET is_deleted = 1,
         updated_by = $1,
         updated_at = NOW()
     WHERE location_id = $2
       AND branch_id = $3`, [userId, location_id, branchId]);
                const remaining = await queryRunner.query(`SELECT 1
     FROM ${fullSchemaName}.location_branch_mapping
     WHERE location_id = $1
       AND is_deleted = 0
     LIMIT 1`, [location_id]);
                if (remaining.length === 0) {
                    await queryRunner.query(`UPDATE ${fullSchemaName}.asset_locations
       SET is_deleted = 1,
           updated_by = $1,
           updated_at = NOW()
       WHERE location_id = $2`, [userId, location_id]);
                }
            };
            const addressPayload = {
                branch_street: payload.branch_street,
                branch_landmark: payload.branch_landmark,
                city: payload.city,
                state: payload.state,
                pincode: payload.pincode,
                country: payload.country,
            };
            const hasAddress = Object.values(addressPayload).some((v) => v !== undefined && v !== null && v !== '');
            if (occupancy_type === 'campus') {
                const incomingIds = new Set((payload.campuses || [])
                    .filter((c) => c.campus_id && !c.is_new)
                    .map((c) => Number(c.campus_id)));
                const existingCampuses = await queryRunner.manager.query(`SELECT al.location_id
   FROM ${fullSchemaName}.asset_locations al
   INNER JOIN ${fullSchemaName}.location_branch_mapping lbm
      ON lbm.location_id = al.location_id
   WHERE lbm.branch_id = $1
     AND lbm.is_deleted = 0
     AND al.location_type_code = 'campus'
     AND al.is_deleted = 0`, [branchId]);
                for (const row of existingCampuses) {
                    if (!incomingIds.has(Number(row.location_id))) {
                        await softDeleteLocation(Number(row.location_id));
                    }
                }
                for (const campus of payload.campuses || []) {
                    const name = campus.campus_name?.trim();
                    if (!name)
                        continue;
                    await upsertLocation({
                        location_id: campus.is_new ? null : (campus.campus_id ?? null),
                        name,
                        type_code: 'campus',
                        parent_location_id: branchId,
                        parent_path: null,
                        address: hasAddress ? addressPayload : null,
                    });
                }
            }
            if (occupancy_type === 'building') {
                let campusLocationId = null;
                let campusPath = null;
                const campusObj = payload.campuses?.[0];
                if (campusObj) {
                    const result = await upsertLocation({
                        location_id: campusObj.is_new
                            ? null
                            : (campusObj.campus_id ?? null),
                        name: campusObj.campus_name?.trim() ?? '',
                        type_code: 'campus',
                        parent_location_id: null,
                        parent_path: null,
                        address: hasAddress ? addressPayload : null,
                    });
                    campusLocationId = result.location_id;
                    campusPath = result.path;
                }
                const incomingBuildingIds = new Set((payload.buildings || [])
                    .filter((b) => b.building_id && !b.is_new)
                    .map((b) => Number(b.building_id)));
                const existingBuildings = await queryRunner.manager.query(`SELECT DISTINCT al.location_id
   FROM ${fullSchemaName}.asset_locations al
   INNER JOIN ${fullSchemaName}.location_branch_mapping map
      ON map.location_id = al.location_id
   WHERE map.branch_id = $1
     AND map.is_deleted = 0
     AND al.location_type_code = 'building'
     AND al.is_deleted = 0`, [branchId]);
                for (const row of existingBuildings) {
                    if (!incomingBuildingIds.has(Number(row.location_id))) {
                        await softDeleteLocation(Number(row.location_id));
                    }
                }
                for (const building of payload.buildings || []) {
                    const name = building.building_name?.trim();
                    if (!name)
                        continue;
                    await upsertLocation({
                        location_id: building.is_new
                            ? null
                            : (building.building_id ?? null),
                        name,
                        type_code: 'building',
                        parent_location_id: campusLocationId ?? null,
                        parent_path: campusPath,
                        address: !campusObj && hasAddress ? addressPayload : null,
                    });
                }
            }
            if (occupancy_type === 'floor') {
                let campusLocationId = null;
                let campusPath = null;
                const campusObj = payload.campuses?.[0];
                if (campusObj) {
                    const result = await upsertLocation({
                        location_id: campusObj.is_new
                            ? null
                            : (campusObj.campus_id ?? null),
                        name: campusObj.campus_name?.trim() ?? '',
                        type_code: 'campus',
                        parent_location_id: null,
                        parent_path: null,
                        address: null,
                    });
                    campusLocationId = result.location_id;
                    campusPath = result.path;
                }
                const buildingPathMap = new Map();
                const incomingBuildingIds = new Set((payload.buildings || [])
                    .filter((b) => b.building_id && !b.is_new)
                    .map((b) => Number(b.building_id)));
                const existingBuildings = await queryRunner.manager.query(`SELECT al.location_id
         FROM ${fullSchemaName}.asset_locations al
         WHERE al.branch_id = $1
           AND al.location_type_code = 'building'
           AND al.is_deleted = 0
           AND NOT EXISTS (
             SELECT 1 FROM ${fullSchemaName}.location_branch_mapping lbm
             WHERE lbm.location_id = al.location_id
               AND lbm.branch_id != $1
               AND lbm.is_deleted = 0
           )`, [branchId]);
                for (const row of existingBuildings) {
                    if (!incomingBuildingIds.has(Number(row.location_id))) {
                        await softDeleteLocation(Number(row.location_id));
                    }
                }
                for (const building of payload.buildings || []) {
                    const name = building.building_name?.trim();
                    if (!name)
                        continue;
                    const result = await upsertLocation({
                        location_id: building.is_new
                            ? null
                            : (building.building_id ?? null),
                        name,
                        type_code: 'building',
                        parent_location_id: campusLocationId,
                        parent_path: campusPath,
                        address: null,
                    });
                    buildingPathMap.set(result.location_id, result.path);
                }
                const incomingFloorIds = new Set((payload.floors || [])
                    .filter((f) => f.floor_id && !f.is_new)
                    .map((f) => Number(f.floor_id)));
                const existingFloors = await queryRunner.manager.query(`SELECT DISTINCT al.location_id
   FROM ${fullSchemaName}.asset_locations al
   INNER JOIN ${fullSchemaName}.location_branch_mapping map
      ON map.location_id = al.location_id
   WHERE map.branch_id = $1
     AND map.is_deleted = 0
     AND al.location_type_code = 'floor'
     AND al.is_deleted = 0`, [branchId]);
                for (const row of existingFloors) {
                    if (!incomingFloorIds.has(Number(row.location_id))) {
                        await softDeleteLocation(Number(row.location_id));
                    }
                }
                for (const floor of payload.floors || []) {
                    const floorLabel = floor.floor_label?.trim();
                    if (!floorLabel)
                        continue;
                    const buildingLocationId = floor.building_id ?? null;
                    const parentPath = buildingLocationId
                        ? (buildingPathMap.get(Number(buildingLocationId)) ?? campusPath)
                        : campusPath;
                    await upsertLocation({
                        location_id: floor.is_new ? null : (floor.floor_id ?? null),
                        name: floorLabel,
                        floor_no: floor.floor_no ?? null,
                        type_code: 'floor',
                        parent_location_id: buildingLocationId ?? campusLocationId,
                        parent_path: parentPath,
                        address: null,
                    });
                }
            }
            await queryRunner.commitTransaction();
            await this.redisService.delByPattern('organization-branches:*');
            await this.redisService.delByPattern('organization-branches-count:*');
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.BRANCH);
            return {
                ...savedBranch,
                message: 'Branch updated successfully',
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleteBranchById(branchIds, organizationId, req) {
        if (!Array.isArray(branchIds) || branchIds.length === 0) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.BAD_REQUEST, message: 'No Branch IDs provided' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        const schemaName = req?.cookies['x-organization-schema'];
        let fullSchemaName = 'public';
        if (schemaName) {
            try {
                const decryptedSchemaName = (0, crypto_utils_1.decrypt)(schemaName);
                if (decryptedSchemaName) {
                    fullSchemaName = `org_${decryptedSchemaName}`;
                }
            }
            catch (err) {
                console.error('Schema decrypt error:', err.message);
            }
        }
        await queryRunner.startTransaction();
        const deletedBranches = [];
        const failedBranches = [];
        try {
            await queryRunner.query(`SET search_path TO ${fullSchemaName};`);
            for (const branch_id of branchIds) {
                try {
                    const existingBranch = await queryRunner.manager.findOne(branches_entity_1.Branch, {
                        where: { branch_id },
                    });
                    if (!existingBranch) {
                        failedBranches.push({
                            branch_id,
                            message: `Branch with ID ${branch_id} not found`,
                        });
                        continue;
                    }
                    const assetExists = await queryRunner.manager
                        .createQueryBuilder()
                        .select('1')
                        .from(asset_mapping_entity_1.AssetMappingRepository, 'mapping')
                        .where('mapping.target_type = :type', {
                        type: asset_mapping_entity_1.AssignTargetType.BRANCH,
                    })
                        .andWhere('mapping.target_id = :branchId', {
                        branchId: branch_id,
                    })
                        .andWhere('mapping.is_deleted = 0')
                        .limit(1)
                        .getRawOne();
                    const locationExists = await queryRunner.manager
                        .createQueryBuilder()
                        .select('1')
                        .from(locations_entity_1.Locations, 'loc')
                        .where('loc.branch_id = :branchId', { branchId: branch_id })
                        .andWhere('loc.is_deleted = 0')
                        .limit(1)
                        .getRawOne();
                    if (assetExists || locationExists) {
                        failedBranches.push({
                            branch_id,
                            message: 'Branch cannot be deleted because assets or locations exist under this branch.',
                        });
                        continue;
                    }
                    existingBranch.is_active = 0;
                    existingBranch.is_deleted = 1;
                    existingBranch.updated_at = new Date();
                    await queryRunner.manager.save(existingBranch);
                    await queryRunner.query(`UPDATE ${fullSchemaName}.location_branch_mapping
   SET is_deleted = 1,
       is_active = 0,
       updated_at = NOW()
   WHERE branch_id = $1 AND is_deleted = 0`, [branch_id]);
                    deletedBranches.push({
                        branch_id,
                        message: `Branch with ID ${branch_id} deactivated and deleted.`,
                    });
                }
                catch (error) {
                    failedBranches.push({
                        branch_id,
                        message: `Error deleting branch ${branch_id}: ${error.message}`,
                    });
                }
            }
            const totalBranches = await queryRunner.manager.count(branches_entity_1.Branch, {
                where: { is_deleted: 0 },
            });
            const enableFeatureRestriction = process.env.ENABLE_FEATURE_RESTRICTION === 'true';
            const featureIdForBranchCreation = 1;
            if (enableFeatureRestriction && deletedBranches.length > 0) {
                try {
                    const decrementCount = deletedBranches.length;
                    await usage_util_1.UsageUtil.updateUsageCountInBothPortals(organizationId, featureIdForBranchCreation, `decrement:${decrementCount}`);
                    console.log(`✅ Usage count decremented by ${decrementCount}.`);
                }
                catch (updateError) {
                    console.error('⚠️ Failed to decrement usage count:', updateError.message);
                }
            }
            await queryRunner.commitTransaction();
            await this.redisService.delByPattern('organization-branches:*');
            await this.redisService.delByPattern('organization-branches-count:*');
            await this.redisService.delByPattern('orgnizationprofile-getcounts:*');
            if (deletedBranches.length > 0) {
                await this.dropdownCache.invalidateMany([
                    dropdown_entities_1.DROPDOWN.BRANCH,
                    dropdown_entities_1.DROPDOWN.USER,
                ]);
            }
            return {
                success: true,
                totalDeleted: deletedBranches.length,
                totalFailed: failedBranches.length,
                deleted: deletedBranches,
                failed: failedBranches,
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async activateBranches(branchIds, systemUserId) {
        const results = [];
        const branchesToActivate = [];
        for (const id of branchIds) {
            const branch = await this.branchRepository.findOne({
                where: { branch_id: id, is_deleted: 0 },
            });
            if (!branch) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Branch not found.',
                    name: `ID ${id}`,
                });
                continue;
            }
            if (branch.is_active === 1) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Branch is already active.',
                    name: branch.branch_name,
                });
                continue;
            }
            branchesToActivate.push(branch);
            results.push({
                id,
                status: 'success',
                name: branch.branch_name,
            });
        }
        if (branchesToActivate.length > 0) {
            await this.branchRepository
                .createQueryBuilder()
                .update()
                .set({ is_active: 1 })
                .where('branch_id IN (:...ids)', {
                ids: branchesToActivate.map((b) => b.branch_id),
            })
                .execute();
        }
        const successful = results.filter((r) => r.status === 'success');
        let message = '';
        if (successful.length === 1) {
            message = `Branch ${successful[0].name} marked as active.`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} branches marked as active.`;
        }
        else {
            message = 'No branches were marked as active.';
        }
        await this.redisService.delByPattern('organization-branches:*');
        await this.redisService.delByPattern('organization-branches-count:*');
        await this.redisService.delByPattern('orgnizationprofile-getcounts:*');
        if (branchesToActivate.length > 0) {
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.BRANCH);
        }
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async deactivateBranches(branchIds, systemUserId) {
        const results = [];
        const branchesToDeactivate = [];
        for (const id of branchIds) {
            const branch = await this.branchRepository.findOne({
                where: { branch_id: id, is_deleted: 0 },
            });
            if (!branch) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Branch not found.',
                    name: `ID ${id}`,
                });
                continue;
            }
            if (branch.is_active === 0) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Branch is already inactive.',
                    name: branch.branch_name,
                });
                continue;
            }
            const assetExists = await this.assetViewRepo
                .createQueryBuilder('v')
                .where(`(v.target_type = :type AND v.target_id = :branchId)
            OR v.location_branch_id = :branchId`, { type: 'BRANCH', branchId: id })
                .andWhere('v.asset_is_active = 1')
                .select('1')
                .limit(1)
                .getRawOne();
            if (assetExists) {
                results.push({
                    id,
                    status: 'failed',
                    message: 'Branch has assigned assets. Cannot deactivate.',
                    name: branch.branch_name,
                });
                continue;
            }
            branchesToDeactivate.push(branch);
            results.push({
                id,
                status: 'success',
                name: branch.branch_name,
            });
        }
        if (branchesToDeactivate.length > 0) {
            await this.branchRepository
                .createQueryBuilder()
                .update()
                .set({ is_active: 0 })
                .where('branch_id IN (:...ids)', {
                ids: branchesToDeactivate.map((b) => b.branch_id),
            })
                .execute();
        }
        const successful = results.filter((r) => r.status === 'success');
        const failed = results.filter((r) => r.status === 'failed');
        let message = '';
        if (failed.length > 0) {
            message =
                'One or more branches have assigned assets, so they cannot be deactivated.';
        }
        else if (successful.length === 1) {
            message = `Branch ${successful[0].name} marked as inactive.`;
        }
        else if (successful.length > 1) {
            message = `${successful.length} branches marked as inactive.`;
        }
        else {
            message = 'No branches were processed.';
        }
        await this.redisService.delByPattern('organization-branches:*');
        await this.redisService.delByPattern('organization-branches-count:*');
        await this.redisService.delByPattern('orgnizationprofile-getcounts:*:*');
        if (branchesToDeactivate.length > 0) {
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.BRANCH);
        }
        return {
            success: successful.length > 0,
            message,
            details: results,
        };
    }
    async getOrganizationBranchesList(dto, branchIds = []) {
        try {
            console.log('BRANCH DTO', dto);
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const knownTotalRaw = dto?.knownTotal ?? dto?.known_total;
            const knownTotalVal = knownTotalRaw != null && !Number.isNaN(Number(knownTotalRaw))
                ? Number(knownTotalRaw)
                : null;
            const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
            const direction = d.direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = Boolean(d.jumpToLast || dto.isLastPageMode);
            if (jumpToLast) {
                dto.isLastPageMode = true;
            }
            const jumpPage = d.page ? Number(d.page) : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
            const cacheKey = (0, cache_service_helper_1.buildListCacheKey)({
                prefix: 'organization-branches',
                dto: dto,
                schema: dto.schema,
                login_user_id: dto.login_user_id,
            });
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                console.log('✅ BRANCH CACHE HIT');
                return cached;
            }
            console.log('❌ BRANCH CACHE MISS');
            const applySearchAndFilters = (qb) => {
                searchArray.forEach((s, index) => {
                    if (!s.values?.length)
                        return;
                    const value = s.values.join(' ');
                    qb.andWhere(`(
            branch.branch_name ILIKE :s${index}
            OR branch.branch_code ILIKE :s${index}
            OR branch.city ILIKE :s${index}
            OR branch.state ILIKE :s${index}
            OR branch.country ILIKE :s${index}
            OR branch.branch_email ILIKE :s${index}
            OR CAST(branch.branch_id AS TEXT) ILIKE :s${index}
          )`, { [`s${index}`]: `%${value}%` });
                });
                for (const f of filters) {
                    if (!f.values?.length)
                        continue;
                    const cleaned = f.values
                        .map((v) => String(v))
                        .filter((v) => v.toLowerCase() !== 'all' && v !== 'NaN');
                    if (!cleaned.length)
                        continue;
                    switch (f.column) {
                        case 'is_active':
                            qb.andWhere('branch.is_active IN (:...is_active)', {
                                is_active: cleaned.map(Number),
                            });
                            break;
                    }
                }
                if (branchIds.length) {
                    qb.andWhere('branch.branch_id IN (:...branchIds)', { branchIds });
                }
            };
            const buildBaseQuery = (qb) => {
                return qb
                    .select([
                    'branch.branch_id AS branch_id',
                    'branch.branch_code AS branch_code',
                    'branch.branch_name AS branch_name',
                    'branch.occupancy_type_code AS type_code',
                    'branch.is_active AS is_active',
                    'COALESCE(asset_counts.asset_count, 0) AS asset_count',
                ])
                    .leftJoin(branch_asset_counts_view_1.BranchAssetCountsView, 'asset_counts', 'asset_counts.branch_id = branch.branch_id')
                    .where('branch.is_deleted = :deleted', { deleted: 0 });
            };
            const countKey = 'organization-branches-count:' +
                JSON.stringify({ search: searchArray, filters, branchIds });
            const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => {
                const countQb = buildBaseQuery(this.branchRepository.createQueryBuilder('branch'));
                applySearchAndFilters(countQb);
                return countQb.getCount();
            }, 30, knownTotalVal);
            const qb = buildBaseQuery(this.branchRepository.createQueryBuilder('branch'));
            applySearchAndFilters(qb);
            const sortableMap = {
                branch_id: 'branch.branch_id',
                branch_code: 'branch.branch_code',
                branch_name: 'branch.branch_name',
                is_active: 'branch.is_active',
                asset_count: 'asset_counts.asset_count',
            };
            const idColumn = 'branch_id';
            const idDbColumn = 'branch.branch_id';
            const defaultSort = { column: 'branch_id', order: 'DESC' };
            if (dto.getAll === true) {
                (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'next',
                });
                const rawRows = await qb.getRawMany();
                console.log("rawRows", rawRows);
                const mergedRows = rawRows.map((row) => ({
                    branch_id: Number(row.branch_id),
                    branch_code: row.branch_code,
                    branch_name: row.branch_name,
                    type_code: row.type_code,
                    is_active: Number(row.is_active),
                    asset_count: Number(row.asset_count || 0),
                }));
                console.log("mergedRows", mergedRows);
                const total = mergedRows.length;
                const response = {
                    success: true,
                    message: total
                        ? 'Branches fetched successfully'
                        : 'No branches found',
                    data: mergedRows,
                    meta: {
                        total,
                        totalPages: 1,
                        currentPage: 1,
                        limit: total,
                        count: total,
                        hasNextPage: false,
                        hasPrevPage: false,
                        startCursor: null,
                        endCursor: null,
                        nextCursor: null,
                        prevCursor: null,
                    },
                };
                await this.redisService.set(cacheKey, response, 30);
                return response;
            }
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'prev',
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'next',
                });
                (0, keyset_pagination_1.applyOffsetRaw)(qb, jumpPage, limit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: cursorToken,
                    direction,
                });
            }
            const rawRows = usingOffset
                ? await qb.getRawMany()
                : await qb.limit(limit + 1).getRawMany();
            const mergedRows = rawRows.map((row) => ({
                branch_id: Number(row.branch_id),
                branch_code: row.branch_code,
                branch_name: row.branch_name,
                type_code: row.type_code,
                is_active: Number(row.is_active),
                asset_count: Number(row.asset_count || 0),
            }));
            const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
            let data;
            let meta;
            if (usingOffset) {
                data = mergedRows;
                const firstRow = data[0];
                const lastRow = data[data.length - 1];
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page: {
                        data,
                        startCursor: firstRow
                            ? (0, keyset_pagination_1.encodeCursor)({
                                v: firstRow[plan.sortColumn] ?? null,
                                id: firstRow[idColumn],
                            })
                            : null,
                        endCursor: lastRow
                            ? (0, keyset_pagination_1.encodeCursor)({
                                v: lastRow[plan.sortColumn] ?? null,
                                id: lastRow[idColumn],
                            })
                            : null,
                        hasNextPage: jumpPage < totalPages,
                        hasPrevPage: jumpPage > 1,
                    },
                    limit,
                    total,
                    currentPage: jumpPage,
                });
            }
            else {
                const page = (0, keyset_pagination_1.finalizePage)({
                    rows: mergedRows,
                    limit,
                    plan,
                    idColumn,
                    hadCursor: !!cursorToken,
                });
                data = page.data;
                if (jumpToLast) {
                    page.hasNextPage = false;
                    page.hasPrevPage = total > data.length;
                }
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page,
                    limit,
                    total,
                    currentPage: jumpToLast ? totalPages : 1,
                });
            }
            const response = {
                success: true,
                message: data.length
                    ? 'Branches fetched successfully'
                    : 'No branches found',
                data,
                meta,
            };
            await this.redisService.set(cacheKey, response, 300);
            return response;
        }
        catch (error) {
            console.error('getOrganizationBranchesList ERROR:', error);
            throw error;
        }
    }
    async getAllBranchesforDropdown(branchIds = []) {
        return this.dropdownCache.getOrSet(dropdown_entities_1.DROPDOWN.BRANCH, { variant: 'all', branchIds }, async () => {
            const qb = this.branchRepository
                .createQueryBuilder('branch')
                .select([
                'branch.branch_id',
                'branch.branch_name',
                'branch.city',
                'branch.state',
                'branch.occupancy_type_code',
            ])
                .where('branch.is_deleted = :deleted', { deleted: 0 })
                .andWhere('branch.is_active = :isActive', { isActive: 1 })
                .orderBy('branch.branch_name', 'ASC');
            (0, branch_access_1.applyBranchFilter)({
                qb,
                entityKey: 'Branch',
                branchIds,
            });
            const branches = await qb.getMany();
            const branchIdsList = branches.map((b) => b.branch_id);
            return branches.map((b) => ({
                value: b.branch_id,
                label: b.branch_name,
                city: b.city,
                state: b.state,
                occupancy_type_code: b.occupancy_type_code ?? null,
            }));
        });
    }
    async bulkImportBranches(dtos, organizationId, userId) {
        const successBranches = [];
        const errorBranches = [];
        const localUserId = await this.getUserByPublicID(+userId);
        const existingBranches = await this.branchRepository.find({
            where: { is_active: 1, is_deleted: 0 },
        });
        const branchNameSet = new Set(existingBranches.map(b => b.branch_name?.trim().toLowerCase()));
        let lastCount = await this.branchRepository.count();
        const enableFeatureRestriction = process.env.ENABLE_FEATURE_RESTRICTION === 'true';
        let maxBranches = null;
        let totalBranches = 0;
        if (enableFeatureRestriction) {
            const { assetRestriction, billingRestriction } = await restriction_util_1.RestrictionUtil.checkRestrictionAndLimitation(organizationId, 1);
            if (billingRestriction?.value) {
                maxBranches = Number(billingRestriction.value);
            }
            else if (assetRestriction?.overrideValue) {
                maxBranches = Number(assetRestriction.overrideValue);
            }
            totalBranches = await this.branchRepository.count({
                where: { is_deleted: 0 },
            });
        }
        const branchPayloads = [];
        for (const dto of dtos) {
            try {
                if (!dto.branch_name || typeof dto.branch_name !== 'string') {
                    throw new Error('Branch name is required.');
                }
                const branchName = dto.branch_name.trim().toLowerCase();
                if (branchNameSet.has(branchName)) {
                    throw new Error(`Branch '${dto.branch_name}' already exists.`);
                }
                branchNameSet.add(branchName);
                if (dto.pincode && !/^\d{6}$/.test(dto.pincode)) {
                    throw new Error('Pincode must be 6-digit.');
                }
                if (dto.country && dto.country !== 'India') {
                    throw new Error('Country must be India.');
                }
                if (enableFeatureRestriction && maxBranches !== null) {
                    if (totalBranches >= maxBranches) {
                        throw new common_1.HttpException(`🚫 Branch creation limit reached — max ${maxBranches}`, common_1.HttpStatus.FORBIDDEN);
                    }
                    totalBranches++;
                }
                lastCount++;
                const branchCode = `BR-${String(lastCount).padStart(3, '0')}`;
                branchPayloads.push({
                    branch_code: branchCode,
                    branch_name: dto.branch_name,
                    branch_street: this.sanitize(dto.branch_street),
                    branch_landmark: this.sanitize(dto.branch_landmark),
                    city: this.sanitize(dto.city),
                    state: this.sanitize(dto.state),
                    pincode: this.sanitize(dto.pincode),
                    country: this.sanitize(dto.country),
                    city_id: this.sanitize(dto.city_id),
                    country_id: this.sanitize(dto.country_id),
                    location_id: this.sanitize(dto.location_id),
                    gst_no: this.sanitize(dto.gstNo),
                    alternative_contact_number: this.sanitize(dto.alternative_contact_number),
                    established_date: this.sanitize(dto.established_date) ?? new Date(),
                    organization_id: organizationId,
                    created_by: localUserId,
                    is_active: 1,
                    is_deleted: 0,
                });
            }
            catch (err) {
                errorBranches.push({
                    ...dto,
                    reason: err.message || 'Unknown error',
                });
            }
        }
        let insertedBranches = [];
        if (branchPayloads.length > 0) {
            const result = await this.branchRepository
                .createQueryBuilder()
                .insert()
                .into('branches')
                .values(branchPayloads)
                .returning('*')
                .execute();
            insertedBranches = result.raw;
            successBranches.push(...insertedBranches);
            for (const branch of insertedBranches) {
                const existingLocation = await this.locationRepository.findOne({
                    where: {
                        location_name: branch.branch_name,
                        location_type_code: 'branch',
                        is_deleted: 0,
                    },
                });
                if (!existingLocation) {
                    const branchLocation = this.locationRepository.create({
                        location_name: branch.branch_name,
                        location_type_code: 'branch',
                        location_type_entity_id: branch.branch_id,
                        created_by: localUserId,
                        is_active: 1,
                        is_deleted: 0,
                    });
                    const savedLocation = await this.locationRepository.save(branchLocation);
                    savedLocation.path = `/${savedLocation.location_id}/`;
                    await this.locationRepository.save(savedLocation);
                    await this.locationBranchMappingRepository.save({
                        location_id: savedLocation.location_id,
                        branch_id: branch.branch_id,
                        type_id: savedLocation.location_type_id,
                        is_active: 1,
                        is_deleted: 0,
                    });
                }
            }
        }
        if (enableFeatureRestriction) {
            try {
                await usage_util_1.UsageUtil.updateUsageCountInBothPortals(organizationId, 1, totalBranches.toString());
            }
            catch (err) {
                console.error('Usage update failed:', err.message);
            }
        }
        const totalBranchesNow = await this.branchRepository
            .createQueryBuilder('branch')
            .where('branch.is_deleted = 0')
            .getCount();
        await this.recordMetric('total_branches', totalBranchesNow);
        const BRANCH_CREATION_EVENT_ID = 55;
        console.log("point:13");
        const createdUser = await this.userRepository
            .createQueryBuilder("users")
            .where("users.user_id = :userId", { userId: localUserId })
            .getOne();
        console.log("point:14");
        const successCount = successBranches.length;
        const contextData = {
            updatedUser: {
                first_name: createdUser?.first_name,
                last_name: createdUser?.last_name,
            },
            assetStockSerial: {
                quantity: successCount,
            },
        };
        console.log("point:15");
        const recipients = [];
        if (createdUser?.users_business_email) {
            recipients.push({
                recipient_type: "user",
                recipient_id: String(createdUser.user_id),
                recipient_email: createdUser.users_business_email,
            });
        }
        console.log("point:16");
        await this.notificationHelper.triggerEventNotification({
            eventId: BRANCH_CREATION_EVENT_ID,
            contextData,
            recipients,
            meta: {
                trace_id: `BRANCH_BULK_${Date.now()}`,
            },
        });
        let updatedAccess;
        if (insertedBranches.length > 0) {
            const SUPER_ADMIN_ROLE_ID = 1;
            const superAdmins = await this.userRepository.find({
                where: {
                    role_id: SUPER_ADMIN_ROLE_ID,
                    is_deleted: 0,
                },
            });
            const newBranchIds = insertedBranches.map(b => b.branch_id);
            for (const admin of superAdmins) {
                const existingAccess = admin.branch_access || [];
                updatedAccess = Array.from(new Set([...existingAccess, ...newBranchIds]));
                await this.userRepository.update(admin.user_id, {
                    branch_access: updatedAccess,
                });
            }
        }
        try {
            this.redisService.delByPattern('organization-branches:*');
            this.redisService.delByPattern('organization-branches-count:*');
            this.redisService.delByPattern('orgnizationprofile-getcounts:*');
            this.refreshStockSummaryFromContext();
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.BRANCH);
        }
        catch (cacheErr) {
            console.error('⚠️ Branch saved, but post-commit cache invalidation failed:', cacheErr?.message ?? cacheErr);
        }
        return {
            status: successBranches.length
                ? common_1.HttpStatus.CREATED
                : common_1.HttpStatus.CONFLICT,
            message: successBranches.length && errorBranches.length
                ? 'Bulk branches created with some conflicts.'
                : successBranches.length
                    ? 'All branches created successfully.'
                    : 'No branches created.',
            data: {
                created_count: successBranches.length,
                created_records: successBranches,
                error_records: errorBranches,
                branch_access: updatedAccess
            },
        };
    }
    async downloadBranchImportTemplate() {
        try {
            const workbook = await XlsxPopulate.fromBlankAsync();
            const mainSheet = workbook.sheet(0);
            mainSheet.name('Branch_Template');
            const dataSheet = workbook.addSheet('Data');
            const instructions = [
                'Instructions:',
                '1. Fill in the fields starting from row 8.',
                '2. Dropdown fields: State, Country.',
                '3. Do not edit the header row (Row 7).',
                '4. Branch Name is mandatory.',
            ];
            instructions.forEach((text, index) => {
                mainSheet
                    .cell(index + 1, 1)
                    .value(text)
                    .style({ bold: true, fontColor: '0000FF' });
            });
            const headers = [
                { label: 'Branch Name', required: true },
                { label: 'Street', required: false },
                { label: 'Landmark', required: false },
                { label: 'City', required: false },
                { label: 'State', required: false },
                { label: 'Pincode', required: false },
                { label: 'Country', required: false },
            ];
            const columnWidths = [25, 25, 25, 25, 25, 25, 25];
            columnWidths.forEach((width, index) => {
                mainSheet.column(index + 1).width(width);
            });
            headers.forEach((item, index) => {
                const cell = mainSheet.cell(7, index + 1);
                cell.value(item.label).style({ bold: true });
                if (item.required) {
                    cell.style({ fill: 'FFCCCC' });
                }
            });
            const states = [
                'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
                'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
                'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
                'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
                'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
            ];
            const countries = ['India'];
            states.forEach((state, index) => dataSheet.cell(index + 1, 1).value(state));
            countries.forEach((country, index) => dataSheet.cell(index + 1, 2).value(country));
            const startRow = 8;
            const maxRow = 5000;
            mainSheet.range(`E${startRow}:E${maxRow}`).dataValidation({
                type: 'list',
                formula1: `Data!$A$1:$A$${states.length}`,
                allowBlank: true,
            });
            mainSheet.range(`G${startRow}:G${maxRow}`).dataValidation({
                type: 'list',
                formula1: `Data!$B$1:$B$${countries.length}`,
                allowBlank: true,
            });
            dataSheet.hidden(true);
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('Error generating branch template:', error);
            throw new Error('Failed to generate Excel branch template');
        }
    }
    async exportOrganizationBranchesExcel(dto) {
        try {
            const searchArray = dto.search || [];
            const filters = dto.filters || [];
            const sortArray = dto.sort || [];
            const visibleColumns = dto.visible_columns || {};
            const rangeFilters = dto.range_filters || [];
            const dateBetween = dto.date_between;
            const selectedIds = dto.selectedIds || [];
            const isSelectAll = dto.isSelectAll;
            const excludeIds = dto.excludeIds || [];
            const intColumns = [
                'branch_id',
                'city_id',
                'country_id',
                'location_id',
                'is_active',
                'pincode',
            ];
            const qb = this.branchRepository
                .createQueryBuilder('branch')
                .where('branch.is_deleted = :deleted', { deleted: 0 });
            const baseSelect = [
                'branch.branch_id',
                'branch.branch_name',
                'branch.branch_code',
                'branch.is_active',
                'branch.created_at',
                'branch.updated_at',
                'branch.gst_no',
                'branch.city_id',
                'branch.country_id',
                'branch.branch_street',
                'branch.branch_landmark',
                'branch.city',
                'branch.state',
                'branch.country',
                'branch.pincode',
                'branch.established_date',
                'branch.contact_number',
                'branch.branch_email',
                'branch.alternative_contact_number',
            ];
            if (Object.keys(visibleColumns).length > 0) {
                Object.entries(visibleColumns).forEach(([col, show]) => {
                    if (show)
                        baseSelect.push(`branch.${col}`);
                });
            }
            qb.select(baseSelect);
            qb.addSelect((subQuery) => {
                return subQuery
                    .select('COUNT(DISTINCT serial_view.asset_stocks_unique_id)')
                    .from(v_asset_stock_serials_view_entity_1.AssetStockSerialsView, 'serial_view')
                    .where('serial_view.location_branch_id = branch.branch_id')
                    .andWhere('serial_view.asset_is_active = 1');
            }, 'asset_count');
            if (isSelectAll) {
                if (excludeIds.length) {
                    const numericExcludeIds = excludeIds.map(Number).filter((n) => !isNaN(n));
                    if (numericExcludeIds.length) {
                        qb.andWhere('branch.branch_id NOT IN (:...numericExcludeIds)', { numericExcludeIds });
                    }
                }
            }
            else if (selectedIds.length) {
                const numericSelectedIds = selectedIds.map(Number).filter((n) => !isNaN(n));
                if (numericSelectedIds.length) {
                    qb.andWhere('branch.branch_id IN (:...numericSelectedIds)', { numericSelectedIds });
                }
            }
            searchArray.forEach((s, i) => {
                if (!s.values?.length)
                    return;
                const val = s.values.join(' ');
                qb.andWhere(`(
          branch.branch_name ILIKE :s${i} OR
          branch.branch_code ILIKE :s${i} OR
          branch.city ILIKE :s${i} OR
          branch.state ILIKE :s${i} OR
          branch.country ILIKE :s${i} OR
          branch.branch_email ILIKE :s${i} OR
          CAST(branch.branch_id AS TEXT) ILIKE :s${i}
        )`, { [`s${i}`]: `%${val}%` });
            });
            for (const f of filters) {
                if (!f.values?.length)
                    continue;
                const isInt = intColumns.includes(f.column);
                const values = isInt ? f.values.map(Number) : f.values;
                if (isInt) {
                    qb.andWhere(`branch.${f.column} IN (:...${f.column})`, {
                        [f.column]: values,
                    });
                }
                else {
                    qb.andWhere(new typeorm_2.Brackets((qb2) => {
                        values.forEach((v, i) => {
                            qb2.orWhere(`branch.${f.column} ILIKE :${f.column}_${i}`, {
                                [`${f.column}_${i}`]: `%${v}%`,
                            });
                        });
                    }));
                }
            }
            if (dateBetween?.column && dateBetween?.date) {
                const [colStart, colEnd] = dateBetween.column.split(',');
                const d = new Date(dateBetween.date);
                const start = new Date(d);
                start.setHours(0, 0, 0, 0);
                const end = new Date(d);
                end.setHours(23, 59, 59, 999);
                qb.andWhere(`(branch.${colStart} BETWEEN :start AND :end OR 
          branch.${colEnd} BETWEEN :start AND :end)`, { start, end });
            }
            for (const rf of rangeFilters) {
                if (!rf.column)
                    continue;
                if (rf.from !== undefined) {
                    qb.andWhere(`branch.${rf.column} >= :from_${rf.column}`, {
                        [`from_${rf.column}`]: rf.from,
                    });
                }
                if (rf.to !== undefined) {
                    qb.andWhere(`branch.${rf.column} <= :to_${rf.column}`, {
                        [`to_${rf.column}`]: rf.to,
                    });
                }
            }
            if (sortArray.length > 0) {
                sortArray.forEach((s) => {
                    qb.addOrderBy(`branch.${s.column}`, s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
                });
            }
            else {
                qb.orderBy('branch.branch_id', 'DESC');
            }
            const { entities, raw } = await qb.getRawAndEntities();
            const results = entities.map((branch, i) => ({
                ...branch,
                asset_count: Number(raw[i]?.asset_count || 0),
            }));
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('Branches');
            const headers = [
                'Sr. No.',
                'Branch Code',
                'Branch Name',
                'Status',
                'Assets',
            ];
            headers.forEach((h, i) => sheet
                .cell(1, i + 1)
                .value(h)
                .style({ bold: true }));
            results.forEach((branch, i) => {
                const row = i + 2;
                sheet.cell(row, 1).value(i + 1);
                sheet.cell(row, 2).value(branch.branch_code || '');
                sheet.cell(row, 3).value(branch.branch_name || '');
                sheet.cell(row, 4).value(branch.is_active ? 'Active' : 'Inactive');
                sheet.cell(row, 5).value(branch.asset_count || 0);
            });
            headers.forEach((_, i) => sheet.column(i + 1).width(headers[i].length + 12));
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('exportOrganizationBranchesExcel ERROR:', error);
            throw error;
        }
    }
    async findPincodeviaStateAndCity(pincode) {
        return this.pincodesRepository.findOne({
            where: { pincode },
            select: ['city', 'state'],
        });
    }
    async recordMetric(metric, value) {
        return this.orgStatRepository.save({
            metric,
            value,
        });
    }
    async getOverview() {
        const metrics = [
            'total_users',
            'total_branches',
            'total_departments',
            'total_locations',
        ];
        const result = {};
        for (const metric of metrics) {
            const records = await this.orgStatRepository.find({
                where: { metric },
                order: { recorded_at: 'DESC' },
                take: 2,
            });
            if (records.length === 0) {
                result[metric] = { value: 0, trend: 'stable' };
                continue;
            }
            const latest = records[0].value;
            const prev = records[1]?.value ?? latest;
            let trend = 'stable';
            if (latest > prev)
                trend = 'up';
            else if (latest < prev)
                trend = 'down';
            result[metric] = { value: latest, trend };
        }
        return result;
    }
    async getWeeklyOverview() {
        const metrics = [
            'total_users',
            'total_branches',
            'total_departments',
            'total_locations',
            'total_assets',
        ];
        const result = {};
        const now = new Date();
        const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        for (const metric of metrics) {
            const thisWeek = await this.orgStatRepository.findOne({
                where: {
                    metric,
                    recorded_at: (0, typeorm_3.MoreThan)(thisWeekStart),
                },
                order: { recorded_at: 'DESC' },
            });
            const lastWeek = await this.orgStatRepository.findOne({
                where: {
                    metric,
                    recorded_at: (0, typeorm_2.LessThan)(thisWeekStart),
                },
                order: { recorded_at: 'DESC' },
            });
            const latestValue = thisWeek?.value ?? 0;
            const prevValue = lastWeek?.value ?? 0;
            let trend = 'stable';
            let percent = 0;
            if (prevValue > 0) {
                percent = ((latestValue - prevValue) / prevValue) * 100;
            }
            else if (latestValue > 0) {
                percent = 100;
            }
            if (percent > 0)
                trend = 'up';
            else if (percent < 0)
                trend = 'down';
            result[metric] = {
                value: latestValue,
                trend,
                percentage: Math.round(percent),
            };
        }
        return result;
    }
    async bulkCreateUsers(dtos, organizationId, createdBy) {
        console.log('SPS:1', dtos);
        const userId = await this.getUserIdByRegisterLoginId(createdBy);
        const successUsers = [];
        const errorUsers = [];
        if (!organizationId || isNaN(organizationId)) {
            throw new Error('Invalid organization ID');
        }
        console.log('NEW CODE RUNNING');
        const branchResponse = await this.getAllOrganizationBranches();
        const branches = branchResponse.data;
        const departmentResponse = await this.getAllDepartmentAndItsDegination();
        const departments = departmentResponse.data;
        const rolesResponse = await this.fetchOrganizationRoles();
        const roles = rolesResponse.data;
        const primaryUserLogin = await this.registerUser.findOne({
            where: {
                organization_id: organizationId,
                is_primary_user: 'Y',
                is_deleted: 0,
            },
        });
        if (!primaryUserLogin) {
            throw new Error('Primary user not found');
        }
        const orgBillingId = primaryUserLogin.org_billing_id;
        const creatorUser = await this.userRepository
            .createQueryBuilder('user')
            .where('user.user_id = :userId', { userId })
            .getOne();
        const OrgData = await this.registerOrganization
            .createQueryBuilder('org')
            .where('org.organization_id = :organizationId', { organizationId })
            .getOne();
        const existingUsers = await this.registerUser.find({
            select: ['business_email'],
        });
        const existingEmailSet = new Set(existingUsers
            .filter((user) => user.business_email)
            .map((user) => user.business_email.toLowerCase()));
        const featureIdForUserCreation = 3;
        const enableFeatureRestriction = process.env.ENABLE_FEATURE_RESTRICTION === 'true';
        let maxUsers = null;
        let remainingSlots = Infinity;
        let totalUsersBefore = 0;
        if (enableFeatureRestriction) {
            const { assetRestriction, billingRestriction } = await restriction_util_1.RestrictionUtil.checkRestrictionAndLimitation(organizationId, featureIdForUserCreation);
            if (billingRestriction?.value) {
                maxUsers = Number(billingRestriction.value);
            }
            else if (assetRestriction?.overrideValue) {
                maxUsers = Number(assetRestriction.overrideValue);
            }
            if (maxUsers !== null) {
                totalUsersBefore = await this.userRepository.count({
                    where: {
                        organization_id: organizationId,
                        is_deleted: 0,
                    },
                });
                remainingSlots = maxUsers - totalUsersBefore;
                if (remainingSlots <= 0) {
                    throw new common_1.HttpException(`User creation failed: subscription limit reached. Your plan allows a maximum of ${maxUsers} users. You already have ${totalUsersBefore} users. Please upgrade your subscription to add more users.`, common_1.HttpStatus.FORBIDDEN);
                }
            }
        }
        const registerUserPayloads = [];
        const validUserMeta = [];
        const notificationQueue = [];
        let createdCount = 0;
        console.time('OPRATION START');
        for (const dto of dtos) {
            try {
                if (enableFeatureRestriction &&
                    maxUsers !== null &&
                    createdCount >= remainingSlots) {
                    errorUsers.push({
                        ...dto,
                        reason: `Subscription limit exceeded. Your plan allows a maximum of ${maxUsers} users. Cannot add more users.`,
                    });
                    continue;
                }
                if (!dto.first_name?.trim()) {
                    errorUsers.push({
                        ...dto,
                        reason: 'First Name is required',
                    });
                    continue;
                }
                const email = dto.users_business_email || dto.email || dto.email_address || null;
                if (!email) {
                    errorUsers.push({
                        ...dto,
                        reason: 'Email is required',
                    });
                    continue;
                }
                if (existingEmailSet.has(email.toLowerCase())) {
                    errorUsers.push({
                        ...dto,
                        reason: `Email '${email}' already exists`,
                    });
                    continue;
                }
                existingEmailSet.add(email.toLowerCase());
                const branch = branches.find((b) => b.label.toLowerCase() ===
                    (dto.branch_name || dto.branch || '').toLowerCase());
                const departmentEntry = departments.find((d) => d.label.toLowerCase() ===
                    (dto.department_name || dto.department || '').toLowerCase());
                let designationEntry = null;
                if (departmentEntry?.children?.length) {
                    designationEntry = departmentEntry.children.find((des) => des.designationName.toLowerCase() ===
                        (dto.designation_name || dto.designation || '').toLowerCase());
                }
                const role = roles.find((r) => r.role_name.toLowerCase() ===
                    (dto.role_name || dto.role || '').toLowerCase());
                const loginPayload = this.registerUser.create({
                    first_name: dto.first_name,
                    last_name: dto.last_name,
                    business_email: email,
                    phone_number: dto.phone_number || dto.phone || null,
                    organization_id: organizationId,
                    org_billing_id: orgBillingId,
                    invite_status: register_user_login_entity_1.InviteStatus.INVITED,
                    invite_expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000),
                    password: null,
                    verified: false,
                    passwordReset: 'Y',
                    is_primary_user: 'N',
                    organization: {
                        organization_id: organizationId,
                    },
                });
                registerUserPayloads.push(loginPayload);
                validUserMeta.push({
                    dto,
                    branch,
                    departmentEntry,
                    designationEntry,
                    role,
                    email,
                });
                createdCount++;
            }
            catch (error) {
                console.log('ERROR:', error.message);
                errorUsers.push({
                    ...dto,
                    reason: error.message,
                });
            }
        }
        console.timeEnd('OPRATION END');
        const savedUserLogins = await this.registerUser.save(registerUserPayloads);
        const userPayloads = [];
        for (let i = 0; i < savedUserLogins.length; i++) {
            const savedUserLogin = savedUserLogins[i];
            const meta = validUserMeta[i];
            const { dto, branch, departmentEntry, designationEntry, role, email } = meta;
            const newUser = this.userRepository.create({
                emp_id: dto.employee_id || dto.emp_id || null,
                created_by: userId,
                first_name: dto.first_name,
                middle_name: dto.middle_name || '',
                last_name: dto.last_name,
                users_business_email: email,
                phone_number: dto.phone_number || dto.phone || null,
                branch_id: branch?.value ?? null,
                role_id: role?.role_id ?? 4,
                designation_id: designationEntry?.designationId ?? null,
                department_id: departmentEntry?.value ?? null,
                organization_id: organizationId,
                register_user_login_id: savedUserLogin.user_id,
                is_department_head: ['yes', 'true', '1'].includes(dto.is_department_head?.toString().toLowerCase())
                    ? 1
                    : 0,
            });
            userPayloads.push(newUser);
        }
        const savedUsers = await this.userRepository.save(userPayloads);
        for (let i = 0; i < savedUsers.length; i++) {
            const savedUser = savedUsers[i];
            const savedUserLogin = savedUserLogins[i];
            const meta = validUserMeta[i];
            const formattedUserResponse = {
                ...savedUser,
                branch: meta.branch?.label || null,
                department: meta.departmentEntry?.label || null,
                designation: meta.designationEntry?.designationName || null,
                role: meta.role?.role_name || null,
                employee_id: savedUser.emp_id,
                is_department_head: savedUser.is_department_head === 1 ? 'Yes' : 'No',
            };
            successUsers.push(formattedUserResponse);
            notificationQueue.push({
                savedUser,
                savedUserLogin,
            });
        }
        console.log('REDIS UPDATE:USER-BULK-IMPORT');
        await this.redisService.delByPattern('organization-users:*');
        if (savedUsers.length > 0) {
            await this.dropdownCache.invalidate(dropdown_entities_1.DROPDOWN.USER);
        }
        if (enableFeatureRestriction) {
            const totalUsersAfterInsert = await this.userRepository.count({
                where: {
                    organization_id: organizationId,
                    is_deleted: 0,
                },
            });
            try {
                await usage_util_1.UsageUtil.updateUsageCountInBothPortals(organizationId, featureIdForUserCreation, totalUsersAfterInsert.toString());
                console.log('✅ Bulk user usage count updated');
            }
            catch (err) {
                console.error('⚠️ Usage update failed:', err.message);
            }
        }
        console.time(' notificationQueue OPRATION START');
        await Promise.all(notificationQueue.map(async ({ savedUser, savedUserLogin }) => {
            try {
                const recipients = [
                    {
                        recipient_type: 'user',
                        recipient_id: String(savedUser.user_id),
                        recipient_email: savedUser.users_business_email,
                        recipient_contact: savedUser.phone_number,
                    },
                ];
                const contextData = {
                    updatedUser: {
                        first_name: savedUser.first_name,
                        last_name: savedUser.last_name,
                        phone_number: savedUser.phone_number,
                        created_by: creatorUser
                            ? `${creatorUser.first_name} ${creatorUser.last_name}`
                            : '',
                        redirection_link: `${process.env.CLIENT_ORIGIN_URL}/set-forgot-password?userId=${savedUserLogin.user_id}`,
                        users_business_email: savedUserLogin.business_email,
                        temp_password: null,
                    },
                };
                await this.notificationHelper.triggerEventNotification({
                    eventId: 36,
                    contextData,
                    recipients,
                    meta: {
                        trace_id: `USER_CREATE_${savedUser.user_id}`,
                    },
                });
                console.log(`📧 Email sent to ${savedUser.users_business_email}`);
            }
            catch (error) {
                console.error(`⚠️ Email failed for ${savedUser.users_business_email}`, error.message);
            }
        }));
        console.timeEnd(' notificationQueue OPRATION START');
        return {
            status: successUsers.length ? common_1.HttpStatus.CREATED : common_1.HttpStatus.CONFLICT,
            data: {
                created_count: successUsers.length,
                created_records: successUsers,
                error_records: errorUsers,
            },
        };
    }
    async getAllLoginUserMyAssetData(dto, user_id) {
        console.time('GET_USER_ASSETS_TOTAL');
        console.log('user_id received:', user_id);
        try {
            const userId = typeof user_id === 'string' ? parseInt(user_id, 10) : user_id;
            if (isNaN(userId) || userId <= 0) {
                throw new common_1.BadRequestException('Invalid user_id');
            }
            console.time('INPUT');
            const d = dto;
            const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
            const searchArray = dto.search || [];
            const filtersArray = dto.filters || [];
            const sortArray = dto.sort || [];
            const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
            const direction = d.direction === 'prev' ? 'prev' : 'next';
            const jumpToLast = d.jumpToLast === true || dto.isLastPageMode === true;
            const jumpPage = d.page ? Number(d.page) : undefined;
            const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
            console.timeEnd('INPUT');
            console.time('CACHE_KEY');
            const cacheKey = `user-assets:${JSON.stringify({
                user_id: userId,
                search: searchArray,
                filters: filtersArray,
                sort: sortArray,
                cursor: cursorToken,
                limit,
                jumpToLast,
            })}`;
            console.timeEnd('CACHE_KEY');
            console.time('REDIS_GET');
            console.timeEnd('REDIS_GET');
            console.time('USER_DATA');
            const user = await this.userRepository
                .createQueryBuilder('user')
                .leftJoin('user.user_role', 'role')
                .leftJoin('user.user_department', 'department')
                .leftJoin('user.user_designation', 'designation')
                .select([
                'user.user_id',
                'user.first_name',
                'user.middle_name',
                'user.last_name',
                'user.emp_id',
                'user.last_login',
                'role.role_name',
                'department.department_name',
                'designation.designation_name',
            ])
                .where('user.user_id = :uid', { uid: userId })
                .andWhere('user.is_deleted = 0')
                .getOne();
            if (!user)
                throw new common_1.NotFoundException('User not found');
            const loginUserData = {
                user_id: user.user_id,
                user_full_name: [user.first_name, user.middle_name, user.last_name]
                    .filter(Boolean)
                    .join(' ')
                    .trim(),
                role_name: user.user_role?.role_name,
                department_name: user.user_department?.department_name,
                designation_name: user.user_designation?.designation_name,
                last_login: user.last_login,
                emp_id: user.emp_id,
            };
            console.timeEnd('USER_DATA');
            console.time('QUERY_BUILDER');
            const intColumns = [
                'mapping_id',
                'asset_id',
                'status_type_id',
                'working_status_type_id',
                'main_category_id',
                'sub_category_id',
                'department_id',
            ];
            const buildBaseQuery = (qb) => {
                return qb
                    .leftJoin('mapping.asset', 'asset')
                    .leftJoin('mapping.stock_serial', 'stockSerial')
                    .leftJoin('asset_warranty_details', 'warranty', 'warranty.asset_stocks_unique_id = stockSerial.asset_stocks_unique_id')
                    .leftJoin('stockSerial.stock', 'stock')
                    .leftJoin('asset.main_category', 'mainCat')
                    .leftJoin('asset.sub_category', 'subCat')
                    .leftJoin('mapping.status', 'statusType')
                    .leftJoin('mapping.asset_working_status', 'workingStatus')
                    .leftJoin('mapping.assigned_by_user', 'assignedBy')
                    .leftJoin('assignedBy.user_department', 'assignedDept')
                    .select([
                    'mapping.mapping_id',
                    'mapping.created_at',
                    'mapping.updated_at',
                    'mapping.is_active',
                    'asset.asset_id',
                    'asset.asset_title',
                    'mainCat.main_category_name',
                    'subCat.sub_category_name',
                    'statusType.status_type_id',
                    'statusType.status_type_name',
                    'statusType.status_color_code',
                    'workingStatus.working_status_type_id',
                    'workingStatus.working_status_type_name',
                    'workingStatus.status_category',
                    'workingStatus.status_for_category',
                    'stockSerial.stock_serials',
                    'stockSerial.system_code',
                    'stockSerial.asset_serial_title',
                    'stockSerial.asset_stocks_unique_id',
                    'stockSerial.stock_id',
                    'warranty.warranty_start_date',
                    'warranty.warranty_end_date',
                    'warranty.warranty_in_year',
                    'warranty.warranty_category',
                    'warranty.support_type',
                    'warranty.contract_number',
                    'assignedDept.department_name',
                ])
                    .addSelect('asset.asset_id', 'asset_id_raw')
                    .where('mapping.target_id = :uid', { uid: userId })
                    .andWhere('mapping.target_type = :type')
                    .andWhere('mapping.is_deleted = 0')
                    .setParameter('type', asset_mapping_entity_1.AssignTargetType.USER);
            };
            console.timeEnd('QUERY_BUILDER');
            console.time('SEARCH_FILTERS');
            const applySearchAndFilters = (qb) => {
                searchArray.forEach((s, i) => {
                    if (!s.values?.length)
                        return;
                    const value = s.values
                        .map((v) => v.trim())
                        .filter(Boolean)
                        .join(' ');
                    qb.andWhere(`(
            asset.asset_title ILIKE :s${i}
            OR mainCat.main_category_name ILIKE :s${i}
            OR subCat.sub_category_name ILIKE :s${i}
            OR stockSerial.system_code ILIKE :s${i}
            OR stockSerial.stock_serials ILIKE :s${i}
          )`, { [`s${i}`]: `%${value}%` });
                });
                const filters = {};
                filtersArray.forEach((f) => {
                    filters[f.column] = f.values || [];
                });
                if (filters.status?.length) {
                    const stValues = filters.status
                        .map((v) => {
                        if (v === '1' || v === 'active')
                            return 1;
                        if (v === '0' || v === '2' || v === 'inactive')
                            return 0;
                        return null;
                    })
                        .filter((v) => v !== null);
                    if (stValues.length === 1) {
                        qb.andWhere('mapping.is_active = :stVal', { stVal: stValues[0] });
                    }
                    else if (stValues.length > 1) {
                        qb.andWhere('mapping.is_active IN (:...stVals)', {
                            stVals: stValues,
                        });
                    }
                }
                const filterColumnMap = {
                    status_type_id: 'mapping.status_type_id',
                    main_category_id: 'asset.main_category_id',
                    sub_category_id: 'asset.sub_category_id',
                    department_id: 'mapping.department_id',
                    working_status_type_id: 'mapping.working_status_type_id',
                };
                Object.keys(filters).forEach((key) => {
                    if (key === 'status')
                        return;
                    if (!filters[key]?.length)
                        return;
                    const isInt = intColumns.includes(key);
                    const values = filters[key].map((v) => (isInt ? Number(v) : v));
                    const dbColumn = filterColumnMap[key];
                    if (!dbColumn)
                        return;
                    if (isInt) {
                        qb.andWhere(`${dbColumn} IN (:...${key})`, { [key]: values });
                    }
                    else {
                        qb.andWhere(new typeorm_2.Brackets((qb2) => {
                            values.forEach((val, idx) => {
                                qb2.orWhere(`${dbColumn} ILIKE :${key}_${idx}`, {
                                    [`${key}_${idx}`]: `%${val}%`,
                                });
                            });
                        }));
                    }
                });
            };
            console.timeEnd('SEARCH_FILTERS');
            console.time('COUNT_QUERY');
            const countKey = 'user-assets-count:' +
                JSON.stringify({
                    search: searchArray,
                    filters: filtersArray,
                    user_id: userId,
                });
            const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => {
                const countQb = buildBaseQuery(this.assetMappingRepository.createQueryBuilder('mapping'));
                applySearchAndFilters(countQb);
                return countQb.getCount();
            }, 30);
            console.timeEnd('COUNT_QUERY');
            console.time('STATS_COUNTS');
            const baseCountQb = this.assetMappingRepository
                .createQueryBuilder('m')
                .leftJoin('m.stock_serial', 'ss')
                .where('m.target_id = :uid', { uid: userId })
                .andWhere('m.target_type = :type', {
                type: asset_mapping_entity_1.AssignTargetType.USER,
            })
                .andWhere('m.is_deleted = 0');
            const totalAssets = await baseCountQb.clone().getCount();
            const inUseAssets = await baseCountQb
                .clone()
                .andWhere('m.is_active = 1')
                .andWhere('ss.is_active = 1')
                .andWhere('ss.is_deleted = 0')
                .andWhere('ss.working_status_type_id NOT IN (:...ids)', {
                ids: [8, 9],
            })
                .getCount();
            const maintenanceAssets = await baseCountQb
                .clone()
                .andWhere('m.is_active = 1')
                .andWhere('ss.is_active = 1')
                .andWhere('ss.is_deleted = 0')
                .andWhere('ss.working_status_type_id IN (:...ids)', {
                ids: [8, 9],
            })
                .getCount();
            console.timeEnd('STATS_COUNTS');
            console.time('MAIN_QUERY');
            const qb = buildBaseQuery(this.assetMappingRepository.createQueryBuilder('mapping'));
            applySearchAndFilters(qb);
            const sortableMap = {
                mapping_id: 'mapping.mapping_id',
                asset_id: 'asset.asset_id',
                asset_title: 'asset.asset_title',
                created_at: 'mapping.created_at',
                main_category_name: 'mainCat.main_category_name',
                sub_category_name: 'subCat.sub_category_name',
                system_code: 'stockSerial.system_code',
                stock_serials: 'stockSerial.stock_serials',
            };
            const idColumn = 'mapping_id';
            const idDbColumn = 'mapping.mapping_id';
            const defaultSort = { column: 'mapping_id', order: 'DESC' };
            let plan;
            if (jumpToLast) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'prev',
                });
            }
            else if (usingOffset) {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: null,
                    direction: 'next',
                });
                (0, keyset_pagination_1.applyOffsetRaw)(qb, jumpPage, limit);
            }
            else {
                plan = (0, keyset_pagination_1.buildKeyset)({
                    qb,
                    columnMap: sortableMap,
                    sort: sortArray,
                    defaultSort,
                    idColumn,
                    idDbColumn,
                    cursor: cursorToken,
                    direction,
                });
            }
            console.timeEnd('MAIN_QUERY');
            console.time('CURSOR_PAGINATION');
            const result = usingOffset
                ? await qb.getRawAndEntities()
                : await qb.limit(limit + 1).getRawAndEntities();
            console.log('Raw result:', result.raw[0]);
            console.log('Entity result:', result.entities[0]);
            console.timeEnd('CURSOR_PAGINATION');
            const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
            let data;
            let meta;
            if (usingOffset) {
                data = result.entities.map((item, i) => ({
                    ...item,
                    ...result.raw[i],
                }));
                const first = data[0];
                const last = data[data.length - 1];
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page: {
                        data,
                        startCursor: first
                            ? (0, keyset_pagination_1.encodeCursor)({
                                v: first[plan.sortColumn] ?? null,
                                id: first[idColumn],
                            })
                            : null,
                        endCursor: last
                            ? (0, keyset_pagination_1.encodeCursor)({
                                v: last[plan.sortColumn] ?? null,
                                id: last[idColumn],
                            })
                            : null,
                        hasNextPage: jumpPage < totalPages,
                        hasPrevPage: jumpPage > 1,
                    },
                    limit,
                    total,
                    currentPage: jumpPage,
                });
            }
            else {
                const page = (0, keyset_pagination_1.finalizePage)({
                    rows: result.entities.map((item, i) => ({
                        ...item,
                        ...result.raw[i],
                    })),
                    limit,
                    plan,
                    idColumn,
                    hadCursor: !!cursorToken,
                });
                data = page.data;
                if (jumpToLast) {
                    page.hasNextPage = false;
                    page.hasPrevPage = total > data.length;
                }
                meta = (0, keyset_pagination_1.buildListMeta)({
                    page,
                    limit,
                    total,
                    currentPage: jumpToLast ? totalPages : 1,
                });
            }
            console.time('DATA_MAPPING');
            if (data.length > 0) {
                console.log('First data row keys:', Object.keys(data[0]));
                console.log('First data row:', data[0]);
            }
            const assets = data.map((row) => {
                return {
                    mapping_id: row.mapping_id || row.mapping_mapping_id,
                    asset_id: row.asset_id || row.asset_asset_id || row.asset_id_raw,
                    asset_name: row.asset_serial_title ||
                        row.stockSerial_asset_serial_title ||
                        row.asset_title ||
                        row.asset_asset_title,
                    asset_stocks_unique_id: row.asset_stocks_unique_id ||
                        row.stockSerial_asset_stocks_unique_id,
                    stock_id: row.stock_id || row.stockSerial_stock_id,
                    main_category_name: row.main_category_name || row.mainCat_main_category_name,
                    sub_category_name: row.sub_category_name || row.subCat_sub_category_name,
                    created_at: row.created_at || row.mapping_created_at,
                    updated_at: row.updated_at || row.mapping_updated_at,
                    is_active: row.is_active || row.mapping_is_active,
                    system_code: row.system_code || row.stockSerial_system_code || null,
                    status_type_name: row.status_type_name || row.statusType_status_type_name || null,
                    status_color_code: row.status_color_code || row.statusType_status_color_code || null,
                    department_name: row.department_name || row.assignedDept_department_name || null,
                    warranty_start: row.warranty_start_date || row.warranty_warranty_start_date || null,
                    warranty_end: row.warranty_end_date || row.warranty_warranty_end_date || null,
                    purchase_date: row.purchase_date || row.stock_purchase_date || null,
                    stock_serials: row.stock_serials || row.stockSerial_stock_serials || null,
                    status_type_id: row.status_type_id || row.statusType_status_type_id || null,
                    working_status_type_id: row.working_status_type_id ||
                        row.workingStatus_working_status_type_id ||
                        null,
                    working_status_type_name: row.working_status_type_name ||
                        row.workingStatus_working_status_type_name ||
                        null,
                    status_category: row.status_category || row.workingStatus_status_category || null,
                    status_for_category: row.status_for_category ||
                        row.workingStatus_status_for_category ||
                        null,
                };
            });
            console.timeEnd('DATA_MAPPING');
            console.time('RESPONSE_BUILD');
            const response = {
                success: true,
                message: assets.length
                    ? 'Assets retrieved successfully'
                    : 'No assets found',
                loginUserData,
                counts: {
                    total: totalAssets,
                    inUse: inUseAssets,
                    maintenance: maintenanceAssets,
                },
                data: assets,
                meta: {
                    total: meta.total,
                    totalPages: meta.totalPages,
                    currentPage: meta.currentPage,
                    limit: meta.limit,
                    count: meta.count,
                    hasNextPage: meta.hasNextPage,
                    hasPrevPage: meta.hasPrevPage,
                    startCursor: meta.startCursor,
                    endCursor: meta.endCursor,
                    nextCursor: meta.nextCursor,
                    prevCursor: meta.prevCursor,
                },
            };
            console.timeEnd('RESPONSE_BUILD');
            console.time('REDIS_SET');
            console.timeEnd('REDIS_SET');
            console.timeEnd('GET_USER_ASSETS_TOTAL');
            return response;
        }
        catch (error) {
            console.timeEnd('GET_USER_ASSETS_TOTAL');
            console.error('getAllLoginUserMyAssetData ERROR:', error);
            throw error;
        }
    }
    async exportFilteredExcelForMyAssets(dto, user_id) {
        try {
            const userId = typeof user_id === 'string' ? parseInt(user_id, 10) : user_id;
            if (isNaN(userId) || userId <= 0) {
                throw new common_1.BadRequestException('Invalid user_id');
            }
            const searchArray = dto.search || [];
            const filtersArray = dto.filters || [];
            const sortArray = dto.sort || [];
            const selectedIds = dto.selectedIds || [];
            const intColumns = [
                'mapping_id',
                'asset_id',
                'status_type_id',
                'working_status_type_id',
                'main_category_id',
                'sub_category_id',
                'department_id',
            ];
            const userDetails = await this.userRepository
                .createQueryBuilder('user')
                .leftJoin('user.user_designation', 'designation')
                .leftJoin('user.user_department', 'department')
                .select([
                'user.user_id AS user_id',
                'user.first_name AS first_name',
                'user.middle_name AS middle_name',
                'user.last_name AS last_name',
                'user.emp_id AS emp_id',
                'user.users_business_email AS email',
                'user.last_login AS last_login',
                'designation.designation_name AS designation_name',
                'department.department_name AS department_name',
            ])
                .where('user.user_id = :userId', { userId })
                .getRawOne();
            const qb = this.assetMappingRepository
                .createQueryBuilder('mapping')
                .leftJoin('mapping.asset', 'asset')
                .leftJoin('mapping.stock_serial', 'stockSerial')
                .leftJoin('asset_warranty_details', 'warranty', 'warranty.asset_stocks_unique_id = stockSerial.asset_stocks_unique_id')
                .leftJoin('stockSerial.stock', 'stock')
                .leftJoin('asset.main_category', 'mainCat')
                .leftJoin('asset.sub_category', 'subCat')
                .leftJoin('mapping.status', 'statusType')
                .leftJoin('mapping.asset_working_status', 'workingStatus')
                .leftJoin('mapping.assigned_by_user', 'assignedBy')
                .leftJoin('assignedBy.user_department', 'assignedDept')
                .select([
                'mapping.mapping_id',
                'mapping.created_at',
                'mapping.updated_at',
                'mapping.is_active',
                'asset.asset_id',
                'asset.asset_title',
                'mainCat.main_category_name',
                'subCat.sub_category_name',
                'statusType.status_type_id',
                'statusType.status_type_name',
                'statusType.status_color_code',
                'workingStatus.working_status_type_id',
                'workingStatus.working_status_type_name',
                'workingStatus.status_category',
                'workingStatus.status_for_category',
                'stockSerial.stock_serials',
                'stockSerial.system_code',
                'stockSerial.asset_serial_title',
                'stockSerial.asset_stocks_unique_id',
                'stockSerial.stock_id',
                'warranty.warranty_start_date',
                'warranty.warranty_end_date',
                'warranty.warranty_in_year',
                'warranty.warranty_category',
                'warranty.support_type',
                'warranty.contract_number',
                'assignedDept.department_name',
            ])
                .addSelect('asset.asset_id', 'asset_id_raw')
                .where('mapping.target_id = :uid', { uid: userId })
                .andWhere('mapping.target_type = :type')
                .andWhere('mapping.is_deleted = 0')
                .setParameter('type', asset_mapping_entity_1.AssignTargetType.USER);
            if (selectedIds && selectedIds.length > 0) {
                qb.andWhere('mapping.mapping_id IN (:...selectedIds)', { selectedIds });
            }
            searchArray.forEach((s, i) => {
                if (!s.values?.length)
                    return;
                const value = s.values
                    .map((v) => v.trim())
                    .filter(Boolean)
                    .join(' ');
                qb.andWhere(`(
          asset.asset_title ILIKE :s${i}
          OR mainCat.main_category_name ILIKE :s${i}
          OR subCat.sub_category_name ILIKE :s${i}
          OR stockSerial.system_code ILIKE :s${i}
          OR stockSerial.stock_serials ILIKE :s${i}
        )`, { [`s${i}`]: `%${value}%` });
            });
            const filters = {};
            filtersArray.forEach((f) => {
                filters[f.column] = f.values || [];
            });
            if (filters.status?.length) {
                const stValues = filters.status
                    .map((v) => {
                    if (v === '1' || v === 'active')
                        return 1;
                    if (v === '0' || v === '2' || v === 'inactive')
                        return 0;
                    return null;
                })
                    .filter((v) => v !== null);
                if (stValues.length === 1) {
                    qb.andWhere('mapping.is_active = :stVal', { stVal: stValues[0] });
                }
                else if (stValues.length > 1) {
                    qb.andWhere('mapping.is_active IN (:...stVals)', {
                        stVals: stValues,
                    });
                }
            }
            const filterColumnMap = {
                status_type_id: 'mapping.status_type_id',
                main_category_id: 'asset.main_category_id',
                sub_category_id: 'asset.sub_category_id',
                department_id: 'mapping.department_id',
                working_status_type_id: 'mapping.working_status_type_id',
            };
            Object.keys(filters).forEach((key) => {
                if (key === 'status')
                    return;
                if (!filters[key]?.length)
                    return;
                const isInt = intColumns.includes(key);
                const values = filters[key].map((v) => (isInt ? Number(v) : v));
                const dbColumn = filterColumnMap[key];
                if (!dbColumn)
                    return;
                if (isInt) {
                    qb.andWhere(`${dbColumn} IN (:...${key})`, { [key]: values });
                }
                else {
                    qb.andWhere(new typeorm_2.Brackets((qb2) => {
                        values.forEach((val, idx) => {
                            qb2.orWhere(`${dbColumn} ILIKE :${key}_${idx}`, {
                                [`${key}_${idx}`]: `%${val}%`,
                            });
                        });
                    }));
                }
            });
            if (sortArray.length > 0) {
                sortArray.forEach((s) => {
                    if (!s.column)
                        return;
                    const dbCol = {
                        mapping_id: 'mapping.mapping_id',
                        asset_id: 'asset.asset_id',
                        asset_title: 'asset.asset_title',
                        created_at: 'mapping.created_at',
                        main_category_name: 'mainCat.main_category_name',
                        sub_category_name: 'subCat.sub_category_name',
                        system_code: 'stockSerial.system_code',
                        stock_serials: 'stockSerial.stock_serials',
                    }[s.column] || `mapping.${s.column}`;
                    qb.addOrderBy(dbCol, s.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
                });
            }
            else {
                qb.orderBy('mapping.mapping_id', 'DESC');
            }
            const result = await qb.getRawAndEntities();
            const assets = result.entities.map((item, i) => {
                const row = { ...item, ...result.raw[i] };
                return {
                    system_code: row.system_code || row.stockSerial_system_code || '',
                    asset_name: row.asset_serial_title ||
                        row.stockSerial_asset_serial_title ||
                        row.asset_title ||
                        row.asset_asset_title || '',
                    main_category_name: row.main_category_name || row.mainCat_main_category_name || '',
                    sub_category_name: row.sub_category_name || row.subCat_sub_category_name || '',
                    stock_serials: row.stock_serials || row.stockSerial_stock_serials || '',
                    assigned_date: row.updated_at || row.mapping_updated_at || '',
                    warranty_end: row.warranty_end_date || row.warranty_warranty_end_date || '',
                    status_type_name: row.status_type_name || row.statusType_status_type_name || '',
                    status_color_code: row.status_color_code || row.statusType_status_color_code || '',
                };
            });
            const workbook = await XlsxPopulate.fromBlankAsync();
            const sheet = workbook.sheet(0);
            sheet.name('My Assets');
            let currentRow = 1;
            sheet.cell(currentRow, 1).value('USER DETAILS').style({
                bold: true,
                fontSize: 14
            });
            currentRow += 2;
            const userHeaders = ['Field', 'Value'];
            userHeaders.forEach((header, index) => {
                sheet
                    .cell(currentRow, index + 1)
                    .value(header)
                    .style({
                    bold: true,
                    fill: { color: 'E0E0E0' }
                });
            });
            currentRow += 1;
            const fullName = userDetails
                ? [userDetails.first_name, userDetails.middle_name, userDetails.last_name]
                    .filter(Boolean)
                    .join(' ')
                : '-';
            const userFields = [
                { label: 'User Name', value: fullName || '-' },
                { label: 'Employee ID', value: userDetails?.emp_id || '-' },
                { label: 'Email', value: userDetails?.email || '-' },
                { label: 'Designation', value: userDetails?.designation_name || '-' },
                { label: 'Department', value: userDetails?.department_name || '-' },
                { label: 'Last Login', value: userDetails?.last_login ? new Date(userDetails.last_login).toLocaleString() : '-' },
            ];
            userFields.forEach((field) => {
                sheet.cell(currentRow, 1).value(field.label);
                sheet.cell(currentRow, 2).value(field.value);
                currentRow += 1;
            });
            currentRow += 2;
            sheet.cell(currentRow, 1).value(`ASSETS SUMMARY (${assets.length} assets)`).style({
                bold: true,
                fontSize: 14
            });
            currentRow += 2;
            const headers = [
                'Asset ID',
                'Asset Display Name',
                'Asset Details',
                'Serial Number',
                'Assigned Date',
                'Warranty',
                'Status',
            ];
            headers.forEach((header, index) => {
                sheet
                    .cell(currentRow, index + 1)
                    .value(header)
                    .style({
                    bold: true,
                    fill: { color: '4472C4' },
                    fontColor: 'FFFFFF',
                    border: true,
                });
            });
            currentRow += 1;
            assets.forEach((asset, index) => {
                const row = currentRow + index;
                sheet.cell(row, 1).value(asset.system_code || '');
                sheet.cell(row, 2).value(asset.asset_name || '');
                let assetDetails = asset.main_category_name || '';
                if (asset.sub_category_name) {
                    assetDetails = assetDetails ? `${assetDetails} / ${asset.sub_category_name}` : asset.sub_category_name;
                }
                sheet.cell(row, 3).value(assetDetails || '-');
                sheet.cell(row, 4).value(asset.stock_serials || '');
                sheet.cell(row, 5).value(asset.assigned_date ? new Date(asset.assigned_date).toLocaleDateString() : '-');
                sheet.cell(row, 6).value(asset.warranty_end ? new Date(asset.warranty_end).toLocaleDateString() : '-');
                sheet.cell(row, 7).value(asset.status_type_name || 'Unknown');
            });
            const columnWidths = [
                { col: 'A', width: 25 },
                { col: 'B', width: 30 },
                { col: 'C', width: 35 },
                { col: 'D', width: 25 },
                { col: 'E', width: 20 },
                { col: 'F', width: 20 },
                { col: 'G', width: 20 },
            ];
            columnWidths.forEach(({ col, width }) => {
                sheet.column(col).width(width);
            });
            return await workbook.outputAsync();
        }
        catch (error) {
            console.error('Error exporting my assets:', error);
            throw new common_1.BadRequestException(`Error exporting my assets: ${error.message}`);
        }
    }
    async saveAssetIdSettings(payload, userId) {
        console.log('🚀 saveAssetIdSettings');
        console.log('payload:', payload);
        if (payload.applied_template_id) {
            console.log('🔁 Applying template:', payload.applied_template_id);
            const unsetResult = await this.assetIdSettingsRepo.update({
                scope: payload.scope,
                is_current: true,
            }, { is_current: false });
            console.log('❌ Unset result:', unsetResult);
            const setResult = await this.assetIdSettingsRepo.update({
                id: payload.applied_template_id,
            }, { is_current: true });
            console.log('✅ Set result:', setResult);
            return this.assetIdSettingsRepo.findOne({
                where: { id: payload.applied_template_id },
            });
        }
        await this.assetIdSettingsRepo.update({
            scope: payload.scope,
            is_current: true,
        }, { is_current: false });
        const customCount = await this.assetIdSettingsRepo.count({
            where: { is_default: false },
        });
        const label = `Custom Template ${customCount + 1}`;
        const newTemplate = this.assetIdSettingsRepo.create({
            ...payload,
            id: undefined,
            label,
            created_by: userId,
            is_default: false,
            is_current: true,
            created_at: new Date(),
        });
        return this.assetIdSettingsRepo.save(newTemplate);
    }
    async updateBarcodeSetting(payload, userId) {
        const { is_barcode_enable, scope } = payload;
        const current = await this.assetIdSettingsRepo.findOne({
            where: { created_by: userId, scope, is_current: true },
        });
        if (!current) {
            throw new Error('No current Asset ID settings found.');
        }
        current.is_barcode_enable = is_barcode_enable;
        await this.assetIdSettingsRepo.save(current);
        return current;
    }
    async updateQrcodeSetting(payload, userId) {
        console.log('TEST:111');
        const { is_qrcode_enable, scope } = payload;
        const current = await this.assetIdSettingsRepo.findOne({
            where: { created_by: userId, scope, is_current: true },
        });
        if (!current) {
            throw new Error('No current Asset ID settings found.');
        }
        current.is_qrcode_enable = is_qrcode_enable;
        await this.assetIdSettingsRepo.save(current);
        return current;
    }
    async getBarcodeQrSettings(scope) {
        const validScopes = ['Global', 'Branch', 'Department'];
        const defaultScope = 'Global';
        scope = validScopes.includes(scope) ? scope : defaultScope;
        let settings = await this.assetIdSettingsRepo.findOne({
            where: {
                scope,
                is_current: true,
            },
            select: ['is_barcode_enable', 'is_qrcode_enable'],
        });
        if (!settings) {
            const newSettings = this.assetIdSettingsRepo.create({
                scope,
                is_barcode_enable: false,
                is_qrcode_enable: false,
                is_current: true,
                created_by: 1,
            });
            settings = await this.assetIdSettingsRepo.save(newSettings);
        }
        return {
            barcode: settings.is_barcode_enable,
            qrCode: settings.is_qrcode_enable,
        };
    }
    async getAssetIdSettings(scope, userId) {
        const validScopes = ['Global', 'Branch', 'Department'];
        const defaultScope = 'Global';
        scope = validScopes.includes(scope) ? scope : defaultScope;
        let settings = await this.assetIdSettingsRepo.findOne({
            where: { scope, created_by: userId, is_current: true },
            order: { updated_at: 'DESC' },
        });
        console.log('settings', settings);
        if (!settings) {
            settings = this.assetIdSettingsRepo.create({
                scope,
                prefix: 'ASSET',
                suffix: '',
                starting_number: 1,
                next_number: 1,
                sequence_length: 6,
                separator: '-',
                reset_sequence: 'never',
                include_year: false,
                include_date: false,
                date_format: 'DDMMYY',
                include_branch: false,
                branch_source: 'CODE',
                branch_length: null,
                include_department: false,
                department_source: 'CODE',
                department_length: null,
                include_category: false,
                category_source: 'CODE',
                category_length: null,
                include_sub_category: false,
                sub_category_source: 'CODE',
                sub_category_length: null,
                include_item: false,
                item_source: 'CODE',
                item_length: null,
                word_case: 'upper',
                max_length: 25,
                user_input: false,
                applied_template_id: null,
                created_by: userId,
                is_current: true,
            });
            await this.assetIdSettingsRepo.save(settings);
        }
        return settings;
    }
    async findAllTemplates(userId) {
        const defaultTemplates = await this.assetIdSettingsRepo.find({
            where: { is_default: true },
            order: { id: 'ASC' },
        });
        const customTemplates = await this.assetIdSettingsRepo.find({
            where: { created_by: userId, is_default: false },
            order: { id: 'ASC' },
        });
        const labeledCustoms = customTemplates.map((t, index) => ({
            ...t,
            label: t.label || `Custom Template ${index + 1}`,
        }));
        const templates = [...defaultTemplates, ...labeledCustoms];
        return templates.map((t) => ({
            id: t.id,
            label: t.label,
            is_default: t.is_default,
            is_current: t.is_current,
            fields: {
                prefix: t.prefix,
                suffix: t.suffix,
                starting_number: t.starting_number,
                next_number: t.next_number,
                sequence_length: t.sequence_length,
                separator: t.separator,
                reset_sequence: t.reset_sequence,
                include_year: t.include_year,
                include_date: t.include_date,
                date_format: t.date_format,
                include_branch: t.include_branch,
                branch_source: t.branch_source,
                branch_length: t.branch_length,
                include_department: t.include_department,
                department_source: t.department_source,
                department_length: t.department_length,
                include_category: t.include_category,
                category_source: t.category_source,
                category_length: t.category_length,
                include_sub_category: t.include_sub_category,
                sub_category_source: t.sub_category_source,
                sub_category_length: t.sub_category_length,
                include_item: t.include_item,
                item_source: t.item_source,
                item_length: t.item_length,
                scope: t.scope,
                word_case: t.word_case,
                max_length: t.max_length,
                user_input: t.user_input,
                applied_template_id: t.applied_template_id,
            },
            preview: null,
        }));
    }
    async saveQRCodeSettings(payload, userId) {
        try {
            await this.qrCodeSettingRepo.update({ created_by: userId, is_current: true }, { is_current: false, updated_by: userId });
            const newSettings = this.qrCodeSettingRepo.create({
                settings: payload,
                is_current: true,
                created_by: userId,
                asset_id_setting_id: payload.serial_id ?? null,
            });
            const saved = await this.qrCodeSettingRepo.save(newSettings);
            return {
                success: true,
                message: 'QR Code settings saved successfully',
                data: saved,
            };
        }
        catch (error) {
            console.error('Error saving QR Code settings:', error);
            throw new Error('Failed to save QR Code settings');
        }
    }
    async getQRCodeSettings(userId) {
        try {
            const currentSettings = await this.qrCodeSettingRepo.findOne({
                where: { created_by: userId, is_current: true },
                order: { created_at: 'DESC' },
            });
            console.log('currentSettings1:', currentSettings);
            if (!currentSettings) {
                return {
                    success: false,
                    message: 'No QR Code settings found for this user',
                    data: null,
                };
            }
            return {
                success: true,
                message: 'QR Code settings fetched successfully',
                data: currentSettings,
            };
        }
        catch (error) {
            console.error('Error fetching QR Code settings:', error);
            throw new Error('Failed to fetch QR Code settings');
        }
    }
    async userSpecificSidebarPrefrances(payload, userId) {
        try {
            console.log('Updating sidebar preferences for user:', userId, 'Payload:', payload);
            await this.userRepository.update({ user_id: userId }, { sidebarprefs: payload });
            const updatedUser = await this.userRepository.findOne({
                where: { user_id: userId },
            });
            return updatedUser;
        }
        catch (error) {
            console.error('Error updating sidebar preferences:', error);
            throw new Error('Failed to update sidebar preferences');
        }
    }
    async updateThemePreferences(payload, userId) {
        try {
            console.log('Updating theme preferences', userId, payload);
            await this.userRepository.update({
                user_id: userId,
            }, {
                theme_preferences: payload,
            });
            return await this.userRepository.findOne({
                where: {
                    user_id: userId,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to update theme preferences');
        }
    }
    async getLoginUserSidebarPreferances(userId) {
        try {
            const user = await this.userRepository.findOne({
                where: { user_id: userId },
                select: ['sidebarprefs'],
            });
            if (!user) {
                throw new Error('User not found');
            }
            return {
                success: true,
                user_id: userId,
                sidebarprefs: user.sidebarprefs || {},
            };
        }
        catch (error) {
            console.error('Error fetching sidebar preferences:', error);
            throw new Error('Failed to fetch sidebar preferences');
        }
    }
    async updateOtherSettingPref(payload, organizationId) {
        console.log('payload', payload);
        await this.organizationalProfileRepo.update({ organization_profile_id: organizationId }, { othersetting: payload });
        const othersettings = await this.organizationalProfileRepo.findOne({
            where: { organization_profile_id: organizationId },
        });
        return othersettings;
    }
    async saveSidebarPreferances(payload, userId) {
        console.log('payload', payload);
        await this.otherSettingsEntityRepo.update({ createdBy: userId, isCurrent: true }, { isCurrent: false, updatedBy: userId, updatedAt: new Date() });
        const newSettings = this.otherSettingsEntityRepo.create({
            settings: payload,
            isCurrent: true,
            createdBy: userId,
        });
        return await this.otherSettingsEntityRepo.save(newSettings);
    }
    async getSidebarPreferances(userId) {
        const currentSettings = await this.otherSettingsEntityRepo.findOne({
            where: { createdBy: userId, isCurrent: true },
        });
        if (!currentSettings) {
            return {
                success: true,
                message: 'No sidebar preferences found. Using default settings.',
                data: null,
            };
        }
        return {
            success: true,
            message: 'Sidebar preferences fetched successfully.',
            data: currentSettings.settings,
        };
    }
    async addFavourateMenuToUser(payload, userId) {
        try {
            const user = await this.userRepository.findOne({
                where: { user_id: userId },
            });
            if (!user)
                throw new Error('User not found');
            user.favorites_sidebar_menu = payload.favorites || [];
            await this.userRepository.save(user);
            return { success: true, favorites: user.favorites_sidebar_menu };
        }
        catch (err) {
            console.error('Error updating user favorites:', err);
            throw new Error('Failed to update favorites');
        }
    }
    async getFavourateMenuOfUser(userId) {
        try {
            const [user, total] = await this.dataSource
                .getRepository(organizational_user_entity_1.User)
                .findAndCount({
                where: { user_id: userId },
                select: ['user_id', 'favorites_sidebar_menu'],
                take: 1,
            });
            if (total === 0 || !user.length) {
                throw new Error('User not found');
            }
            return user[0].favorites_sidebar_menu || [];
        }
        catch {
            throw new Error('Failed to fetch favorites');
        }
    }
    async getRestrictionByFeatureIdForUI(orgId, featureId) {
        try {
            const restriction = await this.assetLimitRepo.findOne({
                where: {
                    orgId,
                    featureId,
                    isDeleted: false,
                    isActive: true,
                },
            });
            if (!restriction)
                return null;
            const parseValue = (val) => {
                if (!val)
                    return null;
                const lower = val.toLowerCase?.();
                if (lower === 'true' || lower === 'false')
                    return lower === 'true';
                if (!isNaN(Number(val)))
                    return Number(val);
                return val;
            };
            const overrideValue = parseValue(restriction.overrideValue);
            const defaultValue = parseValue(restriction.defaultValue);
            const currentUsage = parseValue(restriction.currentUsage);
            let limitReached = false;
            if (typeof overrideValue === 'number' &&
                typeof currentUsage === 'number') {
                limitReached = currentUsage >= overrideValue;
            }
            return {
                orgId: restriction.orgId,
                featureId: restriction.featureId,
                planId: restriction.planId,
                mappingId: restriction.mappingId,
                overrideValue,
                defaultValue,
                currentUsage,
                limitReached,
            };
        }
        catch (error) {
            console.error('❌ Error in getRestrictionByFeatureId:', error);
            throw new Error('Failed to fetch restriction by feature');
        }
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    async createNotification(dto, organizationId) {
        console.log('📥 Service Triggered');
        console.log('DTO:', dto);
        console.log('Organization ID:', organizationId);
        const notification = this.inRepo.create({
            recipient_type: dto.recipient_type,
            recipient_id: String(dto.recipient_id),
            event_id: dto.event_id,
            template_version_id: dto.template_version_id,
            title: dto.title,
            message: dto.message,
            data: dto.data,
            is_read: false,
            organization_id: organizationId,
            created_at: new Date(),
            redirect_key: dto.redirect_key,
            redirect_params: dto.redirect_params,
        });
        console.log('📝 Entity Created:', notification);
        const saved = await this.inRepo.save(notification);
        console.log('💾 Saved in DB:', saved);
        return saved;
    }
    async getUserIdFromPublicId(publicUserId) {
        const publicUser = await this.registerUser.findOne({
            where: { user_id: publicUserId, is_deleted: 0 },
        });
        if (!publicUser) {
            throw new common_1.HttpException(`Public user with ID ${publicUserId} not found.`, common_1.HttpStatus.NOT_FOUND);
        }
        const organizationId = publicUser.organization_id || publicUser.org_billing_id;
        if (!organizationId) {
            throw new common_1.HttpException(`Organization ID not found for public user ${publicUserId}.`, common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.userRepository.findOne({
            where: {
                organization_id: organizationId,
                is_deleted: 0,
            },
        });
        if (!user) {
            throw new common_1.HttpException(`Tenant user not found for public user ID ${publicUserId}.`, common_1.HttpStatus.NOT_FOUND);
        }
        return user.user_id;
    }
    async getNotifications(recipientId, organizationId) {
        const notifications = await this.inRepo.find({
            where: {
                recipient_id: recipientId,
                organization_id: organizationId,
                is_deleted: false,
            },
            order: { created_at: 'DESC' },
        });
        return { data: notifications };
    }
    async getUnreadCount(recipientId, organizationId) {
        const count = await this.inRepo.count({
            where: {
                recipient_id: recipientId,
                organization_id: organizationId,
                is_read: false,
                is_deleted: false,
            },
        });
        return { data: { count } };
    }
    async markAsRead(organizationId, ids) {
        const where = {
            organization_id: organizationId,
            is_read: false,
            is_deleted: false,
        };
        if (ids) {
            where.notification_id = Array.isArray(ids) ? (0, typeorm_2.In)(ids) : ids;
        }
        const result = await this.inRepo.update(where, {
            is_read: true,
        });
        return result.affected || 0;
    }
    async saveAndUpdateUserProfileImage(userId, file) {
        try {
            const uploadDir = path_1.default.join(process.cwd(), 'uploads', 'user-profile');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const ext = file.mimetype.split('/')[1] || 'jpg';
            const fileName = `user-${Date.now()}.${ext}`;
            const fullPath = path_1.default.join(uploadDir, fileName);
            fs.writeFileSync(fullPath, file.buffer);
            const dbPath = `/uploads/user-profile/${fileName}`;
            await this.userRepository.update({ user_id: userId }, { profile_image: dbPath });
            console.log('REDIS UPDATE:USER-PROFILE-IMAGE-UPDATE');
            await this.redisService.delByPattern('organization-users:*');
            return {
                status: common_1.HttpStatus.OK,
                message: 'Profile image updated successfully',
                data: { profile_image: dbPath },
            };
        }
        catch (error) {
            console.error('Error uploading profile image:', error);
            throw error;
        }
    }
    async clearNotifications(organizationId, id) {
        const where = {
            organization_id: organizationId,
            is_deleted: false,
        };
        if (id) {
            where.notification_id = id;
        }
        const result = await this.inRepo.update(where, {
            is_deleted: true,
        });
        return {
            success: true,
            affected: result.affected || 0,
        };
    }
    async updateDepreciationSettings(dto, organization_Id) {
        const organization = await this.dataSource
            .getRepository(organizational_profile_entity_1.OrganizationalProfile)
            .findOne({
            where: {
                tenant_org_id: organization_Id,
            },
        });
        if (!organization) {
            throw new Error('Organization profile not found.');
        }
        organization.it_act_enabled = dto.it_act_enabled;
        organization.company_act_enabled = dto.company_act_enabled;
        await this.dataSource
            .getRepository(organizational_profile_entity_1.OrganizationalProfile)
            .save(organization);
        return {
            it_act_enabled: organization.it_act_enabled,
            company_act_enabled: organization.company_act_enabled,
        };
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __param(10, (0, typeorm_1.InjectRepository)(organizational_user_entity_1.User)),
    __param(11, (0, typeorm_1.InjectRepository)(location_transfers_entity_1.LocationTransfer)),
    __param(12, (0, typeorm_1.InjectRepository)(register_user_login_entity_1.RegisterUserLogin)),
    __param(13, (0, typeorm_1.InjectRepository)(register_organization_entity_1.RegisterOrganization)),
    __param(14, (0, typeorm_1.InjectRepository)(organizational_vendors_entity_1.OrganizationVendors)),
    __param(15, (0, typeorm_1.InjectRepository)(branches_entity_1.Branch)),
    __param(16, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __param(17, (0, typeorm_1.InjectRepository)(location_branch_mapping_entity_1.LocationBranchMapping)),
    __param(18, (0, typeorm_1.InjectRepository)(roles_permission_entity_1.RolesPermission)),
    __param(19, (0, typeorm_1.InjectRepository)(v_asset_stock_serials_view_entity_1.AssetStockSerialsView)),
    __param(20, (0, typeorm_1.InjectRepository)(designations_entity_1.Designations)),
    __param(21, (0, typeorm_1.InjectRepository)(locations_entity_1.Locations)),
    __param(22, (0, typeorm_1.InjectRepository)(pincode_entity_1.Pincodes)),
    __param(23, (0, typeorm_1.InjectRepository)(orgnization_stats_entity_1.OrgStat)),
    __param(24, (0, typeorm_1.InjectRepository)(qr_code_settings_entity_1.QrCodeSetting)),
    __param(25, (0, typeorm_1.InjectRepository)(asset_mapping_entity_1.AssetMappingRepository)),
    __param(26, (0, typeorm_1.InjectRepository)(maintenance_entity_1.AssetMaintenance)),
    __param(27, (0, typeorm_1.InjectRepository)(asset_id_settings_entity_1.AssetIDSettings)),
    __param(28, (0, typeorm_1.InjectRepository)(location_asset_counts_view_1.LocationAssetCountsView)),
    __param(29, (0, typeorm_1.InjectRepository)(other_settings_entity_1.OtherSettingsEntity)),
    __param(30, (0, typeorm_1.InjectRepository)(asset_limitation_entity_1.AssetLimitation)),
    __param(31, (0, typeorm_1.InjectRepository)(organizational_profile_entity_1.OrganizationalProfile)),
    __param(32, (0, typeorm_1.InjectRepository)(asset_stock_serials_entity_1.AssetStockSerials)),
    __param(33, (0, typeorm_1.InjectRepository)(in_app_notifications_entity_1.InAppNotifications)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        database_service_1.DatabaseService,
        redis_service_1.RedisService,
        mail_service_1.MailService,
        mail_config_service_1.MailConfigService,
        auth_service_1.AuthService,
        entity_lookup_service_1.EntityLookupService,
        notifications_helper_1.NotificationHelper,
        roles_permissions_service_1.RolesPermissionsService,
        locations_service_1.LocationsService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        asset_depreciation_service_1.DepreciationViewService,
        dropdown_cache_service_1.DropdownCacheService,
        request_context_service_1.RequestContextService,
        stock_summary_refresh_service_1.StockSummaryRefreshService])
], OrganizationService);
