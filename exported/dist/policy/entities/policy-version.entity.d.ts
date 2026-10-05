import { PolicyMaster } from './policy-master.entity';
export declare enum PolicyStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED"
}
export declare class PolicyVersion {
    policy_version_id: number;
    policy_id: number;
    policy: PolicyMaster;
    version: string;
    is_current: boolean;
    is_archived: boolean;
    status: PolicyStatus;
    released_date: Date;
    policy_content: string;
    policy_document: string;
    created_at: Date;
    updated_at: Date;
    created_by: number;
    updated_by: number;
}
