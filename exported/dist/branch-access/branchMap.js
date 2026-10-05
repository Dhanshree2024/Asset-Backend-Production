"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRANCH_MAP = void 0;
exports.BRANCH_MAP = {
    User: {
        alias: 'user',
        joins: [],
        column: 'user.branch_id',
    },
    Locations: {
        alias: 'asset_locations',
        joins: [],
        column: 'asset_locations.branch_id',
    },
    LocationBranch: {
        alias: 'location_branch_mapping',
        joins: [],
        column: 'location_branch_mapping.branch_id',
    },
    Branch: {
        alias: 'branch',
        joins: [],
        column: 'branch.branch_id',
    },
    AssetAllStockDetailsView: {
        alias: 'v',
        joins: [
            {
                type: 'left',
                from: 'location_branch_mapping',
                alias: 'loc',
                condition: 'loc.location_mapping_id = v.location_id',
            },
        ],
        column: 'loc.branch_id',
    },
    Stock: {
        alias: 'st',
        joins: [
            {
                type: 'left',
                from: 'location_branch_mapping',
                alias: 'loc',
                condition: 'loc.location_mapping_id = st.location_id',
            },
        ],
        column: 'loc.branch_id',
    },
    AssetProcurementItem: {
        alias: 'api',
        joins: [
            {
                type: 'left',
                from: 'location_branch_mapping',
                alias: 'loc',
                condition: 'loc.location_mapping_id = api.location_id',
            },
        ],
        column: 'loc.branch_id',
    },
    AssetStockSerials: {
        alias: 'serial',
        joins: [
            {
                type: 'left',
                from: 'asset_procurement_items',
                alias: 'api',
                condition: 'api.procurement_item_id = serial.procurement_item_id',
            },
            {
                type: 'left',
                from: 'location_branch_mapping',
                alias: 'loc',
                condition: 'loc.location_mapping_id = api.location_id',
            },
        ],
        column: 'loc.branch_id',
    },
    AssetStockSerialsByUser: {
        alias: 'ass',
        joins: [
            {
                type: 'left',
                from: 'users',
                alias: 'u',
                condition: 'u.user_id = ass.created_by',
            },
        ],
        column: 'u.branch_id',
    },
    CreatedByUser: {
        alias: 't',
        joins: [
            {
                type: 'left',
                from: 'users',
                alias: 'u',
                condition: 'u.user_id = t.created_by',
            },
        ],
        column: 'u.branch_id',
    },
    LocationTransfer: {
        alias: 'lt',
        joins: [
            {
                type: 'left',
                from: 'location_branch_mapping',
                alias: 'fromLoc',
                condition: 'fromLoc.location_mapping_id = lt.from_location_id',
            },
        ],
        column: 'fromLoc.branch_id',
    },
    AssetMaintenance: {
        alias: 'm',
        joins: [
            {
                type: 'left',
                from: 'asset_stock_serials',
                alias: 'maint_serial',
                condition: 'maint_serial.asset_stocks_unique_id = m.asset_stocks_unique_id',
            },
            {
                type: 'left',
                from: 'asset_procurement_items',
                alias: 'maint_api',
                condition: 'maint_api.procurement_item_id = maint_serial.procurement_item_id',
            },
            {
                type: 'left',
                from: 'location_branch_mapping',
                alias: 'maint_loc',
                condition: 'maint_loc.location_mapping_id = maint_api.location_id',
            },
        ],
        column: 'maint_loc.branch_id',
    },
    AssetScrap: {
        alias: 's',
        joins: [
            {
                type: 'left',
                from: 'asset_stock_serials',
                alias: 'scrap_serial',
                condition: 'scrap_serial.asset_stocks_unique_id = s.asset_stocks_unique_id',
            },
            {
                type: 'left',
                from: 'asset_procurement_items',
                alias: 'scrap_api',
                condition: 'scrap_api.procurement_item_id = scrap_serial.procurement_item_id',
            },
            {
                type: 'left',
                from: 'location_branch_mapping',
                alias: 'scrap_loc',
                condition: 'scrap_loc.location_mapping_id = scrap_api.location_id',
            },
        ],
        column: 'scrap_loc.branch_id',
    },
};
