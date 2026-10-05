import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { DeleteDesignationsDto } from './dto/delete-degination-dto';
import { DeleteDepartmentsDto } from './dto/delete-department-dto';
import { CreateDepartmentsDto } from './dto/department.dto';
import { CreateDesignationDto } from './dto/designation.dto';
import { EditDepartmentDto } from './dto/update-dept.dto';
import { OrganizationService } from './organizational-profile.service';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { UpdateDepreciationSettingsDto } from './dto/create-organizational-profile.dto';
import { CreateNotificationDto } from './dtos/notificaiton.dto';
export declare class OrganizationalProfileController {
    private readonly organizationService;
    constructor(organizationService: OrganizationService);
    downloadVendorTemplate(req: Request, res: Response): Promise<void>;
    fetchOrganizationDesignation(page: number, limit: number, searchQuery: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    fetchOrganizationDesignationsDropdown(page: number, limit: number, searchQuery: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    fetchDesignationsByDepartment(departmentId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    getIndustryTypeValues(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getDepartmentConfigValues(req: Request, res: Response, page?: number, limit?: number, searchQuery?: string): Promise<Response<any, Record<string, any>>>;
    getDepartmentsWithPagination(req: Request, res: Response, page?: number, limit?: number, searchQuery?: string): Promise<Response<any, Record<string, any>>>;
    getDesignationsWithPagination(req: Request, res: Response, searchQuery?: string): Promise<Response<any, Record<string, any>>>;
    getDesignationsConfigValues(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    setDepartmentValues(createDepartmentsDto: CreateDepartmentsDto, req: Request): Promise<any>;
    editDepartment(id: string, editDto: EditDepartmentDto): Promise<any>;
    setDesignationsValues(CreateDesignationDto: CreateDesignationDto): Promise<any>;
    editDesignation(designationId: number, designationName: string, desg_description: string, departmentId: number): Promise<any>;
    removeDepartmentValues(deleteDepartmentsDto: DeleteDepartmentsDto): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    removeDesignationValue(deleteDesignationDto: DeleteDesignationsDto): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    fetchOrganizationDeparments(searchQuery: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    fetchOrganizationDeparmentsForDropdown(searchQuery: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getCategoryDropdown(req: any): Promise<{
        success: boolean;
        data: {
            label: string;
            value: number;
            is_active: number;
        }[];
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
    getAllorganizationVenders(): Promise<any>;
    getOrganizationalProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateOrgainzationProfileValues(logoFile: Express.Multer.File, payload: any, req: any): Promise<{
        statusCode: number;
        message: string;
        data: {
            message: string;
            organization: import("./entity/organizational-profile.entity").OrganizationalProfile;
        };
    }>;
    getCounts(req: any): Promise<any>;
    getDashboardCounts(): Promise<any>;
    fetchDepartmentWiseCounts(): Promise<any>;
    fetchStatusWiseCounts(): Promise<any>;
    fetchSingleVendorsData(body: {
        vendor_id: number;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    fetchOrganizationVendors(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getOrganizationVendors1(dto: ListViewDto, req: any): Promise<unknown>;
    getOrganizationVendorsDropdown(body: {
        search?: string;
    }, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    generateProjectCode(): Promise<{
        success: boolean;
        code: string;
    }>;
    createNewVendor(payload: any, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getDepartmentsFromVendors(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateVendorData(updatepayload: any, req: any, res: any): Promise<any>;
    deleteVendorData(body: {
        vendor_ids: number[];
    }, req: any, res: any): Promise<any>;
    activateVendors(body: {
        vendorIds: number[];
    }, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
    deactivateVendors(body: {
        vendorIds: number[];
    }, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
    bulkCreateVendors(dtos: any[], req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_records: any[];
            error_records: any[];
        };
    } | {
        statusCode: number;
        message: string;
        data: any;
    }>;
    exportOrganizationVendorsExcel(res: Response, body: {
        gststatus?: string;
        status?: string[];
        search?: string;
        sortField?: string;
        sortOrder?: 'ASC' | 'DESC';
        selectedIds?: number[];
    }): Promise<void>;
    findPincodeviaStateAndCity(pincode: string): Promise<{
        city: string;
        state: string;
    }>;
    getWeeklyOverview(): Promise<Record<string, any>>;
    getAllLoginUserMyAssetData(dto: ListViewDto, req: any): Promise<{
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
    } | {
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
    }>;
    exportMyAssetsToExcel(res: Response, dto: ListViewDto): Promise<Response<any, Record<string, any>>>;
    saveAssetIdSettings(payload: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./entity/asset-id-settings.entity").AssetIDSettings;
    }>;
    updateBarcodeSetting(payload: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./entity/asset-id-settings.entity").AssetIDSettings;
    }>;
    updateQrcodeSetting(payload: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./entity/asset-id-settings.entity").AssetIDSettings;
    }>;
    getAssetIdSettings(scope: 'Global' | 'Branch' | 'Department', req: any): Promise<import("./entity/asset-id-settings.entity").AssetIDSettings>;
    getAssetIdTemplates(req: any): Promise<{
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
    saveQRCodeSettings(payload: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            success: boolean;
            message: string;
            data: import("./entity/qr-code-settings.entity").QrCodeSetting;
        };
    }>;
    getQRCodeSettings(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            success: boolean;
            message: string;
            data: import("./entity/qr-code-settings.entity").QrCodeSetting;
        };
    }>;
    userSpecificSidebarPrefrances(payload: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./entity/organizational-user.entity").User;
    }>;
    updateThemePreferences(payload: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./entity/organizational-user.entity").User;
    }>;
    getLoginUserSidebarPreferances(payload: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            success: boolean;
            user_id: number;
            sidebarprefs: any;
        };
    }>;
    updateothersettings(payload: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./entity/organizational-profile.entity").OrganizationalProfile;
    }>;
    saveSidebarPreferances(payload: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./entity/other-settings.entity").OtherSettingsEntity;
    }>;
    getSidebarPreferances(req: any): Promise<{
        success: boolean;
        message: string;
        data: Record<string, any>;
    }>;
    addSidebarFavouriteToUser(payload: {
        favorites: string[];
    }, req: any): Promise<{
        status: string;
        message: string;
        data: {
            success: boolean;
            favorites: string[];
        };
    }>;
    getSidebarFavouriteOfLoginUser(req: any): Promise<{
        status: string;
        message: string;
        data: string[];
    }>;
    disableDepartment(deleteAssetOwnershipStatusDto: DeleteDepartmentsDto, req: any, res: any): Promise<any>;
    enableDepartment(deleteAssetOwnershipStatusDto: DeleteDepartmentsDto, req: any, res: any): Promise<any>;
    disableDesignation(deleteAssetOwnershipStatusDto: DeleteDesignationsDto, req: any, res: any): Promise<any>;
    enableDesignation(deleteAssetOwnershipStatusDto: DeleteDesignationsDto, req: any, res: any): Promise<any>;
    checkAssetRestrictionByFeature(req: any, body: {
        featureId: number;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    checkRestrictions(req: any, body: {
        featureId: number;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllOrgBranches(dto: ListViewDto, req: any): Promise<unknown>;
    editOrgBranchById(body: any, req: Request): Promise<{
        statusCode: HttpStatus;
        success: boolean;
        message: string;
        data: {
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
            primary_user?: import("./entity/organizational-user.entity").User;
            created_by_user?: import("./entity/organizational-user.entity").User;
            location_id?: import("./entity/locations.entity").Locations[];
            created_at: Date;
            updated_at: Date;
            occupancy_type_code: string;
            created_by?: number;
        };
    }>;
    getOrgBranchById(branchId: number, req: Request): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    deleteOrgBranch(body: {
        branch_id: number[] | number;
    }, req: Request, res: any): Promise<any>;
    activateOrgBranch(body: any, req: any, res: any): Promise<any>;
    deactivateOrgBranch(body: any, req: any, res: any): Promise<any>;
    createPrimaryOrgBranch(body: any, req: any): Promise<void>;
    bulkImportBranches(dtos: any[], req: any, res: Response): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_records: any[];
            error_records: any[];
            branch_access: any;
        };
    } | {
        statusCode: number;
        message: string;
        data: any;
        error?: undefined;
    } | {
        statusCode: number;
        message: string;
        error: any;
        data?: undefined;
    }>;
    downloadBranchImportTemplate(req: Request, res: Response): Promise<void>;
    exportOrganizationBranches(res: Response, dto: ListViewDto): Promise<void>;
    getOrganizationBranchesForDropdown(req: any): Promise<{
        status: boolean;
        message: string;
        data: {
            value: number;
            label: string;
            city: string;
            state: string;
            occupancy_type_code: string;
        }[];
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
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
    createNewOrgBranch(payload: any, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getOrganizationUsers(dto: ListViewDto, req: any): Promise<unknown>;
    fetchSingleUsersData(body: {
        user_id: number;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    fetchSingleUsersProfile(body: {
        user_id: number;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    fetchAllUsers(branch_id: number, department_id?: number): Promise<any>;
    uploadUserProfileImage(file: Express.Multer.File, res: Response): Promise<Response<any, Record<string, any>>>;
    createNewUser(payload: any, req: any): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            user: any;
        };
    } | {
        status: number;
        message: string;
    }>;
    reinviteUser(payload: any, req: any): Promise<{
        status: HttpStatus;
        message: string;
    }> | {
        status: number;
        message: string;
    };
    updateUserManagementData(payload: any, req: any, res: any): Promise<any>;
    activateUsers(body: {
        userIds: number[];
    }, res: Response, req: any): Promise<Response<any, Record<string, any>> | {
        status: number;
        message: string;
    }>;
    deactivateUsers(body: {
        userIds: number[];
    }, res: Response, req: any): Promise<Response<any, Record<string, any>> | {
        status: number;
        message: string;
    }>;
    deleteUserManagementData(body: {
        userIds: number[] | number;
    }, req: any, res: any): Promise<any>;
    exportUsersToExcel(res: Response, dto: ListViewDto): Promise<void>;
    resetPasswordByAdmin(userId: number, req: any): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    changeUserPasswordByAdmin(dto: {
        userId: number;
        newPassword: string;
        sendEmailNotification?: boolean;
    }, req: any): Promise<{
        status: HttpStatus;
        message: string;
    }>;
    generateUserTemplate(req: Request, res: Response): Promise<void>;
    bulkCreateUser(dtos: any[], req: any): Promise<{
        status: HttpStatus;
        data: {
            created_count: number;
            created_records: any[];
            error_records: any[];
        };
    } | {
        statusCode: number;
        message: string;
        data: any;
    }>;
    sidebarCount(): Promise<{
        totalPending: number;
        breakdown: {
            transfer: number;
        };
    }>;
    createNotification(dto: CreateNotificationDto): Promise<import("./public_schema_entity/in_app_notifications.entity").InAppNotifications>;
    getTenantUserId(req: Request): Promise<{
        tenantUserId: number;
    }>;
    getNotifications(recipientId: string, req: Request): Promise<{
        data: import("./public_schema_entity/in_app_notifications.entity").InAppNotifications[];
    }>;
    getUnreadCount(recipientId: string, req: Request): Promise<{
        data: {
            count: number;
        };
    }>;
    markAsRead(req: Request, body: {
        ids?: number | number[];
    }): Promise<{
        success: boolean;
        updatedCount: number;
    }>;
    ipdateUserProfileImage(file: Express.Multer.File, user_id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    clear(req: Request, body: {
        id?: number;
    }): Promise<{
        success: boolean;
        affected: number;
    }>;
    updateDepreciationSettings(dto: UpdateDepreciationSettingsDto, req: any): Promise<{
        statusCode: number;
        message: string;
        data: {
            it_act_enabled: boolean;
            company_act_enabled: boolean;
        };
    }>;
}
