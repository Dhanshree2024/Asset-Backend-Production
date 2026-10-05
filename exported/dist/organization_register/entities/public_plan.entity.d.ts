import { Subscription } from './public_subscription.entity';
export declare class Plan {
    plan_id: number;
    plan_name: string;
    price: number;
    features: object;
    billing_cycle: string;
    user_limit: number;
    storage_limit_gb: number;
    department_limit: number;
    destination_limit: number;
    created_at: Date;
    updated_at: Date;
    branch_limit: number;
    location_limit: number;
    employee_limit: number;
    discounted_percentage: number;
    subscriptions: Subscription[];
}
