import { Response } from 'express';
import { RedisService } from 'src/common/redis/redis.service';
import { AssetMappingService } from './asset-mapping.service';
import { AssignAssetsDto } from './dto/create-asset-mapping.dto';
import { CreateTechnicalRelationshipDto } from './dto/create-technical-relationship.dto';
import { EligibleTargetsQueryDto } from './dto/technical-relationship-query.dto';
import { CreateGovernanceRuleDto, UpdateGovernanceRuleDto } from './dto/create-governance-rule.dto';
import { ReassignAssetsDto, ReturnScrapDto } from './dto/update-asset-mapping.dto';
export declare class AssetMappingController {
    private readonly assetMappingService;
    private readonly redisService;
    constructor(assetMappingService: AssetMappingService, redisService: RedisService);
    exportAssetsMappingToExcel(res: Response, page?: number, limit?: number, searchQuery?: string, customFiltersStr?: string, asset_id?: number, status?: string): Promise<void>;
    findSingleAsset(mapping_id: number): Promise<import("./entities/asset-mapping.entity").AssetMappingRepository>;
    getAssignmentLogsBySerial(asset_stocks_unique_id: number): Promise<{
        event_id: number;
        performed_at: Date;
        notes: string;
        target_type: import("./entities/asset-mapping.entity").AssignTargetType;
        target_id: number;
        assigned_to_name: string;
        working_condition: string;
        color: string;
        performed_by: {
            user_id: number;
            name: string;
        };
    }[]>;
    getSingleAssetMapping(mapping_id: number): Promise<any>;
    assignAssets(dto: AssignAssetsDto, req: any): Promise<{
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
    reassignAssets(dto: ReassignAssetsDto, req: any): Promise<{
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
    returnAssets(dto: ReassignAssetsDto, req: any): Promise<{
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
    returnScrappedAssets(dto: ReturnScrapDto, req: any): Promise<{
        success: boolean;
        message: string;
    } | {
        message: string;
        success?: undefined;
    }>;
    removeAssignedAssets(body: {
        serialIds: any[];
    }, req: any): Promise<{
        status: string;
        message: string;
        data: {
            success: boolean;
            message: string;
        } | {
            message: string;
            success?: undefined;
        };
    }>;
    createTechnicalRelationship(dto: CreateTechnicalRelationshipDto, req: any): Promise<{
        status: string;
        message: string;
        data: {
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
        };
    }>;
    getAssetRelationships(serialId: number, req: any): Promise<{
        status: string;
        data: any[];
        total: number;
    }>;
    getRelationshipTabSummary(serialId: number, req: any): Promise<{
        status: string;
        data: {
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
        };
    }>;
    checkGovernanceByCategory(relationType: string, sourceMain?: string, sourceSub?: string, sourceItem?: string, targetMain?: string, targetSub?: string, targetItem?: string, req?: any): Promise<{
        status: string;
        data: {
            allowed: boolean;
            governance_id: number | null;
            rule_name: string | null;
            message: string | null;
        };
    }>;
    getEligibleTargets(queryDto: EligibleTargetsQueryDto, req: any): Promise<{
        status: string;
        data: any[];
        total: number;
        limit: number;
        page: number;
    }>;
    unlinkTechnicalRelationship(mappingId: number, req: any): Promise<{
        status: string;
        message: string;
        data: {
            message: string;
            mapping_id: number;
            source_serial_id: number;
            target_serial_id: number;
            relation_type: string;
        };
    }>;
    getItemGovernanceRules(itemId: number, req: any): Promise<{
        status: string;
        data: {
            item: any;
            rules: any[];
        };
    }>;
    getGovernanceMetadata(req: any): Promise<{
        status: string;
        data: {
            relationTypes: any[];
            categories: any[];
            subCategories: any[];
            items: any[];
            targetEntityTypes: string[];
        };
    }>;
    createGovernanceRule(dto: CreateGovernanceRuleDto, req: any): Promise<any>;
    updateGovernanceRule(governanceId: number, dto: UpdateGovernanceRuleDto, req: any): Promise<any>;
    deleteGovernanceRule(governanceId: number, req: any): Promise<any>;
    toggleGovernanceRuleStatus(governanceId: number, req: any): Promise<any>;
}
