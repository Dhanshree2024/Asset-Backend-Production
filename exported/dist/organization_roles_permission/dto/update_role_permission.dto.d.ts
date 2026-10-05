export declare class UpdateRoleWithPermissionsDto {
    role_id: number;
    roleName: string;
    roledescription: string;
    permissions: {
        [key: string]: any;
    }[];
    is_deleted?: boolean;
    is_compulsary?: boolean;
    is_outside_organization?: boolean;
}
export declare class BulkUpdateRolesWithPermissionsDto {
    roles: UpdateRoleWithPermissionsDto[];
}
