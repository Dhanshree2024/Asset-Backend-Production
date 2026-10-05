import { DataSource } from 'typeorm';
export declare class UserLocFavouriteScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createUserLocFavTable(schemaName: string): Promise<void>;
}
