"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scopeSerialIdsToBranch = scopeSerialIdsToBranch;
async function scopeSerialIdsToBranch(opts) {
    const { runner, schema, ids, branchIds, label } = opts;
    const enforce = false;
    const clean = [...new Set((ids || []).map(Number))].filter((n) => Number.isInteger(n));
    if (!branchIds?.length || !clean.length) {
        return { ids: clean, dropped: [], enforced: enforce };
    }
    const rows = await runner.query(`SELECT v.asset_stocks_unique_id AS id
       FROM ${schema}.v_asset_stock_serials v
      WHERE v.asset_stocks_unique_id = ANY($1::int[])
        AND v.location_branch_id = ANY($2::int[])`, [clean, branchIds.map(Number)]);
    const allowed = new Set(rows.map((r) => Number(r.id)));
    const dropped = clean.filter((id) => !allowed.has(id));
    if (dropped.length) {
        console.warn(`[BranchScope] ${enforce ? 'BLOCK' : 'BLOCK(log-only)'} ${label}: ` +
            `${dropped.length}/${clean.length} id(s) outside branch_access ` +
            `${JSON.stringify(branchIds)} -> ${JSON.stringify(dropped.slice(0, 25))}` +
            (dropped.length > 25 ? ' …' : ''));
    }
    return {
        ids: enforce ? clean.filter((id) => allowed.has(id)) : clean,
        dropped,
        enforced: enforce,
    };
}
