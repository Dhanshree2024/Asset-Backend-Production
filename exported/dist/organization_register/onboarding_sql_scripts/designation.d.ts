import { DataSource } from 'typeorm';
export declare class DesignationScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createDesignationTable(schemaName: string): Promise<void>;
    insertDesignationTable(schemaName: string, designations: {
        parent_department: string;
        designation_name: string;
    }[]): Promise<void>;
}
