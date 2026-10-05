export declare class Address {
    street: string;
    landmark?: string;
    city: string;
    state: string;
    postalCode: number;
    country: string;
}
export declare class BranchResponseDTO {
    id: number;
    branchName: string;
    contactNumber: string;
    alternateContactNumber?: string;
    establishedDate?: Date;
    gstNumber?: string;
    email: string;
    address: Address;
    status: boolean;
    createdAt: Date;
    lastModified: Date;
}
