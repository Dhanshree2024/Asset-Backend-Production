import { Request } from 'express';
export declare function getOrganizationMetadata(req: Request): {
    org_id: string;
    schema: string;
    register_login_user_id: string;
    branchIds: number[];
};
