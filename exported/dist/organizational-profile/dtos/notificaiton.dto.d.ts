export declare class CreateNotificationDto {
    recipient_type: string;
    recipient_id: number;
    event_id: number;
    template_version_id: number;
    title: string;
    message: string;
    data: any;
    organization_id: number;
    redirect_key?: string;
    redirect_params?: string[];
}
