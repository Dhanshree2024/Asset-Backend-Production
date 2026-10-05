import { DataSource, Repository } from 'typeorm';
import { RequestContextService } from 'src/common/context/request-context.service';
import { CategoryTracingGroupBy, CategoryTracingReportDto } from './dto/category-tracing.dto';
import { SerialReportDto } from './dto/serial-report.dto';
import { DepreciationReportDto, VendorReportDto, WarrantyReportDto, TransferReportDto, MaintenanceReportDto, ScrapReportDto } from './dto/detail-report.dto';
import { SpecialPermissionsMaster } from 'src/organizational-profile/entity/policy-builder/special-permission-master';
import { PolicyAttribute } from 'src/organizational-profile/entity/policy-builder/policy-attribute.entity';
import { RedisService } from 'src/common/redis/redis.service';
export declare class ReportsService {
    private readonly dataSource;
    private readonly requestContext;
    private readonly redisService;
    private readonly specialPermissionRepo;
    private readonly policyAttrRepo;
    constructor(dataSource: DataSource, requestContext: RequestContextService, redisService: RedisService, specialPermissionRepo: Repository<SpecialPermissionsMaster>, policyAttrRepo: Repository<PolicyAttribute>);
    private resolveSchema;
    private buildBaseCte;
    private buildFilters;
    private buildInnerFilters;
    private buildSearchHaving;
    private groupSpec;
    getCategoryTracingReport(dto: CategoryTracingReportDto, branchIds: number[], userId: number, schema: string): Promise<{
        status: boolean;
        groupBy: CategoryTracingGroupBy;
        includeBranch: boolean;
        rows: any;
        totals: any;
        count: any;
        total: number;
        page: number;
        limit: any;
    }>;
    private buildSerialBaseCte;
    private buildSerialOuterFilters;
    private buildSerialInnerFilters;
    private serialReportConfig;
    getSerialReport(dto: SerialReportDto, branchIds: number[], userId: number, schema: string): Promise<{
        status: boolean;
        reportType: import("./dto/serial-report.dto").SerialReportType;
        ownershipTypes: string[];
        rows: any;
        count: any;
        total: number;
        page: number;
        limit: number;
    } | {
        status: boolean;
        reportType: "status" | "ownership" | "working_condition" | "purchase_month" | "asset_register";
        rows: any;
        totals: any;
        count: any;
        total: number;
        page: number;
        limit: any;
    }>;
    private currentFyLabel;
    getVendorReport(dto: VendorReportDto, branchIds: number[], userId: number, schema: string): Promise<{
        status: boolean;
        rows: any;
        totals: any;
        count: any;
        total: number;
        page: number;
        limit: any;
    }>;
    getDepreciationReport(dto: DepreciationReportDto, branchIds: number[], userId: number, schema: string): Promise<{
        status: boolean;
        fyLabel: string;
        rows: any;
        totals: any;
        count: any;
        total: number;
        page: number;
        limit: any;
    }>;
    getWarrantyReport(dto: WarrantyReportDto, branchIds: number[], userId: number, schema: string): Promise<{
        status: boolean;
        rows: any;
        totals: any;
        count: any;
        total: number;
        page: number;
        limit: any;
    }>;
    getTransferReport(dto: TransferReportDto, branchIds: number[], userId: number, schema: string): Promise<{
        status: boolean;
        rows: any;
        totals: any;
        count: any;
        total: number;
        page: number;
        limit: any;
    }>;
    getMaintenanceReport(dto: MaintenanceReportDto, branchIds: number[], userId: number, schema: string): Promise<{
        status: boolean;
        rows: any;
        totals: any;
        count: any;
        total: number;
        page: number;
        limit: any;
    }>;
    getScrapReport(dto: ScrapReportDto, branchIds: number[], userId: number, schema: string): Promise<{
        status: boolean;
        rows: any;
        totals: any;
        count: any;
        total: number;
        page: number;
        limit: any;
    }>;
    getUserByPublicID(public_user_id: number): Promise<number>;
    getItemOwnershipMatrixReport(dto: SerialReportDto, branchIds: number[], userId: number, schema: string): Promise<{
        status: boolean;
        reportType: import("./dto/serial-report.dto").SerialReportType;
        ownershipTypes: string[];
        rows: any;
        count: any;
        total: number;
        page: number;
        limit: number;
    }>;
}
