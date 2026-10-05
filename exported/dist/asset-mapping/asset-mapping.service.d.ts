import { DataSource, Repository } from 'typeorm';
import { AssignAssetsDto } from './dto/create-asset-mapping.dto';
import { ReassignAssetsDto } from './dto/update-asset-mapping.dto';
import { CreateTechnicalRelationshipDto } from './dto/create-technical-relationship.dto';
import { EligibleTargetsQueryDto } from './dto/technical-relationship-query.dto';
import { CreateGovernanceRuleDto, UpdateGovernanceRuleDto } from './dto/create-governance-rule.dto';
import { AssetMappingRepository, AssignTargetType } from './entities/asset-mapping.entity';
import { AssetDatum } from 'src/assets-data/asset-data/entities/asset-datum.entity';
import { Stock } from 'src/assets-data/stocks/entities/stocks.entity';
import { AssetStockSerials } from 'src/assets-data/stocks/entities/asset_stock_serials.entity';
import { AssetTransferHistory } from './entities/asset_transfer_history.entity';
import { AssetWorkingStatus } from 'src/assets-data/asset-working-status/entities/asset-working-status.entity';
import { AssetProcurementItem } from 'src/assets-data/stocks/entities/asset_procurement_items.entity';
import { AssetProcurement } from 'src/assets-data/stocks/entities/asset_procurements.entity';
import { StockSummaryRefreshService } from 'src/assets-data/stocks/stock-summary-refresh.service';
import { RequestContextService } from 'src/common/context/request-context.service';
import { NotificationHelper } from 'src/common/notifications/notifications.helper';
import { RedisService } from 'src/common/redis/redis.service';
import { EntityLookupService } from 'src/organizational-profile/entity-lookup.service';
import { Department } from 'src/organizational-profile/entity/department.entity';
import { AssetItem } from '../assets-data/asset-items/entities/asset-item.entity';
import { AssetAssignmentEvent } from './entities/asset-assignment-log.entity';
export interface AssetHierarchyMeta {
    asset_stocks_unique_id: number;
    asset_id: number;
    item_id: number | null;
    main_category_id: number;
    main_category_name?: string;
    sub_category_id: number;
    sub_category_name?: string;
    asset_name: string;
    current_status_id?: number | null;
    working_status_type_id?: number | null;
    system_code?: string;
}
export declare class AssetMappingService {
    private readonly dataSource;
    private readonly EntityLookupService;
    private readonly notificationHelper;
    private readonly redisService;
    private readonly requestContext;
    private readonly stockSummaryRefresh;
    private readonly assetMappingRepository;
    private readonly assetStockSerialsRepository;
    private readonly stockRepository;
    private readonly assetItemRepository;
    private readonly AssetDatum;
    private readonly assetTransferHistoryRepository;
    private readonly assignmentEventRepository;
    private readonly AssetProcurement;
    private readonly AssetProcurementItem;
    private readonly AssetWorkingStatus;
    getMappedAssegetAllMappedAssetsSortedBySerialIdtsToAssets(asset_id: number): void;
    AssetStockSerialsRepository: any;
    constructor(dataSource: DataSource, EntityLookupService: EntityLookupService, notificationHelper: NotificationHelper, redisService: RedisService, requestContext: RequestContextService, stockSummaryRefresh: StockSummaryRefreshService, assetMappingRepository: Repository<AssetMappingRepository>, assetStockSerialsRepository: Repository<AssetStockSerials>, stockRepository: Repository<Stock>, assetItemRepository: Repository<AssetItem>, AssetDatum: Repository<AssetDatum>, assetTransferHistoryRepository: Repository<AssetTransferHistory>, assignmentEventRepository: Repository<AssetAssignmentEvent>, AssetProcurement: Repository<AssetProcurement>, AssetProcurementItem: Repository<AssetProcurementItem>, AssetWorkingStatus: Repository<AssetWorkingStatus>);
    private refreshStockSummaryFromContext;
    private refreshStockSummaryNowFromContext;
    private resolveOrgIdFromSchema;
    findAll(page: number, limit: number, searchQuery: string, customFilters?: Record<string, any>, asset_id?: number, status?: string): Promise<any>;
    exportFilteredExcelForAssetsMapping(data: any[]): Promise<Buffer>;
    fetchSingleAssetAvailableQty(asset_id: number): Promise<any>;
    findSingleAssetMapping(mapping_id: number): Promise<AssetMappingRepository>;
    getUserByPublicID(public_user_id: number): Promise<number>;
    getTimelineBySerialNo(asset_stocks_unique_id: number): Promise<{
        id: number;
        system_code: string;
        asset_id: number;
        assign_type: import("./entities/asset_transfer_history.entity").AssignTypeEnum;
        status: string;
        from_user: string;
        to_user: string;
        from_department: Department;
        to_department: Department;
        from_branch: string;
        to_branch: string;
        from_project: string;
        to_project: string;
        transferred_at: Date;
    }[]>;
    getSingleAssetMapping(mapping_id: number): Promise<any>;
    assignAssets(dto: AssignAssetsDto, userId: number, organizationId: number, schema?: string, branchIds?: number[]): Promise<{
        success: boolean;
        message: string;
        processedCount?: undefined;
        skippedCount?: undefined;
        skipped?: undefined;
    } | {
        success: boolean;
        message: string;
        processedCount: number;
        skippedCount: number;
        skipped: {
            asset_stocks_unique_id: number;
            reason: string;
        }[];
    }>;
    reassignAssets(dto: ReassignAssetsDto, userId: number, schema?: string, branchIds?: number[]): Promise<{
        success: boolean;
        message: string;
        processedCount?: undefined;
        skippedCount?: undefined;
        skipped?: undefined;
    } | {
        success: boolean;
        message: string;
        processedCount: number;
        skippedCount: number;
        skipped: {
            asset_stocks_unique_id: number;
            reason: string;
        }[];
    }>;
    returnAssets(dto: ReassignAssetsDto, userId: number, schema?: string, branchIds?: number[]): Promise<{
        success: boolean;
        message: string;
        processedCount?: undefined;
        skippedCount?: undefined;
        skipped?: undefined;
    } | {
        success: boolean;
        message: string;
        processedCount: number;
        skippedCount: number;
        skipped: {
            asset_stocks_unique_id: number;
            reason: string;
        }[];
    }>;
    getAssignmentLogsBySerial(serialId: number): Promise<{
        event_id: number;
        performed_at: Date;
        notes: string;
        target_type: AssignTargetType;
        target_id: number;
        assigned_to_name: string;
        working_condition: string;
        color: string;
        performed_by: {
            user_id: number;
            name: string;
        };
    }[]>;
    returnScrappedAssets(dto: {
        serialIds: number[];
        notes?: string;
    }, userId: number, schema?: string, branchIds?: number[]): Promise<{
        success: boolean;
        message: string;
    } | {
        message: string;
        success?: undefined;
    }>;
    removeAssignedAssets(dto: {
        serialIds: {
            asset_stocks_unique_id: number;
            mapping_id: number;
            target_type?: any;
            target_id?: any;
        }[];
        notes?: string;
    }, userId: number, schema?: string, branchIds?: number[]): Promise<{
        success: boolean;
        message: string;
    } | {
        message: string;
        success?: undefined;
    }>;
    getAssetHierarchyBySerialId(serialId: number, schema: string): Promise<AssetHierarchyMeta>;
    checkGovernanceByCategory(relationType: string, source: {
        main_category_id?: number | null;
        sub_category_id?: number | null;
        item_id?: number | null;
    }, target: {
        main_category_id?: number | null;
        sub_category_id?: number | null;
        item_id?: number | null;
    }, schema: string): Promise<{
        allowed: boolean;
        governance_id: number | null;
        rule_name: string | null;
        message: string | null;
    }>;
    getSoftwareMainCategoryId(schema: string): Promise<number | null>;
    validateRelationshipGovernance(sourceSerialId: number, targetSerialId: number, relationType: string, schema: string): Promise<{
        governance_id: number;
        rule_name: string;
        is_allowed: boolean;
        sourceMeta: AssetHierarchyMeta;
        targetMeta: AssetHierarchyMeta;
    }>;
    validateRelationshipGuards(sourceSerialId: number, targetSerialId: number, relationType: string, schema: string, confirmReassign?: boolean): Promise<void>;
    createTechnicalRelationship(dto: CreateTechnicalRelationshipDto, userId: number, schema: string): Promise<{
        message: string;
        created_count: number;
        results: any[];
        mapping_id: number;
        relation_type: string;
        source_serial_id: number;
        target_serial_id: number;
        source_name: string;
        target_name: string;
        governance_rule: string;
    }>;
    getAssetRelationships(serialId: number, schema: string): Promise<any[]>;
    getRelationshipTabSummary(serialId: number, schema: string): Promise<{
        asset_id: number;
        asset_stocks_unique_id: number;
        asset_name: string;
        main_category_id: number;
        main_category_name: string;
        sub_category_id: number;
        sub_category_name: string;
        total_relationships: number;
        is_scrapped?: boolean;
        supports_relationships?: boolean;
        available_tabs: Array<{
            tab_key: string;
            tab_label: string;
            relation_types: string[];
            count: number;
            can_link: boolean;
        }>;
        available_relations?: Array<{
            code: string;
            label: string;
            category: string;
            targetType: string;
            description: string;
        }>;
    }>;
    getEligibleTargetAssets(queryDto: EligibleTargetsQueryDto, schema: string): Promise<{
        items: any[];
        total: number;
        limit: number;
        page: number;
    }>;
    unlinkTechnicalRelationship(mappingId: number, userId: number, schema: string): Promise<{
        message: string;
        mapping_id: number;
        source_serial_id: number;
        target_serial_id: number;
        relation_type: string;
    }>;
    getItemGovernanceRules(itemId: number, schema: string): Promise<{
        item: any;
        rules: any[];
    }>;
    getGovernanceMetadata(schema: string): Promise<{
        relationTypes: any[];
        categories: any[];
        subCategories: any[];
        items: any[];
        targetEntityTypes: string[];
    }>;
    createGovernanceRule(dto: CreateGovernanceRuleDto, schema: string): Promise<any>;
    updateGovernanceRule(governanceId: number, dto: UpdateGovernanceRuleDto, schema: string): Promise<any>;
    deleteGovernanceRule(governanceId: number, schema: string): Promise<any>;
    toggleGovernanceRuleStatus(governanceId: number, schema: string): Promise<any>;
}
