import { AssetWorkingStatus } from 'src/assets-data/asset-working-status/entities/asset-working-status.entity';
import { AssetsStatus } from 'src/assets-data/assets-status/entities/assets-status.entity';
import { AssetStockSerials } from 'src/assets-data/stocks/entities/asset_stock_serials.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { AssetEvent, AssetEventCategory } from './entities/asset-events.entity';
export declare class AssetEventsService {
    private readonly dataSource;
    private readonly assetEventRepo;
    private readonly assetStockSerials;
    private readonly assetWorkingStatus;
    private readonly assetsStatus;
    constructor(dataSource: DataSource, assetEventRepo: Repository<AssetEvent>, assetStockSerials: Repository<AssetStockSerials>, assetWorkingStatus: Repository<AssetWorkingStatus>, assetsStatus: Repository<AssetsStatus>);
    generateEvent(manager: EntityManager, payload: {
        asset_id: number;
        asset_stocks_unique_id?: number;
        event_category: AssetEventCategory;
        performed_by: number;
        reference_table?: string;
        reference_id?: number;
        metadata?: Record<string, any>;
        title?: string;
        description?: string;
        event_type_id?: number;
        created_at?: any;
    }): Promise<AssetEvent>;
    private readonly EVENT_UI_CONFIG;
    getEventsByStockSerialId(assetStockSerialId: number): Promise<{
        log_id: number;
        activity_type: AssetEventCategory;
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
