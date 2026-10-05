import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { AssetsProjectsService } from './assets-projects.service';
import { CreateProjectDto } from './dto/create-new-project.dto';
import { UpdateProjectDto } from './dto/update-assets-project.dto';
export declare class AssetsProjectsController {
    private readonly assetsProjectsService;
    constructor(assetsProjectsService: AssetsProjectsService);
    getAllProjects(dto: ListViewDto, req: any): Promise<unknown>;
    getProjectsDropdown(search?: string): Promise<{
        success: boolean;
        message: string;
        data: any[];
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    generateNextProjectCode(): Promise<{
        success: boolean;
        code: string;
    }>;
    createNewProject(body: CreateProjectDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getProjectById(body: {
        project_id: number;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProjectById(body: UpdateProjectDto, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteProjects(dto: any, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
    activateProjects(dto: any, res: Response, req: any): Promise<Response<any, Record<string, any>> | {
        status: number;
        message: string;
    }>;
    deactivateProjects(dto: any, res: Response, req: any): Promise<Response<any, Record<string, any>> | {
        status: number;
        message: string;
    }>;
    generateProjectImportTemplate(req: Request, res: Response): Promise<void>;
    bulkCreateProjects(dtos: any[], req: any): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_records: any[];
            error_records: any[];
        };
    }>;
    exportProjectsToExcel(res: Response, dto: ListViewDto): Promise<void>;
}
