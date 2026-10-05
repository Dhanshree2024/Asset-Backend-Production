import { Request } from 'express';
import { RequestContextService } from 'src/common/context/request-context.service';
import { AuditService } from '../audit/audit.service';
import { Phase2Settings, Phase2SettingsRepository } from './phase2-settings.repository';
export declare class SettingsController {
    private readonly settings;
    private readonly audit;
    private readonly requestContext;
    constructor(settings: Phase2SettingsRepository, audit: AuditService, requestContext: RequestContextService);
    private resolveSchema;
    get(): Promise<{
        status: boolean;
        settings: Phase2Settings;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        settings?: undefined;
    }>;
    update(body: Partial<Phase2Settings>, req: Request): Promise<{
        status: boolean;
        settings: Phase2Settings;
    }>;
}
