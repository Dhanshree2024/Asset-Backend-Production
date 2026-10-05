export declare enum SupportTicketStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    CLOSED = "closed"
}
export declare class SupportTicket {
    ticketId: number;
    supportTicketId: string;
    name: string;
    email: string;
    subject: string;
    category: string;
    priority: string;
    description: string;
    status: SupportTicketStatus;
    userId?: number;
    is_active: number;
    is_deleted: number;
    createdAt: Date;
    updatedAt: Date;
    attachments?: string[];
}
