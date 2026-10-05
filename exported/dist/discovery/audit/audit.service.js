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
var AuditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const audit_repository_1 = require("./audit.repository");
const audit_util_1 = require("./audit.util");
let AuditService = AuditService_1 = class AuditService {
    constructor(repo) {
        this.repo = repo;
        this.logger = new common_1.Logger(AuditService_1.name);
        this.writeFailures = 0;
    }
    actor(req) {
        return (0, audit_util_1.resolveActor)(req);
    }
    async record(schema, actor, entry) {
        try {
            return await this.repo.insert(schema, actor, entry);
        }
        catch (err) {
            this.writeFailures++;
            this.logger.error(`AUDIT WRITE FAILED (#${this.writeFailures}) action=${entry.action} target=${entry.targetType}:${entry.targetId} actor=${actor.userId}: ${err?.message}`);
            return null;
        }
    }
    async wrap(schema, actor, entry, fn) {
        try {
            const out = await fn();
            await this.record(schema, actor, { ...entry, result: entry.result ?? 'ok' });
            return out;
        }
        catch (err) {
            await this.record(schema, actor, {
                ...entry,
                result: 'error',
                error: err?.message ?? String(err),
            });
            throw err;
        }
    }
    list(schema, filters) {
        return this.repo.list(schema, filters);
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = AuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_repository_1.AuditRepository])
], AuditService);
