import { Plan } from './plan.entity';
export declare class Subscription {
    subscription_id: number;
    organization_profile_id: number;
    plan: Plan;
    payment_status: string;
    payment_mode: string;
    permissions_features: Record<string, any>;
    start_date: string;
    renewal_date: string;
    created_at: Date;
    updated_at: Date;
    license_no: string;
    invoice_number: string;
    price: number;
    discounted_price: number;
    discounted_percentage: number;
    grand_total: number;
}
