import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { Stock } from 'src/assets-data/stocks/entities/stocks.entity';
import { AuthService } from 'src/auth/auth.service';
import { ListViewDtoForExcleExport } from 'src/common/listviewDTO/list-view-export-excle.dto copy';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { MailConfigService } from 'src/common/mail/mail-config.service';
import { MailService } from 'src/common/mail/mail.service';
import { NotificationHelper } from 'src/common/notifications/notifications.helper';
import { DropdownCacheService } from 'src/common/redis/dropdown-cache.service';
import { RedisService } from 'src/common/redis/redis.service';
import { DatabaseService } from 'src/dynamic-schema/database.service';
import { Branch } from 'src/organizational-profile/entity/branches.entity';
import { LocationBranchMapping } from 'src/organizational-profile/entity/location-branch-mapping.entity';
import { LocationType } from 'src/organizational-profile/entity/location-types.entity';
import { Locations } from 'src/organizational-profile/entity/locations.entity';
import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { OrgStat } from 'src/organizational-profile/entity/orgnization-stats.entity';
import { LocationChildCountView } from 'src/organizational-profile/viewentity/location-child-count.view.entity';
import { LocationHierarchyPrecomputedView } from 'src/organizational-profile/viewentity/location-hierarchy-precomputed.view.entity';
import { DataSource, Repository } from 'typeorm';
import { GetLocationsDropdownDto } from './dto/get-location.dto';
import { UserLocationFavorite } from './entities/user-location-fav';
export declare class LocationsService {
    private readonly dataSource;
    private readonly databaseService;
    private readonly mailService;
    private readonly mailConfigService;
    private readonly redisService;
    private readonly authService;
    private readonly notificationHelper;
    private readonly locationRepository;
    private readonly locationTypeRepository;
    private readonly stockRepository;
    private readonly orgStatRepository;
    private readonly branchRepository;
    private readonly locationHierarchyPrecomputedView;
    private readonly locationChildCountView;
    private readonly userRepository;
    private readonly locationBranchMappingRepo;
    private readonly userLocationFavoriteRepo;
    private readonly dropdownCache;
    constructor(dataSource: DataSource, databaseService: DatabaseService, mailService: MailService, mailConfigService: MailConfigService, redisService: RedisService, authService: AuthService, notificationHelper: NotificationHelper, locationRepository: Repository<Locations>, locationTypeRepository: Repository<LocationType>, stockRepository: Repository<Stock>, orgStatRepository: Repository<OrgStat>, branchRepository: Repository<Branch>, locationHierarchyPrecomputedView: Repository<LocationHierarchyPrecomputedView>, locationChildCountView: Repository<LocationChildCountView>, userRepository: Repository<User>, locationBranchMappingRepo: Repository<LocationBranchMapping>, userLocationFavoriteRepo: Repository<UserLocationFavorite>, dropdownCache: DropdownCacheService);
    getUserByPublicID(public_user_id: number): Promise<number>;
    addNewLocation(payload: any, createdBy: number, organizationId: number, req: Request): Promise<{
        status: number;
        success: boolean;
        message: string;
        data: any;
        created?: undefined;
        linked?: undefined;
        branchMappingsAdded?: undefined;
    } | {
        status: number;
        success: boolean;
        message: string;
        data: any[];
        created: number;
        linked: number;
        branchMappingsAdded: number;
    }>;
    getAllAssetsLocations(dto: ListViewDto, branchIds: number[], userId: number): Promise<unknown>;
    deleteLocationsById(ids: number[] | number, userId: number): Promise<{
        message: string;
        deletedIds: any[];
        failed: any[];
    }>;
    optionsLocationTypes(): Promise<{
        value: number;
        label: string;
        type_code: string;
        level: number;
        sort_order: number;
        is_required: boolean;
        is_occupancy_type: boolean;
        is_location: boolean;
        type_icon: string;
    }[]>;
    getOrganizationLocationsDropdown(payload: {
        search?: string;
        branch_id?: number;
    }, branchIds: number[], userId: number): Promise<{
        location_mapping_id: any;
        is_favourite: boolean;
        location_id: any;
        location_name: any;
        location_floor: any;
        location_room: any;
        location_type_code: any;
        parent_location_id: any;
        hierarchy_text: any;
        hierarchy_types: any;
        hierarchy_level: any;
        full_path: any;
        branch_id: any;
        branch_name: any;
    }[]>;
    exportLocationsExcel(dto: ListViewDtoForExcleExport, branchIds?: number[]): Promise<Buffer>;
    recordMetric(metric: string, value: number): Promise<{
        metric: string;
        value: number;
    } & OrgStat>;
    getLocationTemplateHeaders(locationType?: any): Promise<{
        headers: {
            label: string;
            required: boolean;
            type: string;
        }[];
        hierarchyHeaders: string[];
    }>;
    bulkImportLocations(dto: any, userId: number, organizationId: number): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_records: any[];
            error_records: any[];
        };
    }>;
    private resolveOrCreateLocationNode;
    updateLocation(payloadWithId: any, userId: number): Promise<{
        status: HttpStatus;
        message: string;
        data: Locations;
    }>;
    activateLocations(locationIds: number[], systemUserId: number): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    deactivateLocations(locationIds: number[], systemUserId: number): Promise<{
        success: boolean;
        message: string;
        details: {
            id: number;
            status: "success" | "failed";
            message?: string;
            name?: string;
        }[];
    }>;
    getLocationsWithTypeByLabel(dto: any): Promise<{
        success: boolean;
        message: string;
        data: any[];
    }>;
    private toColumnLetter;
    generateLocationTemplate(locationType?: any): Promise<any>;
    getAllOrganizationBranches(): Promise<any>;
    getLocationOptions(types: string[], branchId?: number): Promise<any>;
    getLocationsWithType(dto: any): Promise<{
        success: boolean;
        message: string;
        data: any[];
    }>;
    getGroupedLocations(dto: GetLocationsDropdownDto): Promise<{
        success: boolean;
        message: string;
        data: unknown[];
    }>;
    getLocationsByParent(parentLocationId: number, locationTypeCode?: string): Promise<{
        success: boolean;
        message: string;
        data: Locations[];
    }>;
    getLocationById(location_id: number): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            branch_mappings: LocationBranchMapping[];
            hierarchy: any[];
            displayData: any;
            location_id: number;
            location_name?: string;
            branch_id?: number;
            location_floor?: string;
            location_room?: string;
            location_code?: string;
            location_city?: string;
            location_state?: string;
            country?: string;
            pincode?: number;
            location_landmark?: string;
            location_street_address?: string;
            location_description?: string;
            location_google_map_pin?: string;
            parent_location_id?: number;
            location_level?: number;
            is_locked: boolean;
            is_active: number;
            location_type_code: string;
            location_type_id?: number;
            location_type_entity_id: number;
            path: string;
            is_deleted: number;
            created_at: Date;
            updated_at: Date;
            created_by?: number;
            updated_by?: number;
            branch?: Branch;
            stocks: Stock[];
        };
    }>;
    toggleFavoriteLocation(location_mapping_id: number, userId: number): Promise<{
        status: number;
        success: boolean;
        is_favourite: boolean;
    }>;
    getAllLocationTypes(dto: ListViewDto): Promise<unknown>;
    createLocationType(payload: any, userId: number): Promise<{
        status: number;
        success: boolean;
        message: string;
        data: LocationType;
    }>;
    updateLocationType(payload: any, userId: number): Promise<{
        status: number;
        success: boolean;
        message: string;
        data: LocationType;
    }>;
    deleteLocationType(type_id: number, userId: number): Promise<{
        status: number;
        success: boolean;
        message: string;
        usage_count: number;
    } | {
        status: number;
        success: boolean;
        message: string;
        usage_count?: undefined;
    }>;
    getLocationsHierarchyTree(payload: {
        search?: string;
        branch_id?: number;
        group_by_branch?: boolean;
    }, branchIds: number[], userId: number): Promise<any[]>;
}
