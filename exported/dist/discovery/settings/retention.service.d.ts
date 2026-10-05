import { DataSource } from 'typeorm';
import { EndpointRepository } from '../endpoint/endpoint.repository';
import { JobsService } from '../jobs/jobs.service';
import { AgentRepository } from '../store/agent.repository';
import { AuditService } from '../audit/audit.service';
import { Phase2SettingsRepository } from './phase2-settings.repository';
import { EndpointAutoCollectService } from '../endpoint/auto-collect.service';
export declare class RetentionService {
    private readonly dataSource;
    private readonly settings;
    private readonly endpoint;
    private readonly agents;
    private readonly jobs;
    private readonly audit;
    private readonly autoCollect;
    private readonly logger;
    private firedMinute;
    constructor(dataSource: DataSource, settings: Phase2SettingsRepository, endpoint: EndpointRepository, agents: AgentRepository, jobs: JobsService, audit: AuditService, autoCollect: EndpointAutoCollectService);
    private schemas;
    nightlyRetention(): Promise<void>;
    scheduledEventCollection(): Promise<void>;
}
