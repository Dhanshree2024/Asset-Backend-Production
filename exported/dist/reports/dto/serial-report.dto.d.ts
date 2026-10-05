import { CategoryTracingFiltersDto } from './category-tracing.dto';
export type SerialReportType = 'status' | 'working_condition' | 'ownership' | 'purchase_month' | 'asset_register' | 'item_ownership_matrix';
export declare class SerialReportDto {
    reportType: SerialReportType;
    filters?: CategoryTracingFiltersDto;
    search?: string;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
