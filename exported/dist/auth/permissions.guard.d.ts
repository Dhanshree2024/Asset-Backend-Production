import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
export declare class PermissionsGuard implements CanActivate {
    private readonly reflector;
    private static publicKey;
    constructor(reflector: Reflector);
    private static getPublicKey;
    private static norm;
    private static evaluate;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
