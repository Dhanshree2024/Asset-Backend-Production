"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetRelationshipHookService = void 0;
const common_1 = require("@nestjs/common");
const asset_events_entity_1 = require("../../asset-events/entities/asset-events.entity");
const typeorm_1 = require("typeorm");
let AssetRelationshipHookService = class AssetRelationshipHookService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async validatePreScrap(manager, schema, serialIds) {
        if (!serialIds || serialIds.length === 0)
            return;
        const activeHostedQuery = `
      SELECT 
        m.mapping_id,
        (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.target_id ELSE m.asset_stocks_unique_id END) AS host_serial_id,
        (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.asset_stocks_unique_id ELSE m.target_id END) AS guest_serial_id,
        COALESCE(ass_host.system_code, 'ID ' || m.asset_stocks_unique_id::text) AS host_system_code,
        COALESCE(ass_host.asset_serial_title, a_host.asset_title, 'Host #' || m.asset_stocks_unique_id::text) AS host_name,
        COALESCE(ass_guest.system_code, 'ID ' || m.target_id::text) AS guest_system_code,
        COALESCE(ass_guest.asset_serial_title, a_guest.asset_title, 'Guest #' || m.target_id::text) AS guest_name
      FROM ${schema}.asset_mapping m
      LEFT JOIN ${schema}.asset_stock_serials ass_source ON ass_source.asset_stocks_unique_id = m.asset_stocks_unique_id
      LEFT JOIN ${schema}.assets a_source ON a_source.asset_id = ass_source.asset_id
      LEFT JOIN ${schema}.asset_stock_serials ass_target ON ass_target.asset_stocks_unique_id = m.target_id
      LEFT JOIN ${schema}.assets a_target ON a_target.asset_id = ass_target.asset_id
      LEFT JOIN ${schema}.asset_stock_serials ass_host ON ass_host.asset_stocks_unique_id = (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.target_id ELSE m.asset_stocks_unique_id END)
      LEFT JOIN ${schema}.assets a_host ON a_host.asset_id = ass_host.asset_id
      LEFT JOIN ${schema}.asset_stock_serials ass_guest ON ass_guest.asset_stocks_unique_id = (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.asset_stocks_unique_id ELSE m.target_id END)
      LEFT JOIN ${schema}.assets a_guest ON a_guest.asset_id = ass_guest.asset_id
      WHERE m.relation_type = 'REL-010'
        AND m.is_active = 1
        AND m.is_deleted = 0
        AND (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.target_id ELSE m.asset_stocks_unique_id END) = ANY($1::int[]);
    `;
        const activeHosted = await manager.query(activeHostedQuery, [serialIds]);
        if (activeHosted && activeHosted.length > 0) {
            const hostCodes = [
                ...new Set(activeHosted.map((r) => r.host_system_code || `ID ${r.host_serial_id}`)),
            ];
            const guestCodes = activeHosted
                .slice(0, 5)
                .map((r) => r.guest_system_code || `ID ${r.guest_serial_id}`);
            const extraCount = activeHosted.length > 5 ? ` and ${activeHosted.length - 5} more` : '';
            throw new common_1.HttpException({
                code: 'ERR_ACTIVE_HOSTED_INSTANCES',
                message: `Cannot scrap host server (${hostCodes.join(', ')}): it currently hosts ${activeHosted.length} active virtual machine(s) / guest instance(s) (${guestCodes.join(', ')}${extraCount}). Migrate or unlink VMs first.`,
                details: activeHosted,
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }
    async handlePostScrap(manager, schema, serialIds, userId) {
        if (!serialIds || serialIds.length === 0) {
            return { softwareUnlinkedCount: 0, hostingUnlinkedCount: 0 };
        }
        let activeTechnicalMappings = [];
        try {
            activeTechnicalMappings = await manager.query(`
        SELECT 
          m.mapping_id,
          m.asset_stocks_unique_id AS source_serial_id,
          m.target_id AS target_serial_id,
          m.relation_type,
          t.forward_label,
          t.reverse_label,
          t.category AS rel_category,
          COALESCE(ass_src.asset_serial_title, a_src.asset_title, 'Asset #' || m.asset_stocks_unique_id::text) AS source_name,
          COALESCE(ass_tgt.asset_serial_title, a_tgt.asset_title, 'Asset #' || m.target_id::text) AS target_name,
          ass_src.asset_id AS source_asset_id,
          ass_tgt.asset_id AS target_asset_id
        FROM ${schema}.asset_mapping m
        LEFT JOIN ${schema}.asset_relation_type_table t ON t.code = m.relation_type
        LEFT JOIN ${schema}.asset_stock_serials ass_src ON ass_src.asset_stocks_unique_id = m.asset_stocks_unique_id
        LEFT JOIN ${schema}.assets a_src ON a_src.asset_id = ass_src.asset_id
        LEFT JOIN ${schema}.asset_stock_serials ass_tgt ON ass_tgt.asset_stocks_unique_id = m.target_id
        LEFT JOIN ${schema}.assets a_tgt ON a_tgt.asset_id = ass_tgt.asset_id
        WHERE (m.target_id = ANY($1::int[]) OR m.asset_stocks_unique_id = ANY($1::int[]))
          AND m.relation_type IN ('REL-006', 'REL-010', 'REL-007')
          AND m.is_active = 1
          AND m.is_deleted = 0;
        `, [serialIds]);
        }
        catch (queryErr) {
            console.error('Failed to query technical relationships prior to scrap:', queryErr);
        }
        const deactivateSoftwareResult = await manager.query(`
      UPDATE ${schema}.asset_mapping
      SET 
        is_active = 0,
        is_deleted = 1,
        returned_by = $1,
        assigned_to_date = CURRENT_DATE,
        updated_at = CURRENT_TIMESTAMP,
        description = COALESCE(description, '') || ' [Auto-unlinked: Host hardware scrapped]'
      WHERE (target_id = ANY($2::int[]) OR asset_stocks_unique_id = ANY($2::int[]))
        AND relation_type = 'REL-006'
        AND is_active = 1
        AND is_deleted = 0
      RETURNING mapping_id;
      `, [userId, serialIds]);
        const unlinkedSoftwareSerialIds = [];
        for (const m of activeTechnicalMappings || []) {
            if (m.relation_type === 'REL-006') {
                const sourceSerialId = Number(m.source_serial_id);
                const targetSerialId = Number(m.target_serial_id);
                const swId = serialIds.includes(sourceSerialId) ? targetSerialId : sourceSerialId;
                if (swId && !serialIds.includes(swId)) {
                    unlinkedSoftwareSerialIds.push(swId);
                }
            }
        }
        if (unlinkedSoftwareSerialIds.length > 0) {
            await manager.query(`
        UPDATE ${schema}.asset_stock_serials
        SET current_status_id = 1, -- AVAILABLE
            working_status_type_id = 20,
            updated_by = $2
        WHERE asset_stocks_unique_id = ANY($1::int[])
          AND is_deleted = 0;
        `, [unlinkedSoftwareSerialIds, userId]);
        }
        const deactivateGuestVmResult = await manager.query(`
      UPDATE ${schema}.asset_mapping
      SET 
        is_active = 0,
        is_deleted = 1,
        returned_by = $1,
        assigned_to_date = CURRENT_DATE,
        updated_at = CURRENT_TIMESTAMP,
        description = COALESCE(description, '') || ' [Auto-unlinked: Guest VM scrapped]'
      WHERE (target_id = ANY($2::int[]) OR asset_stocks_unique_id = ANY($2::int[]))
        AND relation_type = 'REL-010'
        AND is_active = 1
        AND is_deleted = 0
      RETURNING mapping_id;
      `, [userId, serialIds]);
        const unlinkedPeripheralSerialIds = [];
        for (const m of activeTechnicalMappings || []) {
            if (m.relation_type === 'REL-007') {
                const sourceSerialId = Number(m.source_serial_id);
                const targetSerialId = Number(m.target_serial_id);
                const periId = serialIds.includes(sourceSerialId) ? targetSerialId : sourceSerialId;
                if (periId && !serialIds.includes(periId)) {
                    unlinkedPeripheralSerialIds.push(periId);
                }
            }
        }
        if (unlinkedPeripheralSerialIds.length > 0) {
            await manager.query(`
        UPDATE ${schema}.asset_mapping
        SET 
          is_active = 0,
          is_deleted = 1,
          returned_by = $1,
          assigned_to_date = CURRENT_DATE,
          updated_at = CURRENT_TIMESTAMP,
          description = COALESCE(description, '') || ' [Auto-unlinked: Host device scrapped]'
        WHERE (target_id = ANY($2::int[]) OR asset_stocks_unique_id = ANY($2::int[]))
          AND relation_type = 'REL-007'
          AND is_active = 1
          AND is_deleted = 0;
        `, [userId, serialIds]);
            await manager.query(`
        UPDATE ${schema}.asset_mapping
        SET is_active = 0, updated_at = CURRENT_TIMESTAMP
        WHERE asset_stocks_unique_id = ANY($1::int[])
          AND is_inherited = 1
          AND is_active = 1;
        `, [unlinkedPeripheralSerialIds]);
            await manager.query(`
        UPDATE ${schema}.asset_stock_serials
        SET current_status_id = 1,
            working_status_type_id = 20,
            updated_by = $2
        WHERE asset_stocks_unique_id = ANY($1::int[])
          AND is_deleted = 0;
        `, [unlinkedPeripheralSerialIds, userId]);
            await manager.query(`
        UPDATE ${schema}.stocks s
        SET quantity = s.quantity + sub.cnt,
            updated_at = CURRENT_TIMESTAMP
        FROM (
          SELECT stock_id, COUNT(*)::int AS cnt
          FROM ${schema}.asset_stock_serials
          WHERE asset_stocks_unique_id = ANY($1::int[])
          GROUP BY stock_id
        ) sub
        WHERE s.stock_id = sub.stock_id;
        `, [unlinkedPeripheralSerialIds]);
        }
        if (activeTechnicalMappings && activeTechnicalMappings.length > 0) {
            try {
                await manager.query(`SET search_path TO "${schema}", public;`);
                const eventsToSave = [];
                for (const row of activeTechnicalMappings) {
                    const sourceSerialId = Number(row.source_serial_id);
                    const targetSerialId = Number(row.target_serial_id);
                    const forwardLabel = row.forward_label || row.relation_type;
                    const reverseLabel = row.reverse_label || row.relation_type;
                    const relCategory = row.rel_category || 'SOFTWARE';
                    const isSourceScrapped = serialIds.includes(sourceSerialId);
                    const sourceEvent = manager.create(asset_events_entity_1.AssetEvent, {
                        asset_id: row.source_asset_id ? Number(row.source_asset_id) : null,
                        asset_stocks_unique_id: sourceSerialId,
                        title: 'Technical Relationship Unlinked',
                        description: isSourceScrapped
                            ? `Auto-unlinked: ${forwardLabel} -> ${row.target_name} (Asset scrapped)`
                            : `Auto-unlinked: ${forwardLabel} -> ${row.target_name} (Connected asset scrapped)`,
                        reference_table: 'asset_mapping',
                        reference_id: Number(row.mapping_id),
                        metadata: {
                            action: 'UNLINK',
                            is_technical_relationship: true,
                            relation_type: row.relation_type,
                            relation_category: relCategory,
                            relation_label: forwardLabel,
                            connected_serial_id: targetSerialId,
                            connected_asset_name: row.target_name,
                            direction: 'FORWARD',
                            reason: 'SCRAP',
                        },
                        performed_by: userId,
                        performed_at: new Date(),
                        created_at: new Date(),
                        event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                    });
                    const targetEvent = manager.create(asset_events_entity_1.AssetEvent, {
                        asset_id: row.target_asset_id ? Number(row.target_asset_id) : null,
                        asset_stocks_unique_id: targetSerialId,
                        title: 'Technical Relationship Unlinked',
                        description: isSourceScrapped
                            ? `Auto-unlinked: ${reverseLabel} -> ${row.source_name} (Host hardware scrapped)`
                            : `Auto-unlinked: ${reverseLabel} -> ${row.source_name} (Connected asset scrapped)`,
                        reference_table: 'asset_mapping',
                        reference_id: Number(row.mapping_id),
                        metadata: {
                            action: 'UNLINK',
                            is_technical_relationship: true,
                            relation_type: row.relation_type,
                            relation_category: relCategory,
                            relation_label: reverseLabel,
                            connected_serial_id: sourceSerialId,
                            connected_asset_name: row.source_name,
                            direction: 'REVERSE',
                            reason: 'SCRAP',
                        },
                        performed_by: userId,
                        performed_at: new Date(),
                        created_at: new Date(),
                        event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                    });
                    eventsToSave.push(sourceEvent, targetEvent);
                }
                if (eventsToSave.length > 0) {
                    await manager.save(asset_events_entity_1.AssetEvent, eventsToSave);
                }
            }
            catch (evtErr) {
                console.error('Failed to log post-scrap relationship unlinking events:', evtErr);
            }
        }
        return {
            softwareUnlinkedCount: deactivateSoftwareResult?.length || 0,
            hostingUnlinkedCount: deactivateGuestVmResult?.length || 0,
        };
    }
    async cascadeImpactToChildren(manager, schema, parentSerialIds, reason = 'PARENT_UNDER_MAINTENANCE') {
        if (!parentSerialIds || parentSerialIds.length === 0)
            return [];
        let currentParents = [...parentSerialIds];
        const allImpactedChildren = new Set();
        for (let depth = 1; depth <= 5; depth++) {
            if (currentParents.length === 0)
                break;
            const childrenRows = await manager.query(`
        SELECT 
          m.relation_type,
          m.asset_stocks_unique_id,
          m.target_id,
          a_src.asset_sub_category_id AS src_sub_cat,
          COALESCE(mc_src.main_category_name, '') AS src_main_cat,
          COALESCE(sc_src.sub_category_name, '') AS src_sub_cat_name,
          a_tgt.asset_sub_category_id AS tgt_sub_cat,
          COALESCE(mc_tgt.main_category_name, '') AS tgt_main_cat,
          COALESCE(sc_tgt.sub_category_name, '') AS tgt_sub_cat_name
        FROM ${schema}.asset_mapping m
        JOIN ${schema}.asset_stock_serials ass_src ON ass_src.asset_stocks_unique_id = m.asset_stocks_unique_id
        JOIN ${schema}.assets a_src ON a_src.asset_id = ass_src.asset_id
        LEFT JOIN ${schema}.asset_main_category mc_src ON mc_src.main_category_id = a_src.asset_main_category_id
        LEFT JOIN ${schema}.asset_sub_category sc_src ON sc_src.sub_category_id = a_src.asset_sub_category_id
        JOIN ${schema}.asset_stock_serials ass_tgt ON ass_tgt.asset_stocks_unique_id = m.target_id
        JOIN ${schema}.assets a_tgt ON a_tgt.asset_id = ass_tgt.asset_id
        LEFT JOIN ${schema}.asset_main_category mc_tgt ON mc_tgt.main_category_id = a_tgt.asset_main_category_id
        LEFT JOIN ${schema}.asset_sub_category sc_tgt ON sc_tgt.sub_category_id = a_tgt.asset_sub_category_id
        WHERE m.is_active = 1
          AND m.is_deleted = 0
          AND m.relation_type IN ('REL-010', 'REL-006', 'REL-007')
          AND (m.asset_stocks_unique_id = ANY($1::bigint[]) OR m.target_id = ANY($1::bigint[]));
        `, [currentParents]);
            const nextParents = [];
            for (const row of childrenRows) {
                let childId = null;
                if (row.relation_type === 'REL-010') {
                    const isSrcVm = row.src_sub_cat === 7 || row.src_sub_cat_name.toLowerCase().includes('cloud');
                    childId = isSrcVm ? Number(row.asset_stocks_unique_id) : Number(row.target_id);
                }
                else if (row.relation_type === 'REL-006') {
                    const isSrcSw = row.src_main_cat.toLowerCase().includes('software') || row.src_sub_cat_name.toLowerCase().includes('software');
                    childId = isSrcSw ? Number(row.asset_stocks_unique_id) : Number(row.target_id);
                }
                else if (row.relation_type === 'REL-007') {
                    const isSrcPeripheral = [13, 14].includes(Number(row.src_sub_cat)) ||
                        (row.src_sub_cat_name || '').toLowerCase().includes('peripheral') ||
                        (row.src_item_name || '').toLowerCase().includes('monitor') ||
                        (row.src_item_name || '').toLowerCase().includes('dock');
                    childId = isSrcPeripheral ? Number(row.asset_stocks_unique_id) : Number(row.target_id);
                }
                if (childId && !parentSerialIds.includes(childId) && !allImpactedChildren.has(childId)) {
                    allImpactedChildren.add(childId);
                    nextParents.push(childId);
                }
            }
            currentParents = nextParents;
        }
        const childIds = Array.from(allImpactedChildren);
        if (childIds.length > 0) {
            await manager.query(`
        UPDATE ${schema}.asset_stock_serials
        SET impact_status = 'IMPACTED',
            impacted_by_serial_id = $1,
            impact_reason = $2
        WHERE asset_stocks_unique_id = ANY($3::bigint[])
          AND (impact_status IS NULL OR impact_status <> 'IMPACTED');
        `, [parentSerialIds[0], reason, childIds]);
        }
        return childIds;
    }
    async clearImpactOnChildren(manager, schema, parentSerialIds) {
        if (!parentSerialIds || parentSerialIds.length === 0)
            return [];
        const res = await manager.query(`
      UPDATE ${schema}.asset_stock_serials
      SET impact_status = 'NONE',
          impacted_by_serial_id = NULL,
          impact_reason = NULL
      WHERE impacted_by_serial_id = ANY($1::bigint[])
      RETURNING asset_stocks_unique_id;
      `, [parentSerialIds]);
        return (res || []).map((r) => Number(r.asset_stocks_unique_id));
    }
    async getTransferImpactPreview(schema, hostSerialId, toLocationId) {
        const hostRows = await this.dataSource.query(`
      SELECT 
        ass.asset_stocks_unique_id,
        ass.system_code,
        COALESCE(ass.asset_serial_title, a.asset_title, 'Host Asset') AS asset_name,
        ass.location_id,
        ass.current_status_id,
        ass.impact_status
      FROM ${schema}.asset_stock_serials ass
      JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
      WHERE ass.asset_stocks_unique_id = $1 AND ass.is_deleted = 0;
      `, [hostSerialId]);
        if (!hostRows || hostRows.length === 0) {
            throw new common_1.HttpException('Host asset not found', common_1.HttpStatus.NOT_FOUND);
        }
        const host = hostRows[0];
        const isHostDown = host.impact_status === 'IMPACTED' ||
            [8, 9].includes(Number(host.current_status_id));
        let currentParents = [hostSerialId];
        const visited = new Set([hostSerialId]);
        const dependents = [];
        let hasImpactedOrMaintenanceChild = isHostDown;
        let blockReason = isHostDown
            ? `Host '${host.system_code}' is currently under maintenance or impacted (ERR_PARENT_UNAVAILABLE).`
            : null;
        for (let depth = 1; depth <= 5; depth++) {
            if (currentParents.length === 0)
                break;
            const childrenRows = await this.dataSource.query(`
        SELECT 
          m.mapping_id,
          m.relation_type,
          m.asset_stocks_unique_id,
          m.target_id,
          ass_src.system_code AS src_system_code,
          COALESCE(ass_src.asset_serial_title, a_src.asset_title, '') AS src_name,
          ass_src.location_id AS src_location_id,
          ass_src.current_status_id AS src_status_id,
          ass_src.impact_status AS src_impact_status,
          a_src.asset_sub_category_id AS src_sub_cat,
          COALESCE(mc_src.main_category_name, '') AS src_main_cat,
          COALESCE(sc_src.sub_category_name, '') AS src_sub_cat_name,

          ass_tgt.system_code AS tgt_system_code,
          COALESCE(ass_tgt.asset_serial_title, a_tgt.asset_title, '') AS tgt_name,
          ass_tgt.location_id AS tgt_location_id,
          ass_tgt.current_status_id AS tgt_status_id,
          ass_tgt.impact_status AS tgt_impact_status,
          a_tgt.asset_sub_category_id AS tgt_sub_cat,
          COALESCE(mc_tgt.main_category_name, '') AS tgt_main_cat,
          COALESCE(sc_tgt.sub_category_name, '') AS tgt_sub_cat_name
        FROM ${schema}.asset_mapping m
        JOIN ${schema}.asset_stock_serials ass_src ON ass_src.asset_stocks_unique_id = m.asset_stocks_unique_id
        JOIN ${schema}.assets a_src ON a_src.asset_id = ass_src.asset_id
        LEFT JOIN ${schema}.asset_main_category mc_src ON mc_src.main_category_id = a_src.asset_main_category_id
        LEFT JOIN ${schema}.asset_sub_category sc_src ON sc_src.sub_category_id = a_src.asset_sub_category_id
        JOIN ${schema}.asset_stock_serials ass_tgt ON ass_tgt.asset_stocks_unique_id = m.target_id
        JOIN ${schema}.assets a_tgt ON a_tgt.asset_id = ass_tgt.asset_id
        LEFT JOIN ${schema}.asset_main_category mc_tgt ON mc_tgt.main_category_id = a_tgt.asset_main_category_id
        LEFT JOIN ${schema}.asset_sub_category sc_tgt ON sc_tgt.sub_category_id = a_tgt.asset_sub_category_id
        WHERE m.is_active = 1
          AND m.is_deleted = 0
          AND m.relation_type IN ('REL-010', 'REL-006', 'REL-007')
          AND (m.asset_stocks_unique_id = ANY($1::bigint[]) OR m.target_id = ANY($1::bigint[]));
        `, [currentParents]);
            const nextParents = [];
            for (const row of childrenRows) {
                const isParentSrc = currentParents.includes(Number(row.asset_stocks_unique_id));
                const childId = isParentSrc ? Number(row.target_id) : Number(row.asset_stocks_unique_id);
                const childSystemCode = isParentSrc ? row.tgt_system_code : row.src_system_code;
                const childName = isParentSrc ? row.tgt_name : row.src_name;
                const childLocationId = isParentSrc ? row.tgt_location_id : row.src_location_id;
                const childStatusId = isParentSrc ? row.tgt_status_id : row.src_status_id;
                const childImpactStatus = isParentSrc ? row.tgt_impact_status : row.src_impact_status;
                let dependentType = 'OTHER';
                let defaultAction = 'MOVE';
                let allowedActions = ['MOVE'];
                if (row.relation_type === 'REL-010') {
                    dependentType = 'VM';
                    defaultAction = 'MOVE';
                    allowedActions = ['MOVE', 'MIGRATE_FIRST'];
                }
                else if (row.relation_type === 'REL-006') {
                    dependentType = 'SOFTWARE';
                    defaultAction = 'MOVE';
                    allowedActions = ['MOVE'];
                }
                else if (row.relation_type === 'REL-007') {
                    dependentType = 'PERIPHERAL';
                    defaultAction = 'MOVE';
                    allowedActions = ['MOVE', 'LEAVE_BEHIND'];
                }
                if (childId && !visited.has(childId)) {
                    visited.add(childId);
                    nextParents.push(childId);
                    const isChildDown = childImpactStatus === 'IMPACTED' || [8, 9].includes(Number(childStatusId));
                    if (isChildDown) {
                        hasImpactedOrMaintenanceChild = true;
                        if (!blockReason) {
                            blockReason = `Dependent asset '${childSystemCode}' is currently under maintenance or impacted (ERR_PARENT_UNAVAILABLE).`;
                        }
                    }
                    const warnings = [];
                    if (dependentType === 'SOFTWARE') {
                        try {
                            const swSub = await this.dataSource.query(`
                SELECT license_metric, branch_id
                FROM ${schema}.asset_software_subscription
                WHERE asset_stocks_unique_id = $1
                LIMIT 1;
                `, [childId]);
                            if (swSub &&
                                swSub.length > 0 &&
                                swSub[0].license_metric === 'SITE' &&
                                swSub[0].branch_id &&
                                Number(swSub[0].branch_id) !== Number(toLocationId)) {
                                warnings.push(`Site licence is scoped to branch #${swSub[0].branch_id}. Transferring host may require licence reassessment or compliance review.`);
                            }
                        }
                        catch (swErr) {
                        }
                    }
                    dependents.push({
                        serial_id: childId,
                        system_code: childSystemCode,
                        asset_name: childName,
                        relation_type: row.relation_type,
                        depth,
                        dependent_type: dependentType,
                        default_action: defaultAction,
                        allowed_actions: allowedActions,
                        current_location_id: childLocationId,
                        is_impacted_or_maintenance: isChildDown,
                        warnings,
                    });
                }
            }
            currentParents = nextParents;
        }
        return {
            host_serial_id: Number(host.asset_stocks_unique_id),
            host_system_code: host.system_code,
            host_name: host.asset_name,
            from_location_id: Number(host.location_id),
            to_location_id: Number(toLocationId),
            is_host_impacted_or_maintenance: isHostDown,
            can_transfer: !hasImpactedOrMaintenanceChild,
            block_reason: blockReason,
            dependents,
            summary: {
                total_dependents: dependents.length,
                software_count: dependents.filter((d) => d.dependent_type === 'SOFTWARE').length,
                vm_count: dependents.filter((d) => d.dependent_type === 'VM').length,
                peripheral_count: dependents.filter((d) => d.dependent_type === 'PERIPHERAL').length,
            },
        };
    }
    async cascadeLocationTransfer(manager, schema, hostSerialId, toLocationId, dependentsDecision = [], userId, parentTransferId) {
        const decisionsMap = new Map();
        for (const d of dependentsDecision || []) {
            decisionsMap.set(Number(d.serial_id), d.action);
        }
        let currentParents = [hostSerialId];
        const visited = new Set([hostSerialId]);
        let movedCount = 0;
        let leftBehindCount = 0;
        for (let depth = 1; depth <= 5; depth++) {
            if (currentParents.length === 0)
                break;
            const childrenRows = await manager.query(`
        SELECT 
          m.mapping_id,
          m.relation_type,
          m.asset_stocks_unique_id,
          m.target_id,
          a_src.asset_sub_category_id AS src_sub_cat,
          COALESCE(mc_src.main_category_name, '') AS src_main_cat,
          COALESCE(sc_src.sub_category_name, '') AS src_sub_cat_name,
          a_tgt.asset_sub_category_id AS tgt_sub_cat,
          COALESCE(mc_tgt.main_category_name, '') AS tgt_main_cat,
          COALESCE(sc_tgt.sub_category_name, '') AS tgt_sub_cat_name
        FROM ${schema}.asset_mapping m
        JOIN ${schema}.asset_stock_serials ass_src ON ass_src.asset_stocks_unique_id = m.asset_stocks_unique_id
        JOIN ${schema}.assets a_src ON a_src.asset_id = ass_src.asset_id
        LEFT JOIN ${schema}.asset_main_category mc_src ON mc_src.main_category_id = a_src.asset_main_category_id
        LEFT JOIN ${schema}.asset_sub_category sc_src ON sc_src.sub_category_id = a_src.asset_sub_category_id
        JOIN ${schema}.asset_stock_serials ass_tgt ON ass_tgt.asset_stocks_unique_id = m.target_id
        JOIN ${schema}.assets a_tgt ON a_tgt.asset_id = ass_tgt.asset_id
        LEFT JOIN ${schema}.asset_main_category mc_tgt ON mc_tgt.main_category_id = a_tgt.asset_main_category_id
        LEFT JOIN ${schema}.asset_sub_category sc_tgt ON sc_tgt.sub_category_id = a_tgt.asset_sub_category_id
        WHERE m.is_active = 1
          AND m.is_deleted = 0
          AND m.relation_type IN ('REL-010', 'REL-006', 'REL-007')
          AND (m.asset_stocks_unique_id = ANY($1::bigint[]) OR m.target_id = ANY($1::bigint[]));
        `, [currentParents]);
            const nextParents = [];
            for (const row of childrenRows) {
                const isParentSrc = currentParents.includes(Number(row.asset_stocks_unique_id));
                const childId = isParentSrc
                    ? Number(row.target_id)
                    : Number(row.asset_stocks_unique_id);
                const isPeripheral = row.relation_type === 'REL-007';
                if (childId && !visited.has(childId)) {
                    visited.add(childId);
                    const decision = decisionsMap.get(childId) || 'MOVE';
                    if (isPeripheral && decision === 'LEAVE_BEHIND') {
                        await manager.query(`
              UPDATE ${schema}.asset_mapping
              SET is_active = 0,
                  is_deleted = 1,
                  returned_by = $1,
                  updated_at = CURRENT_TIMESTAMP
              WHERE mapping_id = $2;
              `, [userId, row.mapping_id]);
                        await manager.query(`
              UPDATE ${schema}.asset_mapping
              SET is_active = 0,
                  is_deleted = 1,
                  returned_by = $1,
                  updated_at = CURRENT_TIMESTAMP
              WHERE asset_stocks_unique_id = $2 AND is_inherited = 1;
              `, [userId, childId]);
                        await manager.query(`
              UPDATE ${schema}.asset_stock_serials
              SET current_status_id = 1,
                  working_status_type_id = 20
              WHERE asset_stocks_unique_id = $1;
              `, [childId]);
                        const unlinkEvent = manager.create(asset_events_entity_1.AssetEvent, {
                            asset_stocks_unique_id: childId,
                            title: 'Peripheral Left Behind',
                            description: `Detached from host #${hostSerialId} on location transfer; returned to Available stock`,
                            reference_table: 'asset_mapping',
                            reference_id: Number(row.mapping_id),
                            metadata: {
                                action: 'LEAVE_BEHIND',
                                reason: 'HOST_TRANSFERRED',
                                host_serial_id: hostSerialId,
                            },
                            performed_by: userId,
                            performed_at: new Date(),
                            created_at: new Date(),
                            event_category: asset_events_entity_1.AssetEventCategory.ASSIGNMENT,
                        });
                        await manager.save(asset_events_entity_1.AssetEvent, unlinkEvent);
                        leftBehindCount++;
                    }
                    else {
                        await manager.query(`
              UPDATE ${schema}.asset_stock_serials
              SET location_id = $1
              WHERE asset_stocks_unique_id = $2;
              `, [toLocationId, childId]);
                        const moveEvent = manager.create(asset_events_entity_1.AssetEvent, {
                            asset_stocks_unique_id: childId,
                            title: 'Asset Location Transfer (CASCADE)',
                            description: `Cascaded location transfer with host #${hostSerialId} to location #${toLocationId}`,
                            reference_table: 'location_transfer',
                            reference_id: parentTransferId || null,
                            metadata: {
                                transfer_reason: 'CASCADE',
                                parent_serial_id: hostSerialId,
                                parent_transfer_id: parentTransferId,
                                to_location_id: toLocationId,
                            },
                            performed_by: userId,
                            performed_at: new Date(),
                            created_at: new Date(),
                            event_category: asset_events_entity_1.AssetEventCategory.LOCATION,
                        });
                        await manager.save(asset_events_entity_1.AssetEvent, moveEvent);
                        movedCount++;
                        nextParents.push(childId);
                    }
                }
            }
            currentParents = nextParents;
        }
        return { movedCount, leftBehindCount };
    }
};
exports.AssetRelationshipHookService = AssetRelationshipHookService;
exports.AssetRelationshipHookService = AssetRelationshipHookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AssetRelationshipHookService);
