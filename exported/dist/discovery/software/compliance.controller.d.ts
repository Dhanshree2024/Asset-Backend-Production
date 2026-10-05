import { Request } from 'express';
import { RequestContextService } from 'src/common/context/request-context.service';
import { AuditService } from '../audit/audit.service';
import { ComplianceService } from './compliance.service';
import { CompliancePolicyInput } from './software.types';
export declare class ComplianceController {
    private readonly compliance;
    private readonly audit;
    private readonly requestContext;
    constructor(compliance: ComplianceService, audit: AuditService, requestContext: RequestContextService);
    private resolveSchema;
    summary(): Promise<{
        policies: any[];
        totals: Record<string, number>;
        topDevices: any[];
        status: boolean;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        policies: any[];
        totals: {};
        topDevices: any[];
    }>;
    policies(): Promise<{
        status: boolean;
        policies: import("./software.types").CompliancePolicy[];
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        policies: any[];
    }>;
    createPolicy(body: CompliancePolicyInput, req: Request): Promise<{
        status: boolean;
        policy: import("./software.types").CompliancePolicy;
        message: string;
    }>;
    updatePolicy(id: string, body: Partial<CompliancePolicyInput>, req: Request): Promise<{
        status: boolean;
        policy: import("./software.types").CompliancePolicy;
    }>;
    deletePolicy(id: string, req: Request): Promise<{
        status: boolean;
    }>;
    evaluate(req: Request): Promise<{
        message: string;
        devices: number;
        violations: number;
        status: boolean;
    }>;
    findings(status?: string, policyId?: string, deviceId?: string, severity?: string, limit?: string, offset?: string): Promise<{
        findings: import("./software.types").ComplianceFinding[];
        total: number;
        status: boolean;
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        findings: any[];
        total: number;
    }>;
    waive(id: string, body: {
        reason: string;
        until?: string | null;
    }, req: Request): Promise<{
        status: boolean;
        finding: import("./software.types").ComplianceFinding;
    }>;
    unwaive(id: string, req: Request): Promise<{
        status: boolean;
        finding: import("./software.types").ComplianceFinding;
    }>;
    remediate(id: string, req: Request): Promise<{
        message: string;
        finding: import("./software.types").ComplianceFinding;
        job: import("../interfaces/device.interface").RemoteJob;
        status: boolean;
    }>;
    protectedList(): Promise<{
        status: boolean;
        protected: import("./software.types").ProtectedSoftware[];
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        protected: any[];
    }>;
    addProtected(body: {
        nameMatch: string;
        publisherMatch?: string | null;
        reason?: string | null;
    }, req: Request): Promise<{
        status: boolean;
        entry: import("./software.types").ProtectedSoftware;
    }>;
    removeProtected(id: string, req: Request): Promise<{
        status: boolean;
    }>;
}
