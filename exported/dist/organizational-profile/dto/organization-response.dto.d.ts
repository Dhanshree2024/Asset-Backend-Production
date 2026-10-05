declare class AddressDto {
    street: string;
    city: string;
    state: string;
    postalCode: number;
    landmark: string;
    country: string;
}
export declare class OrganizationResponseDto {
    organization_profile_id: number;
    user_id: number;
    industry_type_id: number;
    department_id: number;
    designation_id: number;
    role_id: number;
    organization_id: number;
    organizationName: string;
    contactNumber: string;
    email: string;
    hqAddress: string;
    hqAddressFields: AddressDto;
    industryType: string;
    establishedDate: string;
    website: string;
    financialYear: string;
    baseCurrency: string;
    dateFormat: string;
    timeZone: string;
    gstNumber: string;
    primaryContactName: string;
    primaryContactEmail: string;
    primaryContactPhone: string;
    primaryContactRole: string;
    billingContactName: string;
    billingContactEmail: string;
    billingContactPhone: string;
    themeMode: string;
    customThemeColor: string;
    logo: string;
    logoPreviewBase64: string;
    role_name: string;
    it_act_enabled: boolean;
    company_act_enabled: boolean;
}
export {};
