import { Request } from 'express';
import { AuditActor } from '../phase2.types';
export declare function resolveActor(req: Request | undefined): AuditActor;
export declare function redactParams(params: Record<string, unknown> | null | undefined, depth?: number): Record<string, unknown> | null;
