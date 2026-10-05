import { HttpStatus } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CustomView } from './entity/custom-view.entity';
import { CreateCustomViewDto } from './dto/create-custom-view.dto';
export declare class CustomViewService {
    private readonly customViewRepo;
    private readonly dataSource;
    constructor(customViewRepo: Repository<CustomView>, dataSource: DataSource);
    getUserByPublicID(public_user_id: number): Promise<number>;
    createCustomView(dto: CreateCustomViewDto, user_id: number, organization_id: number): Promise<{
        status: HttpStatus;
        message: string;
        data?: undefined;
        error?: undefined;
    } | {
        status: HttpStatus;
        message: string;
        data: CustomView;
        error?: undefined;
    } | {
        status: HttpStatus;
        message: string;
        error: any;
        data?: undefined;
    }>;
    deleteCustomView(id: number): Promise<{
        message: string;
    }>;
    getCustomViews(user_id: number, organization_id: number): Promise<CustomView[]>;
    getCustomViewsByUser(user_id: number, organization_id: number): Promise<CustomView[]>;
}
