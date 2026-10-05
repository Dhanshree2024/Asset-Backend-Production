export declare class UpdateBranchDto {
    branch_id: number;
    branch_name?: string;
    contact_number?: string;
    branch_email?: string;
    branch_street?: string;
    branch_landmark?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    gstNo?: string;
    established_date?: string;
    primary_user_id?: number;
}
export declare class UpdateUserDto {
    user_id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    phone_number: string;
    users_business_email: string;
    role_id?: number;
    department_id?: number;
    designation_id?: number;
    branch_id?: number;
    street?: string;
    landmark?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
}
export declare class UpdateBranchAndUserDto {
    branch: UpdateBranchDto;
    user?: UpdateUserDto;
}
