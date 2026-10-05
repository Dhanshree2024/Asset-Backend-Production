export type ActionCode = 'ASSIGN' | 'REASSIGN' | 'RETURN' | 'MAINTENANCE' | 'SCRAP' | 'TRANSFER';
export interface AssetRule {
    code: string;
    label: string;
    sql: (schema: string) => string;
    reason: string;
    remediable?: boolean;
}
export declare const ASSET_ACTION_RULES: Record<ActionCode, AssetRule[]>;
export declare function buildRuleCaseSql(action: ActionCode, schema: string): string | null;
export declare function getRule(action: ActionCode, code: string): AssetRule | undefined;
