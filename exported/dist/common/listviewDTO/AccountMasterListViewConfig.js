"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountMasterListViewConfig = void 0;
exports.AccountMasterListViewConfig = {
    primaryKey: 'account_master_id',
    join_keys: {
        account_master_type: ['account_type_id'],
    },
    relations: ['account_master_type'],
    non_db_relations: [],
    selectedColumns: {
        t: [
            'account_master_id',
            'account_master_name',
            'account_master_name_local',
            'account_master_short_name',
            'account_master_description',
            'account_type_id',
            'is_enabled',
            'is_deleted',
            'created_at',
            'updated_at',
        ],
        account_master_type: ['account_type_id', 'account_master_type_name']
    },
    visible_columns: [
        'account_master_name',
        'account_master_short_name',
        'account_master_name_local',
        'account_master_description',
        'account_master_type.account_master_type_name',
        'is_enabled',
        'created_at',
        'updated_at'
    ],
    sortable_columns: [
        'account_master_id',
        'account_master_name',
        'account_master_name_local',
        'account_master_short_name',
        'created_at',
        'updated_at',
        'is_enabled'
    ],
    display_names: {
        account_master_id: 'Account Master ID',
        account_master_name: 'Account Master Name',
        account_master_name_local: 'Name (Local)',
        account_master_short_name: 'Short Name',
        account_master_description: 'Description',
        'account_master_type.account_master_type_name': 'Account Type',
        is_enabled: 'Status',
        created_at: 'Created At',
        updated_at: 'Updated At'
    },
    column_order: [
        'account_master_name',
        'account_master_name_local',
        'account_master_short_name',
        'account_master_description',
        'account_master_type.account_master_type_name',
        'is_enabled',
        'created_at',
        'updated_at',
    ],
    column_visibility: {
        account_master_id: false,
        account_master_name: true,
        account_master_name_local: false,
        account_master_short_name: true,
        account_master_description: true,
        'account_master_type.account_master_type_name': true,
        is_enabled: true,
        created_at: false,
        updated_at: false
    },
    sort: [{ column: 'account_master_id', order: 'DESC' }],
    filters: [{ column: 'is_deleted', values: ['0'] }],
    pagination: { page: 1, limit: 20 },
    filterable_columns: [
        {
            display_name: 'Account Master Type',
            column: 'account_type_id',
            type: 'select',
            dynamicOptionsFrom: 'account_master_type'
        },
        {
            display_name: 'Status',
            column: 'is_enabled',
            type: 'select',
            options: [
                { label: 'Active', value: 1 },
                { label: 'Inactive', value: 0 }
            ]
        }
    ]
};
