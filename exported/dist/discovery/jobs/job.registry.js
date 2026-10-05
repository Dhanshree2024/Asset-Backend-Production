"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JOB_TYPES = void 0;
exports.jobTypeMeta = jobTypeMeta;
exports.isKnownJobType = isKnownJobType;
exports.jobNeedsApproval = jobNeedsApproval;
const T = (type, label, tier, spec, ttlMinutes = 60) => ({
    type,
    label,
    tier,
    spec,
    ttlMinutes,
    auditAction: `job.${type.toLowerCase()}`,
});
exports.JOB_TYPES = {
    PING: T('PING', 'Ping agent', 'read', '§24', 10),
    INVENTORY_NOW: T('INVENTORY_NOW', 'Refresh inventory now', 'read', '§11', 30),
    CRED_TEST: T('CRED_TEST', 'Test credential', 'read', '§6', 15),
    SERVICE_LIST: T('SERVICE_LIST', 'List Windows services', 'read', '§16', 30),
    SERVICE_CONTROL: T('SERVICE_CONTROL', 'Start / stop / restart / startup-type', 'destructive', '§16', 60),
    EVENTLOG_QUERY: T('EVENTLOG_QUERY', 'Collect event log entries', 'read', '§14', 30),
    PERF_SAMPLE: T('PERF_SAMPLE', 'Sample performance counters', 'read', '§17', 15),
    NET_DIAG: T('NET_DIAG', 'Run network diagnostic', 'operate', '§21', 15),
    AUTH_COLLECT: T('AUTH_COLLECT', 'Authenticated inventory sweep', 'operate', '§6/§12', 240),
    AGENT_UPDATE: T('AGENT_UPDATE', 'Upgrade agent', 'destructive', '§4.1', 240),
    SOFTWARE_INSTALL: T('SOFTWARE_INSTALL', 'Install software package', 'destructive', '§20', 240),
    AGENT_PUSH_INSTALL: T('AGENT_PUSH_INSTALL', 'Remote agent installation (push)', 'destructive', '§3.6.1/D6', 240),
    SOFTWARE_UNINSTALL: T('SOFTWARE_UNINSTALL', 'Uninstall software', 'destructive', '§19', 240),
};
function jobTypeMeta(type) {
    return exports.JOB_TYPES[(type || '').toUpperCase()] ?? null;
}
function isKnownJobType(type) {
    return !!jobTypeMeta(type);
}
function jobNeedsApproval(type) {
    return jobTypeMeta(type)?.tier === 'destructive';
}
