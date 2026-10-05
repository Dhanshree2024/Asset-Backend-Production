import { DataSource } from 'typeorm';
import { JobsService } from '../jobs/jobs.service';
import { AgentRepository } from '../store/agent.repository';
import { Phase2SettingsRepository } from '../settings/phase2-settings.repository';
export declare const AUTO_COLLECT_ACTOR: {
    userId: any;
    name: string;
    ip: any;
    requestId: any;
};
export type CollectKind = 'services' | 'events' | 'perf';
export declare class EndpointAutoCollectService {
    private readonly dataSource;
    private readonly jobs;
    private readonly agents;
    private readonly settings;
    private readonly logger;
    constructor(dataSource: DataSource, jobs: JobsService, agents: AgentRepository, settings: Phase2SettingsRepository);
    private tableExists;
    private hasSnapshot;
    private hasActiveJob;
    private typeOf;
    queue(schema: string, deviceId: string, kind: CollectKind, agentId: string | null, label: string): Promise<boolean>;
    bootstrapForDevice(schema: string, deviceId: string | number, agentId?: string | null, label?: string): Promise<{
        queued: string[];
    }>;
}
