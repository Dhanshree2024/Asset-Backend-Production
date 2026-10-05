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
exports.locationTypesScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let locationTypesScript = class locationTypesScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createLocationTypesTable(schemaName) {
        await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS ${schemaName}.location_types
      (
          type_id SERIAL PRIMARY KEY,
          type_name VARCHAR(100) NOT NULL,
          type_code VARCHAR(50) NOT NULL,
          type_icon VARCHAR(100),
          description TEXT,
          sort_order INTEGER DEFAULT 0,
          is_active INTEGER DEFAULT 1,
          is_deleted INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          is_location BOOLEAN DEFAULT true,
          is_occupancy_type BOOLEAN DEFAULT false,
          level INTEGER,
          updated_at TIMESTAMP,
          updated_by INTEGER,
          is_required BOOLEAN DEFAULT false,
          CONSTRAINT location_types_type_code_key UNIQUE (type_code)
      );

      ALTER TABLE IF EXISTS ${schemaName}.location_types
      OWNER TO postgres;
    `);
        const countResult = await this.dataSource.query(`SELECT COUNT(*) as count FROM ${schemaName}.location_types`);
        const count = parseInt(countResult[0].count, 10);
        if (count === 0) {
            const now = new Date();
            const types = [
                {
                    type_name: 'Campus',
                    type_code: 'campus',
                    sort_order: 1,
                    level: 1,
                    is_location: true,
                    is_occupancy_type: true,
                    is_active: 1,
                    is_deleted: 0,
                    is_required: true,
                },
                {
                    type_name: 'Area / Zone',
                    type_code: 'area',
                    sort_order: 2,
                    level: 2,
                    is_location: true,
                    is_occupancy_type: true,
                    is_active: 0,
                    is_deleted: 1,
                    is_required: false,
                },
                {
                    type_name: 'Building',
                    type_code: 'building',
                    sort_order: 3,
                    level: 2,
                    is_location: true,
                    is_occupancy_type: true,
                    is_active: 1,
                    is_deleted: 0,
                    is_required: true,
                },
                {
                    type_name: 'Shed',
                    type_code: 'shed',
                    sort_order: 4,
                    level: 2,
                    is_location: true,
                    is_occupancy_type: true,
                    is_active: 1,
                    is_deleted: 0,
                    is_required: false,
                },
                {
                    type_name: 'Warehouse',
                    type_code: 'warehouse',
                    sort_order: 5,
                    level: 2,
                    is_location: true,
                    is_occupancy_type: true,
                    is_active: 1,
                    is_deleted: 0,
                    is_required: false,
                },
                {
                    type_name: 'Floor',
                    type_code: 'floor',
                    sort_order: 6,
                    level: 3,
                    is_location: true,
                    is_occupancy_type: true,
                    is_active: 1,
                    is_deleted: 0,
                    is_required: false,
                },
                {
                    type_name: 'Wing',
                    type_code: 'wing',
                    sort_order: 7,
                    level: 3,
                    is_location: true,
                    is_occupancy_type: true,
                    is_active: 1,
                    is_deleted: 0,
                    is_required: false,
                },
                {
                    type_name: 'Section',
                    type_code: 'section',
                    sort_order: 8,
                    level: 3,
                    is_location: true,
                    is_occupancy_type: true,
                    is_active: 0,
                    is_deleted: 1,
                    is_required: false,
                },
                {
                    type_name: 'Room',
                    type_code: 'room',
                    sort_order: 9,
                    level: 4,
                    is_location: true,
                    is_occupancy_type: true,
                    is_active: 1,
                    is_deleted: 0,
                    is_required: false,
                },
                {
                    type_name: 'Cabin',
                    type_code: 'cabin',
                    sort_order: 10,
                    level: 4,
                    is_location: true,
                    is_occupancy_type: true,
                    is_active: 1,
                    is_deleted: 0,
                    is_required: false,
                },
                {
                    type_name: 'Workstation',
                    type_code: 'workstation',
                    sort_order: 11,
                    level: 5,
                    is_location: true,
                    is_occupancy_type: true,
                    is_active: 0,
                    is_deleted: 1,
                    is_required: false,
                },
                {
                    type_name: 'Server Room',
                    type_code: 'server_room',
                    sort_order: 12,
                    level: 4,
                    is_location: true,
                    is_occupancy_type: true,
                    is_active: 0,
                    is_deleted: 1,
                    is_required: false,
                },
                {
                    type_name: 'Storage',
                    type_code: 'storage',
                    sort_order: 13,
                    level: 4,
                    is_location: true,
                    is_occupancy_type: true,
                    is_active: 0,
                    is_deleted: 1,
                    is_required: false,
                },
                {
                    type_name: 'Desk',
                    type_code: 'desk',
                    sort_order: 14,
                    level: 5,
                    is_location: true,
                    is_occupancy_type: true,
                    is_active: 1,
                    is_deleted: 0,
                    is_required: false,
                },
                {
                    type_name: 'Branch',
                    type_code: 'branch',
                    sort_order: 0,
                    level: 0,
                    is_location: false,
                    is_occupancy_type: true,
                    is_active: 1,
                    is_deleted: 0,
                    is_required: false,
                },
                {
                    type_name: 'Head Office',
                    type_code: 'head_office',
                    sort_order: 0,
                    level: 0,
                    is_location: true,
                    is_occupancy_type: false,
                    is_active: 1,
                    is_deleted: 0,
                    is_required: false,
                },
            ].map((t) => ({
                ...t,
                type_icon: null,
                description: null,
                created_at: now,
                updated_at: null,
                updated_by: null,
            }));
            await this.insertLocationTypes(schemaName, types);
        }
    }
    async insertLocationTypes(schemaName, types) {
        const insertQuery = `
      INSERT INTO ${schemaName}.location_types
      (
        type_name,
        type_code,
        type_icon,
        description,
        sort_order,
        is_active,
        is_deleted,
        created_at,
        is_location,
        is_occupancy_type,
        level,
        updated_at,
        updated_by,
        is_required
      )
      VALUES
      (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14
      );
    `;
        for (const t of types) {
            await this.dataSource.query(insertQuery, [
                t.type_name,
                t.type_code,
                t.type_icon,
                t.description,
                t.sort_order,
                t.is_active,
                t.is_deleted,
                t.created_at,
                t.is_location,
                t.is_occupancy_type,
                t.level,
                t.updated_at,
                t.updated_by,
                t.is_required,
            ]);
        }
    }
};
exports.locationTypesScript = locationTypesScript;
exports.locationTypesScript = locationTypesScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], locationTypesScript);
