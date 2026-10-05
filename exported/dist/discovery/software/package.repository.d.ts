import { DataSource } from 'typeorm';
import { PackageMetaInput, SoftwarePackage } from './software.types';
export declare class PackageRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private assertSchema;
    map(r: any): SoftwarePackage;
    list(schema: string, opts?: {
        status?: string;
        search?: string;
        kind?: string;
    }): Promise<SoftwarePackage[]>;
    get(schema: string, id: string): Promise<SoftwarePackage | null>;
    fileRef(schema: string, id: string): Promise<{
        fileRef: string;
        fileName: string;
        sha256: string;
        sizeBytes: number;
        status: string;
    } | null>;
    insert(schema: string, meta: PackageMetaInput, file: {
        fileName: string;
        fileRef: string;
        sizeBytes: number;
        sha256: string;
    }, actor: {
        userId: number | null;
        name: string | null;
    }): Promise<SoftwarePackage>;
    setFileRef(schema: string, id: string, fileRef: string): Promise<void>;
    updateMeta(schema: string, id: string, meta: Partial<PackageMetaInput>): Promise<SoftwarePackage | null>;
    setStatus(schema: string, id: string, status: string, extra?: {
        approvedBy?: number | null;
        approvedByName?: string | null;
        rejectedReason?: string | null;
    }): Promise<SoftwarePackage | null>;
    markSuperseded(schema: string, oldId: string): Promise<void>;
    delete(schema: string, id: string): Promise<{
        fileRef: string;
    } | null>;
    usageCount(schema: string, id: string): Promise<number>;
}
