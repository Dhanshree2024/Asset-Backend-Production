import { BRANCH_MAP } from './branchMap';
export declare function applyBranchFilter({ qb, repo, entityKey, alias, options, queryRunner, branchIds, allowUnscoped, }: {
    qb?: any;
    repo?: any;
    entityKey: keyof typeof BRANCH_MAP;
    alias?: string;
    options?: any;
    queryRunner?: any;
    branchIds?: number[];
    allowUnscoped?: boolean;
}): any;
