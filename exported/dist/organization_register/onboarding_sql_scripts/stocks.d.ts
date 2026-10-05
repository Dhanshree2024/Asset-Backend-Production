import { DataSource } from 'typeorm';
export declare class StocksScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createStocksTable(schemaName: string): Promise<void>;
}
