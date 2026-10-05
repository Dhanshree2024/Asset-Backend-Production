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
exports.EnumScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let EnumScript = class EnumScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createEnumType(schemaName, enumName, values) {
        const formattedValues = values.map(v => `'${v}'`).join(', ');
        await this.dataSource.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_type t
          JOIN pg_namespace n ON n.oid = t.typnamespace
          WHERE t.typname = '${enumName}'
          AND n.nspname = '${schemaName}'
        ) THEN
          CREATE TYPE ${schemaName}.${enumName} AS ENUM (${formattedValues});
        ELSE
          ${values.map((v) => `ALTER TYPE ${schemaName}.${enumName} ADD VALUE IF NOT EXISTS '${v}';`).join('\n          ')}
        END IF;
      END
      $$;
    `);
    }
    async createAllEnums(schemaName) {
        const enums = [
            {
                name: 'assign_type_enum',
                values: [
                    'USER',
                    'PROJECT',
                    'DEPARTMENT',
                    'BRANCH',
                    'SYSTEM',
                    'VENDOR',
                    'LOCATION',
                    'ASSET',
                    'OTHER',
                    'SOFTWARE',
                ],
            },
            {
                name: 'asset_relation_category_enum',
                values: [
                    'OPERATIONAL',
                    'STRUCTURAL',
                    'SOFTWARE',
                    'PHYSICAL',
                    'INFRASTRUCTURE',
                    'LIFECYCLE',
                    'DEPENDENCY',
                    'NETWORK',
                    'MONITORING',
                    'INTEGRATION',
                    'SERVICE',
                    'OTHER',
                ],
            },
            {
                name: 'asset_relation_cardinality_enum',
                values: ['1:1', '1:N', 'N:1', 'N:M'],
            },
            {
                name: 'asset_relationship_source_enum',
                values: ['manual', 'agent', 'scanner', 'sync'],
            },
            {
                name: 'item_type_enum',
                values: ['Physical', 'Virtual'],
            },
            {
                name: 'ownership_type_enum',
                values: ['capex', 'opex', 'NA'],
            },
            {
                name: 'relation_type',
                values: ['Other', 'Accessory', 'Contract', 'Application'],
            },
            {
                name: 'role_type_enum',
                values: ['system', 'custom'],
            },
            {
                name: 'support_type_enum',
                values: ['Basic', 'On-site', 'NBD', 'ADP'],
            },
            {
                name: 'warranty_type_enum',
                values: ['WARRANTY DETAILS', 'SUPPORT', 'AMC', 'SERVICE', 'SUBSCRIPTION'],
            },
            {
                name: 'special_permission_attribute_enum',
                values: ['exact', 'range', 'dateRange', 'array'],
            },
            {
                name: 'asset_event_category',
                values: [
                    'LIFECYCLE',
                    'ASSIGNMENT',
                    'LOCATION',
                    'MAINTENANCE',
                    'FINANCIAL',
                    'STATUS',
                    'DOCUMENT',
                    'SYSTEM',
                    'SCRAPE',
                    'UPDATE',
                    'PROJECT',
                    'COSTCENTER',
                    'TITLE',
                    'RENEWALS'
                ],
            },
            {
                name: 'setup_category_type',
                values: ['ESSENTIAL', 'RECOMMENDED', 'OPTIONAL'],
            },
            {
                name: 'setup_role_type',
                values: ['SUPER_ADMIN', 'ADMIN', 'USER'],
            },
            {
                name: 'setup_task_status',
                values: ['PENDING', 'COMPLETED', 'AUTO_COMPLETED'],
            },
            {
                name: 'task_scope_type',
                values: ['INDIVIDUAL', 'COMMON', 'ONE_TIME'],
            },
            {
                name: 'asset_type',
                values: ['TANGIBLE', 'INTANGIBLE'],
            },
        ];
        for (const enumDef of enums) {
            await this.createEnumType(schemaName, enumDef.name, enumDef.values);
        }
    }
};
exports.EnumScript = EnumScript;
exports.EnumScript = EnumScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], EnumScript);
