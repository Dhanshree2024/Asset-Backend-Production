import { Request } from 'express';
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { CreatePolicyVersionDto } from './dto/create-policy-version.dto';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { GetPolicyAcknowledgementsDto } from './dto/acknowledgement.dto';
export declare class PolicyController {
    private readonly policyService;
    constructor(policyService: PolicyService);
    private resolveUserId;
    create(file: Express.Multer.File, dto: CreatePolicyDto, req: Request): Promise<{
        status: boolean;
        message: string;
        data: {
            policy: import("./entities/policy-master.entity").PolicyMaster;
            version: import("./entities/policy-version.entity").PolicyVersion;
        };
    }>;
    findAll(dto: ListViewDto, req: Request): Promise<{
        status: boolean;
        rows: import("./entities/policy-master.entity").PolicyMaster[];
        count: number;
        total: number;
        meta: any;
    }>;
    findOne(policy_id: number): Promise<import("./entities/policy-master.entity").PolicyMaster>;
    update(dto: UpdatePolicyDto & {
        policy_id: number;
    }, req: Request): Promise<import("./entities/policy-master.entity").PolicyMaster>;
    createVersion(file: Express.Multer.File, dto: CreatePolicyVersionDto, req: Request): Promise<{
        status: boolean;
        message: string;
        data: {
            policy: import("./entities/policy-master.entity").PolicyMaster;
            version: import("./entities/policy-version.entity").PolicyVersion;
        };
    }>;
    publishVersion(policy_id: number, versionId: number, req: Request): Promise<{
        status: boolean;
        message: string;
        data: {
            policy: import("./entities/policy-master.entity").PolicyMaster;
            version: import("./entities/policy-version.entity").PolicyVersion;
        };
    }>;
    unpublishVersion(policy_id: number, versionId: number, req: Request): Promise<import("./entities/policy-version.entity").PolicyVersion>;
    markAllAcknowledged(policy_id: number, versionId: number, req: Request): Promise<{
        status: boolean;
        message: string;
    }>;
    findMyPolicies(dto: ListViewDto, req: Request): Promise<{
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
            status: import("./entities/policy-version.entity").PolicyStatus;
            released_date: Date;
            policy_content: string;
            policy_document: string;
            acknowledge_status: string;
            acknowledged_at: any;
            can_acknowledge: boolean;
        }[];
        meta: any;
    }>;
    acknowledgePolicy(policy_id: number, versionId: number, req: Request): Promise<import("./entities/acknowledgement.entity").PolicyAcknowledgement>;
    updateDraftVersion(file: Express.Multer.File, policy_id: number, versionId: number, dto: any, req: Request): Promise<{
        policy: import("./entities/policy-master.entity").PolicyMaster;
        version: import("./entities/policy-version.entity").PolicyVersion;
    }>;
    getAcknowledgements(dto: GetPolicyAcknowledgementsDto & ListViewDto): Promise<{
        status: boolean;
        rows: any[];
        count: number;
        total: number;
        meta: any;
    }>;
    sendReminder(policy_id: number, versionId: number, req: Request): Promise<{
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
    findMyPolicyDetail(policy_id: number, versionId: number, req: Request): Promise<{
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
        status: import("./entities/policy-version.entity").PolicyStatus;
        released_date: Date;
        policy_content: string;
        policy_document: string;
        acknowledge_status: string;
        acknowledged_at: Date;
        can_acknowledge: boolean;
    }>;
}
