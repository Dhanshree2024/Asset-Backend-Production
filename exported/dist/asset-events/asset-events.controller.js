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
exports.AssetEventsController = void 0;
const common_1 = require("@nestjs/common");
const asset_events_service_1 = require("./asset-events.service");
const api_key_guard_1 = require("../auth/api-key.guard");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let AssetEventsController = class AssetEventsController {
    constructor(assetEventsService) {
        this.assetEventsService = assetEventsService;
    }
    async getEventsByStockSerial(serialId) {
        return this.assetEventsService.getEventsByStockSerialId(serialId);
    }
};
exports.AssetEventsController = AssetEventsController;
__decorate([
    (0, common_1.Post)('get-asset-events-by-serial-id'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('serialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AssetEventsController.prototype, "getEventsByStockSerial", null);
exports.AssetEventsController = AssetEventsController = __decorate([
    (0, common_1.Controller)('asset-events'),
    __metadata("design:paramtypes", [asset_events_service_1.AssetEventsService])
], AssetEventsController);
