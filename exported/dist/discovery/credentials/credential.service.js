"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CredentialService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const phase2_types_1 = require("../phase2.types");
const credential_repository_1 = require("./credential.repository");
const ALGO = 'aes-256-gcm';
const TAG = 'c1';
let CredentialService = CredentialService_1 = class CredentialService {
    constructor(repo) {
        this.repo = repo;
        this.logger = new common_1.Logger(CredentialService_1.name);
    }
    key() {
        const raw = process.env.DISCOVERY_CREDENTIAL_KEY;
        if (!raw || raw.length < 16) {
            throw new common_1.BadRequestException('Credential store is not configured: set DISCOVERY_CREDENTIAL_KEY (>= 16 characters) in the backend environment');
        }
        return crypto.createHash('sha256').update(raw).digest();
    }
    encrypt(plain) {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(ALGO, this.key(), iv);
        const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
        return [TAG, iv.toString('hex'), cipher.getAuthTag().toString('hex'), ct.toString('hex')].join(':');
    }
    decrypt(stored) {
        if (!stored)
            return null;
        const parts = stored.split(':');
        if (parts.length !== 4 || parts[0] !== TAG) {
            throw new common_1.BadRequestException('Stored credential has an unrecognised format');
        }
        const [, ivHex, tagHex, dataHex] = parts;
        const decipher = crypto.createDecipheriv(ALGO, this.key(), Buffer.from(ivHex, 'hex'));
        decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
        return Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]).toString('utf8');
    }
    list(schema) {
        return this.repo.list(schema);
    }
    async get(schema, id) {
        const row = await this.repo.getFull(schema, id);
        if (!row)
            throw new common_1.NotFoundException('Credential not found');
        const { secretEnc: _omit, ...summary } = row;
        return summary;
    }
    async create(schema, input, userId) {
        this.validate(input, true);
        return this.repo.insert(schema, {
            name: input.name.trim(),
            kind: input.kind,
            username: input.username?.trim() || null,
            domain: input.domain?.trim() || null,
            secretEnc: input.secret ? this.encrypt(input.secret) : null,
            description: input.description?.trim() || null,
            isDefault: !!input.isDefault,
        }, userId);
    }
    async update(schema, id, input, userId) {
        if (input.kind && !phase2_types_1.CREDENTIAL_KINDS.includes(input.kind)) {
            throw new common_1.BadRequestException(`Invalid credential kind '${input.kind}'`);
        }
        const patch = {};
        if (input.name !== undefined)
            patch.name = input.name.trim();
        if (input.kind !== undefined)
            patch.kind = input.kind;
        if (input.username !== undefined)
            patch.username = input.username?.trim() || null;
        if (input.domain !== undefined)
            patch.domain = input.domain?.trim() || null;
        if (input.description !== undefined)
            patch.description = input.description?.trim() || null;
        if (input.isDefault !== undefined)
            patch.isDefault = !!input.isDefault;
        if (input.secret)
            patch.secretEnc = this.encrypt(input.secret);
        const row = await this.repo.update(schema, id, patch, userId);
        if (!row)
            throw new common_1.NotFoundException('Credential not found');
        return row;
    }
    async remove(schema, id, userId) {
        const ok = await this.repo.softDelete(schema, id, userId);
        if (!ok)
            throw new common_1.NotFoundException('Credential not found');
    }
    async materializeForAgent(schema, id) {
        const row = await this.repo.getFull(schema, id);
        if (!row)
            throw new common_1.NotFoundException('Credential not found');
        return {
            id: row.id,
            kind: row.kind,
            username: row.username,
            domain: row.domain,
            secret: this.decrypt(row.secretEnc),
        };
    }
    validate(input, creating) {
        if (!input?.name?.trim())
            throw new common_1.BadRequestException('name is required');
        if (!input.kind || !phase2_types_1.CREDENTIAL_KINDS.includes(input.kind)) {
            throw new common_1.BadRequestException(`kind must be one of ${phase2_types_1.CREDENTIAL_KINDS.join(', ')}`);
        }
        if (creating && input.kind !== 'snmp-v2c' && !input.username?.trim()) {
            throw new common_1.BadRequestException('username is required for this credential kind');
        }
        if (creating && !input.secret) {
            throw new common_1.BadRequestException('secret is required when creating a credential');
        }
        if (input.kind === 'windows-domain' && !input.domain?.trim()) {
            throw new common_1.BadRequestException('domain is required for a windows-domain credential');
        }
    }
};
exports.CredentialService = CredentialService;
exports.CredentialService = CredentialService = CredentialService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [credential_repository_1.CredentialRepository])
], CredentialService);
