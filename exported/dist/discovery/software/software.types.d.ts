export type InstallerType = 'msi' | 'exe' | 'ps1';
export type PackageStatus = 'pending_approval' | 'approved' | 'rejected' | 'superseded' | 'retired';
export type RebootBehaviour = 'none' | 'may-require' | 'always';
export type DetectionRule = {
    type: 'registry';
    hive: 'HKLM' | 'HKCU';
    key: string;
    value?: string;
    expected?: string;
} | {
    type: 'file';
    path: string;
    minVersion?: string;
} | {
    type: 'service';
    name: string;
} | {
    type: 'software';
    nameMatch: string;
    minVersion?: string;
};
export type PackageKind = 'software' | 'agent';
export interface SoftwarePackage {
    id: string;
    name: string;
    version: string;
    kind: PackageKind;
    installerType: InstallerType;
    architecture: 'x64' | 'x86' | 'any';
    fileName: string;
    sizeBytes: number;
    sha256: string;
    signatureSubject: string | null;
    requireSignature: boolean;
    silentInstallArgs: string | null;
    silentUninstallArgs: string | null;
    productCode: string | null;
    detectionRule: DetectionRule | null;
    rebootBehaviour: RebootBehaviour;
    status: PackageStatus;
    supersedesId: string | null;
    approvedBy: number | null;
    approvedByName: string | null;
    approvedAt: string | null;
    rejectedReason: string | null;
    notes: string | null;
    createdBy: number | null;
    createdByName: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface PackageMetaInput {
    name: string;
    version: string;
    kind?: PackageKind;
    installerType: InstallerType;
    architecture?: 'x64' | 'x86' | 'any';
    silentInstallArgs?: string | null;
    silentUninstallArgs?: string | null;
    productCode?: string | null;
    detectionRule?: DetectionRule | null;
    rebootBehaviour?: RebootBehaviour;
    requireSignature?: boolean;
    signatureSubject?: string | null;
    supersedesId?: string | null;
    notes?: string | null;
    expectedSha256?: string | null;
}
export type DeploymentStatus = 'pending_approval' | 'approved' | 'running' | 'paused' | 'completed' | 'cancelled' | 'rejected';
export type DeploymentDeviceStatus = 'pending' | 'queued' | 'downloading' | 'installing' | 'succeeded' | 'failed' | 'needs_reboot' | 'skipped' | 'cancelled';
export type RebootPolicy = 'never' | 'if-required' | 'force';
export interface TargetSelector {
    deviceIds?: string[];
    category?: string | null;
    segment?: string | null;
    osContains?: string | null;
    search?: string | null;
}
export interface Deployment {
    id: string;
    name: string;
    packageId: string;
    packageName?: string;
    packageVersion?: string;
    action: 'install' | 'uninstall';
    targetSelector: TargetSelector;
    rings: string[][];
    ringThreshold: number;
    currentRing: number;
    rebootPolicy: RebootPolicy;
    retryCount: number;
    status: DeploymentStatus;
    requestedBy: number | null;
    requestedByName: string | null;
    approvedBy: number | null;
    approvedByName: string | null;
    approvedAt: string | null;
    rejectedReason: string | null;
    startedAt: string | null;
    finishedAt: string | null;
    createdAt: string;
    updatedAt: string;
    counts?: Record<DeploymentDeviceStatus, number> & {
        total: number;
    };
}
export interface DeploymentDevice {
    id: string;
    deploymentId: string;
    deviceId: string;
    hostname: string | null;
    ip: string | null;
    ring: number;
    jobId: string | null;
    status: DeploymentDeviceStatus;
    attempts: number;
    exitCode: number | null;
    detected: boolean | null;
    installLog: string | null;
    error: string | null;
    startedAt: string | null;
    finishedAt: string | null;
    updatedAt: string;
}
export interface DeploymentInput {
    name: string;
    packageId: string;
    action?: 'install' | 'uninstall';
    targets: TargetSelector;
    ringSizes?: number[];
    ringThreshold?: number;
    rebootPolicy?: RebootPolicy;
    retryCount?: number;
}
export type PolicyRuleType = 'banned' | 'required' | 'version_floor' | 'version_ceiling';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type RemediationAction = 'none' | 'alert' | 'uninstall' | 'install';
export type FindingStatus = 'open' | 'approved' | 'remediating' | 'resolved' | 'waived';
export interface CompliancePolicy {
    id: string;
    name: string;
    description: string | null;
    enabled: boolean;
    scopeSelector: TargetSelector;
    ruleType: PolicyRuleType;
    appNameMatch: string;
    publisherMatch: string | null;
    versionValue: string | null;
    severity: Severity;
    remediationAction: RemediationAction;
    remediationPackageId: string | null;
    requiresApproval: boolean;
    createdBy: number | null;
    createdByName: string | null;
    createdAt: string;
    updatedAt: string;
    openFindings?: number;
}
export interface CompliancePolicyInput {
    name: string;
    description?: string | null;
    enabled?: boolean;
    scopeSelector?: TargetSelector;
    ruleType: PolicyRuleType;
    appNameMatch: string;
    publisherMatch?: string | null;
    versionValue?: string | null;
    severity?: Severity;
    remediationAction?: RemediationAction;
    remediationPackageId?: string | null;
    requiresApproval?: boolean;
}
export interface ComplianceFinding {
    id: string;
    policyId: string;
    policyName?: string;
    ruleType?: PolicyRuleType;
    severity?: Severity;
    deviceId: string;
    hostname?: string | null;
    ip?: string | null;
    softwareName: string | null;
    detectedVersion: string | null;
    detail: string | null;
    status: FindingStatus;
    remediationJobId: string | null;
    waiverReason: string | null;
    waivedBy: number | null;
    waivedByName: string | null;
    waivedUntil: string | null;
    firstDetected: string;
    lastEvaluated: string;
    resolvedAt: string | null;
}
export interface ProtectedSoftware {
    id: string;
    nameMatch: string;
    publisherMatch: string | null;
    reason: string | null;
    createdBy: number | null;
    createdAt: string;
}
export interface InstalledSoftwareRow {
    id: string;
    deviceId: string;
    name: string;
    version: string | null;
    publisher: string | null;
    productCode: string | null;
    uninstallString: string | null;
    architecture: string | null;
}
