import { RequestContextService } from '../context/request-context.service';
export interface NotificationRecipient {
    recipient_type: 'user' | 'staff';
    recipient_id?: string;
    recipient_contact?: string;
    recipient_whatsapp_number?: string;
    recipient_email?: string;
    language_code?: string;
}
export interface NotificationTriggerEvent {
    event_id: number;
    recipients: NotificationRecipient[];
    payload: Record<string, any> | Array<Record<string, any>>;
    meta?: {
        trace_id?: string;
        source?: string;
    };
}
export declare class NotificationHelper {
    private readonly requestContext;
    private readonly logger;
    private readonly billingApi;
    constructor(requestContext: RequestContextService);
    private accountTypeContextMap;
    sendNotificationByEvent(eventId: number, recipients: NotificationRecipient[], payloadData: Record<string, any> | Array<Record<string, any>>, meta?: {
        trace_id?: string;
        source?: string;
        organization_id?: string | number;
    }): Promise<any>;
    getTemplateVariables(eventId: number): Promise<any[]>;
    private getValueByPath;
    buildDynamicPayload(templateVariablesArray: any[], sourceData: Record<string, any>): Record<string, any>;
    triggerEventNotification(options: {
        eventId: number;
        contextData: Record<string, any>;
        recipients: NotificationRecipient[];
        meta?: {
            trace_id?: string;
            source?: string;
        };
    }): Promise<any>;
}
