export declare class CreateTechnicalRelationshipDto {
    source_serial_id: number;
    target_serial_id?: number;
    target_serial_ids?: number[];
    relation_type: string;
    assigned_from_date?: string;
    description?: string;
    metadata?: Record<string, any>;
    confirm_reassign?: boolean;
    source?: 'manual' | 'agent' | 'scanner' | 'sync';
    agent_flag_only?: boolean;
}
