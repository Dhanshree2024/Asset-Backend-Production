export declare const DISCOVERY_MODULE = "Agent Discovery";
export declare const DiscoverySub: {
    readonly Dashboard: "Dashboard";
    readonly Config: "Config";
    readonly Collector: "Collector";
    readonly Import: "Import to Assets";
    readonly Credentials: "Credentials";
    readonly Jobs: "Jobs";
    readonly Audit: "Audit Log";
    readonly AD: "Active Directory";
    readonly Agents: "Agents";
    readonly Packages: "Packages";
    readonly Deployments: "Deployments";
    readonly Compliance: "Compliance";
};
export type DiscoverySubmodule = (typeof DiscoverySub)[keyof typeof DiscoverySub];
export type DiscoveryAction = 'VIEW' | 'ADD' | 'EDIT' | 'DELETE' | 'IMPORT' | 'EXPORT';
export declare const RequireDiscovery: (submodule: DiscoverySubmodule, action: DiscoveryAction) => import("@nestjs/common").CustomDecorator<string>;
