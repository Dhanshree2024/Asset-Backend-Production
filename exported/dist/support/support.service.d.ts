import { MailConfigService } from 'src/common/mail/mail-config.service';
import { MailService } from 'src/common/mail/mail.service';
import { NotificationHelper } from 'src/common/notifications/notifications.helper';
import { RegisterUserLogin } from 'src/organization_register/entities/register-user-login.entity';
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { CreateSupportMessageDto } from "./dto/create-support-message.dto";
import { CreateSupportTicketDto } from "./dto/create-support-ticket.dto";
import { MarkTaskCompleteDto } from './dto/mark-setup-complete.dto';
import { SupportTicket, SupportTicketStatus } from './entities/support-ticket.entity';
export declare class SupportService {
    private readonly dataSource;
    private readonly mailService;
    private readonly mailConfigService;
    private readonly notificationHelper;
    private readonly ticketRepo;
    private readonly registerUserLoginRepo;
    constructor(dataSource: DataSource, mailService: MailService, mailConfigService: MailConfigService, notificationHelper: NotificationHelper, ticketRepo: Repository<SupportTicket>, registerUserLoginRepo: Repository<RegisterUserLogin>);
    getUserByPublicID(public_user_id: number): Promise<number>;
    generateSupportTicketId(manager: EntityManager): Promise<string>;
    createTicket(dto: CreateSupportTicketDto, encryptedUserId: string, attachmentPath?: string | null): Promise<{
        success: boolean;
        message: string;
        ticketId: number;
    }>;
    private sendSupportTicketNotificationAsync;
    sendMessage(dto: CreateSupportMessageDto): Promise<{
        success: boolean;
        message: string;
    }>;
    private sendSupportMessageAsync;
    getTickets({ status, period, page, limit, systemUserId }: {
        status: any;
        period: any;
        page: any;
        limit: any;
        systemUserId: any;
    }): Promise<{
        data: SupportTicket[];
        total: number;
        page: any;
        limit: any;
    }>;
    getSingleTicket(ticketId: number): Promise<any>;
    updateTicketStatusInOrgSchema(supportTicketId: string, status: SupportTicketStatus, billingOrgId: number): Promise<void>;
    markTaskComplete(dto: MarkTaskCompleteDto, userId: number, organizationId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    insertUserProgress(queryRunner: QueryRunner, organizationId: number, userId: number, taskId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    markOrgTaskComplete(organizationId: number, taskId: number, userId: number): Promise<any>;
    getTaskFromOnboarding(taskId: number): Promise<any>;
    getOrganizationProgress(orgId: number, planId: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getUserProgress(orgId: number, userId: number): Promise<{
        success: boolean;
        message: string;
        data: any[];
    }>;
}
