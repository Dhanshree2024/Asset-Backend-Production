import { MailConfigService } from './mail-config.service';
export declare class MailService {
    private readonly mailConfigService;
    private transporter;
    constructor(mailConfigService: MailConfigService);
    initializeTransporter(): Promise<void>;
    sendEmail(to: string, subject: string, emailHtml: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
    }>;
}
