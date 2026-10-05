import { AssetEventsService } from './asset-events.service';
export declare class AssetEventsController {
    private readonly assetEventsService;
    constructor(assetEventsService: AssetEventsService);
    getEventsByStockSerial(serialId: any): Promise<{
        log_id: number;
        activity_type: import("./entities/asset-events.entity").AssetEventCategory;
        title: string;
        message: string;
        description_or_note: string;
        created_at: Date;
        working_status_name: string;
        working_status_color: string;
        performed_by: {
            id: number;
            name: string;
        };
        is_current: boolean;
        metadata: Record<string, any>;
    }[]>;
}
