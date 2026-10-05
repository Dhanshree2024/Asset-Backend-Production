import { DataSource } from 'typeorm';
import { ComplianceFinding, CompliancePolicy, CompliancePolicyInput, FindingStatus, InstalledSoftwareRow, ProtectedSoftware } from './software.types';
export declare class ComplianceRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private assertSchema;
    private iso;
    mapPolicy(r: any): CompliancePolicy;
    mapFinding(r: any): ComplianceFinding;
    listPolicies(schema: string, onlyEnabled?: boolean): Promise<CompliancePolicy[]>;
    getPolicy(schema: string, id: string): Promise<CompliancePolicy | null>;
    insertPolicy(schema: string, p: CompliancePolicyInput, actor: {
        userId: number | null;
        name: string | null;
    }): Promise<CompliancePolicy>;
    updatePolicy(schema: string, id: string, p: Partial<CompliancePolicyInput>): Promise<CompliancePolicy | null>;
    deletePolicy(schema: string, id: string): Promise<boolean>;
    listFindings(schema: string, f?: {
        status?: string;
        policyId?: string;
        deviceId?: string;
        severity?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        findings: ComplianceFinding[];
        total: number;
    }>;
    getFinding(schema: string, id: string): Promise<ComplianceFinding | null>;
    findingsForDevice(schema: string, deviceId: string): Promise<ComplianceFinding[]>;
    upsertViolation(schema: string, policyId: string, deviceId: string, softwareName: string | null, detectedVersion: string | null, detail: string): Promise<void>;
    resolveExcept(schema: string, deviceId: string, violatingPolicyIds: string[]): Promise<number>;
    setFindingStatus(schema: string, id: string, status: FindingStatus, extra?: {
        waiverReason?: string | null;
        waivedBy?: number | null;
        waivedByName?: string | null;
        waivedUntil?: string | null;
        remediationJobId?: string | null;
    }): Promise<ComplianceFinding | null>;
    findingByJob(schema: string, jobId: string): Promise<ComplianceFinding | null>;
    expireWaivers(schema: string): Promise<number>;
    summary(schema: string): Promise<{
        policies: any[];
        totals: Record<string, number>;
        topDevices: any[];
    }>;
    installedSoftware(schema: string, deviceId: string): Promise<InstalledSoftwareRow[]>;
    installedSoftwareRow(schema: string, softwareId: string): Promise<InstalledSoftwareRow | null>;
    devicesWithSoftware(schema: string): Promise<string[]>;
    listProtected(schema: string): Promise<ProtectedSoftware[]>;
    insertProtected(schema: string, nameMatch: string, publisherMatch: string | null, reason: string | null, userId: number | null): Promise<ProtectedSoftware>;
    deleteProtected(schema: string, id: string): Promise<boolean>;
}
