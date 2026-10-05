import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
import { GetGroupedLocationsDto } from './dto/get-grouped-location.dto';
import { GetLocationsDropdownDto } from './dto/get-location.dto';
import { LocationsService } from './locations.service';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    createNewLocation(body: any, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllOrganiationLocation(dto: ListViewDto, req: any): Promise<unknown>;
    getLocationById(body: {
        location_id: number;
    }, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteLocations(body: {
        location_id: number[] | number;
    }, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getOrganizationLocationsDropdown(body: {
        search?: string;
        branch_id?: number;
    }, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    dropdownOptionsLocationTypes(): Promise<{
        value: number;
        label: string;
        type_code: string;
        level: number;
        sort_order: number;
        is_required: boolean;
        is_occupancy_type: boolean;
        is_location: boolean;
        type_icon: string;
    }[]>;
    exportLocationsExcel(res: Response, dto: ListViewDto): Promise<void>;
    getLocationTemplateHeaders(locationType: any): Promise<{
        headers: {
            headers: {
                label: string;
                required: boolean;
                type: string;
            }[];
            hierarchyHeaders: string[];
        };
    }>;
    addNewLocation(createnewlocationpayload: any, req: Request): Promise<{
        status: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_records: any[];
            error_records: any[];
        };
    }>;
    updateLocation(body: any, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    activateLocations(body: {
        locationIds: number[];
    }, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
    deactivateLocations(body: {
        locationIds: number[];
    }, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
    generateLocationTemplate(body: any, res: Response): Promise<void>;
    createBulkLocations(dtos: any[], req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            created_count: number;
            created_records: any[];
            error_records: any[];
        };
    } | {
        statusCode: number;
        message: string;
        data: any;
    }>;
    getLocations(dto: GetLocationsDropdownDto): Promise<{
        success: boolean;
        message: string;
        data: any[];
    }>;
    getGroupedLocations(dto: GetGroupedLocationsDto): Promise<{
        success: boolean;
        message: string;
        data: unknown[];
    }>;
    getLocationOptions(types: string | string[], branchId?: number): Promise<any>;
    getLocationsByParent(parent_location_id: number, location_type_code?: string): Promise<{
        success: boolean;
        message: string;
        data: import("../organizational-profile/entity/locations.entity").Locations[];
    }>;
    toggleFavoriteLocation(body: {
        location_mapping_id: number;
    }, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllLocationTypes(dto: ListViewDto, req: any): Promise<unknown>;
    createLocationType(body: any, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateLocationType(body: any, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteLocationType(body: {
        type_id: number;
    }, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getLocationsHierarchyTree(body: {
        search?: string;
        branch_id?: number;
        group_by_branch?: boolean;
    }, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
