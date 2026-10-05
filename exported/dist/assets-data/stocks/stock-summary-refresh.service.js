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
exports.StockSummaryRefreshService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../common/redis/redis.service");
const typeorm_1 = require("typeorm");
let StockSummaryRefreshService = class StockSummaryRefreshService {
    constructor(dataSource, redis) {
        this.dataSource = dataSource;
        this.redis = redis;
        this.pendingRefresh = new Map();
        this.refreshInFlight = new Set();
        this.DEBOUNCE_MS = 4000;
        this.DASHBOARD_MATVIEWS = ['dashboard_counts', 'dashboard_analytics'];
        this.dashboardPending = new Map();
        this.dashboardInFlight = new Set();
        this.DASHBOARD_DEBOUNCE_MS = 180000;
        this.MATVIEWS = [
            'view_item_stock_summary',
            'view_softwares',
            'perpetual_softwares',
            'v_branch_asset_counts',
            'v_location_asset_counts',
            'v_vendor_asset_counts',
            'v_cost_center_asset_counts',
            'v_project_asset_counts',
        ];
    }
    async resolveSchema(organizationId) {
        const cacheKey = `organization_organization_schema_name:${organizationId}`;
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return cached;
        const org = await this.dataSource.query(`SELECT organization_schema_name FROM public.register_organization WHERE organization_id = $1 LIMIT 1`, [organizationId]);
        if (!org?.length) {
            throw new Error(`No schema found for organizationId=${organizationId}`);
        }
        const schema = `org_${org[0].organization_schema_name}`;
        await this.redis.set(cacheKey, schema, 3600);
        return schema;
    }
    async scheduleRefresh(organizationId) {
        const schema = await this.resolveSchema(organizationId);
        const existing = this.pendingRefresh.get(schema);
        if (existing)
            clearTimeout(existing);
        const timer = setTimeout(() => {
            this.pendingRefresh.delete(schema);
            this.runRefresh(schema).catch((err) => console.error(`[StockSummaryRefresh] failed for ${schema}:`, err));
        }, this.DEBOUNCE_MS);
        this.pendingRefresh.set(schema, timer);
        this.scheduleDashboardRefresh(schema);
    }
    async refreshNow(organizationId) {
        const schema = await this.resolveSchema(organizationId);
        const existing = this.pendingRefresh.get(schema);
        if (existing) {
            clearTimeout(existing);
            this.pendingRefresh.delete(schema);
        }
        await this.runRefresh(schema);
    }
    scheduleDashboardRefresh(schema) {
        const existing = this.dashboardPending.get(schema);
        if (existing)
            clearTimeout(existing);
        const timer = setTimeout(() => {
            this.dashboardPending.delete(schema);
            this.runDashboardRefresh(schema).catch((err) => console.error(`[DashboardRefresh] failed for ${schema}:`, err));
        }, this.DASHBOARD_DEBOUNCE_MS);
        this.dashboardPending.set(schema, timer);
    }
    async forceDashboardRefreshNow(organizationId) {
        const schema = await this.resolveSchema(organizationId);
        const existing = this.dashboardPending.get(schema);
        if (existing) {
            clearTimeout(existing);
            this.dashboardPending.delete(schema);
        }
        await this.runDashboardRefresh(schema);
    }
    async runDashboardRefresh(schema) {
        if (this.dashboardInFlight.has(schema))
            return;
        this.dashboardInFlight.add(schema);
        console.time(`dashboardRefresh:${schema}`);
        try {
            for (const mv of this.DASHBOARD_MATVIEWS) {
                try {
                    await this.dataSource.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${schema}.${mv}`);
                }
                catch (err) {
                    console.warn(`[DashboardRefresh] skipped ${schema}.${mv} (CONCURRENTLY not possible): ${err?.message}`);
                }
            }
        }
        finally {
            console.timeEnd(`dashboardRefresh:${schema}`);
            this.dashboardInFlight.delete(schema);
        }
    }
    async forceRefreshNow(organizationId) {
        const schema = await this.resolveSchema(organizationId);
        const existing = this.pendingRefresh.get(schema);
        if (existing) {
            clearTimeout(existing);
            this.pendingRefresh.delete(schema);
        }
        await this.runRefresh(schema);
    }
    async runRefresh(schema) {
        if (this.refreshInFlight.has(schema)) {
            const timer = setTimeout(() => {
                this.pendingRefresh.delete(schema);
                this.runRefresh(schema).catch((err) => console.error(`[StockSummaryRefresh] failed for ${schema}:`, err));
            }, this.DEBOUNCE_MS);
            this.pendingRefresh.set(schema, timer);
            return;
        }
        this.refreshInFlight.add(schema);
        console.time(`stockSummaryRefresh:${schema}`);
        try {
            for (const mv of this.MATVIEWS) {
                try {
                    await this.dataSource.query(`REFRESH MATERIALIZED VIEW  ${schema}.${mv}`);
                }
                catch (err) {
                    console.warn(`[StockSummaryRefresh] skipped ${schema}.${mv} (CONCURRENTLY not possible): ${err?.message}`);
                }
            }
            await this.redis.incr(`stock_summary_version:${schema}`);
            console.log(`[StockSummaryRefresh] refreshed for ${schema}`);
        }
        catch (err) {
            console.error(`[StockSummaryRefresh] error refreshing ${schema}:`, err);
        }
        finally {
            console.timeEnd(`stockSummaryRefresh:${schema}`);
            this.refreshInFlight.delete(schema);
        }
    }
};
exports.StockSummaryRefreshService = StockSummaryRefreshService;
exports.StockSummaryRefreshService = StockSummaryRefreshService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        redis_service_1.RedisService])
], StockSummaryRefreshService);
