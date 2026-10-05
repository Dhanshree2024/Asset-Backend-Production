import { Response } from 'express';
import { RequestContextService } from 'src/common/context/request-context.service';
import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly audit;
    private readonly requestContext;
    constructor(audit: AuditService, requestContext: RequestContextService);
    private resolveSchema;
    list(action?: string, actorUserId?: string, targetType?: string, targetId?: string, from?: string, to?: string, limit?: string, offset?: string): Promise<{
        status: boolean;
        entries: import("../phase2.types").AuditEntry[];
        total: number;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        entries: any[];
        total: number;
    }>;
    exportCsv(q: Record<string, string>, res: Response): Promise<void>;
}
