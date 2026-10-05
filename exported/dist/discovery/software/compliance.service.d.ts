import { OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuditService } from '../audit/audit.service';
import { RemoteJob } from '../interfaces/device.interface';
import { JobsService } from '../jobs/jobs.service';
import { AuditActor } from '../phase2.types';
import { DeviceRepository } from '../store/device.repository';
import { ComplianceRepository } from './compliance.repository';
import { PackageService } from './package.service';
import { ComplianceFinding, CompliancePolicy, CompliancePolicyInput, InstalledSoftwareRow } from './software.types';
import { TargetResolver } from './target.resolver';
export interface Violation {
    policyId: string;
    softwareName: string | null;
    detectedVersion: string | null;
    detail: string;
}
export declare function evaluatePolicy(policy: CompliancePolicy, software: InstalledSoftwareRow[]): Violation | null;
export declare class ComplianceService implements OnModuleInit {
    private readonly dataSource;
    private readonly repo;
    private readonly devices;
    private readonly targets;
    private readonly jobs;
    private readonly packages;
    private readonly audit;
    private readonly logger;
    constructor(dataSource: DataSource, repo: ComplianceRepository, devices: DeviceRepository, targets: TargetResolver, jobs: JobsService, packages: PackageService, audit: AuditService);
    onModuleInit(): void;
    private validate;
    listPolicies(schema: string): Promise<CompliancePolicy[]>;
    createPolicy(schema: string, actor: AuditActor, p: CompliancePolicyInput): Promise<CompliancePolicy>;
    updatePolicy(schema: string, id: string, p: Partial<CompliancePolicyInput>): Promise<CompliancePolicy>;
    deletePolicy(schema: string, id: string): Promise<void>;
    evaluateDevice(schema: string, deviceId: string, policies?: CompliancePolicy[]): Promise<{
        violations: number;
        resolved: number;
    }>;
    evaluateAll(schema: string): Promise<{
        devices: number;
        violations: number;
    }>;
    nightly(): Promise<void>;
    listFindings(schema: string, f: Parameters<ComplianceRepository['listFindings']>[1]): Promise<{
        findings: ComplianceFinding[];
        total: number;
    }>;
    findingsForDevice(schema: string, deviceId: string): Promise<ComplianceFinding[]>;
    summary(schema: string): Promise<{
        policies: any[];
        totals: Record<string, number>;
        topDevices: any[];
    }>;
    waive(schema: string, actor: AuditActor, id: string, reason: string, until: string | null): Promise<ComplianceFinding>;
    unwaive(schema: string, id: string): Promise<ComplianceFinding>;
    remediate(schema: string, actor: AuditActor, id: string): Promise<{
        finding: ComplianceFinding;
        job: RemoteJob;
    }>;
    private onRemediationJob;
    listProtected(schema: string): Promise<import("./software.types").ProtectedSoftware[]>;
    addProtected(schema: string, actor: AuditActor, nameMatch: string, publisherMatch: string | null, reason: string | null): Promise<import("./software.types").ProtectedSoftware>;
    removeProtected(schema: string, id: string): Promise<void>;
    uninstall(schema: string, actor: AuditActor, deviceId: string, softwareId: string, silentArgs: string | null, extra?: Record<string, unknown>): Promise<RemoteJob>;
}
