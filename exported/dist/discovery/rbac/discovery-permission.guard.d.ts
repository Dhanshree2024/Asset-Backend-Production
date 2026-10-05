import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { RequestContextService } from 'src/common/context/request-context.service';
export declare function decideFromRows(rows: {
    v5: string | null;
    isAllowed: boolean | null;
}[], submoduleId: string | number): boolean;
export declare class DiscoveryPermissionGuard implements CanActivate {
    private readonly reflector;
    private readonly dataSource;
    private readonly requestContext;
    private readonly logger;
    private readonly roleCache;
    private readonly grantCache;
    constructor(reflector: Reflector, dataSource: DataSource, requestContext: RequestContextService);
    private get enforce();
    private static getCached;
    private static setCached;
    invalidate(): void;
    private actorId;
    private roleFor;
    private granted;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
