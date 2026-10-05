import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContextService } from '../context/request-context.service';
export declare class OrgContextMiddleware implements NestMiddleware {
    private readonly context;
    constructor(context: RequestContextService);
    use(req: Request, res: Response, next: NextFunction): void;
}
