import { WarrantyType } from "src/assets-data/asset-items/entities/asset-item.enums";
export declare class UpdateStockBillDto {
    procurement_item_id: number;
    procurement_id: number;
    asset_id: number;
    updated_by?: number;
    vendor_id?: number | null;
    bill_no?: string | null;
    invoice_no?: string | null;
    purchase_date?: string | null;
    buy_price?: number | null;
    gst_percent?: number | null;
    gst_amount?: number | null;
    total_without_gst?: number | null;
    total_amount?: number | null;
    ownership_status_id?: number;
    documents?: any;
    subscription_type?: string | null;
    billing_frequency?: string | null;
    sub_start_date?: string | null;
    next_renewal_date?: string | null;
    quantity?: number;
    location_id?: number | null;
    retained_serial_ids?: number[];
    new_serials?: string[];
}
export declare class UploadBillDocumentDto {
    procurement_item_id: number;
    procurement_id: number;
    asset_id: number;
}
export declare class UpdateWarrantyDto {
    asset_stocks_unique_id: number;
    asset_id?: number;
    stock_id?: number;
    asset_item_id?: number;
    procurement_id?: number;
    warranty_category?: WarrantyType[];
    warranty_in_year?: number;
    warranty_duration_type?: string;
    warranty_start_date?: string;
    warranty_end_date?: string;
    support_type?: string;
    support_contract?: string;
    contract_number?: string;
    amc_vendor?: number;
    amc_frequency?: string;
    last_service_date?: string;
    next_service_due_date?: string;
    updated_by?: number;
}
export declare class UpdateSubscriptionDto {
    asset_stocks_unique_id: number;
    asset_id?: number;
    stock_id?: number;
    asset_item_id?: number;
    procurement_id?: number;
    warranty_category?: WarrantyType[];
    sub_start_date?: string;
    next_renewal_date?: string;
    subscription_type?: string;
    billing_frequency?: string;
    updated_by?: number;
}
