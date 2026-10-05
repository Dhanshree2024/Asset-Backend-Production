"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireDiscovery = exports.DiscoverySub = exports.DISCOVERY_MODULE = void 0;
const permissions_decorator_1 = require("../../auth/permissions.decorator");
exports.DISCOVERY_MODULE = 'Agent Discovery';
exports.DiscoverySub = {
    Dashboard: 'Dashboard',
    Config: 'Config',
    Collector: 'Collector',
    Import: 'Import to Assets',
    Credentials: 'Credentials',
    Jobs: 'Jobs',
    Audit: 'Audit Log',
    AD: 'Active Directory',
    Agents: 'Agents',
    Packages: 'Packages',
    Deployments: 'Deployments',
    Compliance: 'Compliance',
};
const RequireDiscovery = (submodule, action) => (0, permissions_decorator_1.RequireAction)(exports.DISCOVERY_MODULE, submodule, action);
exports.RequireDiscovery = RequireDiscovery;
