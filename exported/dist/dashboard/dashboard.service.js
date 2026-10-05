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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const asset_mapping_entity_1 = require("../asset-mapping/entities/asset-mapping.entity");
const asset_datum_entity_1 = require("../assets-data/asset-data/entities/asset-datum.entity");
const asset_stock_serials_entity_1 = require("../assets-data/stocks/entities/asset_stock_serials.entity");
const stock_summary_refresh_service_1 = require("../assets-data/stocks/stock-summary-refresh.service");
const redis_service_1 = require("../common/redis/redis.service");
const maintenance_entity_1 = require("../manage-asset/entities/maintenance.entity");
const register_organization_entity_1 = require("../organization_register/entities/register-organization.entity");
const department_entity_1 = require("../organizational-profile/entity/department.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const policy_attribute_entity_1 = require("../organizational-profile/entity/policy-builder/policy-attribute.entity");
const special_permission_master_1 = require("../organizational-profile/entity/policy-builder/special-permission-master");
const typeorm_2 = require("typeorm");
let DashboardService = class DashboardService {
    constructor(assetMappingRepository, departmentRepository, assetmaintenanceRepository, AssetDatumRepository, AssetStockSerialsRepository, dataSource, redisService, stockSummaryRefreshService) {
        this.assetMappingRepository = assetMappingRepository;
        this.departmentRepository = departmentRepository;
        this.assetmaintenanceRepository = assetmaintenanceRepository;
        this.AssetDatumRepository = AssetDatumRepository;
        this.AssetStockSerialsRepository = AssetStockSerialsRepository;
        this.dataSource = dataSource;
        this.redisService = redisService;
        this.stockSummaryRefreshService = stockSummaryRefreshService;
    }
    async refreshDashboard(organizationId) {
        await this.stockSummaryRefreshService.forceDashboardRefreshNow(organizationId);
        return {
            success: true,
            message: 'Dashboard refreshed',
            refreshedAt: new Date().toISOString(),
        };
    }
    async getDashboardCountsFromView(organizationId, branchIds = [], globalBranchIds = [], userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const org = await queryRunner.manager
                .getRepository(register_organization_entity_1.RegisterOrganization)
                .findOne({
                where: { organization_id: organizationId },
            });
            if (!org) {
                throw new Error('Organization not found');
            }
            const schemaName = `org_${org.organization_schema_name}`;
            const user = await queryRunner.manager.getRepository(organizational_user_entity_1.User).findOne({
                where: { register_user_login_id: userId },
                select: ['user_id', 'role_id'],
            });
            const roleId = user?.role_id;
            const actualUserId = user?.user_id;
            const selfPermission = await queryRunner.manager
                .getRepository(special_permission_master_1.SpecialPermissionsMaster)
                .findOne({
                where: { attr_key: 'view_self_added_assets' },
                select: ['id'],
            });
            const selfPolicy = await queryRunner.manager
                .getRepository(policy_attribute_entity_1.PolicyAttribute)
                .createQueryBuilder('pa')
                .where('pa.role_id = :roleId', { roleId: roleId?.toString() })
                .andWhere('pa.special_permission_master_id = :spId', {
                spId: selfPermission?.id,
            })
                .getOne();
            const hasSelfAccess = !!selfPolicy;
            await queryRunner.query(`SET app.user_id = '${actualUserId || 0}'`);
            await queryRunner.query(`SET app.has_self_permission = '${hasSelfAccess}'`);
            let filterClause = '';
            const params = [];
            if (branchIds.length > 0) {
                filterClause = `WHERE dc.branch_id = ANY($1::int[])`;
                params.push(branchIds);
            }
            else if (globalBranchIds.length > 0) {
                filterClause = `WHERE dc.branch_id = ANY($1::int[])`;
                params.push(globalBranchIds);
            }
            const result = await queryRunner.query(`
      SELECT 
        COALESCE(SUM(users), 0) AS users,
        COALESCE(SUM(departments), 0) AS departments,
        COALESCE(SUM(branches), 0) AS branches,
        COALESCE(SUM(locations), 0) AS locations,
        COALESCE(SUM(assets), 0) AS assets,
        COALESCE(SUM(in_use_assets), 0) AS in_use_assets,
        COALESCE(SUM(available_assets), 0) AS available_assets,
        COALESCE(SUM(maintenance_assets), 0) AS maintenance_assets,
        COALESCE(SUM(total_asset_price), 0) AS total_asset_price,
        COALESCE(SUM(it_warranty_expiring), 0) AS it_warranty_expiring,
        COALESCE(SUM(it_warranty_action_required), 0) AS it_warranty_action_required,
        COALESCE(SUM(location_transfers), 0) AS location_transfers,
        COALESCE(SUM(pending_location_transfers), 0) AS pending_location_transfers,
        COALESCE(SUM(completed_location_transfers), 0) AS completed_location_transfers,
        COALESCE(SUM(costcenter_counts), 0) AS costcenter_counts,
        COALESCE(SUM(active_cost_centers), 0) AS active_cost_centers,
        COALESCE(SUM(inactive_cost_centers), 0) AS inactive_cost_centers,
        COALESCE(SUM(deleted_cost_centers), 0) AS deleted_cost_centers,
        COALESCE(SUM(costcenter_with_assets), 0) AS costcenter_with_assets,
        MAX(total_cost_centers) AS total_cost_centers,
        COALESCE(SUM(total_software), 0) AS total_software,
        COALESCE(SUM(software_renewal_expiring), 0) AS software_renewal_expiring,
        COALESCE(SUM(software_renewal_expired), 0) AS software_renewal_expired,
        COALESCE(SUM(total_software_price), 0) AS total_software_price,

        CASE 
          WHEN SUM(assets) > 0 
          THEN ROUND(SUM(in_use_assets)::numeric / SUM(assets) * 100, 2)
          ELSE 0 
        END AS in_use_percentage,

        CASE 
          WHEN SUM(assets) > 0 
          THEN ROUND(SUM(available_assets)::numeric / SUM(assets) * 100, 2)
          ELSE 0 
        END AS available_percentage,

        CASE 
          WHEN SUM(assets) > 0 
          THEN ROUND(SUM(maintenance_assets)::numeric / SUM(assets) * 100, 2)
          ELSE 0 
        END AS maintenance_percentage,

        CASE 
          WHEN SUM(location_transfers) > 0 
          THEN ROUND(SUM(pending_location_transfers)::numeric / SUM(location_transfers) * 100, 2)
          ELSE 0 
        END AS pending_transfer_percentage,

        CASE 
          WHEN SUM(location_transfers) > 0 
          THEN ROUND(SUM(completed_location_transfers)::numeric / SUM(location_transfers) * 100, 2)
          ELSE 0 
        END AS completed_transfer_percentage,

        CASE 
          WHEN SUM(assets) > 0 
          THEN ROUND(SUM(it_warranty_expiring)::numeric / SUM(assets) * 100, 2)
          ELSE 0 
        END AS warranty_expiring_percentage,

        CASE
          WHEN SUM(costcenter_counts) > 0
          THEN ROUND(SUM(active_cost_centers)::numeric / SUM(costcenter_counts) * 100, 2)
          ELSE 0
        END AS active_cost_center_percentage,

        CASE
          WHEN SUM(costcenter_counts) > 0
          THEN ROUND(SUM(costcenter_with_assets)::numeric / SUM(costcenter_counts) * 100, 2)
          ELSE 0
        END AS branch_costcenter_utilization,

        CASE
          WHEN MAX(total_cost_centers) > 0
          THEN ROUND(SUM(costcenter_with_assets)::numeric / MAX(total_cost_centers) * 100, 2)
          ELSE 0
        END AS global_costcenter_utilization,

        CASE
          WHEN SUM(total_software) > 0
          THEN ROUND(SUM(software_renewal_expiring)::numeric / SUM(total_software) * 100, 2)
          ELSE 0
        END AS software_renewal_expiring_percentage

      FROM (
        SELECT *
        FROM ${schemaName}.${hasSelfAccess ? 'dashboard_counts_live' : 'dashboard_counts'} dc
        ${filterClause}
      ) dc
      `, params);
            return {
                status: 'success',
                message: 'Dashboard counts fetched successfully',
                data: result?.[0] || {},
            };
        }
        catch (error) {
            throw new common_1.HttpException(error instanceof Error
                ? error.message
                : error || 'Failed to fetch dashboard counts', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            await queryRunner.query(`SET search_path TO public`);
            await queryRunner.release();
        }
    }
    async getDashboardFromView(organizationId, branchIds = [], globalBranchIds = [], userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const user = await queryRunner.manager.getRepository(organizational_user_entity_1.User).findOne({
                where: { register_user_login_id: userId },
                select: ['user_id', 'role_id'],
            });
            const roleId = user?.role_id;
            const actualUserId = user?.user_id;
            const selfPermission = await queryRunner.manager
                .getRepository(special_permission_master_1.SpecialPermissionsMaster)
                .findOne({
                where: { attr_key: 'view_self_added_assets' },
                select: ['id'],
            });
            const selfPolicy = await queryRunner.manager
                .getRepository(policy_attribute_entity_1.PolicyAttribute)
                .createQueryBuilder('pa')
                .where('pa.role_id = :roleId', { roleId: roleId?.toString() })
                .andWhere('pa.special_permission_master_id = :spId', {
                spId: selfPermission?.id,
            })
                .getOne();
            const hasSelfAccess = !!selfPolicy;
            await queryRunner.query(`SET app.user_id = '${actualUserId || 0}'`);
            await queryRunner.query(`SET app.has_self_permission = '${hasSelfAccess}'`);
            const org = await queryRunner.manager
                .getRepository(register_organization_entity_1.RegisterOrganization)
                .findOne({ where: { organization_id: organizationId } });
            if (!org)
                throw new Error('Organization not found');
            const schemaName = `org_${org.organization_schema_name}`;
            await queryRunner.query(`SET search_path TO "${schemaName}", public`);
            const cleanBranchIds = Array.isArray(branchIds)
                ? branchIds.map(Number).filter((id) => !isNaN(id))
                : [];
            const cleanGlobalBranchIds = Array.isArray(globalBranchIds)
                ? globalBranchIds.map(Number).filter((id) => !isNaN(id))
                : [];
            let finalBranchIds = [];
            if (cleanBranchIds.length > 0 && cleanGlobalBranchIds.length > 0) {
                finalBranchIds = cleanBranchIds.filter((id) => cleanGlobalBranchIds.includes(id));
            }
            else if (cleanBranchIds.length > 0) {
                finalBranchIds = cleanBranchIds;
            }
            else if (cleanGlobalBranchIds.length > 0) {
                finalBranchIds = cleanGlobalBranchIds;
            }
            const analyticsRelation = hasSelfAccess
                ? 'dashboard_analytics_live'
                : 'dashboard_analytics';
            let query = `SELECT * FROM ${analyticsRelation}`;
            const params = [];
            if (finalBranchIds.length > 0) {
                query += ` WHERE branch_id = ANY($1::int[])`;
                params.push(finalBranchIds);
            }
            const result = await queryRunner.query(query, params);
            const hasNullRow = result.some((r) => r.branch_id === null);
            if (result.length > 1 && !hasNullRow) {
                let totalAssets = 0;
                const merged = {
                    branch_id: null,
                    dashboard: {
                        ...result[0].dashboard,
                        assets: 0,
                        assetAge: {},
                        assignmentTypeSummary: [],
                        statusSummary: [],
                        newAssets: [],
                        maintenanceMonthly: [],
                        maintenanceYearly: [],
                        ownership: [],
                        categoryChart: [],
                        categoryChartFormatted: {},
                    },
                };
                const assetAgeMap = {};
                const assignmentMap = {};
                const statusMap = {};
                const newAssetsMap = {};
                const monthlyMap = {};
                const yearlyMap = {};
                const ownershipMap = {};
                const categoryMap = {};
                const mainCategoryTotals = {};
                const subCategoryMap = {};
                result.forEach((row) => {
                    const d = row.dashboard || {};
                    totalAssets += Number(d.assets || 0);
                    (d.categoryChart || []).forEach((c) => {
                        const key = `${c.mainCategory}__${c.subCategory}`;
                        if (!categoryMap[key]) {
                            categoryMap[key] = {
                                mainCategory: c.mainCategory,
                                subCategory: c.subCategory,
                                count: 0,
                            };
                        }
                        categoryMap[key].count += Number(c.count || 0);
                        mainCategoryTotals[c.mainCategory] =
                            (mainCategoryTotals[c.mainCategory] || 0) + Number(c.count || 0);
                        if (!subCategoryMap[c.mainCategory]) {
                            subCategoryMap[c.mainCategory] = {};
                        }
                        subCategoryMap[c.mainCategory][c.subCategory] =
                            (subCategoryMap[c.mainCategory][c.subCategory] || 0) +
                                Number(c.count || 0);
                    });
                    Object.entries(d.assetAge || {}).forEach(([k, v]) => {
                        if (!assetAgeMap[k])
                            assetAgeMap[k] = { count: 0 };
                        assetAgeMap[k].count += Number(v?.count || 0);
                    });
                    (d.assignmentTypeSummary || []).forEach((a) => {
                        if (!assignmentMap[a.type]) {
                            assignmentMap[a.type] = { count: 0, color: a.color };
                        }
                        assignmentMap[a.type].count += Number(a.count || 0);
                    });
                    (d.statusSummary || []).forEach((s) => {
                        if (!statusMap[s.statusName]) {
                            statusMap[s.statusName] = { count: 0, color: s.color };
                        }
                        statusMap[s.statusName].count += Number(s.count || 0);
                    });
                    (d.newAssets || []).forEach((n) => {
                        const key = `${n.month}-${n.year}`;
                        newAssetsMap[key] = (newAssetsMap[key] || 0) + Number(n.value || 0);
                    });
                    (d.maintenanceMonthly || []).forEach((m) => {
                        if (!monthlyMap[m.month]) {
                            monthlyMap[m.month] = { assetCount: 0, amount: 0 };
                        }
                        monthlyMap[m.month].assetCount += Number(m.assetCount || 0);
                        monthlyMap[m.month].amount += Number(m.amount || 0);
                    });
                    (d.maintenanceYearly || []).forEach((y) => {
                        if (!yearlyMap[y.year]) {
                            yearlyMap[y.year] = { assetCount: 0, amount: 0 };
                        }
                        yearlyMap[y.year].assetCount += Number(y.assetCount || 0);
                        yearlyMap[y.year].amount += Number(y.amount || 0);
                    });
                    (d.ownership || []).forEach((o) => {
                        if (!ownershipMap[o.type]) {
                            ownershipMap[o.type] = { count: 0, color: o.color };
                        }
                        ownershipMap[o.type].count += Number(o.count || 0);
                    });
                });
                merged.dashboard.assets = totalAssets;
                const totalCategoryCount = Object.values(mainCategoryTotals).reduce((a, b) => a + Number(b || 0), 0);
                merged.dashboard.categoryChart = Object.values(categoryMap);
                merged.dashboard.categoryChartFormatted = {
                    all: Object.keys(mainCategoryTotals).map((mc) => ({
                        name: mc,
                        count: mainCategoryTotals[mc],
                        value: totalCategoryCount > 0
                            ? Math.round((Number(mainCategoryTotals[mc]) / totalCategoryCount) * 100)
                            : 0,
                    })),
                    categories: Object.keys(subCategoryMap).reduce((acc, mc) => {
                        acc[mc] = Object.keys(subCategoryMap[mc]).map((sc) => ({
                            name: sc,
                            count: subCategoryMap[mc][sc],
                            value: mainCategoryTotals[mc] > 0
                                ? Math.round((subCategoryMap[mc][sc] / mainCategoryTotals[mc]) * 100)
                                : 0,
                        }));
                        return acc;
                    }, {}),
                };
                merged.dashboard.assetAge = Object.keys(assetAgeMap).reduce((acc, key) => {
                    acc[key] = {
                        count: assetAgeMap[key].count,
                        percentage: totalAssets > 0
                            ? +((assetAgeMap[key].count / totalAssets) * 100).toFixed(2)
                            : 0,
                    };
                    return acc;
                }, {});
                merged.dashboard.assignmentTypeSummary = Object.keys(assignmentMap).map((k) => ({
                    type: k,
                    count: assignmentMap[k].count,
                    percentage: totalAssets > 0
                        ? +((assignmentMap[k].count / totalAssets) * 100).toFixed(2)
                        : 0,
                    color: assignmentMap[k].color,
                }));
                merged.dashboard.statusSummary = Object.keys(statusMap).map((k) => ({
                    statusName: k,
                    count: statusMap[k].count,
                    percentage: totalAssets > 0
                        ? +((statusMap[k].count / totalAssets) * 100).toFixed(2)
                        : 0,
                    color: statusMap[k].color,
                }));
                merged.dashboard.newAssets = Object.keys(newAssetsMap).map((k) => {
                    const [month, year] = k.split('-');
                    return { month, year: Number(year), value: newAssetsMap[k] };
                });
                merged.dashboard.maintenanceMonthly = Object.keys(monthlyMap).map((k) => ({
                    month: k,
                    assetCount: monthlyMap[k].assetCount,
                    amount: monthlyMap[k].amount,
                }));
                merged.dashboard.maintenanceYearly = Object.keys(yearlyMap).map((k) => ({
                    year: Number(k),
                    assetCount: yearlyMap[k].assetCount,
                    amount: yearlyMap[k].amount,
                }));
                merged.dashboard.ownership = Object.keys(ownershipMap).map((k) => ({
                    type: k,
                    count: ownershipMap[k].count,
                    percentage: totalAssets > 0
                        ? +((ownershipMap[k].count / totalAssets) * 100).toFixed(2)
                        : 0,
                    color: ownershipMap[k].color,
                }));
                return {
                    status: 'success',
                    message: 'Dashboard data fetched successfully',
                    data: [merged],
                };
            }
            return {
                status: 'success',
                message: 'Dashboard data fetched successfully',
                data: result,
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException(error instanceof Error
                ? error.message
                : error || 'Failed to fetch dashboard', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        finally {
            try {
                await queryRunner.query(`SET search_path TO public`);
            }
            catch { }
            await queryRunner.release();
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_mapping_entity_1.AssetMappingRepository)),
    __param(1, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __param(2, (0, typeorm_1.InjectRepository)(maintenance_entity_1.AssetMaintenance)),
    __param(3, (0, typeorm_1.InjectRepository)(asset_datum_entity_1.AssetDatum)),
    __param(4, (0, typeorm_1.InjectRepository)(asset_stock_serials_entity_1.AssetStockSerials)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        redis_service_1.RedisService,
        stock_summary_refresh_service_1.StockSummaryRefreshService])
], DashboardService);
