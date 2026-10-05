"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = __importDefault(require("axios"));
const mail_config_service_1 = require("../common/mail/mail-config.service");
const mail_service_1 = require("../common/mail/mail.service");
const render_email_1 = require("../common/mail/render-email");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
const register_organization_entity_1 = require("../organization_register/entities/register-organization.entity");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const typeorm_2 = require("typeorm");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
const support_ticket_entity_1 = require("./entities/support-ticket.entity");
const billing_utils_1 = require("./utils/billing.utils");
let SupportService = class SupportService {
    constructor(dataSource, mailService, mailConfigService, notificationHelper, ticketRepo, registerUserLoginRepo) {
        this.dataSource = dataSource;
        this.mailService = mailService;
        this.mailConfigService = mailConfigService;
        this.notificationHelper = notificationHelper;
        this.ticketRepo = ticketRepo;
        this.registerUserLoginRepo = registerUserLoginRepo;
    }
    async getUserByPublicID(public_user_id) {
        const userExists = await this.dataSource
            .getRepository(organizational_user_entity_1.User)
            .findOne({ where: { register_user_login_id: public_user_id } });
        if (!userExists) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.BAD_REQUEST, message: 'Invalid user ID' }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            return userExists.user_id;
        }
    }
    async generateSupportTicketId(manager) {
        const year = new Date().getFullYear();
        const lastTicket = await manager
            .createQueryBuilder(support_ticket_entity_1.SupportTicket, "t")
            .setLock("pessimistic_write")
            .where("t.support_ticket_id LIKE :pattern", {
            pattern: `TKT-${year}-%`,
        })
            .orderBy("t.ticket_id", "DESC")
            .getOne();
        let nextNumber = 1;
        if (lastTicket?.supportTicketId) {
            const lastNum = Number(lastTicket.supportTicketId.split("-")[2]);
            nextNumber = lastNum + 1;
        }
        return `TKT-${year}-${String(nextNumber).padStart(3, "0")}`;
    }
    async createTicket(dto, encryptedUserId, attachmentPath = null) {
        try {
            const decryptedUserId = (0, crypto_utils_1.decrypt)(encryptedUserId.toString());
            const orgUserId = await this.getUserByPublicID(Number(decryptedUserId));
            const user = await this.dataSource.getRepository(organizational_user_entity_1.User).findOne({
                where: { user_id: orgUserId, is_deleted: 0 },
                relations: ["userLogintable"],
            });
            if (!user) {
                throw new common_1.NotFoundException("User not found");
            }
            const fullName = `${user.first_name} ${user.last_name}`;
            const userEmail = user.users_business_email;
            const savedTicket = await this.dataSource.transaction(async (manager) => {
                const supportTicketId = await this.generateSupportTicketId(manager);
                return await manager.save(support_ticket_entity_1.SupportTicket, {
                    supportTicketId,
                    name: fullName,
                    email: userEmail,
                    subject: dto.subject,
                    category: dto.category,
                    priority: dto.priority,
                    description: dto.description,
                    status: support_ticket_entity_1.SupportTicketStatus.OPEN,
                    is_active: 1,
                    is_deleted: 0,
                    attachments: attachmentPath ? [attachmentPath] : [],
                    userId: user.user_id,
                });
            });
            void this.sendSupportTicketNotificationAsync({
                savedTicket,
                user,
                dto,
                fullName,
                userEmail,
            });
            try {
                const billingOrgId = user.userLogintable?.org_billing_id;
                if (billingOrgId) {
                    await billing_utils_1.BillingUtil.post("/organizational-profile/create-ticket", {
                        orgId: billingOrgId,
                        supportTicketId: savedTicket.supportTicketId,
                        userName: fullName,
                        email: userEmail,
                        subject: dto.subject,
                        category: dto.category,
                        priority: dto.priority,
                        description: dto.description,
                        userId: user.user_id,
                        attachments: attachmentPath ? [attachmentPath] : [],
                    });
                }
            }
            catch (billingError) {
                console.error("⚠️ Billing sync failed:", billingError);
            }
            return {
                success: true,
                message: "Support ticket created successfully",
                ticketId: savedTicket.ticketId,
            };
        }
        catch (error) {
            console.error("Support Ticket Error:", error);
            throw new common_1.InternalServerErrorException("Failed to submit support ticket");
        }
    }
    async sendSupportTicketNotificationAsync(payload) {
        try {
            const SUPPORT_TICKET_EVENT_ID = 22;
            const formatDate = () => {
                const d = new Date();
                return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
            };
            const attachmentPath = payload.savedTicket.attachments?.[0];
            const attachmentUrl = attachmentPath
                ? `${process.env.ASSET_API_URL}/${attachmentPath.replace(/\\/g, '/')}`
                : null;
            const contextData = {
                support: {
                    ticket_id: payload.savedTicket.ticketId,
                    support_ticket_id: payload.savedTicket.supportTicketId,
                    name: payload.fullName,
                    email: payload.userEmail,
                    subject: payload.dto.subject,
                    category: payload.dto.category,
                    priority: payload.dto.priority,
                    description: payload.dto.description,
                    status: payload.savedTicket.status,
                    created_at: formatDate(),
                    attachment: attachmentUrl,
                },
                updatedUser: {
                    first_name: payload.user.first_name,
                    last_name: payload.user.last_name,
                },
            };
            const recipients = [];
            if (payload.user?.users_business_email) {
                recipients.push({
                    recipient_type: 'user',
                    recipient_id: String(payload.user.user_id),
                    recipient_email: payload.user.users_business_email,
                });
            }
            recipients.push({
                recipient_type: 'user',
                recipient_email: process.env.SUPPORT_EMAIL || 'support@norbikasset.com',
            });
            await this.notificationHelper.triggerEventNotification({
                eventId: SUPPORT_TICKET_EVENT_ID,
                contextData,
                recipients,
                meta: {
                    trace_id: payload.savedTicket.supportTicketId,
                },
            });
        }
        catch (error) {
            console.error('Support ticket notification failed:', error);
        }
    }
    async sendMessage(dto) {
        try {
            void this.sendSupportMessageAsync(dto);
            return {
                success: true,
                message: "Message sent successfully",
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.InternalServerErrorException("Failed to send message");
        }
    }
    async sendSupportMessageAsync(dto) {
        console.log("SEND MESSSAGE:1:dto", dto);
        try {
            await this.mailService.sendEmail(dto.email, `Support Message Received – ${dto.subject}`, await (0, render_email_1.renderEmail)(render_email_1.EmailTemplate.SUPPORT_MESSAGE, dto, this.mailConfigService));
            await this.mailService.sendEmail(process.env.SUPPORT_EMAIL ||
                "support@norbikasset.com", `New Support Message – ${dto.subject}`, await (0, render_email_1.renderEmail)(render_email_1.EmailTemplate.SUPPORT_MESSAGE, dto, this.mailConfigService));
        }
        catch (error) {
            console.error("Support message email failed:", error);
        }
    }
    async getTickets({ status, period, page, limit, systemUserId }) {
        const decryptedUserId = (0, crypto_utils_1.decrypt)(systemUserId.toString());
        const orgUserId = await this.getUserByPublicID(Number(decryptedUserId));
        const qb = this.ticketRepo.createQueryBuilder("t")
            .where("t.is_deleted = 0")
            .andWhere("t.user_id = :userId", { userId: orgUserId });
        if (status) {
            qb.andWhere("t.status = :status", { status });
        }
        if (period) {
            const today = new Date();
            let from;
            switch (period) {
                case "today":
                    from = new Date(today.setHours(0, 0, 0, 0));
                    break;
                case "yesterday":
                    from = new Date();
                    from.setDate(from.getDate() - 1);
                    from.setHours(0, 0, 0, 0);
                    today.setDate(today.getDate() - 1);
                    today.setHours(23, 59, 59, 999);
                    break;
                case "last7days":
                    from = new Date();
                    from.setDate(from.getDate() - 7);
                    break;
                case "thisweek":
                    from = new Date();
                    from.setDate(from.getDate() - from.getDay() + 1);
                    break;
                case "thismonth":
                    from = new Date(today.getFullYear(), today.getMonth(), 1);
                    break;
            }
            if (from) {
                qb.andWhere("t.created_at BETWEEN :from AND :to", {
                    from,
                    to: new Date(),
                });
            }
        }
        const [data, total] = await qb
            .orderBy("t.created_at", "DESC")
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return { data, total, page, limit };
    }
    async getSingleTicket(ticketId) {
        try {
            const ticket = await this.ticketRepo
                .createQueryBuilder('t')
                .where('t.is_deleted = :deleted', { deleted: 0 })
                .andWhere('t.ticket_id = :ticketId', { ticketId })
                .getOne();
            if (!ticket) {
                return {
                    status: 404,
                    message: `No ticket found for ID ${ticketId}`,
                    data: null,
                };
            }
            return {
                status: 200,
                message: 'Ticket fetched successfully',
                data: ticket,
            };
        }
        catch (error) {
            console.error('Error fetching ticket:', error);
            return {
                status: 500,
                message: 'An error occurred while fetching the ticket',
                error: error.message,
                data: null,
            };
        }
    }
    async updateTicketStatusInOrgSchema(supportTicketId, status, billingOrgId) {
        console.log(" [ASSET SERVICE] Sync started");
        console.log({ supportTicketId, status, billingOrgId });
        const userLogin = await this.registerUserLoginRepo.findOne({
            where: {
                org_billing_id: billingOrgId,
                is_deleted: 0,
            },
            relations: ["organization"],
        });
        if (!userLogin?.organization) {
            throw new Error(`Organization not found for billingOrgId ${billingOrgId}`);
        }
        const schema = `org_${userLogin.organization.organization_schema_name}`;
        console.log("Final schema resolved:", schema);
        try {
            await this.dataSource.query(`SET search_path TO "${schema}", public`);
            console.log("search_path set");
            const result = await this.ticketRepo.update({ supportTicketId }, { status,
                updatedAt: new Date(),
            });
            console.log("Update result:", result);
            if (!result.affected) {
                throw new Error(`Ticket ${supportTicketId} not found in schema ${schema}`);
            }
            console.log(" Ticket status updated successfully");
        }
        finally {
            await this.dataSource.query(`SET search_path TO public`);
            console.log(" search_path reset");
        }
    }
    async markTaskComplete(dto, userId, organizationId) {
        console.log('[markTaskComplete] Start', { dto, userId, organizationId });
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const org = await queryRunner.manager
                .getRepository(register_organization_entity_1.RegisterOrganization)
                .findOne({ where: { organization_id: organizationId } });
            console.log('[markTaskComplete] Organization:', org);
            if (!org)
                throw new Error('Organization not found');
            const schemaName = `org_${org.organization_schema_name}`;
            await queryRunner.query(`SET search_path TO "${schemaName}", public`);
            console.log('[markTaskComplete] Set search_path to:', schemaName);
            const orgUser = await queryRunner.manager
                .getRepository(organizational_user_entity_1.User)
                .findOne({ where: { user_id: userId } });
            console.log('[markTaskComplete] Tenant User:', orgUser);
            if (!orgUser)
                throw new Error('Tenant user not found');
            const loginUser = await this.registerUserLoginRepo.findOne({
                where: { user_id: orgUser.register_user_login_id }
            });
            console.log('[markTaskComplete] Billing Login User:', loginUser);
            if (!loginUser)
                throw new Error('Login user not found');
            const billingOrgId = loginUser.org_billing_id;
            const billingUserId = loginUser.user_id;
            const tasks = await this.getTaskFromOnboarding(dto.taskId);
            const task = tasks[0];
            console.log('[markTaskComplete] Task from onboarding:', task);
            if (!task)
                throw new Error('Task not found');
            if (task.taskScope === 'INDIVIDUAL') {
                console.log('[markTaskComplete] Handling INDIVIDUAL task');
                await this.insertUserProgress(queryRunner, organizationId, userId, dto.taskId);
            }
            else if (task.taskScope === 'COMMON') {
                console.log('[markTaskComplete] Handling COMMON task');
                const userResult = await this.insertUserProgress(queryRunner, organizationId, userId, dto.taskId);
                if (!userResult.success) {
                    throw new Error(userResult.message || 'Org task already completed');
                }
                const orgResult = await this.markOrgTaskComplete(billingOrgId, dto.taskId, billingUserId);
                if (!orgResult.success) {
                    throw new Error(orgResult.message || 'Org task already completed');
                }
            }
            else if (task.taskScope === 'ONE_TIME') {
                console.log('[markTaskComplete] Handling ONE_TIME task');
                await this.markOrgTaskComplete(billingOrgId, dto.taskId, billingUserId);
            }
            else {
                console.warn('[markTaskComplete] Unknown taskScope:', task.taskScope);
            }
            await queryRunner.commitTransaction();
            console.log('[markTaskComplete] Transaction committed successfully');
            return {
                success: true,
                message: 'Task completed successfully'
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('[markTaskComplete] Transaction rolled back due to error:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
            console.log('[markTaskComplete] QueryRunner released');
        }
    }
    async insertUserProgress(queryRunner, organizationId, userId, taskId) {
        console.log('[insertUserProgress] Checking existing task');
        const existing = await queryRunner.query(`
    SELECT status 
    FROM user_setup_progress
    WHERE user_id = $1 AND task_id = $2
    `, [userId, taskId]);
        if (existing.length > 0 && existing[0].status === 'COMPLETED') {
            console.log('[insertUserProgress] Task already completed');
            throw new common_1.BadRequestException('Task already completed');
        }
        console.log('[insertUserProgress] Inserting progress');
        await queryRunner.query(`
    INSERT INTO user_setup_progress (
      organization_id,
      user_id,
      task_id,
      status,
      completed_at
    )
    VALUES ($1,$2,$3,'COMPLETED',NOW())
    ON CONFLICT (user_id, task_id)
    DO UPDATE SET
      status='COMPLETED',
      completed_at=NOW()
    `, [organizationId, userId, taskId]);
        console.log('[insertUserProgress] Done');
        return {
            success: true,
            message: 'User task completed'
        };
    }
    async markOrgTaskComplete(organizationId, taskId, userId) {
        console.log('[markOrgTaskComplete] Calling billing service', { organizationId, taskId, userId });
        const url = `${process.env.BILLING_API_URL}/setup-engine/org-task-complete`;
        const res = await axios_1.default.post(url, { organizationId, taskId, userId });
        console.log('[markOrgTaskComplete] Billing service response:', res.data);
        return res.data;
    }
    async getTaskFromOnboarding(taskId) {
        console.log('[getTaskFromOnboarding] Fetching task for taskId:', taskId);
        const url = `${process.env.BILLING_API_URL}/setup-engine/getTask`;
        const res = await axios_1.default.post(url, { task_id: taskId });
        console.log('[getTaskFromOnboarding] Task data received:', res.data);
        return res.data;
    }
    async getOrganizationProgress(orgId, planId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const org = await queryRunner.query(`SELECT schema_name
       FROM public.organizations
       WHERE organization_id = $1`, [orgId]);
            const schema = `org_${org[0].schema_name}`;
            await queryRunner.query(`SET search_path TO "${schema}", public`);
            const result = await queryRunner.query(`SELECT * FROM get_org_setup_progress($1,$2)`, [orgId, planId]);
            return {
                success: true,
                message: 'Organization progress fetched',
                data: result
            };
        }
        finally {
            await queryRunner.release();
        }
    }
    async getUserProgress(orgId, userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const org = await queryRunner.query(`SELECT schema_name
       FROM public.organizations
       WHERE organization_id = $1`, [orgId]);
            const schema = `org_${org[0].schema_name}`;
            await queryRunner.query(`SET search_path TO "${schema}", public`);
            const progress = await queryRunner.manager
                .createQueryBuilder()
                .select([
                'p.task_id as task_id',
                'task.title as task_title',
                'p.status as status'
            ])
                .from('user_progress', 'p')
                .leftJoin('setup_tasks', 'task', 'task.id = p.task_id')
                .where('p.organization_id = :orgId', { orgId })
                .andWhere('p.user_id = :userId', { userId })
                .getRawMany();
            return {
                success: true,
                message: 'User progress fetched',
                data: progress
            };
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.SupportService = SupportService;
exports.SupportService = SupportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(4, (0, typeorm_1.InjectRepository)(support_ticket_entity_1.SupportTicket)),
    __param(5, (0, typeorm_1.InjectRepository)(register_user_login_entity_1.RegisterUserLogin)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        mail_service_1.MailService,
        mail_config_service_1.MailConfigService,
        notifications_helper_1.NotificationHelper,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SupportService);
