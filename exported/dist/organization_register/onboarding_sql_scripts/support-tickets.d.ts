import { DataSource } from "typeorm";
export declare class SupportTicketTablesService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createSupportTicketTable(schemaName: string): Promise<void>;
}
