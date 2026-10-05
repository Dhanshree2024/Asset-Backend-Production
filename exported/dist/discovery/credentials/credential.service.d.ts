import { CredentialSummary, CredentialUpsertInput } from '../phase2.types';
import { CredentialRepository } from './credential.repository';
export interface MaterializedCredential {
    id: string;
    kind: string;
    username: string | null;
    domain: string | null;
    secret: string | null;
}
export declare class CredentialService {
    private readonly repo;
    private readonly logger;
    constructor(repo: CredentialRepository);
    private key;
    encrypt(plain: string): string;
    decrypt(stored: string | null): string | null;
    list(schema: string): Promise<CredentialSummary[]>;
    get(schema: string, id: string): Promise<CredentialSummary>;
    create(schema: string, input: CredentialUpsertInput, userId: number | null): Promise<CredentialSummary>;
    update(schema: string, id: string, input: Partial<CredentialUpsertInput>, userId: number | null): Promise<CredentialSummary>;
    remove(schema: string, id: string, userId: number | null): Promise<void>;
    materializeForAgent(schema: string, id: string): Promise<MaterializedCredential>;
    private validate;
}
