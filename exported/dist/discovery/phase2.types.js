"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NET_DIAG_TOOLS = exports.CREDENTIAL_KINDS = exports.TERMINAL_JOB_STATUSES = void 0;
exports.TERMINAL_JOB_STATUSES = [
    'succeeded', 'failed', 'timed_out', 'cancelled', 'expired', 'rejected',
];
exports.CREDENTIAL_KINDS = [
    'windows-local', 'windows-domain', 'snmp-v2c', 'ssh', 'ldap-bind',
];
exports.NET_DIAG_TOOLS = ['ping', 'tracert', 'pathping', 'nbtstat', 'http', 'https', 'tcp-port'];
