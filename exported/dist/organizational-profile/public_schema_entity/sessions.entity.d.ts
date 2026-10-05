export declare class Session {
    user_id: number;
    session_id: string;
    device_name: string;
    device_type: 'desktop' | 'mobile' | 'tablet' | 'Other';
    ip_address: string;
    location: string;
    user_agent: string;
    is_active: boolean;
    is_blocked: boolean;
    login_at: Date;
    last_seen: Date;
    expires_at: Date;
    logout_at: Date;
    refresh_token: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: number;
    force_logout: boolean;
}
