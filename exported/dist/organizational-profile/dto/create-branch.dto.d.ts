declare class PrimaryUserDto {
    first_name: string;
    middle_name: string;
    last_name: string;
    phone_number: string;
    user_alternative_contact_number: string;
    users_business_email: string;
    department_id: number;
}
export declare class CreateBranchDto {
    branchId?: string;
    branch_name: string;
    gstNo: string;
    city_id: number;
    country_id: number;
    location_id: number;
    branch_street: string;
    branch_landmark: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    contact_number: string;
    branch_email: string;
    alternative_contact_number: string;
    primary_user_id: number;
    created_by: number;
    is_active: boolean;
    is_deleted: boolean;
    established_date: Date;
    primaryUser: PrimaryUserDto;
}
export {};
