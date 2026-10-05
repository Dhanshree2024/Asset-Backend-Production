type BranchJoin = {
    type: 'left' | 'inner';
    from: string;
    alias: string;
    condition: string;
};
type BranchConfig = {
    alias: string;
    joins: BranchJoin[];
    column: string;
    rawCondition?: boolean;
};
export declare const BRANCH_MAP: Record<string, BranchConfig>;
export {};
