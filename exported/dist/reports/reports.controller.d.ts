import { CategoryTracingReportDto } from './dto/category-tracing.dto';
import { SerialReportDto } from './dto/serial-report.dto';
import { DepreciationReportDto, VendorReportDto, WarrantyReportDto, TransferReportDto, MaintenanceReportDto, ScrapReportDto } from './dto/detail-report.dto';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getCategoryTracingReport(dto: CategoryTracingReportDto, req: any): Promise<{
        status: boolean;
        groupBy: import("./dto/category-tracing.dto").CategoryTracingGroupBy;
        includeBranch: boolean;
        rows: any;
        totals: any;
        count: any;
        total: number;
        page: number;
        limit: any;
    } | {
        status: boolean;
        message: string;
        error: any;
        rows: any[];
        totals: {
            total_assets: number;
            total_unit_value: number;
            total_tax_value: number;
            total_value: number;
            distinct_items: number;
        };
    }>;
    getSerialReport(dto: SerialReportDto, req: any): Promise<{
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
    } | {
        status: boolean;
        message: string;
        error: any;
        rows: any[];
        totals: {};
    }>;
    getVendorReport(dto: VendorReportDto, req: any): Promise<{
        status: boolean;
        rows: any;
        totals: any;
        count: any;
        total: number;
        page: number;
        limit: any;
    } | {
        status: boolean;
        message: string;
        error: any;
        rows: any[];
        totals: {};
    }>;
    getDepreciationReport(dto: DepreciationReportDto, req: any): Promise<{
        status: boolean;
        fyLabel: string;
        rows: any;
        totals: any;
        count: any;
        total: number;
        page: number;
        limit: any;
    } | {
        status: boolean;
        message: string;
        error: any;
        rows: any[];
        totals: {};
    }>;
    getWarrantyReport(dto: WarrantyReportDto, req: any): Promise<{
        status: boolean;
        rows: any;
        totals: any;
        count: any;
        total: number;
        page: number;
        limit: any;
    } | {
        status: boolean;
        message: string;
        error: any;
        rows: any[];
        totals: {};
    }>;
    getTransferReport(dto: TransferReportDto, req: any): Promise<{
        status: boolean;
        rows: any;
        totals: any;
        count: any;
        total: number;
        page: number;
        limit: any;
    } | {
        status: boolean;
        message: string;
        error: any;
        rows: any[];
        totals: {
            total_transfers: number;
            total_completed: number;
            total_pending: number;
            total_in_transit: number;
        };
    }>;
    getMaintenanceReport(dto: MaintenanceReportDto, req: any): Promise<{
        status: boolean;
        rows: any;
        totals: any;
        count: any;
        total: number;
        page: number;
        limit: any;
    } | {
        status: boolean;
        message: string;
        error: any;
        rows: any[];
        totals: {};
    }>;
    getScrapReport(dto: ScrapReportDto, req: any): Promise<{
        status: boolean;
        rows: any;
        totals: any;
        count: any;
        total: number;
        page: number;
        limit: any;
    } | {
        status: boolean;
        message: string;
        error: any;
        rows: any[];
        totals: {};
    }>;
}
