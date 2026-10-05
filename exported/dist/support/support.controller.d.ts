import { SupportService } from "./support.service";
import { CreateSupportTicketDto } from "./dto/create-support-ticket.dto";
import { CreateSupportMessageDto } from "./dto/create-support-message.dto";
import { Request } from "express";
import { MarkTaskCompleteDto } from "./dto/mark-setup-complete.dto";
export declare class SupportController {
    private readonly supportService;
    constructor(supportService: SupportService);
    createTicket(req: Request, dto: CreateSupportTicketDto, attachment?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        ticketId: number;
    }>;
    sendMessage(dto: CreateSupportMessageDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getTickets(req: Request, status?: string, period?: string, page?: number, limit?: number): Promise<{
        data: import("./entities/support-ticket.entity").SupportTicket[];
        total: number;
        page: any;
        limit: any;
    }>;
    getSingleTicket(ticketId: string): Promise<any>;
    syncTicketStatus(body: {
        ticketId: string;
        status: string;
        orgId: number;
    }): Promise<{
        success: boolean;
        message: any;
    }>;
    markComplete(dto: MarkTaskCompleteDto, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getOrganizationProgress(body: any): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getUserProgress(body: any): Promise<{
        success: boolean;
        message: string;
        data: any[];
    }>;
}
