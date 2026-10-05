"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyBranchFilter = applyBranchFilter;
const typeorm_1 = require("typeorm");
const branchMap_1 = require("./branchMap");
function applyBranchFilter({ qb, repo, entityKey, alias, options, queryRunner, branchIds = [], allowUnscoped = false, }) {
    if (!branchIds?.length) {
        if (!allowUnscoped) {
            console.warn(`[BranchScope] UNSCOPED query on ${String(entityKey)} — branchIds is empty ` +
                `and allowUnscoped was not set. Returning ALL branches.`);
        }
        return qb || options;
    }
    branchIds = branchIds.map(Number);
    console.log("applyBranchFilter → entityKey:", entityKey, "branchIds:", branchIds);
    const config = branchMap_1.BRANCH_MAP[entityKey];
    if (!config)
        throw new Error(`Branch config not found for ${entityKey}`);
    const paramKey = `bf_${String(entityKey).replace(/[^a-zA-Z0-9]/g, '_')}_ids`;
    if (qb) {
        config.joins?.forEach((j) => {
            const existingAliases = qb.expressionMap?.aliases?.map((a) => a.name) ?? [];
            if (!existingAliases.includes(j.alias)) {
                qb.leftJoin(j.from, j.alias, j.condition);
            }
        });
        qb.andWhere(`${config.column} IN (:...${paramKey})`, {
            [paramKey]: branchIds,
        });
        return qb;
    }
    if (options) {
        if (!config.joins || config.joins.length === 0) {
            const columnName = config.column.split('.')[1];
            return {
                ...options,
                where: {
                    ...options.where,
                    [columnName]: (0, typeorm_1.In)(branchIds),
                },
            };
        }
        throw new Error(`Use QueryBuilder for ${entityKey} (joins required for branch filter)`);
    }
    if (queryRunner) {
        const joins = (config.joins || [])
            .map((j) => `LEFT JOIN ${j.from} ${j.alias} ON ${j.condition}`)
            .join('\n');
        const where = `${config.column} = ANY($1)`;
        const params = [branchIds];
        return { joins, where, params };
    }
    return qb;
}
