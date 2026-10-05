export declare class SuggestImportDto {
    deviceIds: number[];
}
export declare class ImportSpecCreateFieldDto {
    label: string;
    fieldCategoryId?: number;
}
export declare class ImportSpecDto {
    key: string;
    value: any;
    fieldId?: number;
    createField?: ImportSpecCreateFieldDto;
}
export declare class ImportNewLocationDto {
    name: string;
    branchId?: number;
    locationTypeId?: number;
}
export declare class ImportSoftwareDto {
    softwareKey?: string;
    installedSoftwareId?: number;
    name: string;
    version?: string | null;
    publisher?: string | null;
    productCode?: string | null;
    installLocation?: string | null;
    installDate?: string | null;
    maintainInventory: boolean;
    relationType?: string;
    useExistingSerialId?: number;
    existingItemId?: number;
    newItemName?: string;
    subCategoryId?: number;
    licenseMetric?: 'PER_DEVICE' | 'PER_USER' | 'HYBRID' | 'SITE' | 'FREE';
    licenseKey?: string | null;
}
export declare class ImportItemDto {
    deviceId: number;
    software?: ImportSoftwareDto[];
    categoryId?: number;
    newCategoryName?: string;
    subCategoryId?: number;
    newSubCategoryName?: string;
    itemId?: number;
    newItemName?: string;
    itemType?: 'Physical' | 'Virtual';
    title?: string;
    locationMappingId?: number;
    newLocation?: ImportNewLocationDto;
    ownershipStatusId?: number;
    specs?: ImportSpecDto[];
    mode?: 'create' | 'update';
}
export declare class ExecuteImportDefaultsDto {
    locationMappingId?: number;
    addedBy?: number;
}
export declare class ExecuteImportDto {
    items: ImportItemDto[];
    defaults?: ExecuteImportDefaultsDto;
}
