import { DataSource } from 'typeorm';
export declare class EnumScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private createEnumType;
    createAllEnums(schemaName: string): Promise<void>;
}
