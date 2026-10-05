import { Request } from 'express';
import { AuditActor, AuditEntry, AuditEntryInput, AuditListFilters } from '../phase2.types';
import { AuditRepository } from './audit.repository';
export declare class AuditService {
    private readonly repo;
    private readonly logger;
    private writeFailures;
    constructor(repo: AuditRepository);
    actor(req: Request | undefined): AuditActor;
    record(schema: string, actor: AuditActor, entry: AuditEntryInput): Promise<AuditEntry | null>;
    wrap<T>(schema: string, actor: AuditActor, entry: AuditEntryInput, fn: () => Promise<T>): Promise<T>;
    list(schema: string, filters: AuditListFilters): Promise<{
        rows: AuditEntry[];
        total: number;
    }>;
}
