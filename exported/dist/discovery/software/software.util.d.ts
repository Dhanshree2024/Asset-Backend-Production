export declare function compareVersions(a: string | null | undefined, b: string | null | undefined): number;
export declare function matchesGlob(pattern: string | null | undefined, value: string | null | undefined): boolean;
export declare function globToLike(pattern: string): string;
export interface ProtectedRule {
    nameMatch: string;
    publisherMatch?: string | null;
    reason?: string | null;
}
export declare function isProtected(rules: ProtectedRule[], name: string | null | undefined, publisher: string | null | undefined): ProtectedRule | null;
export declare function packageDownloadToken(schema: string, packageId: string, agentId: string, jobId: string, ttlSeconds?: number, now?: number): {
    token: string;
    expiresAt: string;
};
export declare function verifyPackageDownloadToken(token: string | undefined, schema: string, packageId: string, agentId: string, now?: number): {
    ok: boolean;
    reason?: string;
    jobId?: string;
};
export declare function splitRings(deviceIds: string[], ringSizes: number[] | undefined): string[][];
export declare function isRebootExitCode(code: number | null | undefined): boolean;
