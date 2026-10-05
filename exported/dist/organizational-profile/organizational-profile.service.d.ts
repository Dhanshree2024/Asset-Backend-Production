import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { MailConfigService } from 'src/common/mail/mail-config.service';
import { MailService } from 'src/common/mail/mail.service';
import { RegisterOrganization } from 'src/organization_register/entities/register-organization.entity';
import { RegisterUserLogin } from 'src/organization_register/entities/register-user-login.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { DatabaseService } from '../dynamic-schema/database.service';
import { UpdateDepreciationSettingsDto, UpdateOrganizationalProfileDto } from './dto/create-organizational-profile.dto';
import { CreateDepartmentsDto } from './dto/department.dto';
import { CreateDesignationDto } from './dto/designation.dto';
import { Branch } from './entity/branches.entity';
import { Department } from './entity/department.entity';
import { Designations } from './entity/designations.entity';
import { OrganizationalProfile } from './entity/organizational-profile.entity';
import { User } from './entity/organizational-user.entity';
import { OrganizationVendors } from './entity/organizational-vendors.entity';
import { DepreciationViewService } from 'src/asset-depreciation/asset-depreciation.service';
import { LocationsService } from 'src/asset-locations/locations.service';
import { AssetMappingRepository } from 'src/asset-mapping/entities/asset-mapping.entity';
import { AssetStockSerials } from 'src/assets-data/stocks/entities/asset_stock_serials.entity';
import { AssetStockSerialsView } from 'src/assets-data/stocks/entities/v-asset-stock-serials-view.entity';
import { StockSummaryRefreshService } from 'src/assets-data/stocks/stock-summary-refresh.service';
import { RequestContextService } from 'src/common/context/request-context.service';
import { ListViewDtoForExcleExport } from 'src/common/listviewDTO/list-view-export-excle.dto copy';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { NotificationHelper } from 'src/common/notifications/notifications.helper';
import { DropdownCacheService } from 'src/common/redis/dropdown-cache.service';
import { RedisService } from 'src/common/redis/redis.service';
import { LocationTransfer } from 'src/location-transfer/entities/location-transfers.entity';
import { AssetMaintenance } from 'src/manage-asset/entities/maintenance.entity';
import { RolesPermission } from 'src/roles_permissions/entities/roles_permission.entity';
import { DeleteDesignationsDto } from './dto/delete-degination-dto';
import { DeleteDepartmentsDto } from './dto/delete-department-dto';
import { EditDepartmentDto } from './dto/update-dept.dto';
import { CreateAssetIdSettingsDto } from './dtos/create-asset-id-settings.dto';
import { CreateNotificationDto } from './dtos/notificaiton.dto';
import { EntityLookupService } from './entity-lookup.service';
import { AssetIDSettings } from './entity/asset-id-settings.entity';
import { LocationBranchMapping } from './entity/location-branch-mapping.entity';
import { Locations } from './entity/locations.entity';
import { OrgStat } from './entity/orgnization-stats.entity';
import { OtherSettingsEntity } from './entity/other-settings.entity';
import { QrCodeSetting } from './entity/qr-code-settings.entity';
import { AssetLimitation } from './public_schema_entity/asset-limitation.entity';
import { InAppNotifications } from './public_schema_entity/in_app_notifications.entity';
import { Pincodes } from './public_schema_entity/pincode.entity';
import { LocationAssetCountsView } from './viewentity/location-asset-counts.view';
import { RolesPermissionsService } from 'src/roles_permissions/roles_permissions.service';
export declare class OrganizationService {
    private readonly dataSource;
    private readonly databaseService;
    private readonly redisService;
    private readonly mailService;
    private readonly mailConfigService;
    private readonly authService;
    private readonly EntityLookupService;
    private readonly notificationHelper;
    private readonly rolesService;
    private readonly locationsService;
    private readonly userRepository;
    private readonly locationTransfer;
    private readonly registerUser;
    private readonly registerOrganization;
    private readonly vendorRepository;
    private readonly branchRepository;
    private readonly departmentRepository;
    private readonly locationBranchMappingRepository;
    private readonly rolesPermissionRepository;
    private readonly assetViewRepo;
    private readonly designationsRepository;
    private readonly locationRepository;
    private readonly pincodesRepository;
    private readonly orgStatRepository;
    private readonly qrCodeSettingRepo;
    private readonly assetMappingRepository;
    private readonly assetMaintenanceRepository;
    private readonly assetIdSettingsRepo;
    private readonly locationAssetCountsView;
    private readonly otherSettingsEntityRepo;
    private readonly assetLimitRepo;
    private readonly organizationalProfileRepo;
    private readonly assetStockSerialsRepository;
    private readonly inRepo;
    private readonly depViewService;
    private readonly dropdownCache;
    private readonly requestContext;
    private readonly stockSummaryRefresh;
    constructor(dataSource: DataSource, databaseService: DatabaseService, redisService: RedisService, mailService: MailService, mailConfigService: MailConfigService, authService: AuthService, EntityLookupService: EntityLookupService, notificationHelper: NotificationHelper, rolesService: RolesPermissionsService, locationsService: LocationsService, userRepository: Repository<User>, locationTransfer: Repository<LocationTransfer>, registerUser: Repository<RegisterUserLogin>, registerOrganization: Repository<RegisterOrganization>, vendorRepository: Repository<OrganizationVendors>, branchRepository: Repository<Branch>, departmentRepository: Repository<Department>, locationBranchMappingRepository: Repository<LocationBranchMapping>, rolesPermissionRepository: Repository<RolesPermission>, assetViewRepo: Repository<AssetStockSerialsView>, designationsRepository: Repository<Designations>, locationRepository: Repository<Locations>, pincodesRepository: Repository<Pincodes>, orgStatRepository: Repository<OrgStat>, qrCodeSettingRepo: Repository<QrCodeSetting>, assetMappingRepository: Repository<AssetMappingRepository>, assetMaintenanceRepository: Repository<AssetMaintenance>, assetIdSettingsRepo: Repository<AssetIDSettings>, locationAssetCountsView: Repository<LocationAssetCountsView>, otherSettingsEntityRepo: Repository<OtherSettingsEntity>, assetLimitRepo: Repository<AssetLimitation>, organizationalProfileRepo: Repository<OrganizationalProfile>, assetStockSerialsRepository: Repository<AssetStockSerials>, inRepo: Repository<InAppNotifications>, depViewService: DepreciationViewService, dropdownCache: DropdownCacheService, requestContext: RequestContextService, stockSummaryRefresh: StockSummaryRefreshService);
    private sanitizeValue;
    private sanitizeValue2;
    getUserDropdown(branchIds?: number[]): Promise<{
        label: string;
        value: number;
        is_active: number;
    }[]>;
    getCounts(branchIds: number[], schema: any, register_user_login: any): Promise<any>;
    getDashboardCounts(): Promise<any>;
    getDepartmentWiseAssetCounts(): Promise<any>;
    getStatusWiseAssetCounts(): Promise<any>;
    updateOrgainzationProfileValues(dto: UpdateOrganizationalProfileDto, organization_Id: number): Promise<{
        message: string;
        organization: OrganizationalProfile;
    }>;
    fetchIndustryTypes(): Promise<any>;
    getLogoAsBase64(logoPath: string): string | null;
    fetchOrganizationalProfile(dto: any): Promise<any>;
    manageAssetsSidebarCount(): Promise<{
        totalPending: number;
        breakdown: {
            transfer: number;
        };
    }>;
    fetchDesignationsconfig(department_name?: string): Promise<any>;
    createDesignations(CreateDesignationDto: CreateDesignationDto): Promise<any>;
    editDesignation(designationId: number, newName: string, newDescription: string, departmentId: number): Promise<any>;
    deleteDesignation(deleteDesignationDto: DeleteDesignationsDto): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    fetchOrganizationDesignation(searchQuery?: string): Promise<any>;
    fetchOrganizationDesignationsDropdown(searchQuery?: string): Promise<any>;
    fetchDesignationsByDepartment(departmentId: number): Promise<{
        status: string;
        message: string;
        data: any[];
    }>;
    deleteDepartments(deleteDepartmentsDto: DeleteDepartmentsDto): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    disableDepartment(deleteAssetOwnershipStatusDto: DeleteDepartmentsDto): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    enableDepartment(deleteAssetOwnershipStatusDto: DeleteDepartmentsDto): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    disableDesignation(deleteAssetOwnershipStatusDto: DeleteDesignationsDto): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    enableDesignation(deleteAssetOwnershipStatusDto: DeleteDesignationsDto): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    fetchOrganizationDeparments(searchQuery?: string): Promise<any>;
    fetchOrganizationDepartmentsDropdown(searchQuery?: string): Promise<any>;
    getDepartmentDropdown(): Promise<{
        label: string;
        value: number;
    }[]>;
    createDepartments(createDepartmentsDto: CreateDepartmentsDto, userId: number): Promise<any>;
    editDepartment(id: number, dto: EditDepartmentDto): Promise<any>;
    fetchDepartmentconfig(page: number, limit: number, searchQuery: string): Promise<any>;
    fetchDepartments(page: number, limit: number, searchQuery: string): Promise<any>;
    getAllorganizationVenders(): Promise<any>;
    deleteVendorData(deleteVendorDto: any): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            deleted: any[];
            failed: any[];
        };
    }>;
    fetchSingleVendorsData(vendor_id: number): Promise<{
        status: number;
        message: string;
        data: OrganizationVendors;
        error?: undefined;
    } | {
        status: number;
        message: string;
        error: any;
        data?: undefined;
    }>;
    exportVendorCSV(): Promise<{
        'Vendor Name': string;
        'GST No.': string;
        Street: string;
        Landmark: string;
        City: string;
        State: string;
        Country: string;
        Pincode: string;
        'Contact Number': string;
        Email: string;
        'Primary Contact Person': string;
        'Alternative Contact': string;
        'Created By': string;
        'Created At': string;
        'Updated At': string;
    }[]>;
    generateNextVendorCode(): Promise<string>;
    getDepartmentsFromVendors(): Promise<{
        value: any;
        label: any;
    }[]>;
    createNewVendor(payload: any, userId: number): Promise<{
        status: number;
        message: string;
        data?: undefined;
    } | {
        status: number;
        message: string;
        data: OrganizationVendors;
    }>;
    updateVendorData(updatePayload: any): Promise<{
        status: HttpStatus;
        message: string;
        data: OrganizationVendors;
    }>;
    activateVendors(vendorIds: number[], systemUserId: number): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    deactivateVendors(vendorIds: number[], systemUserId: number): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    generateVendorTemplate(): Promise<any>;
    getUserIdByRegisterLoginId(registerUserLoginId: number): Promise<number>;
    bulkCreateVendors(dtos: any[], userId: number): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_records: any[];
            error_records: any[];
        };
    }>;
    fetchOrganizationVendors(): Promise<any>;
    getAllVendors2(dto: ListViewDto, branchIds?: number[]): Promise<unknown>;
    getOrganizationVendorsDropdown(payload: {
        search?: string;
    }): Promise<{
        label: string;
        value: number;
    }[]>;
    exportOrganizationVendorsExcel(payload: {
        gststatus?: string;
        status?: string[];
        search?: string;
        sortField?: string;
        sortOrder?: 'ASC' | 'DESC';
        selectedIds?: number[];
    }): Promise<Buffer>;
    deleteUserManagementData(userIds: number[], orgId: number): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            totalDeleted: number;
            totalFailed: number;
            deleted: any[];
            failed: any[];
        };
    }>;
    getUserByPublicID(public_user_id: number): Promise<number>;
    getPublicUserID(private_user_id: number): Promise<number>;
    getUserByPublicIDForBranch(public_user_id: number, queryRunner?: QueryRunner): Promise<number>;
    fetchOrganizationRoles(): Promise<any>;
    fetchAllUsers2(branch_id?: number, department_id?: number): Promise<any>;
    getAllOrganizationBranches(): Promise<any>;
    getAllDepartmentAndItsDegination(): Promise<any>;
    generateUserTemplate(branchIds: number[]): Promise<any>;
    exportFilteredExcelForUsers(dto: ListViewDtoForExcleExport): Promise<Buffer>;
    sendResetPasswordEmailByAdmin(userId: number, decrypted_system_user_id: number): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    private sendResetPasswordNotificationAsync;
    changeUserPasswordByAdmin(userId: number, newPassword: string, sendEmailNotification: boolean, decrypted_system_user_id: number): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    private sendPasswordUpdatedNotificationAsync;
    fetchOrganizationUsers2(dto: ListViewDto, branchIds?: number[]): Promise<unknown>;
    fetchSingleUsersData(user_id: number): Promise<{
        status: number;
        message: string;
        data: {
            branch: any[];
            user_id: number;
            first_name: string;
            middle_name: string;
            last_name: string;
            date_of_birth: Date;
            gender: string;
            blood_group: string;
            users_business_email: string;
            phone_number: string;
            user_alternative_contact_number: string;
            street: string;
            landmark: string;
            city: string;
            state: string;
            zip: string;
            country: string;
            password: string;
            is_primary_user: string;
            organization_id: number;
            organization: OrganizationalProfile;
            role_id: number;
            user_role: RolesPermission;
            department_id: number;
            user_department: Department;
            designation_id: number;
            user_designation: Designations;
            branch_id: number;
            user_branch: Branch;
            location_id: number;
            location: Locations;
            is_active: number;
            is_deleted: number;
            is_department_head: number;
            branches: number[];
            branch_access: number[];
            favorites_sidebar_menu: string[];
            emp_id: string;
            profile_image: string;
            register_user_login_id: number;
            userLogintable: RegisterUserLogin;
            last_login: Date;
            sidebarprefs: any;
            theme_preferences: any;
            created_by: number;
            added_by_user: User;
            created_at: Date;
            updated_at: Date;
            role: import("../organization_roles_permission/entity/role.entity").Roles;
            createdRoles: import("../organization_roles_permission/entity/role.entity").Roles[];
        };
        error?: undefined;
    } | {
        status: number;
        message: string;
        error: any;
        data?: undefined;
    }>;
    fetchSingleUsersProfile(user_id: number): Promise<{
        status: number;
        message: string;
        data: {
            branch_access: {
                branch_id: number;
                branch_name: string;
            }[];
            permissions: any[];
            user_id: number;
            first_name: string;
            middle_name: string;
            last_name: string;
            date_of_birth: Date;
            gender: string;
            blood_group: string;
            users_business_email: string;
            phone_number: string;
            user_alternative_contact_number: string;
            street: string;
            landmark: string;
            city: string;
            state: string;
            zip: string;
            country: string;
            password: string;
            is_primary_user: string;
            organization_id: number;
            organization: OrganizationalProfile;
            role_id: number;
            user_role: RolesPermission;
            department_id: number;
            user_department: Department;
            designation_id: number;
            user_designation: Designations;
            branch_id: number;
            user_branch: Branch;
            location_id: number;
            location: Locations;
            is_active: number;
            is_deleted: number;
            is_department_head: number;
            branches: number[];
            favorites_sidebar_menu: string[];
            emp_id: string;
            profile_image: string;
            register_user_login_id: number;
            userLogintable: RegisterUserLogin;
            last_login: Date;
            sidebarprefs: any;
            theme_preferences: any;
            created_by: number;
            added_by_user: User;
            created_at: Date;
            updated_at: Date;
            role: import("../organization_roles_permission/entity/role.entity").Roles;
            createdRoles: import("../organization_roles_permission/entity/role.entity").Roles[];
        };
        error?: undefined;
    } | {
        status: number;
        message: string;
        error: any;
        data?: undefined;
    }>;
    uploadUserProfileImage(file: Express.Multer.File): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            profile_image: string;
        };
    }>;
    createNewUser(payload: any, organizationId: number, createdBy: number): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            user: any;
        };
    }>;
    private sendUserInviteNotificationsAsync;
    reinviteUser(userLoginId: number, requestedBy: number): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    private sendReinviteNotificationAsync;
    updateUserManagementData(payload: any): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            user: User;
            userLogin: RegisterUserLogin;
        };
    }>;
    activateUsers(userIds: number[], systemUserId: number): Promise<{
        status: string;
        message: string;
        data: {
            updated: any[];
            failed: any[];
        };
    }>;
    deactivateUsers(userIds: number[], systemUserId: number): Promise<{
        status: string;
        message: string;
        data: {
            updated: any[];
            failed: any[];
        };
    }>;
    sanitize(value: any): any;
    getLocationTypeOptions(type?: 'occupancy' | 'location'): Promise<{
        value: string;
        label: string;
        type_id: number;
        type_code: string;
        sort_order: number;
        is_location: boolean;
        is_occupancy_type: boolean;
        root_location_types: any;
        config: any;
    }[]>;
    createBranch(payload: any, organizationId: number, createdBy: number, req?: Request): Promise<Branch>;
    private refreshStockSummaryFromContext;
    getBranchById(branch_id: number, req?: Request): Promise<any>;
    updateBranch1(branchId: number, payload: any, organizationId: number, updatedBy: number, req?: Request): Promise<{
        message: string;
        branch_id: number;
        branch_name: string;
        gst_no?: string;
        branch_code?: string;
        branch_street?: string;
        branch_landmark?: string;
        city?: string;
        state?: string;
        country?: string;
        pincode?: number;
        city_id?: number;
        country_id?: number;
        contact_number?: string;
        alternative_contact_number?: string;
        branch_email?: string;
        established_date?: Date;
        is_active: number;
        is_deleted: number;
        primary_user?: User;
        created_by_user?: User;
        location_id?: Locations[];
        created_at: Date;
        updated_at: Date;
        occupancy_type_code: string;
        created_by?: number;
    }>;
    deleteBranchById(branchIds: number[], organizationId: number, req?: Request): Promise<{
        success: boolean;
        totalDeleted: number;
        totalFailed: number;
        deleted: any[];
        failed: any[];
    }>;
    activateBranches(branchIds: number[], systemUserId: number): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    deactivateBranches(branchIds: number[], systemUserId: number): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    getOrganizationBranchesList(dto: ListViewDto, branchIds?: number[]): Promise<unknown>;
    getAllBranchesforDropdown(branchIds?: number[]): Promise<{
        value: number;
        label: string;
        city: string;
        state: string;
        occupancy_type_code: string;
    }[]>;
    bulkImportBranches(dtos: any[], organizationId: number, userId: number): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_records: any[];
            error_records: any[];
            branch_access: any;
        };
    }>;
    downloadBranchImportTemplate(): Promise<any>;
    exportOrganizationBranchesExcel(dto: ListViewDtoForExcleExport): Promise<Buffer>;
    findPincodeviaStateAndCity(pincode: string): Promise<Pincodes>;
    recordMetric(metric: string, value: number): Promise<{
        metric: string;
        value: number;
    } & OrgStat>;
    getOverview(): Promise<{}>;
    getWeeklyOverview(): Promise<Record<string, any>>;
    bulkCreateUsers(dtos: any[], organizationId: number, createdBy: number): Promise<{
        status: HttpStatus;
        data: {
            created_count: number;
            created_records: any[];
            error_records: any[];
        };
    }>;
    getAllLoginUserMyAssetData(dto: ListViewDto, user_id: any): Promise<{
        success: boolean;
        message: string;
        loginUserData: {
            user_id: number;
            user_full_name: string;
            role_name: string;
            department_name: string;
            designation_name: string;
            last_login: Date;
            emp_id: string;
        };
        counts: {
            total: number;
            inUse: number;
            maintenance: number;
        };
        data: {
            mapping_id: any;
            asset_id: any;
            asset_name: any;
            asset_stocks_unique_id: any;
            stock_id: any;
            main_category_name: any;
            sub_category_name: any;
            created_at: any;
            updated_at: any;
            is_active: any;
            system_code: any;
            status_type_name: any;
            status_color_code: any;
            department_name: any;
            warranty_start: any;
            warranty_end: any;
            purchase_date: any;
            stock_serials: any;
            status_type_id: any;
            working_status_type_id: any;
            working_status_type_name: any;
            status_category: any;
            status_for_category: any;
        }[];
        meta: {
            total: any;
            totalPages: any;
            currentPage: any;
            limit: any;
            count: any;
            hasNextPage: any;
            hasPrevPage: any;
            startCursor: any;
            endCursor: any;
            nextCursor: any;
            prevCursor: any;
        };
    }>;
    exportFilteredExcelForMyAssets(dto: any, user_id: any): Promise<Buffer>;
    saveAssetIdSettings(payload: CreateAssetIdSettingsDto, userId: number): Promise<AssetIDSettings>;
    updateBarcodeSetting(payload: any, userId: number): Promise<AssetIDSettings>;
    updateQrcodeSetting(payload: any, userId: number): Promise<AssetIDSettings>;
    getBarcodeQrSettings(scope: 'Global' | 'Branch' | 'Department'): Promise<{
        barcode: boolean;
        qrCode: boolean;
    }>;
    getAssetIdSettings(scope: 'Global' | 'Branch' | 'Department', userId: number): Promise<AssetIDSettings>;
    findAllTemplates(userId: number): Promise<{
        id: number;
        label: string;
        is_default: boolean;
        is_current: boolean;
        fields: {
            prefix: string;
            suffix: string;
            starting_number: number;
            next_number: number;
            sequence_length: number;
            separator: string;
            reset_sequence: "never" | "yearly" | "monthly";
            include_year: boolean;
            include_date: boolean;
            date_format: "DDMMYY" | "YYYYMMDD" | "YYMM" | "YYYY" | "YY" | "None";
            include_branch: boolean;
            branch_source: "CODE" | "NAME";
            branch_length: number;
            include_department: boolean;
            department_source: "CODE" | "NAME";
            department_length: number;
            include_category: boolean;
            category_source: "CODE" | "NAME";
            category_length: number;
            include_sub_category: boolean;
            sub_category_source: "CODE" | "NAME";
            sub_category_length: number;
            include_item: boolean;
            item_source: "CODE" | "NAME";
            item_length: number;
            scope: "Global" | "Branch" | "Department";
            word_case: "upper" | "lower" | "mixed";
            max_length: number;
            user_input: boolean;
            applied_template_id: number;
        };
        preview: any;
    }[]>;
    saveQRCodeSettings(payload: any, userId: number): Promise<{
        success: boolean;
        message: string;
        data: QrCodeSetting;
    }>;
    getQRCodeSettings(userId: number): Promise<{
        success: boolean;
        message: string;
        data: QrCodeSetting;
    }>;
    userSpecificSidebarPrefrances(payload: any, userId: number): Promise<User>;
    updateThemePreferences(payload: any, userId: number): Promise<User>;
    getLoginUserSidebarPreferances(userId: number): Promise<{
        success: boolean;
        user_id: number;
        sidebarprefs: any;
    }>;
    updateOtherSettingPref(payload: any, organizationId: any): Promise<OrganizationalProfile>;
    saveSidebarPreferances(payload: any, userId: number): Promise<OtherSettingsEntity>;
    getSidebarPreferances(userId: number): Promise<{
        success: boolean;
        message: string;
        data: Record<string, any>;
    }>;
    addFavourateMenuToUser(payload: {
        favorites: string[];
    }, userId: number): Promise<{
        success: boolean;
        favorites: string[];
    }>;
    getFavourateMenuOfUser(userId: number): Promise<string[]>;
    getRestrictionByFeatureIdForUI(orgId: number, featureId: number): Promise<{
        orgId: number;
        featureId: number;
        planId: number;
        mappingId: number;
        overrideValue: string | number | boolean;
        defaultValue: string | number | boolean;
        currentUsage: string | number | boolean;
        limitReached: boolean;
    }>;
    private hashPassword;
    createNotification(dto: CreateNotificationDto, organizationId: number): Promise<InAppNotifications>;
    getUserIdFromPublicId(publicUserId: number): Promise<number>;
    getNotifications(recipientId: string, organizationId: number): Promise<{
        data: InAppNotifications[];
    }>;
    getUnreadCount(recipientId: string, organizationId: number): Promise<{
        data: {
            count: number;
        };
    }>;
    markAsRead(organizationId: number, ids?: number | number[]): Promise<number>;
    saveAndUpdateUserProfileImage(userId: number, file: Express.Multer.File): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            profile_image: string;
        };
    }>;
    clearNotifications(organizationId: number, id?: number): Promise<{
        success: boolean;
        affected: number;
    }>;
    updateDepreciationSettings(dto: UpdateDepreciationSettingsDto, organization_Id: number): Promise<{
        it_act_enabled: boolean;
        company_act_enabled: boolean;
    }>;
}
