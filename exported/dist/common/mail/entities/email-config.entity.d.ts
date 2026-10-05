export declare class MailConfig {
    id: number;
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    smtpFromEmail: string;
    smtpFromName?: string;
    smtpReplyMail?: string;
    useTLS: boolean;
    useSSL: boolean;
    createdAt: Date;
    updatedAt: Date;
    isActive: number;
}
