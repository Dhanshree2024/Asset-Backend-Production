"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASSET_ACTION_RULES = void 0;
exports.buildRuleCaseSql = buildRuleCaseSql;
exports.getRule = getRule;
const relationship_error_codes_1 = require("../../asset-mapping/constants/relationship-error-codes");
const STATUS_DECOMMISSIONED = 3;
const STATUS_IN_USE = 7;
const STATUS_ASSIGNABLE = [1, 4, 5];
const WS_MAINTENANCE_COMPLETED = 10;
const WS_TRANSFER_PENDING = 16;
const WS_ASSIGN_BLOCKED = [2, 3, 4, 8, 9, 11, 12, 13, 14, 16, 17];
const WS_BUSY_MAINTENANCE = [8, 9, 11];
const WS_BUSY_SCRAP = [13, 14];
const WS_BUSY_TRANSFER = [16, 17];
const WS_SCRAPPED = 12;
const busy = (ids) => `v.working_status_type_id = ANY(ARRAY[${ids.join(',')}])`;
const hasActiveMapping = (schema) => `EXISTS (
  SELECT 1 FROM ${schema}.asset_mapping m
  WHERE m.asset_stocks_unique_id = v.asset_stocks_unique_id
    AND m.is_active = 1 AND m.is_deleted = 0
)`;
const hasOpenMaintenance = (schema) => `EXISTS (
  SELECT 1 FROM ${schema}.asset_maintenance am
  WHERE am.asset_stocks_unique_id = v.asset_stocks_unique_id
    AND am.status_type_id = 2
    AND am.asset_working_condition_id <> ${WS_MAINTENANCE_COMPLETED}
    AND am.is_deleted = 0
)`;
const hasPendingTransfer = (schema) => `EXISTS (
  SELECT 1 FROM ${schema}.location_transfers lt
  WHERE lt.asset_stocks_unique_id = v.asset_stocks_unique_id
    AND lt.transfer_status = ${WS_TRANSFER_PENDING}
    AND lt.is_deleted = 0
)`;
const hostsActiveVirtualMachines = (schema) => `EXISTS (
  SELECT 1 FROM ${schema}.asset_mapping m
  LEFT JOIN ${schema}.asset_stock_serials ass_source ON ass_source.asset_stocks_unique_id = m.asset_stocks_unique_id
  LEFT JOIN ${schema}.assets a_source ON a_source.asset_id = ass_source.asset_id
  WHERE m.relation_type = 'REL-010'
    AND m.is_active = 1
    AND m.is_deleted = 0
    AND (CASE WHEN a_source.asset_sub_category_id = 7 THEN m.target_id ELSE m.asset_stocks_unique_id END) = v.asset_stocks_unique_id
)`;
const isSoftwareInstalledOnHost = (schema) => `(
  v.is_software = true AND EXISTS (
    SELECT 1 FROM ${schema}.asset_mapping r
    JOIN ${schema}.asset_items ai ON ai.asset_item_id = v.asset_item_id
    WHERE r.target_id = v.asset_stocks_unique_id
      AND r.relation_type = 'REL-006'
      AND r.is_active = 1
      AND r.is_deleted = 0
      AND (ai.license_metric = 'PER_DEVICE' OR ai.license_metric IS NULL)
  )
)`;
const hasInheritedCustody = (schema) => `(
  EXISTS (
    SELECT 1 FROM ${schema}.asset_mapping m
    WHERE m.asset_stocks_unique_id = v.asset_stocks_unique_id
      AND m.is_inherited = 1
      AND m.is_active = 1
      AND m.is_deleted = 0
  ) OR EXISTS (
    SELECT 1 FROM ${schema}.asset_mapping r
    WHERE r.target_id = v.asset_stocks_unique_id
      AND r.relation_type IN ('REL-006', 'REL-007')
      AND r.is_active = 1
      AND r.is_deleted = 0
  )
)`;
const DECOMMISSIONED = `v.asset_status_type_id = ${STATUS_DECOMMISSIONED}`;
exports.ASSET_ACTION_RULES = {
    SCRAP: [
        { code: 'SCRAP_ALREADY_SCRAPPED', label: 'Already scrapped',
            sql: () => `(${DECOMMISSIONED} OR v.working_status_type_id = ${WS_SCRAPPED})`,
            reason: 'Asset is already scrapped.' },
        { code: 'SCRAP_HOSTS_ACTIVE_VMS', label: 'Hosts active virtual machines (REL-010)',
            sql: hostsActiveVirtualMachines,
            reason: 'Host server currently hosts active virtual machines. Migrate or unlink VMs before scrapping.' },
        { code: 'SCRAP_IN_SCRAP_FLOW', label: 'Scrap already in progress',
            sql: () => busy(WS_BUSY_SCRAP),
            reason: 'A scrap request for this asset is already in progress.' },
        { code: 'SCRAP_IN_TRANSFER', label: 'Mid-transfer',
            sql: () => busy(WS_BUSY_TRANSFER),
            reason: 'Asset is being transferred. Complete or cancel the transfer first.' },
    ],
    MAINTENANCE: [
        { code: 'MAINT_DECOMMISSIONED', label: 'Decommissioned',
            sql: () => `(${DECOMMISSIONED} OR v.working_status_type_id = ${WS_SCRAPPED})`,
            reason: 'Asset is decommissioned.' },
        { code: 'MAINT_ALREADY_OPEN', label: 'Already in active maintenance',
            sql: (s) => `(${hasOpenMaintenance(s)} OR ${busy(WS_BUSY_MAINTENANCE)})`,
            reason: 'Asset already has an open maintenance record.' },
        { code: 'MAINT_IN_SCRAP_FLOW', label: 'Scrap in progress',
            sql: () => busy(WS_BUSY_SCRAP),
            reason: 'A scrap request for this asset is in progress.' },
        { code: 'MAINT_IN_TRANSFER', label: 'Mid-transfer',
            sql: () => busy(WS_BUSY_TRANSFER),
            reason: 'Asset is being transferred. Complete or cancel the transfer first.' },
    ],
    TRANSFER: [
        { code: 'TRANSFER_DECOMMISSIONED', label: 'Decommissioned',
            sql: () => DECOMMISSIONED,
            reason: 'Asset is decommissioned.' },
        { code: 'TRANSFER_PENDING', label: 'Already in a pending transfer',
            sql: hasPendingTransfer,
            reason: 'Asset is already in a pending transfer.' },
        { code: 'TRANSFER_NO_SOURCE', label: 'No source location',
            sql: () => `v.asset_location IS NULL`, remediable: true,
            reason: 'Asset has no source location. Set one before transferring.' },
        { code: 'TRANSFER_IN_SCRAP_FLOW', label: 'Scrap in progress',
            sql: () => busy(WS_BUSY_SCRAP),
            reason: 'A scrap request for this asset is in progress.' },
    ],
    ASSIGN: [
        { code: relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.CUSTODY_INHERITED, label: 'Installed on Host (REL-006)',
            sql: isSoftwareInstalledOnHost,
            reason: 'Software is currently installed on a host computer. Its user and branch follow that device. Unlink it first, or reassign the host device.' },
        { code: 'ASSIGN_ALREADY_ASSIGNED', label: 'Already assigned',
            sql: () => `v.asset_status_type_id = ${STATUS_IN_USE}`,
            reason: 'Asset is already assigned. Use Reassign instead.' },
        { code: 'ASSIGN_BAD_STATE', label: 'Not in an assignable state',
            sql: () => `v.asset_status_type_id NOT IN (${STATUS_ASSIGNABLE.join(',')})`,
            reason: 'Asset is not in an assignable state.' },
        { code: 'ASSIGN_RESTRICTED_CONDITION', label: 'Working condition blocks assignment',
            sql: () => `v.working_status_type_id = ANY(ARRAY[${WS_ASSIGN_BLOCKED.join(',')}])`,
            reason: 'Asset working condition does not allow assignment.' },
    ],
    REASSIGN: [
        { code: relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.CUSTODY_INHERITED, label: 'Installed on Host (REL-006)',
            sql: isSoftwareInstalledOnHost,
            reason: 'Software is currently installed on a host computer. Its user and branch follow that device. Unlink it first, or reassign the host device.' },
        { code: 'REASSIGN_NOT_ASSIGNED', label: 'Not currently assigned',
            sql: () => `v.asset_status_type_id <> ${STATUS_IN_USE}`,
            reason: 'Asset is not currently assigned, so it cannot be reassigned.' },
        { code: 'REASSIGN_RESTRICTED_CONDITION', label: 'Working condition blocks reassignment',
            sql: () => `v.working_status_type_id = ANY(ARRAY[${WS_ASSIGN_BLOCKED.join(',')}])`,
            reason: 'Asset working condition does not allow reassignment.' },
    ],
    RETURN: [
        { code: relationship_error_codes_1.RELATIONSHIP_ERROR_CODES.CUSTODY_INHERITED, label: 'Installed on Host / Inherited Custody',
            sql: hasInheritedCustody,
            reason: 'Custody is inherited from host device. Please unlink or detach the asset from its host device instead of returning custody directly.' },
        { code: 'RETURN_DECOMMISSIONED', label: 'Decommissioned',
            sql: () => DECOMMISSIONED,
            reason: 'Asset is decommissioned.' },
        { code: 'RETURN_NOT_ASSIGNED', label: 'Not currently assigned',
            sql: (s) => `NOT ${hasActiveMapping(s)}`,
            reason: 'Asset is not currently assigned, so there is nothing to return.' },
        { code: 'RETURN_IN_TRANSFER', label: 'Mid-transfer',
            sql: () => busy(WS_BUSY_TRANSFER),
            reason: 'Asset is being transferred. Complete or cancel the transfer first.' },
    ],
};
function buildRuleCaseSql(action, schema) {
    const rules = exports.ASSET_ACTION_RULES[action];
    if (!rules?.length)
        return null;
    const whens = rules
        .map((r) => `WHEN ${r.sql(schema)} THEN '${r.code}'`)
        .join('\n         ');
    return `CASE ${whens} ELSE NULL END`;
}
function getRule(action, code) {
    return exports.ASSET_ACTION_RULES[action]?.find((r) => r.code === code);
}
