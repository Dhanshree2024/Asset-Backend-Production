import { JobTypeMeta } from '../phase2.types';
export declare const JOB_TYPES: Record<string, JobTypeMeta>;
export declare function jobTypeMeta(type: string): JobTypeMeta | null;
export declare function isKnownJobType(type: string): boolean;
export declare function jobNeedsApproval(type: string): boolean;
