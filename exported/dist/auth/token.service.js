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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jose_1 = require("jose");
const bcrypt = __importStar(require("bcrypt"));
const user_repository_1 = require("../user/user.repository");
let TokenService = class TokenService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async generateTokens(user, accessExpiry, refreshExpiry) {
        const finalAccessExpiry = accessExpiry ?? process.env.JWT_ACCESS_EXPIRATION ?? '5h';
        const finalRefreshExpiry = refreshExpiry ?? process.env.JWT_REFRESH_EXPIRATION ?? '15m';
        console.log('🕐 FINAL access expiry:', finalAccessExpiry);
        console.log('🕐 FINAL refresh expiry:', finalRefreshExpiry);
        const accessSecretJose = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET_KEY.padEnd(32, '0'));
        const refreshSecretJose = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET_KEY.padEnd(32, '0'));
        const payload = {
            userId: user.user_id,
            organizationSchema: user.organization.organization_schema_name,
        };
        const encryptPayload = async (p, secret) => {
            const encoded = new TextEncoder().encode(JSON.stringify(p));
            return await new jose_1.CompactEncrypt(encoded)
                .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
                .encrypt(secret);
        };
        const encryptedPayload = await encryptPayload(payload, accessSecretJose);
        const accessToken = await new jose_1.SignJWT({ data: encryptedPayload })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(finalAccessExpiry)
            .sign(accessSecretJose);
        const refreshToken = await new jose_1.SignJWT({ data: encryptedPayload })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(finalRefreshExpiry)
            .sign(refreshSecretJose);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(user.user_id, { refreshToken: hashedRefreshToken });
        return { accessToken, refreshToken };
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_repository_1.UserRepository)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], TokenService);
