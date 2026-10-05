"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModule = void 0;
const common_1 = require("@nestjs/common");
const request_context_module_1 = require("../context/request-context.module");
const notification_gateway_1 = require("./notification.gateway");
const notifications_helper_1 = require("./notifications.helper");
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [request_context_module_1.RequestContextModule],
        providers: [notification_gateway_1.NotificationGateway, notifications_helper_1.NotificationHelper],
        exports: [notification_gateway_1.NotificationGateway, notifications_helper_1.NotificationHelper, request_context_module_1.RequestContextModule],
    })
], NotificationModule);
