import { DataSource } from 'typeorm';
export declare class DocumentTypeScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createDocumentTypeTable(schemaName: string): Promise<void>;
}
