import { RegisterUserLogin } from 'src/organization_register/entities/register-user-login.entity';
import { AssetLimitation } from 'src/organizational-profile/public_schema_entity/asset-limitation.entity';
import { DataSource, Repository } from 'typeorm';
import { ManageAssetService } from '../../manage-asset/manage-asset.service';
import { RedisService } from '../redis/redis.service';
export declare class MaintenanceCronService {
    private readonly manageAssetService;
    private readonly dataSource;
    private readonly redisService;
    private readonly registerUserLoginRepository;
    private readonly limitationRepo;
    private readonly logger;
    private invitationCronRunning;
    private partitionCronRunning;
    private isRunning;
    private readonly SCHEDULED_STATUS;
    private readonly OVERDUE_STATUS;
    constructor(manageAssetService: ManageAssetService, dataSource: DataSource, redisService: RedisService, registerUserLoginRepository: Repository<RegisterUserLogin>, limitationRepo: Repository<AssetLimitation>);
    handleOverdueMaintenance(): Promise<void>;
    markOverdueMaintenance(): Promise<void>;
    handleExpiredInvitations(): Promise<void>;
    getTenantSchemas(): Promise<string[]>;
    handlePartitionCreation(): Promise<void>;
    createNextMonthPartitions(): Promise<{
        created: string[];
        skipped: string[];
        failed: string[];
    }>;
}
