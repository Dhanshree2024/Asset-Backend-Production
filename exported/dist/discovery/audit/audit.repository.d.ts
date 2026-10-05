import { DataSource } from 'typeorm';
import { AuditActor, AuditEntry, AuditEntryInput, AuditListFilters } from '../phase2.types';
export declare class AuditRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private assertSchema;
    insert(schema: string, actor: AuditActor, entry: AuditEntryInput): Promise<AuditEntry>;
    list(schema: string, f?: AuditListFilters): Promise<{
        rows: AuditEntry[];
        total: number;
    }>;
    private map;
}
