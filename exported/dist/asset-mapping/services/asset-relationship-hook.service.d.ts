import { DataSource, EntityManager } from 'typeorm';
export declare class AssetRelationshipHookService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    validatePreScrap(manager: EntityManager, schema: string, serialIds: number[]): Promise<void>;
    handlePostScrap(manager: EntityManager, schema: string, serialIds: number[], userId: number): Promise<{
        softwareUnlinkedCount: number;
        hostingUnlinkedCount: number;
    }>;
    cascadeImpactToChildren(manager: EntityManager, schema: string, parentSerialIds: number[], reason?: string): Promise<number[]>;
    clearImpactOnChildren(manager: EntityManager, schema: string, parentSerialIds: number[]): Promise<number[]>;
    getTransferImpactPreview(schema: string, hostSerialId: number, toLocationId: number): Promise<any>;
    cascadeLocationTransfer(manager: EntityManager, schema: string, hostSerialId: number, toLocationId: number, dependentsDecision: Array<{
        serial_id: number;
        action: 'MOVE' | 'LEAVE_BEHIND' | 'MIGRATE_FIRST';
        target_host_id?: number;
    }>, userId: number, parentTransferId?: number): Promise<{
        movedCount: number;
        leftBehindCount: number;
    }>;
}
