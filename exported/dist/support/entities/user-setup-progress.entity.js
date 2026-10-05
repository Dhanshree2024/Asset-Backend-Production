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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSetupProgress = void 0;
const typeorm_1 = require("typeorm");
let UserSetupProgress = class UserSetupProgress {
};
exports.UserSetupProgress = UserSetupProgress;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id', type: 'bigint' }),
    __metadata("design:type", Number)
], UserSetupProgress.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'organization_id' }),
    __metadata("design:type", Number)
], UserSetupProgress.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], UserSetupProgress.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'task_id' }),
    __metadata("design:type", Number)
], UserSetupProgress.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status' }),
    __metadata("design:type", String)
], UserSetupProgress.prototype, "status", void 0);
exports.UserSetupProgress = UserSetupProgress = __decorate([
    (0, typeorm_1.Entity)("user_setup_progress")
], UserSetupProgress);
