import { DataSource, EntityTarget, Repository } from 'typeorm';
export declare function getTenantRepository<T>(dataSource: DataSource, entity: EntityTarget<T>, schema: string): Promise<Repository<T>>;
export declare function withTenantRepository<T>(dataSource: DataSource, entity: EntityTarget<T>, schema: string, callback: (repo: Repository<T>) => Promise<void>): Promise<void>;
