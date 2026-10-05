import { Request } from 'express';
import { RequestContextService } from 'src/common/context/request-context.service';
import { AuditService } from '../audit/audit.service';
import { JobsService } from '../jobs/jobs.service';
import { ComplianceRepository } from './compliance.repository';
import { ComplianceService } from './compliance.service';
import { PackageService } from './package.service';
export declare class SoftwareActionsController {
    private readonly compliance;
    private readonly complianceRepo;
    private readonly packages;
    private readonly jobs;
    private readonly audit;
    private readonly requestContext;
    constructor(compliance: ComplianceService, complianceRepo: ComplianceRepository, packages: PackageService, jobs: JobsService, audit: AuditService, requestContext: RequestContextService);
    private resolveSchema;
    software(deviceId: string): Promise<{
        status: boolean;
        software: {
            protected: boolean;
            protectedReason: string;
            canUninstall: boolean;
            isMsi: boolean;
            id: string;
            deviceId: string;
            name: string;
            version: string | null;
            publisher: string | null;
            productCode: string | null;
            uninstallString: string | null;
            architecture: string | null;
        }[];
    }>;
    compliance_(deviceId: string): Promise<{
        status: boolean;
        findings: import("./software.types").ComplianceFinding[];
    }>;
    install(deviceId: string, body: {
        packageId: string;
    }, req: Request): Promise<{
        status: boolean;
        job: import("../interfaces/device.interface").RemoteJob;
        message: string;
    }>;
    uninstall(deviceId: string, body: {
        softwareId: string;
        silentArgs?: string | null;
    }, req: Request): Promise<{
        status: boolean;
        job: import("../interfaces/device.interface").RemoteJob;
        message: string;
    }>;
}
