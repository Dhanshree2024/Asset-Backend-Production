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
exports.SetSchemaMiddleware = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("./database.service");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
const request_context_service_1 = require("../common/context/request-context.service");
let SetSchemaMiddleware = class SetSchemaMiddleware {
    constructor(databaseService, context) {
        this.databaseService = databaseService;
        this.context = context;
    }
    async use(req, res, next) {
        const schemaName = req.cookies['x-organization-schema'];
        if (schemaName) {
            try {
                const decryptedSchemaName = (0, crypto_utils_1.decrypt)(schemaName);
                if (decryptedSchemaName) {
                    const fullSchemaName = `org_${decryptedSchemaName}`;
                    await this.databaseService.setSchema(fullSchemaName);
                    this.context.set('schema', fullSchemaName);
                }
            }
            catch (error) {
                console.error('Error decrypting schema name:', error.message);
            }
        }
        next();
    }
};
exports.SetSchemaMiddleware = SetSchemaMiddleware;
exports.SetSchemaMiddleware = SetSchemaMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        request_context_service_1.RequestContextService])
], SetSchemaMiddleware);
