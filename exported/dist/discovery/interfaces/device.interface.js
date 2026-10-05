"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_DISCOVERY_CONFIG = exports.DEFAULT_FINGERPRINT_PORTS = exports.AGENT_OFFLINE_AFTER_MS = exports.DEVICE_SPECS_CONTRACT_VERSION = exports.DEVICE_CATEGORIES = void 0;
exports.DEVICE_CATEGORIES = [
    'router', 'switch', 'server', 'virtual-machine', 'laptop', 'desktop', 'windows-host',
    'linux-host', 'printer', 'nas', 'ip-camera', 'dvr-nvr', 'attendance',
    'tv', 'projector', 'monitor', 'phone', 'access-point', 'ups', 'hvac',
    'iot', 'unknown',
];
exports.DEVICE_SPECS_CONTRACT_VERSION = 2;
exports.AGENT_OFFLINE_AFTER_MS = 5 * 60 * 1000;
exports.DEFAULT_FINGERPRINT_PORTS = [
    21, 22, 23, 53, 80, 81, 88, 139, 443, 445, 515, 554, 631, 1900, 3389,
    4370, 5000, 7001, 8000, 8001, 8080, 8081, 8443, 8554, 8899, 9000, 9100,
    34567, 37777, 49152,
];
exports.DEFAULT_DISCOVERY_CONFIG = {
    segments: [],
    scanCron: '*/15 * * * *',
    fingerprintPorts: exports.DEFAULT_FINGERPRINT_PORTS,
    snmpEnabled: false,
    snmpCommunity: null,
    snmpSweepAll: false,
    snmpDevices: [],
    autoDetectSubnets: true,
};
