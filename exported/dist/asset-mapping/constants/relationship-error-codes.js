"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RELATIONSHIP_ERROR_MESSAGES = exports.RELATIONSHIP_ERROR_CODES = void 0;
exports.RELATIONSHIP_ERROR_CODES = {
    PARENT_LINK_ACTIVE: 'ERR_PARENT_LINK_ACTIVE',
    CUSTODY_INHERITED: 'ERR_CUSTODY_INHERITED',
    INVALID_TARGET_FOR_METRIC: 'ERR_INVALID_TARGET_FOR_METRIC',
    LOCATION_INHERITED: 'ERR_LOCATION_INHERITED',
    LICENSE_SEATS_EXHAUSTED: 'ERR_LICENSE_SEATS_EXHAUSTED',
    ENDPOINT_INACTIVE: 'ERR_ENDPOINT_INACTIVE',
    LICENSE_SCOPE_MISMATCH: 'ERR_LICENSE_SCOPE_MISMATCH',
    LICENSE_ALREADY_ASSIGNED: 'ERR_LICENSE_ALREADY_ASSIGNED',
    ALREADY_CONNECTED: 'ERR_ALREADY_CONNECTED',
    ACTIVE_HOSTED_INSTANCES: 'ERR_ACTIVE_HOSTED_INSTANCES',
    CUSTODY_CONFLICT: 'ERR_CUSTODY_CONFLICT',
    UNRESOLVED_DEPENDENTS: 'ERR_UNRESOLVED_DEPENDENTS',
    ACTION_NOT_ALLOWED_FOR_OFFBOARDING: 'ERR_ACTION_NOT_ALLOWED_FOR_OFFBOARDING',
    CHILD_LINKED_TRANSFER: 'ERR_CHILD_LINKED_TRANSFER',
    PARENT_UNAVAILABLE: 'ERR_PARENT_UNAVAILABLE',
    MISSING_REQUIRED_FIELDS: 'ERR_MISSING_REQUIRED_FIELDS',
};
exports.RELATIONSHIP_ERROR_MESSAGES = {
    [exports.RELATIONSHIP_ERROR_CODES.PARENT_LINK_ACTIVE]: (softwareName, hostSystemCode, hostName) => {
        const hostInfo = hostSystemCode
            ? `'${hostSystemCode}'${hostName ? ` (${hostName})` : ''}`
            : 'a host computer';
        return `Cannot assign: Software '${softwareName}' is currently installed on host ${hostInfo}. Unlink from host first (${exports.RELATIONSHIP_ERROR_CODES.PARENT_LINK_ACTIVE}).`;
    },
    [exports.RELATIONSHIP_ERROR_CODES.CUSTODY_INHERITED]: (softwareName, hostSystemCode, hostName, userOrBranchInfo) => {
        const hostInfo = hostSystemCode
            ? `'${hostSystemCode}'${hostName ? ` (${hostName})` : ''}`
            : 'a host computer';
        const detail = userOrBranchInfo ? ` (${userOrBranchInfo})` : '';
        return `Cannot assign: Software '${softwareName}' is installed on host ${hostInfo}${detail}. Its user and branch follow that device. Unlink it first, or reassign the device (${exports.RELATIONSHIP_ERROR_CODES.CUSTODY_INHERITED}).`;
    },
    [exports.RELATIONSHIP_ERROR_CODES.INVALID_TARGET_FOR_METRIC]: (softwareName, metric, targetType) => {
        return `Cannot assign: '${softwareName}' uses licence metric ${metric}, which cannot be assigned to target type ${targetType} (${exports.RELATIONSHIP_ERROR_CODES.INVALID_TARGET_FOR_METRIC}).`;
    },
    [exports.RELATIONSHIP_ERROR_CODES.LOCATION_INHERITED]: (assetName, hostSystemCode, hostName, isVm) => {
        const hostInfo = hostSystemCode
            ? `'${hostSystemCode}'${hostName ? ` (${hostName})` : ''}`
            : 'the host server';
        if (isVm) {
            return `Cannot assign branch/location: Virtual instance '${assetName}' is hosted on Server ${hostInfo}. Physical location is inherited from the host server (${exports.RELATIONSHIP_ERROR_CODES.LOCATION_INHERITED}). To relocate this instance, migrate it to a host server in the destination branch.`;
        }
        return `Cannot assign branch/location: Software '${assetName}' is installed on host ${hostInfo}. Location is inherited from the host device (${exports.RELATIONSHIP_ERROR_CODES.LOCATION_INHERITED}).`;
    },
    [exports.RELATIONSHIP_ERROR_CODES.LICENSE_SEATS_EXHAUSTED]: (softwareName, totalSeats) => {
        return `Cannot link software: All ${totalSeats} license seat(s) for '${softwareName}' are currently exhausted (${exports.RELATIONSHIP_ERROR_CODES.LICENSE_SEATS_EXHAUSTED}).`;
    },
    [exports.RELATIONSHIP_ERROR_CODES.ENDPOINT_INACTIVE]: (hostSystemCode, hostName) => {
        const hostInfo = hostSystemCode
            ? `'${hostSystemCode}'${hostName ? ` (${hostName})` : ''}`
            : 'host endpoint';
        return `Cannot link software: Host ${hostInfo} is inactive, decommissioned, or scrapped (${exports.RELATIONSHIP_ERROR_CODES.ENDPOINT_INACTIVE}).`;
    },
    [exports.RELATIONSHIP_ERROR_CODES.LICENSE_SCOPE_MISMATCH]: (softwareName, licensedBranchName, hostDeviceName, hostBranchName) => {
        return `Cannot link site-licensed software '${softwareName}': License is scoped to Branch '${licensedBranchName}', but host device '${hostDeviceName}' is located in Branch '${hostBranchName}' (${exports.RELATIONSHIP_ERROR_CODES.LICENSE_SCOPE_MISMATCH}).`;
    },
    [exports.RELATIONSHIP_ERROR_CODES.LICENSE_ALREADY_ASSIGNED]: (softwareName, systemCode, targetType, assignedToName) => {
        const code = systemCode ? ` (${systemCode})` : '';
        const target = targetType ? `${targetType}` : 'a user/department';
        const detail = assignedToName ? `: '${assignedToName}'` : '';
        return `Cannot link software: Software '${softwareName}'${code} is currently directly assigned to ${target}${detail}. Please unassign it before dedicating it to a device (${exports.RELATIONSHIP_ERROR_CODES.LICENSE_ALREADY_ASSIGNED}).`;
    },
    [exports.RELATIONSHIP_ERROR_CODES.ALREADY_CONNECTED]: (guestName, hostName, hostCode, isPeripheral) => {
        const code = hostCode ? ` (${hostCode})` : '';
        if (isPeripheral) {
            return `Single-Host Violation: Peripheral '${guestName}' is already physically attached to Host '${hostName}'${code}. Please detach it from the existing host first (${exports.RELATIONSHIP_ERROR_CODES.ALREADY_CONNECTED}).`;
        }
        return `Single-Host Violation: Target instance '${guestName}' is already hosted on Server '${hostName}'${code}. Please unlink or migrate it from the existing host first (${exports.RELATIONSHIP_ERROR_CODES.ALREADY_CONNECTED}).`;
    },
    [exports.RELATIONSHIP_ERROR_CODES.ACTIVE_HOSTED_INSTANCES]: (hostName, hostCode, guestCount, guestCodesText) => {
        const code = hostCode ? ` (${hostCode})` : '';
        const details = guestCodesText ? ` (${guestCodesText})` : '';
        return `Cannot scrap host server '${hostName}'${code}: it currently hosts ${guestCount} active virtual machine(s) / guest instance(s)${details}. Migrate or unlink VMs first (${exports.RELATIONSHIP_ERROR_CODES.ACTIVE_HOSTED_INSTANCES}).`;
    },
    [exports.RELATIONSHIP_ERROR_CODES.CUSTODY_CONFLICT]: (peripheralName, custodianName, hostCustodianName) => {
        const hostCust = hostCustodianName ? ` instead of host custodian '${hostCustodianName}'` : '';
        return `Custody Conflict: Peripheral '${peripheralName}' is currently directly assigned to '${custodianName}'${hostCust}. Set confirm_reassign to true to reassign it to the host custodian (${exports.RELATIONSHIP_ERROR_CODES.CUSTODY_CONFLICT}).`;
    },
    [exports.RELATIONSHIP_ERROR_CODES.UNRESOLVED_DEPENDENTS]: (hostName, dependentsCount) => {
        return `Unresolved Dependents: Host device '${hostName}' has ${dependentsCount} dependent asset(s) attached. Please specify return actions (RETURN_DETACH, RETURN_BUNDLE, KEEP_WITH_USER, REASSIGN) for each dependent (${exports.RELATIONSHIP_ERROR_CODES.UNRESOLVED_DEPENDENTS}).`;
    },
    [exports.RELATIONSHIP_ERROR_CODES.ACTION_NOT_ALLOWED_FOR_OFFBOARDING]: (peripheralName) => {
        return `Offboarding Policy Violation: Action KEEP_WITH_USER is not permitted for dependent '${peripheralName}' during employee offboarding. The offboarding user cannot retain any company assets (${exports.RELATIONSHIP_ERROR_CODES.ACTION_NOT_ALLOWED_FOR_OFFBOARDING}).`;
    },
    [exports.RELATIONSHIP_ERROR_CODES.CHILD_LINKED_TRANSFER]: (peripheralName, hostName, hostCode) => {
        const hostInfo = hostCode ? `'${hostCode}' (${hostName || 'Host'})` : hostName || 'its host asset';
        return `Cannot transfer connected peripheral '${peripheralName}' alone: It is physically attached to host ${hostInfo}. Detach it first, or transfer the host asset (${exports.RELATIONSHIP_ERROR_CODES.CHILD_LINKED_TRANSFER}).`;
    },
    [exports.RELATIONSHIP_ERROR_CODES.PARENT_UNAVAILABLE]: (assetName, causeAssetName, reason = 'maintenance / impacted') => {
        return `Cannot transfer '${assetName}': ${causeAssetName} is currently under ${reason} (${exports.RELATIONSHIP_ERROR_CODES.PARENT_UNAVAILABLE}). Finish maintenance before initiating location transfer.`;
    },
    [exports.RELATIONSHIP_ERROR_CODES.MISSING_REQUIRED_FIELDS]: (field, context) => {
        return `Missing required field '${field}'${context ? ` for ${context}` : ''} (${exports.RELATIONSHIP_ERROR_CODES.MISSING_REQUIRED_FIELDS}).`;
    },
};
