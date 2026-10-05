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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MaintenanceCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const maintenance_entity_1 = require("../../manage-asset/entities/maintenance.entity");
const register_user_login_entity_1 = require("../../organization_register/entities/register-user-login.entity");
const asset_limitation_entity_1 = require("../../organizational-profile/public_schema_entity/asset-limitation.entity");
const typeorm_2 = require("typeorm");
const manage_asset_service_1 = require("../../manage-asset/manage-asset.service");
const redis_service_1 = require("../redis/redis.service");
const tenant_util_1 = require("./utils/tenant.util");
const PARTITIONED_TABLES = [
    { table: 'asset_events' },
    { table: 'asset_assignment_events' },
    { table: 'asset_maintenance' },
    { table: 'location_transfers' },
];
const TABLESPACE = process.env.PG_TABLESPACE ?? 'pg_default';
const TABLE_OWNER = process.env.PG_TABLE_OWNER ?? 'postgres';
function pad2(n) {
    return String(n).padStart(2, '0');
}
function getNextMonthRange() {
    const now = new Date();
    const year = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
    const month = now.getMonth() === 11 ? 1 : now.getMonth() + 2;
    const nextYear = month === 12 ? year + 1 : year;
    const nextMonth = month === 12 ? 1 : month + 1;
    return {
        fromTs: `${year}-${pad2(month)}-01 00:00:00`,
        toTs: `${nextYear}-${pad2(nextMonth)}-01 00:00:00`,
        suffix: `${year}_${pad2(month)}`,
    };
}
function buildPartitionSQL(schema, table, fromTs, toTs, suffix) {
    return `
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = '${schema}' AND c.relname = '${table}_${suffix}'
      ) THEN
        EXECUTE format(
          'CREATE TABLE %I.%I PARTITION OF %I.%I
             FOR VALUES FROM (%L) TO (%L) TABLESPACE ${TABLESPACE}',
          '${schema}', '${table}_${suffix}',
          '${schema}', '${table}',
          '${fromTs}', '${toTs}'
        );
        EXECUTE format(
          'ALTER TABLE %I.%I OWNER TO %I',
          '${schema}', '${table}_${suffix}', '${TABLE_OWNER}'
        );
      END IF;
    END;
    $$
  `;
}
let MaintenanceCronService = MaintenanceCronService_1 = class MaintenanceCronService {
    constructor(manageAssetService, dataSource, redisService, registerUserLoginRepository, limitationRepo) {
        this.manageAssetService = manageAssetService;
        this.dataSource = dataSource;
        this.redisService = redisService;
        this.registerUserLoginRepository = registerUserLoginRepository;
        this.limitationRepo = limitationRepo;
        this.logger = new common_1.Logger(MaintenanceCronService_1.name);
        this.invitationCronRunning = false;
        this.partitionCronRunning = false;
        this.isRunning = false;
        this.SCHEDULED_STATUS = 8;
        this.OVERDUE_STATUS = 11;
    }
    async handleOverdueMaintenance() {
        if (this.isRunning) {
            this.logger.warn('Maintenance cron already running. Skipping.');
            return;
        }
        this.isRunning = true;
        this.logger.log('⏰ Starting overdue maintenance cron job');
        try {
            await this.markOverdueMaintenance();
            this.logger.log('✅ Overdue maintenance cron completed');
        }
        catch (error) {
            this.logger.error('❌ Cron failed', error);
        }
        finally {
            this.isRunning = false;
        }
    }
    async markOverdueMaintenance() {
        const today = new Date();
        const tenants = await this.dataSource.query(`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name LIKE 'org_%'
    `);
        this.logger.log(`Found ${tenants.length} tenant(s)`);
        for (const tenant of tenants) {
            const schema = tenant.schema_name;
            try {
                this.logger.log(`Processing tenant: ${schema}`);
                await (0, tenant_util_1.withTenantRepository)(this.dataSource, maintenance_entity_1.AssetMaintenance, schema, async (maintenanceRepo) => {
                    const result = await maintenanceRepo.update({
                        scheduled_date: (0, typeorm_2.LessThan)(today),
                        asset_working_condition_id: this.SCHEDULED_STATUS,
                        is_active: 1,
                        is_deleted: 0,
                    }, {
                        asset_working_condition_id: this.OVERDUE_STATUS,
                        updated_at: new Date(),
                    });
                    this.logger.log(`[${schema}] Marked ${result.affected || 0} maintenance(s) as OVERDUE`);
                });
            }
            catch (tenantError) {
                this.logger.error(`❌ Failed processing tenant ${schema}`, tenantError);
            }
        }
    }
    async handleExpiredInvitations() {
        if (this.invitationCronRunning) {
            this.logger.warn('Invitation cron already running. Skipping.');
            return;
        }
        this.isRunning = true;
        this.logger.log('Starting invitation expiry cron job');
        try {
            const now = new Date();
            const result = await this.registerUserLoginRepository.update({
                invite_status: register_user_login_entity_1.InviteStatus.INVITED,
                invite_expires_at: (0, typeorm_2.LessThan)(now),
            }, {
                invite_status: register_user_login_entity_1.InviteStatus.EXPIRED,
            });
            this.logger.log(`Marked ${result.affected || 0} invitation(s) as EXPIRED`);
            this.logger.log('✅ Invitation expiry cron completed');
            await this.redisService.delByPattern('organization-users:*');
        }
        catch (error) {
            this.logger.error('❌ Invitation cron failed', error);
        }
        finally {
            this.isRunning = false;
        }
    }
    async getTenantSchemas() {
        const rows = await this.dataSource.query(`
    SELECT schema_name
    FROM information_schema.schemata
    WHERE schema_name LIKE 'org_%'
      AND schema_name NOT IN ('org_public', 'information_schema')
  `);
        return rows.map((r) => r.schema_name);
    }
    async handlePartitionCreation() {
        if (this.partitionCronRunning) {
            this.logger.warn('Partition cron already running. Skipping.');
            return;
        }
        this.partitionCronRunning = true;
        this.logger.log('⏰ Starting partition creation cron job');
        try {
            await this.createNextMonthPartitions();
            this.logger.log('✅ Partition creation cron completed');
        }
        catch (error) {
            this.logger.error('❌ Partition cron failed', error);
        }
        finally {
            this.partitionCronRunning = false;
        }
    }
    async createNextMonthPartitions() {
        const { fromTs, toTs, suffix } = getNextMonthRange();
        const results = { created: [], skipped: [], failed: [] };
        const schemas = await this.getTenantSchemas();
        this.logger.log(`Found ${schemas.length} schemas`);
        for (const schema of schemas) {
            for (const { table } of PARTITIONED_TABLES) {
                const partName = `${schema}.${table}_${suffix}`;
                try {
                    const exists = await this.dataSource.query(`
          SELECT 1
          FROM pg_class c
          JOIN pg_namespace n ON n.oid = c.relnamespace
          WHERE n.nspname = $1
            AND c.relname = $2
          `, [schema, `${table}_${suffix}`]);
                    if (exists.length > 0) {
                        this.logger.log(`⏭ Skipped: ${partName}`);
                        results.skipped.push(partName);
                        continue;
                    }
                    await this.dataSource.query(buildPartitionSQL(schema, table, fromTs, toTs, suffix));
                    this.logger.log(`✓ Created: ${partName}`);
                    results.created.push(partName);
                }
                catch (err) {
                    this.logger.error(`✗ Failed: ${partName}`, err);
                    results.failed.push(partName);
                }
            }
        }
        return results;
    }
};
exports.MaintenanceCronService = MaintenanceCronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaintenanceCronService.prototype, "handleOverdueMaintenance", null);
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaintenanceCronService.prototype, "handleExpiredInvitations", null);
__decorate([
    (0, schedule_1.Cron)('0 11 25 * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaintenanceCronService.prototype, "handlePartitionCreation", null);
exports.MaintenanceCronService = MaintenanceCronService = MaintenanceCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(register_user_login_entity_1.RegisterUserLogin)),
    __param(4, (0, typeorm_1.InjectRepository)(asset_limitation_entity_1.AssetLimitation)),
    __metadata("design:paramtypes", [manage_asset_service_1.ManageAssetService,
        typeorm_2.DataSource,
        redis_service_1.RedisService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MaintenanceCronService);
