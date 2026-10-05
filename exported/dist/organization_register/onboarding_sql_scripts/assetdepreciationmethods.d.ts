import { DataSource } from 'typeorm';
export declare class assetDepreciationMethodsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createassetDepreciationMethodsScriptTable(schemaName: string): Promise<void>;
    insertDepreciationMethods(schemaName: string, methods: {
        dep_method_name: string;
    }[]): Promise<void>;
}
