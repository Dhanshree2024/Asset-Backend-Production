import { Request } from 'express';
import { RequestContextService } from 'src/common/context/request-context.service';
import { AuditService } from '../audit/audit.service';
import { PackageService } from './package.service';
import { PackageMetaInput } from './software.types';
export declare class PackageController {
    private readonly packages;
    private readonly audit;
    private readonly requestContext;
    constructor(packages: PackageService, audit: AuditService, requestContext: RequestContextService);
    private resolveSchema;
    list(status?: string, search?: string, kind?: string): Promise<{
        status: boolean;
        packages: import("./software.types").SoftwarePackage[];
        message?: undefined;
        error?: undefined;
    } | {
        status: boolean;
        message: string;
        error: any;
        packages: any[];
    }>;
    get(id: string): Promise<{
        status: boolean;
        package: import("./software.types").SoftwarePackage;
    }>;
    upload(file: Express.Multer.File | undefined, body: {
        meta?: string;
    } & Partial<PackageMetaInput>, req: Request): Promise<{
        status: boolean;
        package: import("./software.types").SoftwarePackage;
        message: string;
    }>;
    update(id: string, body: Partial<PackageMetaInput>, req: Request): Promise<{
        status: boolean;
        package: import("./software.types").SoftwarePackage;
    }>;
    approve(id: string, req: Request): Promise<{
        status: boolean;
        package: import("./software.types").SoftwarePackage;
    }>;
    reject(id: string, body: {
        reason?: string;
    }, req: Request): Promise<{
        status: boolean;
        package: import("./software.types").SoftwarePackage;
    }>;
    retire(id: string, req: Request): Promise<{
        status: boolean;
        package: import("./software.types").SoftwarePackage;
    }>;
    remove(id: string, req: Request): Promise<{
        status: boolean;
    }>;
}
