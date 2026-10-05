import { AuditActor } from '../phase2.types';
import { PackageRepository } from './package.repository';
import { PackageMetaInput, SoftwarePackage } from './software.types';
export declare class PackageService {
    private readonly repo;
    private readonly logger;
    constructor(repo: PackageRepository);
    static storageRoot(): string;
    static sha256File(file: string): Promise<string>;
    private validateMeta;
    upload(schema: string, actor: AuditActor, meta: PackageMetaInput, tmpPath: string, originalName: string, sizeBytes: number): Promise<SoftwarePackage>;
    list(schema: string, opts: {
        status?: string;
        search?: string;
        kind?: string;
    }): Promise<SoftwarePackage[]>;
    get(schema: string, id: string): Promise<SoftwarePackage>;
    update(schema: string, id: string, meta: Partial<PackageMetaInput>): Promise<SoftwarePackage>;
    approve(schema: string, actor: AuditActor, id: string): Promise<SoftwarePackage>;
    reject(schema: string, id: string, reason: string | null): Promise<SoftwarePackage>;
    retire(schema: string, id: string): Promise<SoftwarePackage>;
    remove(schema: string, id: string): Promise<void>;
    fileForDownload(schema: string, id: string): Promise<{
        path: string;
        fileName: string;
        sha256: string;
        sizeBytes: number;
    }>;
}
