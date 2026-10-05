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
exports.DiscoveredSoftwareTablesScript = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let DiscoveredSoftwareTablesScript = class DiscoveredSoftwareTablesScript {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createDiscoveredSoftwareTables(schemaName) {
        const query = `
-- ========================= discovered_software_status_enum =========================
DO $enum$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typname = 'discovered_software_status_enum'
          AND n.nspname = '${schemaName}'
    ) THEN
        CREATE TYPE ${schemaName}.discovered_software_status_enum AS ENUM
            ('NOT_TRACKED', 'TRACKED', 'FAILED', 'REMOVED');
    END IF;
END
$enum$;

-- ========================= asset_serial_discovered_software =========================
CREATE TABLE IF NOT EXISTS ${schemaName}.asset_serial_discovered_software (
    id                     bigserial PRIMARY KEY,

    -- Host device serial (the laptop / desktop / server the software was found on)
    host_serial_id         integer NOT NULL
                           REFERENCES ${schemaName}.asset_stock_serials (asset_stocks_unique_id) ON DELETE CASCADE,

    -- Stable identity across re-scans: product_code when present, else
    -- lower(trim(name)) || '|' || lower(trim(coalesce(publisher,''))).
    software_key           text NOT NULL,
    name                   text NOT NULL,
    version                text,
    publisher              text,
    product_code           text,
    install_location       text,
    install_date           timestamptz,

    -- Latest matching installed_software.id for this host (refreshed on every
    -- scan; intentionally NOT a foreign key — the row is recreated each scan).
    installed_software_id  bigint,
    source_device_id       bigint,

    -- ---- decision ----
    maintain_inventory     boolean NOT NULL DEFAULT false,
    relation_type          varchar(50)
                           REFERENCES ${schemaName}.asset_relation_type_table (code),
    software_item_id       bigint,                       -- asset_items.asset_item_id
    software_asset_id      integer,                      -- assets.asset_id
    software_serial_id     integer
                           REFERENCES ${schemaName}.asset_stock_serials (asset_stocks_unique_id) ON DELETE SET NULL,
    mapping_id             integer,                      -- asset_mapping.mapping_id (REL-006 edge)
    status                 ${schemaName}.discovered_software_status_enum NOT NULL DEFAULT 'NOT_TRACKED',
    unlicensed_install     boolean NOT NULL DEFAULT false, -- matched an existing software asset but no free seat
    license_key            text,                          -- licence / serial key entered by the user
    last_error             text,

    -- ---- bookkeeping ----
    first_seen_at          timestamptz NOT NULL DEFAULT now(),
    last_seen_at           timestamptz NOT NULL DEFAULT now(),
    decided_by             integer,
    decided_at             timestamptz,
    created_at             timestamptz NOT NULL DEFAULT now(),
    updated_at             timestamptz NOT NULL DEFAULT now(),
    is_deleted             smallint NOT NULL DEFAULT 0,

    CONSTRAINT uq_asset_serial_discovered_software UNIQUE (host_serial_id, software_key)
);

-- Backfill for schemas created before license_key existed
ALTER TABLE ${schemaName}.asset_serial_discovered_software ADD COLUMN IF NOT EXISTS license_key text;

CREATE INDEX IF NOT EXISTS idx_asdsw_host_status
    ON ${schemaName}.asset_serial_discovered_software (host_serial_id, status);
CREATE INDEX IF NOT EXISTS idx_asdsw_software_serial
    ON ${schemaName}.asset_serial_discovered_software (software_serial_id)
    WHERE software_serial_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_asdsw_source_device
    ON ${schemaName}.asset_serial_discovered_software (source_device_id)
    WHERE source_device_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_asdsw_key
    ON ${schemaName}.asset_serial_discovered_software (software_key);
`;
        await this.dataSource.query(query);
    }
};
exports.DiscoveredSoftwareTablesScript = DiscoveredSoftwareTablesScript;
exports.DiscoveredSoftwareTablesScript = DiscoveredSoftwareTablesScript = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], DiscoveredSoftwareTablesScript);
