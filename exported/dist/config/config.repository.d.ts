import { DataSource, Repository } from 'typeorm';
import { Config } from './config.entity';
export declare class ConfigRepository extends Repository<Config> {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    getJwtSecret(): Promise<string>;
}
