import { Response } from 'express';
import { CustomViewService } from './custom-view.service';
import { CreateCustomViewDto } from './dto/create-custom-view.dto';
export declare class CustomViewController {
    private readonly customViewService;
    constructor(customViewService: CustomViewService);
    createCustomView(dto: CreateCustomViewDto, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteCustomView(id: number): Promise<{
        message: string;
    }>;
    listCustomViews(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getUserCustomViews(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
