interface SupportTicketEmailProps {
    name: string;
    email: string;
    subject: string;
    category: string;
    priority: string;
    description: string;
    companyName: string;
    companyLogo?: string;
    mailReply: string;
    attachments?: string[];
}
export declare function SupportTicketEmail({ name, email, subject, category, priority, description, companyName, companyLogo, mailReply, attachments, }: SupportTicketEmailProps): import("react/jsx-runtime").JSX.Element;
export {};
