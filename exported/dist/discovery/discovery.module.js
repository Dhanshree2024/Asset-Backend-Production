"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const request_context_module_1 = require("../common/context/request-context.module");
const database_module_1 = require("../dynamic-schema/database.module");
const organizational_profile_module_1 = require("../organizational-profile/organizational-profile.module");
const location_types_entity_1 = require("../organizational-profile/entity/location-types.entity");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const user_repository_1 = require("../user/user.repository");
const asset_categories_module_1 = require("../assets-data/asset-categories/asset-categories.module");
const asset_data_module_1 = require("../assets-data/asset-data/asset-data.module");
const asset_fields_service_1 = require("../assets-data/asset-fields/asset-fields.service");
const asset_items_fields_mapping_module_1 = require("../assets-data/asset-items-fields-mapping/asset-items-fields-mapping.module");
const asset_items_module_1 = require("../assets-data/asset-items/asset-items.module");
const asset_subcategories_service_1 = require("../assets-data/asset-subcategories/asset-subcategories.service");
const stocks_module_1 = require("../assets-data/stocks/stocks.module");
const agent_controller_1 = require("./agent.controller");
const discovery_config_service_1 = require("./config/discovery-config.service");
const discovery_controller_1 = require("./discovery.controller");
const discovery_service_1 = require("./discovery.service");
const classifier_service_1 = require("./enrichment/classifier.service");
const http_probe_service_1 = require("./enrichment/http-probe.service");
const oui_service_1 = require("./enrichment/oui.service");
const import_controller_1 = require("./import/import.controller");
const import_service_1 = require("./import/import.service");
const software_inventory_service_1 = require("./import/software-inventory.service");
const auto_collect_service_1 = require("./endpoint/auto-collect.service");
const software_inventory_controller_1 = require("./import/software-inventory.controller");
const asset_mapping_module_1 = require("../asset-mapping/asset-mapping.module");
const arp_scanner_1 = require("./scanners/arp.scanner");
const mdns_scanner_1 = require("./scanners/mdns.scanner");
const netbios_scanner_1 = require("./scanners/netbios.scanner");
const ping_scanner_1 = require("./scanners/ping.scanner");
const snmp_scanner_1 = require("./scanners/snmp.scanner");
const ssdp_scanner_1 = require("./scanners/ssdp.scanner");
const agent_repository_1 = require("./store/agent.repository");
const device_repository_1 = require("./store/device.repository");
const audit_controller_1 = require("./audit/audit.controller");
const audit_repository_1 = require("./audit/audit.repository");
const audit_service_1 = require("./audit/audit.service");
const jobs_controller_1 = require("./jobs/jobs.controller");
const jobs_service_1 = require("./jobs/jobs.service");
const credential_controller_1 = require("./credentials/credential.controller");
const credential_repository_1 = require("./credentials/credential.repository");
const credential_service_1 = require("./credentials/credential.service");
const endpoint_controller_1 = require("./endpoint/endpoint.controller");
const endpoint_repository_1 = require("./endpoint/endpoint.repository");
const ad_controller_1 = require("./ad/ad.controller");
const ad_repository_1 = require("./ad/ad.repository");
const ad_service_1 = require("./ad/ad.service");
const phase2_settings_repository_1 = require("./settings/phase2-settings.repository");
const retention_service_1 = require("./settings/retention.service");
const discovery_permission_guard_1 = require("./rbac/discovery-permission.guard");
const package_repository_1 = require("./software/package.repository");
const package_service_1 = require("./software/package.service");
const package_controller_1 = require("./software/package.controller");
const deployment_repository_1 = require("./software/deployment.repository");
const deployment_service_1 = require("./software/deployment.service");
const deployment_controller_1 = require("./software/deployment.controller");
const compliance_repository_1 = require("./software/compliance.repository");
const compliance_service_1 = require("./software/compliance.service");
const compliance_controller_1 = require("./software/compliance.controller");
const software_actions_controller_1 = require("./software/software-actions.controller");
const target_resolver_1 = require("./software/target.resolver");
const settings_controller_1 = require("./settings/settings.controller");
const agent_ops_controller_1 = require("./agents/agent-ops.controller");
const agent_push_controller_1 = require("./agents/agent-push.controller");
const agent_push_repository_1 = require("./agents/agent-push.repository");
const agent_push_service_1 = require("./agents/agent-push.service");
let DiscoveryModule = class DiscoveryModule {
};
exports.DiscoveryModule = DiscoveryModule;
exports.DiscoveryModule = DiscoveryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRATION },
            }),
            typeorm_1.TypeOrmModule.forFeature([sessions_entity_1.Session, register_user_login_entity_1.RegisterUserLogin, user_repository_1.UserRepository, location_types_entity_1.LocationType]),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            request_context_module_1.RequestContextModule,
            organizational_profile_module_1.OrganizationalProfileModule,
            asset_data_module_1.AssetDataModule,
            stocks_module_1.StocksModule,
            asset_items_module_1.AssetItemsModule,
            asset_categories_module_1.AssetCategoriesModule,
            asset_items_fields_mapping_module_1.AssetItemsFieldsMappingModule,
            asset_mapping_module_1.AssetMappingModule,
        ],
        controllers: [
            discovery_controller_1.DiscoveryController,
            agent_controller_1.AgentController,
            import_controller_1.DiscoveryImportController,
            software_inventory_controller_1.SoftwareInventoryController,
            jobs_controller_1.JobsController,
            audit_controller_1.AuditController,
            credential_controller_1.CredentialController,
            endpoint_controller_1.EndpointController,
            ad_controller_1.AdController,
            settings_controller_1.SettingsController,
            agent_ops_controller_1.AgentOpsController,
            agent_push_controller_1.AgentPushController,
            package_controller_1.PackageController,
            deployment_controller_1.DeploymentController,
            compliance_controller_1.ComplianceController,
            software_actions_controller_1.SoftwareActionsController,
        ],
        providers: [
            arp_scanner_1.ArpScanner,
            ping_scanner_1.PingScanner,
            mdns_scanner_1.MdnsScanner,
            ssdp_scanner_1.SsdpScanner,
            netbios_scanner_1.NetbiosScanner,
            snmp_scanner_1.SnmpScanner,
            oui_service_1.OuiService,
            http_probe_service_1.HttpProbeService,
            classifier_service_1.ClassifierService,
            device_repository_1.DeviceRepository,
            agent_repository_1.AgentRepository,
            discovery_config_service_1.DiscoveryConfigService,
            discovery_service_1.DiscoveryService,
            asset_subcategories_service_1.AssetSubcategoriesService,
            asset_fields_service_1.AssetFieldsService,
            import_service_1.DiscoveryImportService,
            software_inventory_service_1.SoftwareInventoryService,
            audit_repository_1.AuditRepository,
            audit_service_1.AuditService,
            credential_repository_1.CredentialRepository,
            credential_service_1.CredentialService,
            endpoint_repository_1.EndpointRepository,
            auto_collect_service_1.EndpointAutoCollectService,
            jobs_service_1.JobsService,
            ad_repository_1.AdRepository,
            ad_service_1.AdService,
            phase2_settings_repository_1.Phase2SettingsRepository,
            retention_service_1.RetentionService,
            discovery_permission_guard_1.DiscoveryPermissionGuard,
            package_repository_1.PackageRepository, package_service_1.PackageService,
            deployment_repository_1.DeploymentRepository, deployment_service_1.DeploymentService,
            agent_push_repository_1.AgentPushRepository, agent_push_service_1.AgentPushService,
            compliance_repository_1.ComplianceRepository, compliance_service_1.ComplianceService,
            target_resolver_1.TargetResolver,
        ],
        exports: [discovery_service_1.DiscoveryService],
    })
], DiscoveryModule);
