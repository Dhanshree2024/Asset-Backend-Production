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
exports.AssetEventsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const asset_working_status_entity_1 = require("../assets-data/asset-working-status/entities/asset-working-status.entity");
const assets_status_entity_1 = require("../assets-data/assets-status/entities/assets-status.entity");
const asset_stock_serials_entity_1 = require("../assets-data/stocks/entities/asset_stock_serials.entity");
const typeorm_2 = require("typeorm");
const asset_events_entity_1 = require("./entities/asset-events.entity");
let AssetEventsService = class AssetEventsService {
    constructor(dataSource, assetEventRepo, assetStockSerials, assetWorkingStatus, assetsStatus) {
        this.dataSource = dataSource;
        this.assetEventRepo = assetEventRepo;
        this.assetStockSerials = assetStockSerials;
        this.assetWorkingStatus = assetWorkingStatus;
        this.assetsStatus = assetsStatus;
        this.EVENT_UI_CONFIG = {
            LIFECYCLE: {
                color: "bg-blue-500",
                bgColor: "bg-blue-50 dark:bg-blue-950/30",
                borderColor: "border-blue-200 dark:border-blue-800",
                icon: "🔄",
            },
            ASSIGNMENT: {
                color: "bg-emerald-500",
                bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
                borderColor: "border-emerald-200 dark:border-emerald-800",
                icon: "👤",
            },
            LOCATION: {
                color: "bg-purple-500",
                bgColor: "bg-purple-50 dark:bg-purple-950/30",
                borderColor: "border-purple-200 dark:border-purple-800",
                icon: "📍",
            },
            MAINTENANCE: {
                color: "bg-amber-500",
                bgColor: "bg-amber-50 dark:bg-amber-950/30",
                borderColor: "border-amber-200 dark:border-amber-800",
                icon: "🛠️",
            },
            FINANCIAL: {
                color: "bg-green-600",
                bgColor: "bg-green-50 dark:bg-green-950/30",
                borderColor: "border-green-200 dark:border-green-800",
                icon: "💰",
            },
            STATUS: {
                color: "bg-indigo-500",
                bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
                borderColor: "border-indigo-200 dark:border-indigo-800",
                icon: "📊",
            },
            DOCUMENT: {
                color: "bg-cyan-500",
                bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
                borderColor: "border-cyan-200 dark:border-cyan-800",
                icon: "📄",
            },
            SYSTEM: {
                color: "bg-gray-500",
                bgColor: "bg-gray-50 dark:bg-gray-900/40",
                borderColor: "border-gray-200 dark:border-gray-700",
                icon: "⚙️",
            },
            SCRAP: {
                color: "bg-orange-500",
                bgColor: "bg-orange-50 dark:bg-orange-950/30",
                borderColor: "border-orange-200 dark:border-orange-800",
                icon: "🗑️",
            },
        };
    }
    async generateEvent(manager, payload) {
        const event = manager.create(asset_events_entity_1.AssetEvent, {
            asset_id: payload.asset_id,
            asset_stocks_unique_id: payload.asset_stocks_unique_id,
            event_category: payload.event_category,
            title: payload.title || null,
            description: payload.description || null,
            reference_table: payload.reference_table || null,
            reference_id: payload.reference_id || null,
            metadata: payload.metadata || {},
            performed_by: payload.performed_by,
            performed_at: new Date(),
            event_type_id: payload.event_type_id || null,
            created_at: payload.created_at || new Date()
        });
        return await manager.save(asset_events_entity_1.AssetEvent, event);
    }
    async getEventsByStockSerialId(assetStockSerialId) {
        if (!assetStockSerialId) {
            throw new common_1.BadRequestException('assetStockSerialId is required');
        }
        const events = await this.assetEventRepo
            .createQueryBuilder('event')
            .leftJoinAndSelect('event.stock_serial', 'stock_serial')
            .leftJoinAndSelect('event.performed_user', 'user')
            .leftJoinAndSelect('event.event', 'working_status')
            .where('event.asset_stocks_unique_id = :assetStockSerialId', { assetStockSerialId })
            .orderBy('event.created_at', 'DESC')
            .getMany();
        const allStatuses = await this.assetWorkingStatus.find({
            where: { is_deleted: 0 },
        });
        const statusMap = new Map();
        allStatuses.forEach((status) => {
            statusMap.set(status.working_status_type_id, status.working_status_type_name);
        });
        if (!events.length)
            return [];
        const latestEventId = events[0].event_id;
        const transformed = events.map((event) => {
            const userName = event.performed_user
                ? `${event.performed_user.first_name || ''} ${event.performed_user.last_name || ''}`.trim()
                : 'System';
            const metadata = event.metadata || {};
            const currentStatus = event.event?.working_status_type_name || 'Unknown';
            let message = '';
            let description = event.description || '';
            switch (event.event_category) {
                case 'ASSIGNMENT':
                    if (event.title === 'Technical Relationship Established' ||
                        metadata?.is_technical_relationship === true ||
                        metadata?.action === 'LINK') {
                        const relLabel = metadata.relation_label ? ` [${metadata.relation_label}]` : '';
                        const connectedName = metadata.connected_asset_name ? `'${metadata.connected_asset_name}'` : 'asset';
                        message = `${userName} established relationship with ${connectedName}${relLabel}`;
                    }
                    else if (event.title === 'Technical Relationship Unlinked' ||
                        metadata?.action === 'UNLINK') {
                        const connectedName = metadata.connected_asset_name ? `'${metadata.connected_asset_name}'` : 'asset';
                        message = `${userName} unlinked relationship with ${connectedName}`;
                    }
                    else if (event.title === 'Asset Assigned') {
                        message = `${userName} assigned asset to ${metadata.target_type || ''} (${metadata.target_name || ''})`;
                    }
                    else if (event.title === 'Asset Unassigned') {
                        message = `${userName} unassigned asset from ${metadata.previous_target_type || ''}`;
                    }
                    else if (event.title === 'Asset Reassigned') {
                        message = `${userName} reassigned asset to ${metadata.target_type || ''} (${metadata.target_name || ''})`;
                    }
                    else {
                        message = `${userName} performed assignment`;
                    }
                    break;
                case 'LIFECYCLE':
                    message = `${userName} created the asset`;
                    break;
                case 'FINANCIAL':
                    message = `${userName} updated billing information`;
                    break;
                case 'LOCATION':
                    if (event.title === 'Asset location transfer completed') {
                        message = `${userName} completed asset transfer from ${metadata.fromLocationName} to ${metadata.toLocationName}`;
                    }
                    else {
                        message = `${userName} initiated asset transfer`;
                    }
                    break;
                case 'MAINTENANCE':
                    message = `${userName} performed ${event.event_category?.toLowerCase()} (Status:${currentStatus}) Ticket:${metadata.ticket.trim() || ''}   ${metadata.managed_by ? `[ MANAGED BY: ${metadata.managed_by}]` : ""}`;
                    description = event.description;
                    break;
                case 'SCRAPE':
                    const scrapRef = metadata.ticket ? ` (Ref: ${metadata.ticket})` : '';
                    const previousStatusId = metadata.previous_asset_working_condition_id;
                    const approved_by = metadata.approved_by;
                    const scrapped_by = metadata.scrapped_by;
                    const notes = metadata.notes;
                    const previousStatusName = previousStatusId && statusMap?.get(previousStatusId)
                        ? statusMap.get(previousStatusId)
                        : null;
                    message = `${userName} changed asset status to Scrapped${scrapRef} [ ${approved_by ? `\nAPPROVED BY: ${approved_by}` : ''}]  [ ${scrapped_by ? `\nSCRAPPED BY: ${scrapped_by}` : ''}]`;
                    if (previousStatusName) {
                        description = `Status changed from ${previousStatusName} to ${currentStatus}.`;
                    }
                    else {
                        description = `${notes?.trim() ? `${notes} \n
            ` : `Asset status updated to ${currentStatus}`}`;
                    }
                    break;
                default:
                    message = `${userName} performed ${event.event_category?.toLowerCase()}`;
            }
            return {
                log_id: event.event_id,
                activity_type: event.event_category,
                title: event.title,
                message,
                description_or_note: description,
                created_at: event.created_at,
                working_status_name: currentStatus,
                working_status_color: event.event?.working_status_color,
                performed_by: {
                    id: event.performed_user?.user_id || null,
                    name: userName,
                },
                is_current: event.event_id === latestEventId,
                metadata,
            };
        });
        return transformed;
    }
};
exports.AssetEventsService = AssetEventsService;
exports.AssetEventsService = AssetEventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(asset_events_entity_1.AssetEvent)),
    __param(2, (0, typeorm_1.InjectRepository)(asset_stock_serials_entity_1.AssetStockSerials)),
    __param(3, (0, typeorm_1.InjectRepository)(asset_working_status_entity_1.AssetWorkingStatus)),
    __param(4, (0, typeorm_1.InjectRepository)(assets_status_entity_1.AssetsStatus)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AssetEventsService);
