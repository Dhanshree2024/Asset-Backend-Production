import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from './database.service';
import { RequestContextService } from '../common/context/request-context.service';
export declare class SetSchemaMiddleware implements NestMiddleware {
    private readonly databaseService;
    private readonly context;
    constructor(databaseService: DatabaseService, context: RequestContextService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
