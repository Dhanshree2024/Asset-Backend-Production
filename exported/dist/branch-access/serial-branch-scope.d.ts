import { DataSource, EntityManager } from 'typeorm';
export interface SerialScopeResult {
    ids: number[];
    dropped: number[];
    enforced: boolean;
}
export declare function scopeSerialIdsToBranch(opts: {
    runner: DataSource | EntityManager;
    schema: string;
    ids: number[];
    branchIds: number[];
    label: string;
}): Promise<SerialScopeResult>;
