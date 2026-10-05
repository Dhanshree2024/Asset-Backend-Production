import { RegisterUserLogin } from 'src/organization_register/entities/register-user-login.entity';
import { DataSource } from 'typeorm';
import { MailConfigService } from 'src/common/mail/mail-config.service';
import { MailService } from 'src/common/mail/mail.service';
import { HttpService } from '@nestjs/axios';
import { NotificationHelper } from 'src/common/notifications/notifications.helper';
export declare class OrganizationSchemaManager {
    private readonly dataSource;
    private readonly mailConfigService;
    private readonly mailService;
    private readonly httpService;
    private readonly notificationHelper;
    constructor(dataSource: DataSource, mailConfigService: MailConfigService, mailService: MailService, httpService: HttpService, notificationHelper: NotificationHelper);
    private hashPassword;
    createOrganizationSchemaAndTables(user: RegisterUserLogin): Promise<void>;
}
