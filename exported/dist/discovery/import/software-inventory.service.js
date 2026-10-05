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
var SoftwareInventoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoftwareInventoryService = void 0;
exports.normalizeSoftwareName = normalizeSoftwareName;
exports.softwareKeyOf = softwareKeyOf;
exports.isOsComponent = isOsComponent;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asset_mapping_service_1 = require("../../asset-mapping/asset-mapping.service");
const asset_data_service_1 = require("../../assets-data/asset-data/asset-data.service");
const asset_items_service_1 = require("../../assets-data/asset-items/asset-items.service");
const asset_item_enums_1 = require("../../assets-data/asset-items/entities/asset-item.enums");
const stocks_service_1 = require("../../assets-data/stocks/stocks.service");
function normalizeSoftwareName(s) {
    return (s || '')
        .toLowerCase()
        .replace(/\(.*?\)/g, ' ')
        .replace(/\b(x64|x86|64-bit|32-bit|amd64|en-us)\b/g, ' ')
        .replace(/\bversion\b\s*[\d.]+/g, ' ')
        .replace(/\b\d+(\.\d+){1,3}\b/g, ' ')
        .replace(/[^a-z0-9+#. ]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
function softwareKeyOf(name, publisher, productCode) {
    const pc = (productCode || '').trim().toLowerCase();
    if (pc)
        return `pc:${pc}`;
    return `${normalizeSoftwareName(name)}|${(publisher || '').trim().toLowerCase()}`;
}
const OS_PUBLISHER_RE = /^(microsoft( corporation)?|microsoft windows|intel( corporation)?|nvidia( corporation)?|realtek|advanced micro devices|amd|qualcomm|synaptics|dell inc\.?|dell technologies|hp inc\.?|hewlett-packard|lenovo)$/i;
const OS_NAME_RE = /(update for|security update|hotfix|kb\d{5,}|redistributable|runtime|\.net (framework|core|runtime|sdk)|visual c\+\+|directx|driver|chipset|firmware|windows sdk|windows software development kit|servicing stack|language pack|feature on demand)/i;
function isOsComponent(name, publisher) {
    const n = name || '';
    const p = (publisher || '').trim();
    if (OS_NAME_RE.test(n))
        return true;
    if (OS_PUBLISHER_RE.test(p) && !/(office|365|teams|visual studio|sql server|power bi|edge|onedrive|onenote)/i.test(n)) {
        return true;
    }
    return false;
}
function fuzzy(a, b) {
    if (!a || !b)
        return 0;
    if (a === b)
        return 1;
    if (a.includes(b) || b.includes(a))
        return 0.85;
    const at = new Set(a.split(' ').filter(Boolean));
    const bt = new Set(b.split(' ').filter(Boolean));
    let overlap = 0;
    for (const t of at)
        if (bt.has(t))
            overlap++;
    return overlap / (Math.max(at.size, bt.size) || 1);
}
const MIN_ITEM_MATCH = 0.6;
let SoftwareInventoryService = SoftwareInventoryService_1 = class SoftwareInventoryService {
    constructor(dataSource, assetMappingService, assetDataService, stocksService, assetItemsService) {
        this.dataSource = dataSource;
        this.assetMappingService = assetMappingService;
        this.assetDataService = assetDataService;
        this.stocksService = stocksService;
        this.assetItemsService = assetItemsService;
        this.logger = new common_1.Logger(SoftwareInventoryService_1.name);
    }
    assertSchema(schema) {
        if (!schema || !/^org_[A-Za-z0-9_]+$/.test(schema)) {
            throw new common_1.BadRequestException('Organization schema could not be resolved for this request');
        }
    }
    async tableExists(schema, table) {
        const rows = await this.dataSource.query(`SELECT to_regclass($1) AS r`, [`${schema}.${table}`]);
        return !!rows?.[0]?.r;
    }
    async getSoftwareLookups(schema) {
        this.assertSchema(schema);
        const softwareMainCategoryId = await this.assetMappingService.getSoftwareMainCategoryId(schema);
        const relationTypes = await this.dataSource.query(`SELECT code, forward_label, reverse_label, category, target_type, cardinality
       FROM ${schema}.asset_relation_type_table
       WHERE is_active = true AND category = 'SOFTWARE'
       ORDER BY CASE WHEN code = 'REL-006' THEN 0 ELSE 1 END, code ASC`);
        const subCategories = softwareMainCategoryId
            ? await this.dataSource.query(`SELECT sub_category_id, sub_category_name FROM ${schema}.asset_sub_category
           WHERE main_category_id = $1 AND is_active = 1 AND is_deleted = 0
           ORDER BY sub_category_name ASC`, [softwareMainCategoryId])
            : [];
        return {
            softwareMainCategoryId,
            softwareRelationTypes: relationTypes.map((r) => ({
                code: r.code,
                forward_label: r.forward_label,
                reverse_label: r.reverse_label,
                category: r.category,
                target_type: r.target_type,
                cardinality: r.cardinality,
            })),
            softwareSubCategories: subCategories.map((s) => ({
                sub_category_id: Number(s.sub_category_id),
                sub_category_name: s.sub_category_name,
            })),
            licenseMetrics: Object.values(asset_item_enums_1.LicenseMetric),
        };
    }
    async suggestForDevice(schema, software, hostSerialId) {
        this.assertSchema(schema);
        if (!software?.length)
            return [];
        const softwareMainCategoryId = await this.assetMappingService.getSoftwareMainCategoryId(schema);
        const items = softwareMainCategoryId
            ? await this.dataSource.query(`SELECT asset_item_id, asset_item_name, license_metric
           FROM ${schema}.asset_items
           WHERE main_category_id = $1 AND is_active = 1 AND is_deleted = 0`, [softwareMainCategoryId])
            : [];
        const normalizedItems = items.map((i) => ({ ...i, _n: normalizeSoftwareName(i.asset_item_name) }));
        let decisions = [];
        if (hostSerialId && (await this.tableExists(schema, 'asset_serial_discovered_software'))) {
            decisions = await this.dataSource.query(`SELECT * FROM ${schema}.asset_serial_discovered_software
         WHERE host_serial_id = $1 AND is_deleted = 0`, [hostSerialId]);
        }
        const decisionByKey = new Map();
        for (const d of decisions)
            decisionByKey.set(d.software_key, d);
        const out = [];
        for (const sw of software) {
            const key = softwareKeyOf(sw.name, sw.publisher, sw.productCode);
            const n = normalizeSoftwareName(sw.name);
            let matchedItem = null;
            let best = 0;
            for (const it of normalizedItems) {
                const sc = fuzzy(n, it._n);
                if (sc > best) {
                    best = sc;
                    matchedItem = {
                        asset_item_id: Number(it.asset_item_id),
                        asset_item_name: it.asset_item_name,
                        license_metric: it.license_metric ?? null,
                        confidence: Number(sc.toFixed(2)),
                    };
                }
            }
            if (best < MIN_ITEM_MATCH)
                matchedItem = null;
            let matchedAsset = null;
            let availableSeat = null;
            let seatCounts = null;
            if (matchedItem) {
                const assetRows = await this.dataSource.query(`SELECT asset_id, asset_title FROM ${schema}.assets
           WHERE asset_item_id = $1 AND is_deleted = 0
           ORDER BY (lower(trim(asset_title)) = lower(trim($2))) DESC, asset_id ASC
           LIMIT 1`, [matchedItem.asset_item_id, sw.name]);
                if (assetRows[0]) {
                    matchedAsset = { asset_id: Number(assetRows[0].asset_id), asset_title: assetRows[0].asset_title };
                    const seat = await this.findAvailableSeat(schema, matchedAsset.asset_id);
                    availableSeat = seat;
                    seatCounts = await this.seatCounts(schema, matchedAsset.asset_id);
                }
            }
            out.push({
                softwareKey: key,
                installedSoftwareId: Number(sw.id),
                name: sw.name,
                version: sw.version ?? null,
                publisher: sw.publisher ?? null,
                productCode: sw.productCode ?? null,
                installLocation: sw.installLocation ?? null,
                installDate: sw.installDate ?? null,
                isOsComponent: isOsComponent(sw.name, sw.publisher),
                matchedItem,
                matchedAsset,
                availableSeat,
                seatCounts,
                existingDecision: decisionByKey.get(key) ?? null,
            });
        }
        return out;
    }
    async findAvailableSeat(schema, assetId) {
        const rows = await this.dataSource.query(`SELECT ass.asset_stocks_unique_id, ass.system_code
       FROM ${schema}.asset_stock_serials ass
       WHERE ass.asset_id = $1 AND ass.is_deleted = 0 AND ass.current_status_id = 1
         AND NOT EXISTS (
           SELECT 1 FROM ${schema}.asset_mapping m
           WHERE (m.asset_stocks_unique_id = ass.asset_stocks_unique_id
                  OR (m.target_id = ass.asset_stocks_unique_id AND m.target_type IN ('ASSET','SOFTWARE')))
             AND m.is_active = 1 AND m.is_deleted = 0
         )
       ORDER BY ass.asset_stocks_unique_id ASC
       LIMIT 1`, [assetId]);
        return rows[0]
            ? { asset_stocks_unique_id: Number(rows[0].asset_stocks_unique_id), system_code: rows[0].system_code ?? null }
            : null;
    }
    async seatCounts(schema, assetId) {
        const rows = await this.dataSource.query(`SELECT
         COUNT(*)::int AS total,
         COUNT(*) FILTER (
           WHERE ass.current_status_id = 1 AND NOT EXISTS (
             SELECT 1 FROM ${schema}.asset_mapping m
             WHERE (m.asset_stocks_unique_id = ass.asset_stocks_unique_id
                    OR (m.target_id = ass.asset_stocks_unique_id AND m.target_type IN ('ASSET','SOFTWARE')))
               AND m.is_active = 1 AND m.is_deleted = 0)
         )::int AS free
       FROM ${schema}.asset_stock_serials ass
       WHERE ass.asset_id = $1 AND ass.is_deleted = 0`, [assetId]);
        return { total: Number(rows[0]?.total ?? 0), free: Number(rows[0]?.free ?? 0) };
    }
    async processForHost(ctx, software) {
        this.assertSchema(ctx.schema);
        const summary = { discovered: 0, tracked: 0, notTracked: 0, failed: 0, details: [] };
        if (!Array.isArray(software) || !software.length)
            return summary;
        if (!(await this.tableExists(ctx.schema, 'asset_serial_discovered_software'))) {
            throw new common_1.BadRequestException('asset_serial_discovered_software is missing in this organization schema — run migrate_add_discovered_software_all_schemas.sql');
        }
        for (const sw of software) {
            if (!sw?.name)
                continue;
            summary.discovered++;
            const res = await this.processOne(ctx, sw);
            summary.details.push(res);
            if (res.status === 'TRACKED')
                summary.tracked++;
            else if (res.status === 'FAILED')
                summary.failed++;
            else
                summary.notTracked++;
        }
        return summary;
    }
    async processOne(ctx, sw) {
        const key = sw.softwareKey || softwareKeyOf(sw.name, sw.publisher, sw.productCode);
        const relationType = sw.relationType || 'REL-006';
        if (!sw.maintainInventory) {
            await this.upsertDecision(ctx, sw, key, {
                maintain_inventory: false,
                relation_type: relationType,
                status: 'NOT_TRACKED',
                last_error: null,
            });
            return { softwareKey: key, name: sw.name, status: 'NOT_TRACKED', maintainInventory: false };
        }
        let softwareItemId = null;
        let softwareAssetId = null;
        let softwareSerialId = null;
        let unlicensedInstall = false;
        try {
            const seat = await this.resolveSeat(ctx, sw);
            softwareItemId = seat.itemId;
            softwareAssetId = seat.assetId;
            softwareSerialId = seat.serialId;
            unlicensedInstall = seat.unlicensedInstall;
            const link = await this.assetMappingService.createTechnicalRelationship({
                source_serial_id: softwareSerialId,
                target_serial_id: ctx.hostSerialId,
                relation_type: relationType,
                source: 'agent',
                agent_flag_only: true,
                description: `Discovered by agent on ${ctx.hostName}`,
                metadata: {
                    discovery: true,
                    device_id: ctx.hostDeviceId,
                    installed_software_id: sw.installedSoftwareId ?? null,
                    software_key: key,
                    version: sw.version ?? null,
                    publisher: sw.publisher ?? null,
                    product_code: sw.productCode ?? null,
                    install_location: sw.installLocation ?? null,
                    install_date: sw.installDate ?? null,
                    license_key: sw.licenseKey?.trim() || null,
                },
            }, ctx.userId, ctx.schema);
            const mappingId = Number(link.mapping_id);
            const guardFlags = link.results?.[0]?.guard_flags ?? [];
            await this.upsertDecision(ctx, sw, key, {
                maintain_inventory: true,
                relation_type: relationType,
                software_item_id: softwareItemId,
                software_asset_id: softwareAssetId,
                software_serial_id: softwareSerialId,
                mapping_id: mappingId,
                status: 'TRACKED',
                unlicensed_install: unlicensedInstall || guardFlags.length > 0,
                last_error: guardFlags.length ? guardFlags.join(' | ') : null,
            });
            return {
                softwareKey: key,
                name: sw.name,
                status: 'TRACKED',
                maintainInventory: true,
                softwareSerialId,
                softwareAssetId,
                mappingId,
                unlicensedInstall: unlicensedInstall || guardFlags.length > 0,
                guardFlags,
            };
        }
        catch (err) {
            const message = err?.message ?? String(err);
            this.logger.warn(`software '${sw.name}' on host serial ${ctx.hostSerialId} failed: ${message}`);
            await this.upsertDecision(ctx, sw, key, {
                maintain_inventory: true,
                relation_type: relationType,
                software_item_id: softwareItemId,
                software_asset_id: softwareAssetId,
                software_serial_id: softwareSerialId,
                mapping_id: null,
                status: 'FAILED',
                unlicensed_install: unlicensedInstall,
                last_error: message,
            }).catch((e) => this.logger.error(`decision upsert failed: ${e?.message ?? e}`));
            return {
                softwareKey: key,
                name: sw.name,
                status: 'FAILED',
                maintainInventory: true,
                message,
                softwareSerialId,
                softwareAssetId,
                unlicensedInstall,
            };
        }
    }
    async resolveSeat(ctx, sw) {
        const { schema } = ctx;
        if (sw.useExistingSerialId) {
            const rows = await this.dataSource.query(`SELECT ass.asset_stocks_unique_id, ass.asset_id, COALESCE(ass.asset_item_id, a.asset_item_id) AS item_id,
                ass.current_status_id
         FROM ${schema}.asset_stock_serials ass
         JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
         WHERE ass.asset_stocks_unique_id = $1 AND ass.is_deleted = 0 LIMIT 1`, [sw.useExistingSerialId]);
            if (!rows[0])
                throw new common_1.BadRequestException(`Software serial ${sw.useExistingSerialId} not found`);
            if (Number(rows[0].current_status_id) !== 1) {
                throw new common_1.BadRequestException(`Software serial ${sw.useExistingSerialId} is no longer Available`);
            }
            return {
                itemId: Number(rows[0].item_id),
                assetId: Number(rows[0].asset_id),
                serialId: Number(rows[0].asset_stocks_unique_id),
                unlicensedInstall: false,
            };
        }
        const softwareMainCategoryId = await this.assetMappingService.getSoftwareMainCategoryId(schema);
        if (!softwareMainCategoryId) {
            throw new common_1.BadRequestException("No 'Software' main category exists in this organization");
        }
        let itemId = sw.existingItemId ?? null;
        if (itemId) {
            const chk = await this.dataSource.query(`SELECT asset_item_id FROM ${schema}.asset_items WHERE asset_item_id = $1 AND is_deleted = 0 LIMIT 1`, [itemId]);
            if (!chk[0])
                itemId = null;
        }
        if (!itemId) {
            itemId = await this.findOrCreateSoftwareItem(ctx, sw, softwareMainCategoryId);
        }
        const title = (sw.newItemName || sw.name).trim();
        let assetId = null;
        const existingAsset = await this.dataSource.query(`SELECT asset_id FROM ${schema}.assets
       WHERE asset_item_id = $1 AND is_deleted = 0
       ORDER BY (lower(trim(asset_title)) = lower(trim($2))) DESC, asset_id ASC LIMIT 1`, [itemId, title]);
        if (existingAsset[0])
            assetId = Number(existingAsset[0].asset_id);
        let unlicensedInstall = false;
        if (assetId) {
            const free = await this.findAvailableSeat(schema, assetId);
            if (free) {
                return { itemId, assetId, serialId: free.asset_stocks_unique_id, unlicensedInstall: false };
            }
            const counts = await this.seatCounts(schema, assetId);
            unlicensedInstall = counts.total > 0;
        }
        else {
            const assetResult = await this.assetDataService.addAsset({
                asset_item_id: itemId,
                asset_title: title,
                asset_description: `Discovered by agent on ${ctx.hostName}`,
                manufacturer: sw.publisher?.trim() || null,
                model: null,
                asset_added_by: ctx.userId,
            }, ctx.organizationId, ctx.userId, schema);
            if (assetResult?.status !== 'success') {
                throw new common_1.BadRequestException(assetResult?.message || assetResult?.error || 'Failed to create software asset');
            }
            assetId = Number(assetResult.data.asset_id);
        }
        const serialNumber = await this.resolveSerialNumber(ctx, itemId, sw);
        const informationFields = await this.softwareInformationFields(schema, itemId, sw);
        const stockDto = {
            asset_id: assetId,
            asset_item_id: itemId,
            asset_title: title,
            quantity: 1,
            total_available_quantity: 1,
            location_id: ctx.hostLocationMappingId,
            asset_ownership_status: 1,
            created_by: ctx.userId,
            information_fields: JSON.stringify(informationFields),
            assetDetails: [
                {
                    serial_number: serialNumber,
                    department_id: null,
                    location_id: ctx.hostLocationMappingId,
                    project_id: null,
                    cost_center_id: null,
                    asset_used_by: null,
                    asset_managed_by: null,
                    asset_item_id: itemId,
                    status_type_id: 1,
                },
            ],
        };
        await this.stocksService.createStocks(stockDto, ctx.organizationId, schema, ctx.req);
        const serialRows = await this.dataSource.query(`SELECT asset_stocks_unique_id FROM ${schema}.asset_stock_serials
       WHERE asset_id = $1 AND stock_serials = $2 AND is_deleted = 0
       ORDER BY asset_stocks_unique_id DESC LIMIT 1`, [assetId, serialNumber]);
        if (!serialRows[0])
            throw new common_1.BadRequestException('Software seat was created but its serial could not be read back');
        return { itemId, assetId, serialId: Number(serialRows[0].asset_stocks_unique_id), unlicensedInstall };
    }
    async resolveSerialNumber(ctx, itemId, sw) {
        const key = (sw.licenseKey || '').trim();
        if (key) {
            const taken = await this.dataSource.query(`SELECT 1 FROM ${ctx.schema}.asset_stock_serials WHERE asset_item_id = $1 AND stock_serials = $2 AND is_deleted = 0 LIMIT 1`, [itemId, key]);
            if (!taken.length)
                return key;
            return `${key}-${ctx.hostSerialId}`;
        }
        const base = `SW-${this.shortHash(softwareKeyOf(sw.name, sw.publisher, sw.productCode))}-${ctx.hostSerialId}`;
        let candidate = base;
        for (let n = 2; n < 50; n++) {
            const taken = await this.dataSource.query(`SELECT 1 FROM ${ctx.schema}.asset_stock_serials WHERE asset_item_id = $1 AND stock_serials = $2 AND is_deleted = 0 LIMIT 1`, [itemId, candidate]);
            if (!taken.length)
                return candidate;
            candidate = `${base}-${n}`;
        }
        return `${base}-${Date.now()}`;
    }
    async findOrCreateSoftwareItem(ctx, sw, softwareMainCategoryId) {
        const { schema } = ctx;
        const itemName = (sw.newItemName || sw.name).trim();
        const existing = await this.dataSource.query(`SELECT asset_item_id FROM ${schema}.asset_items WHERE asset_item_name ILIKE $1 AND is_deleted = 0 LIMIT 1`, [itemName]);
        if (existing[0])
            return Number(existing[0].asset_item_id);
        let subCategoryId = sw.subCategoryId ?? null;
        if (!subCategoryId) {
            const sub = await this.dataSource.query(`SELECT sub_category_id FROM ${schema}.asset_sub_category
         WHERE main_category_id = $1 AND is_deleted = 0 AND is_active = 1
         ORDER BY (lower(sub_category_name) LIKE '%application%') DESC, sub_category_id ASC LIMIT 1`, [softwareMainCategoryId]);
            subCategoryId = sub[0]?.sub_category_id ? Number(sub[0].sub_category_id) : null;
        }
        if (!subCategoryId) {
            throw new common_1.BadRequestException('No subcategory exists under the Software main category to create the software item in');
        }
        try {
            await this.assetItemsService.createNewAssetItem({
                asset_item_name: itemName,
                sub_category_id: subCategoryId,
                main_category_id: softwareMainCategoryId,
                item_type: asset_item_enums_1.ItemType.VIRTUAL,
                is_licensable: true,
                license_metric: sw.licenseMetric || asset_item_enums_1.LicenseMetric.PER_DEVICE,
                has_depreciation: false,
                has_serials: true,
                added_by: ctx.userId,
            }, undefined, ctx.organizationId);
        }
        catch {
        }
        const created = await this.dataSource.query(`SELECT asset_item_id FROM ${schema}.asset_items WHERE asset_item_name ILIKE $1 AND is_deleted = 0 LIMIT 1`, [itemName]);
        if (!created[0])
            throw new common_1.BadRequestException(`Failed to create software item '${itemName}'`);
        return Number(created[0].asset_item_id);
    }
    async softwareInformationFields(schema, itemId, sw) {
        const fields = await this.dataSource.query(`SELECT m.asset_field_id, m.asset_field_category_id, fc.asset_field_category_name,
              f.asset_field_label_name, f.asset_field_name
       FROM ${schema}.asset_items_fields_mapping m
       LEFT JOIN ${schema}.asset_fields f ON f.asset_field_id = m.asset_field_id
       LEFT JOIN ${schema}.asset_field_category fc ON fc.asset_field_category_id = m.asset_field_category_id
       WHERE m.asset_item_id = $1 AND m.aif_is_active = 1 AND m.aif_is_deleted = 0`, [itemId]);
        const want = [
            [/licen[cs]e ?key|serial ?key|product ?key|activation ?key|\bkey\b/i, sw.licenseKey],
            [/version/i, sw.version],
            [/publisher|vendor|manufacturer/i, sw.publisher],
            [/product ?code|product ?id/i, sw.productCode],
            [/install ?(path|location|dir)/i, sw.installLocation],
            [/install(ed)? ?date/i, sw.installDate],
        ];
        const out = [];
        for (const f of fields) {
            const label = `${f.asset_field_label_name || ''} ${f.asset_field_name || ''}`;
            for (const [re, val] of want) {
                if (val !== null && val !== undefined && val !== '' && re.test(label)) {
                    out.push({
                        asset_field_id: f.asset_field_id,
                        asset_field_category_id: f.asset_field_category_id,
                        asset_field_category_name: f.asset_field_category_name,
                        asset_field_label_name: f.asset_field_label_name,
                        value: val,
                    });
                    break;
                }
            }
        }
        return out;
    }
    shortHash(s) {
        let h = 5381;
        for (let i = 0; i < s.length; i++)
            h = ((h << 5) + h + s.charCodeAt(i)) | 0;
        return (h >>> 0).toString(36).toUpperCase();
    }
    async upsertDecision(ctx, sw, key, patch) {
        await this.dataSource.query(`INSERT INTO ${ctx.schema}.asset_serial_discovered_software
         (host_serial_id, software_key, name, version, publisher, product_code, install_location, install_date,
          installed_software_id, source_device_id,
          maintain_inventory, relation_type, software_item_id, software_asset_id, software_serial_id, mapping_id,
          status, unlicensed_install, last_error, decided_by, license_key, decided_at, last_seen_at, updated_at, is_deleted)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17::${ctx.schema}.discovered_software_status_enum,$18,$19,$20,$21,now(),now(),now(),0)
       ON CONFLICT (host_serial_id, software_key) DO UPDATE SET
         license_key           = COALESCE(EXCLUDED.license_key, ${ctx.schema}.asset_serial_discovered_software.license_key),
         name                  = EXCLUDED.name,
         version               = EXCLUDED.version,
         publisher             = EXCLUDED.publisher,
         product_code          = EXCLUDED.product_code,
         install_location      = EXCLUDED.install_location,
         install_date          = EXCLUDED.install_date,
         installed_software_id = EXCLUDED.installed_software_id,
         source_device_id      = COALESCE(EXCLUDED.source_device_id, ${ctx.schema}.asset_serial_discovered_software.source_device_id),
         maintain_inventory    = EXCLUDED.maintain_inventory,
         relation_type         = EXCLUDED.relation_type,
         software_item_id      = EXCLUDED.software_item_id,
         software_asset_id     = EXCLUDED.software_asset_id,
         software_serial_id    = EXCLUDED.software_serial_id,
         mapping_id            = EXCLUDED.mapping_id,
         status                = EXCLUDED.status,
         unlicensed_install    = EXCLUDED.unlicensed_install,
         last_error            = EXCLUDED.last_error,
         decided_by            = EXCLUDED.decided_by,
         decided_at            = now(),
         last_seen_at          = now(),
         updated_at            = now(),
         is_deleted            = 0`, [
            ctx.hostSerialId,
            key,
            sw.name,
            sw.version ?? null,
            sw.publisher ?? null,
            sw.productCode ?? null,
            sw.installLocation ?? null,
            sw.installDate ? new Date(sw.installDate) : null,
            sw.installedSoftwareId ?? null,
            ctx.hostDeviceId,
            patch.maintain_inventory ?? false,
            patch.relation_type ?? null,
            patch.software_item_id ?? null,
            patch.software_asset_id ?? null,
            patch.software_serial_id ?? null,
            patch.mapping_id ?? null,
            patch.status ?? 'NOT_TRACKED',
            patch.unlicensed_install ?? false,
            patch.last_error ?? null,
            ctx.userId,
            sw.licenseKey?.trim() || null,
        ]);
    }
    async listForSerial(schema, serialId) {
        this.assertSchema(schema);
        const host = await this.dataSource.query(`SELECT ass.asset_stocks_unique_id, ass.source_device_id, ass.location_id, ass.system_code,
              COALESCE(ass.asset_serial_title, a.asset_title) AS host_name
       FROM ${schema}.asset_stock_serials ass
       JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
       WHERE ass.asset_stocks_unique_id = $1 AND ass.is_deleted = 0 LIMIT 1`, [serialId]);
        if (!host[0])
            throw new common_1.BadRequestException(`Serial ${serialId} not found`);
        const sourceDeviceId = host[0].source_device_id ? Number(host[0].source_device_id) : null;
        const hasDecisions = await this.tableExists(schema, 'asset_serial_discovered_software');
        const installed = sourceDeviceId
            ? await this.dataSource.query(`SELECT id, name, version, publisher, install_date, install_location, architecture, product_code, reported_at
           FROM ${schema}.installed_software WHERE device_id = $1::bigint ORDER BY lower(name)`, [sourceDeviceId])
            : [];
        const decisions = hasDecisions
            ? await this.dataSource.query(`SELECT d.*, ass.system_code AS software_system_code,
                  COALESCE(ass.asset_serial_title, a.asset_title) AS software_asset_title,
                  ass.current_status_id AS software_status_id
           FROM ${schema}.asset_serial_discovered_software d
           LEFT JOIN ${schema}.asset_stock_serials ass ON ass.asset_stocks_unique_id = d.software_serial_id
           LEFT JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
           WHERE d.host_serial_id = $1 AND d.is_deleted = 0`, [serialId])
            : [];
        const byKey = new Map();
        for (const d of decisions)
            byKey.set(d.software_key, d);
        const rows = [];
        const seen = new Set();
        for (const s of installed) {
            const key = softwareKeyOf(s.name, s.publisher, s.product_code);
            seen.add(key);
            const d = byKey.get(key);
            rows.push(this.toSoftwareTabRow(s, d, key, false));
        }
        for (const d of decisions) {
            if (seen.has(d.software_key))
                continue;
            rows.push(this.toSoftwareTabRow(null, d, d.software_key, true));
        }
        const counts = {
            installed: installed.length,
            tracked: rows.filter((r) => r.status === 'TRACKED').length,
            notMapped: rows.filter((r) => r.status === 'NOT_TRACKED').length,
            failed: rows.filter((r) => r.status === 'FAILED').length,
            removed: rows.filter((r) => r.status === 'REMOVED').length,
        };
        return {
            host: {
                serialId: Number(host[0].asset_stocks_unique_id),
                systemCode: host[0].system_code ?? null,
                name: host[0].host_name ?? null,
                sourceDeviceId,
                discovered: !!sourceDeviceId,
            },
            counts,
            software: rows,
        };
    }
    toSoftwareTabRow(s, d, key, removed) {
        const status = removed
            ? 'REMOVED'
            : d
                ? d.status
                : 'NOT_TRACKED';
        const name = s?.name ?? d?.name;
        const publisher = s?.publisher ?? d?.publisher ?? null;
        return {
            softwareKey: key,
            decisionId: d ? Number(d.id) : null,
            installedSoftwareId: s ? Number(s.id) : d?.installed_software_id ? Number(d.installed_software_id) : null,
            name,
            version: s?.version ?? d?.version ?? null,
            publisher,
            productCode: s?.product_code ?? d?.product_code ?? null,
            installLocation: s?.install_location ?? d?.install_location ?? null,
            installDate: s?.install_date ?? d?.install_date ?? null,
            architecture: s?.architecture ?? null,
            reportedAt: s?.reported_at ?? null,
            isOsComponent: isOsComponent(name, publisher),
            status,
            maintainInventory: d ? !!d.maintain_inventory : false,
            relationType: d?.relation_type ?? null,
            softwareSerialId: d?.software_serial_id ? Number(d.software_serial_id) : null,
            softwareAssetId: d?.software_asset_id ? Number(d.software_asset_id) : null,
            softwareSystemCode: d?.software_system_code ?? null,
            softwareAssetTitle: d?.software_asset_title ?? null,
            mappingId: d?.mapping_id ? Number(d.mapping_id) : null,
            unlicensedInstall: d ? !!d.unlicensed_install : false,
            licenseKey: d?.license_key ?? null,
            lastError: d?.last_error ?? null,
            lastSeenAt: d?.last_seen_at ?? null,
            decidedAt: d?.decided_at ?? null,
        };
    }
    async trackFromSerial(schema, serialId, input, organizationId, userId, req) {
        this.assertSchema(schema);
        const host = await this.dataSource.query(`SELECT ass.asset_stocks_unique_id, ass.source_device_id, ass.location_id,
              COALESCE(ass.asset_serial_title, a.asset_title) AS host_name
       FROM ${schema}.asset_stock_serials ass
       JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
       WHERE ass.asset_stocks_unique_id = $1 AND ass.is_deleted = 0 LIMIT 1`, [serialId]);
        if (!host[0])
            throw new common_1.BadRequestException(`Serial ${serialId} not found`);
        const sourceDeviceId = host[0].source_device_id ? Number(host[0].source_device_id) : null;
        let s = null;
        if (input.installedSoftwareId) {
            const r = await this.dataSource.query(`SELECT * FROM ${schema}.installed_software WHERE id = $1::bigint LIMIT 1`, [input.installedSoftwareId]);
            s = r[0] ?? null;
        }
        if (!s && sourceDeviceId && input.softwareKey) {
            const all = await this.dataSource.query(`SELECT * FROM ${schema}.installed_software WHERE device_id = $1::bigint`, [sourceDeviceId]);
            s = all.find((x) => softwareKeyOf(x.name, x.publisher, x.product_code) === input.softwareKey) ?? null;
        }
        if (!s)
            throw new common_1.BadRequestException('Discovered software row not found for this asset');
        const ctx = {
            schema,
            hostSerialId: serialId,
            hostDeviceId: sourceDeviceId,
            hostLocationMappingId: host[0].location_id ? Number(host[0].location_id) : null,
            hostName: host[0].host_name ?? `serial ${serialId}`,
            organizationId,
            userId,
            req,
        };
        return this.processOne(ctx, {
            softwareKey: softwareKeyOf(s.name, s.publisher, s.product_code),
            installedSoftwareId: Number(s.id),
            name: s.name,
            version: s.version,
            publisher: s.publisher,
            productCode: s.product_code,
            installLocation: s.install_location,
            installDate: s.install_date,
            maintainInventory: input.maintainInventory !== false,
            relationType: input.relationType || 'REL-006',
            useExistingSerialId: input.useExistingSerialId,
            existingItemId: input.existingItemId,
            newItemName: input.newItemName,
            subCategoryId: input.subCategoryId,
            licenseMetric: input.licenseMetric,
            licenseKey: input.licenseKey ?? null,
        });
    }
    async suggestOneForSerial(schema, serialId, softwareKey) {
        this.assertSchema(schema);
        const host = await this.dataSource.query(`SELECT ass.asset_stocks_unique_id, ass.source_device_id, ass.asset_item_id,
              a.asset_main_category_id, a.asset_sub_category_id,
              COALESCE(ass.asset_serial_title, a.asset_title) AS host_name
       FROM ${schema}.asset_stock_serials ass
       JOIN ${schema}.assets a ON a.asset_id = ass.asset_id
       WHERE ass.asset_stocks_unique_id = $1 AND ass.is_deleted = 0 LIMIT 1`, [serialId]);
        if (!host[0])
            throw new common_1.BadRequestException(`Serial ${serialId} not found`);
        const sourceDeviceId = host[0].source_device_id ? Number(host[0].source_device_id) : null;
        if (!sourceDeviceId)
            throw new common_1.BadRequestException('This asset was not imported from Agent Discovery');
        const rows = await this.dataSource.query(`SELECT id, name, version, publisher, install_date, install_location, architecture, product_code, reported_at
       FROM ${schema}.installed_software WHERE device_id = $1::bigint`, [sourceDeviceId]);
        const row = rows.find((x) => softwareKeyOf(x.name, x.publisher, x.product_code) === softwareKey);
        if (!row)
            throw new common_1.BadRequestException('Discovered software row not found for this asset');
        const matches = await this.suggestForDevice(schema, [{
                id: Number(row.id), name: row.name, version: row.version ?? null, publisher: row.publisher ?? null,
                installDate: row.install_date ?? null, installLocation: row.install_location ?? null,
                architecture: row.architecture ?? null, productCode: row.product_code ?? null, reportedAt: row.reported_at,
            }], serialId);
        const softwareMainCategoryId = await this.assetMappingService.getSoftwareMainCategoryId(schema);
        const governance = await this.assetMappingService.checkGovernanceByCategory('REL-006', { main_category_id: softwareMainCategoryId }, { main_category_id: host[0].asset_main_category_id, sub_category_id: host[0].asset_sub_category_id, item_id: host[0].asset_item_id }, schema);
        const lookups = await this.getSoftwareLookups(schema);
        return { host: { serialId, name: host[0].host_name, sourceDeviceId }, match: matches[0] ?? null, governance, lookups };
    }
    async untrack(schema, decisionId, userId) {
        this.assertSchema(schema);
        const rows = await this.dataSource.query(`SELECT * FROM ${schema}.asset_serial_discovered_software WHERE id = $1 AND is_deleted = 0 LIMIT 1`, [decisionId]);
        const d = rows[0];
        if (!d)
            throw new common_1.BadRequestException('Decision not found');
        if (d.mapping_id) {
            try {
                await this.assetMappingService.unlinkTechnicalRelationship(Number(d.mapping_id), userId, schema);
            }
            catch (e) {
                this.logger.warn(`unlink mapping ${d.mapping_id} failed: ${e?.message ?? e}`);
            }
        }
        await this.dataSource.query(`UPDATE ${schema}.asset_serial_discovered_software
       SET maintain_inventory = false, mapping_id = NULL, status = 'NOT_TRACKED', last_error = NULL,
           decided_by = $2, decided_at = now(), updated_at = now()
       WHERE id = $1`, [decisionId, userId]);
        return { id: decisionId, status: 'NOT_TRACKED' };
    }
    async reconcileDevice(schema, deviceId) {
        this.assertSchema(schema);
        if (!(await this.tableExists(schema, 'asset_serial_discovered_software')))
            return;
        const hosts = await this.dataSource.query(`SELECT asset_stocks_unique_id FROM ${schema}.asset_stock_serials
       WHERE source_device_id = $1 AND is_deleted = 0`, [deviceId]);
        if (!hosts.length)
            return;
        const installed = await this.dataSource.query(`SELECT id, name, version, publisher, product_code, install_location, install_date
       FROM ${schema}.installed_software WHERE device_id = $1::bigint`, [deviceId]);
        const byKey = new Map();
        for (const s of installed)
            byKey.set(softwareKeyOf(s.name, s.publisher, s.product_code), s);
        for (const h of hosts) {
            const hostSerialId = Number(h.asset_stocks_unique_id);
            const decisions = await this.dataSource.query(`SELECT * FROM ${schema}.asset_serial_discovered_software WHERE host_serial_id = $1 AND is_deleted = 0`, [hostSerialId]);
            for (const d of decisions) {
                const s = byKey.get(d.software_key);
                if (s) {
                    const revive = d.status === 'REMOVED';
                    const newStatus = revive ? (d.mapping_id ? 'TRACKED' : d.maintain_inventory ? 'FAILED' : 'NOT_TRACKED') : d.status;
                    await this.dataSource.query(`UPDATE ${schema}.asset_serial_discovered_software
             SET version = $2, installed_software_id = $3, install_location = $4, install_date = $5,
                 last_seen_at = now(), updated_at = now(), status = $6::${schema}.discovered_software_status_enum
             WHERE id = $1`, [d.id, s.version ?? null, Number(s.id), s.install_location ?? null, s.install_date ?? null, newStatus]);
                    if (d.mapping_id) {
                        await this.dataSource.query(`UPDATE ${schema}.asset_mapping SET last_seen_at = now(),
                 metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('version', $2::text)
               WHERE mapping_id = $1 AND is_active = 1 AND is_deleted = 0`, [d.mapping_id, s.version ?? null]);
                    }
                }
                else if (d.status !== 'REMOVED') {
                    await this.dataSource.query(`UPDATE ${schema}.asset_serial_discovered_software
             SET status = 'REMOVED', updated_at = now() WHERE id = $1`, [d.id]);
                }
            }
        }
    }
};
exports.SoftwareInventoryService = SoftwareInventoryService;
exports.SoftwareInventoryService = SoftwareInventoryService = SoftwareInventoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        asset_mapping_service_1.AssetMappingService,
        asset_data_service_1.AssetDataService,
        stocks_service_1.StocksService,
        asset_items_service_1.AssetItemsService])
], SoftwareInventoryService);
