import { DataSource } from 'typeorm';
import { CredentialKind, CredentialSummary } from '../phase2.types';
export interface CredentialRowFull extends CredentialSummary {
    secretEnc: string | null;
}
export declare class CredentialRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private assertSchema;
    list(schema: string): Promise<CredentialSummary[]>;
    getFull(schema: string, id: string): Promise<CredentialRowFull | null>;
    insert(schema: string, input: {
        name: string;
        kind: CredentialKind;
        username: string | null;
        domain: string | null;
        secretEnc: string | null;
        description: string | null;
        isDefault: boolean;
    }, userId: number | null): Promise<CredentialSummary>;
    update(schema: string, id: string, patch: {
        name?: string;
        kind?: CredentialKind;
        username?: string | null;
        domain?: string | null;
        secretEnc?: string | null;
        description?: string | null;
        isDefault?: boolean;
    }, userId: number | null): Promise<CredentialSummary | null>;
    softDelete(schema: string, id: string, userId: number | null): Promise<boolean>;
    recordTest(schema: string, id: string, ok: boolean, error: string | null): Promise<void>;
    private clearDefault;
    private mapSummary;
}
