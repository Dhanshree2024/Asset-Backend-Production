import { DataSource } from 'typeorm';
export declare class LicenceTypesScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createLicenceTypesTable(schemaName: string): Promise<void>;
    insertLicenceTypeTable(schemaName: string, licenceTypes: {
        licence_type: string;
        licence_key_type: boolean;
    }[]): Promise<void>;
}
