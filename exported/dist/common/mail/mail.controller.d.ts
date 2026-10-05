import { EmailProps } from "./render-email";
import { MailService } from './mail.service';
import { MailConfigService } from './mail-config.service';
export declare class MailController {
    private readonly mailerService;
    private readonly mailConfigService;
    constructor(mailerService: MailService, mailConfigService: MailConfigService);
    sendVerificationEmail(body: EmailProps): Promise<{
        message: string;
        error?: undefined;
    } | {
        message: string;
        error: any;
    }>;
}
