import { DataSource } from 'typeorm';
import { Deployment, DeploymentDevice, DeploymentDeviceStatus, DeploymentStatus } from './software.types';
export declare class DeploymentRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private assertSchema;
    private iso;
    mapDeployment(r: any): Deployment;
    mapDevice(r: any): DeploymentDevice;
    private static BASE_SELECT;
    insert(schema: string, input: {
        name: string;
        packageId: string;
        action: 'install' | 'uninstall';
        targetSelector: any;
        rings: string[][];
        ringThreshold: number;
        rebootPolicy: string;
        retryCount: number;
        requestedBy: number | null;
        requestedByName: string | null;
    }): Promise<Deployment>;
    insertDevices(schema: string, deploymentId: string, rings: string[][]): Promise<void>;
    list(schema: string, opts?: {
        status?: string;
        limit?: number;
        offset?: number;
    }): Promise<{
        deployments: Deployment[];
        total: number;
    }>;
    get(schema: string, id: string): Promise<Deployment | null>;
    devices(schema: string, deploymentId: string): Promise<DeploymentDevice[]>;
    setStatus(schema: string, id: string, status: DeploymentStatus, extra?: {
        approvedBy?: number | null;
        approvedByName?: string | null;
        rejectedReason?: string | null;
        currentRing?: number;
        started?: boolean;
        finished?: boolean;
    }): Promise<Deployment | null>;
    setDevice(schema: string, deploymentId: string, deviceId: string, patch: Partial<{
        status: DeploymentDeviceStatus;
        jobId: string | null;
        attemptsIncrement: number;
        exitCode: number | null;
        detected: boolean | null;
        installLog: string | null;
        error: string | null;
        started: boolean;
        finished: boolean;
    }>): Promise<void>;
    deviceByJob(schema: string, jobId: string): Promise<{
        deploymentId: string;
        deviceId: string;
    } | null>;
    ringRows(schema: string, deploymentId: string, ring: number): Promise<DeploymentDevice[]>;
    activeDeployments(schema: string): Promise<Deployment[]>;
    cancelPendingDevices(schema: string, deploymentId: string): Promise<string[]>;
}
