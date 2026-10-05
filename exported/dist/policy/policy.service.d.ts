import { RequestContextService } from 'src/common/context/request-context.service';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { NotificationHelper } from 'src/common/notifications/notifications.helper';
import { RedisService } from 'src/common/redis/redis.service';
import { User } from 'src/organizational-profile/entity/organizational-user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePolicyVersionDto } from './dto/create-policy-version.dto';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PolicyAcknowledgement } from './entities/acknowledgement.entity';
import { AssignTypeEnum, PolicyMaster } from './entities/policy-master.entity';
import { PolicyStatus, PolicyVersion } from './entities/policy-version.entity';
export interface FindAllPoliciesQuery {
    search?: string;
    category?: string[];
    status?: string[];
    page?: number;
    limit?: number;
}
export declare class PolicyService {
    private readonly dataSource;
    private readonly requestContext;
    private readonly redisService;
    private readonly notificationHelper;
    private readonly userRepository;
    constructor(dataSource: DataSource, requestContext: RequestContextService, redisService: RedisService, notificationHelper: NotificationHelper, userRepository: Repository<User>);
    private buildPolicyDocumentJson;
    createPolicy(dto: CreatePolicyDto, userId: number, file?: Express.Multer.File): Promise<{
        status: boolean;
        message: string;
        data: {
            policy: PolicyMaster;
            version: PolicyVersion;
        };
    }>;
    private sendPolicyPublishedNotificationAsync;
    findOne(policy_id: number): Promise<PolicyMaster>;
    updatePolicy(policy_id: number, dto: UpdatePolicyDto, userId: number): Promise<PolicyMaster>;
    createVersion(dto: CreatePolicyVersionDto, userId: number, file?: Express.Multer.File): Promise<{
        status: boolean;
        message: string;
        data: {
            policy: PolicyMaster;
            version: PolicyVersion;
        };
    }>;
    updateDraftVersion(policy_id: number, versionId: number, dto: {
        policy_name?: string;
        category?: string | number[];
        applicable_type?: AssignTypeEnum;
        applicable_to?: number[];
        policy_content?: string;
    }, userId: number, file?: Express.Multer.File): Promise<{
        policy: PolicyMaster;
        version: PolicyVersion;
    }>;
    publishVersion(policy_id: number, versionId: number, userId: number): Promise<{
        status: boolean;
        message: string;
        data: {
            policy: PolicyMaster;
            version: PolicyVersion;
        };
    }>;
    unpublishVersion(policy_id: number, versionId: number, userId: number): Promise<PolicyVersion>;
    markAllAcknowledged(policy_id: number, versionId: number, userId: number): Promise<{
        status: boolean;
        message: string;
    }>;
    getUserByPublicID(public_user_id: number): Promise<number>;
    private attachListMetadata;
    findAll(schema: string, dto: ListViewDto): Promise<{
        status: boolean;
        rows: PolicyMaster[];
        count: number;
        total: number;
        meta: any;
    }>;
    private getListCacheKey;
    findMyPolicies(schema: string, userId: number, dto: ListViewDto): Promise<{
        status: boolean;
        rows: {
            ak_id: number;
            policy_id: number;
            policy_name: string;
            category: number[];
            category_names: {
                id: number;
                name: string;
            }[];
            created_by: number;
            created_by_name: string;
            policy_version_id: number;
            version: string;
            status: PolicyStatus;
            released_date: Date;
            policy_content: string;
            policy_document: string;
            acknowledge_status: string;
            acknowledged_at: any;
            can_acknowledge: boolean;
        }[];
        meta: any;
    }>;
    private getMyPolicyVersionContext;
    findMyPolicyDetail(userId: number, policy_id: number, versionId: number): Promise<{
        ak_id: number;
        policy_id: number;
        policy_name: string;
        category: number[];
        category_names: {
            id: number;
            name: string;
        }[];
        created_by: number;
        created_by_name: string;
        policy_version_id: number;
        version: string;
        status: PolicyStatus;
        released_date: Date;
        policy_content: string;
        policy_document: string;
        acknowledge_status: string;
        acknowledged_at: Date;
        can_acknowledge: boolean;
    }>;
    sendPolicyReminder(policy_id: number, versionId: number, userId: any): Promise<{
        status: boolean;
        message: string;
        data?: undefined;
    } | {
        status: boolean;
        message: string;
        data: {
            policy_id: number;
            policy_version_id: number;
            recipients_count: number;
        };
    }>;
    acknowledgePolicy(policy_id: number, versionId: number, userId: number): Promise<PolicyAcknowledgement>;
    getAcknowledgements(policy_id: number, policy_version_id: number, ackType: 'ACCEPTED' | 'NOT_ACCEPTED' | 'TOTAL', dto: ListViewDto): Promise<{
        status: boolean;
        rows: any[];
        count: number;
        total: number;
        meta: any;
    }>;
}
