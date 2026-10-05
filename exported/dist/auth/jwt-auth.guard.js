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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const cookie_1 = require("cookie");
const cookie_config_1 = require("../common/config/cookie.config");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const user_repository_1 = require("../user/user.repository");
const typeorm_2 = require("typeorm");
const auth_service_1 = require("./auth.service");
const token_service_1 = require("./token.service");
let JwtAuthGuard = class JwtAuthGuard {
    constructor(jwtService, tokenService, authService, userRepository, sessionRepository, registerUserLogin) {
        this.jwtService = jwtService;
        this.tokenService = tokenService;
        this.authService = authService;
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.registerUserLogin = registerUserLogin;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const cookies = (0, cookie_1.parse)(request.headers.cookie || '');
        const accessToken = cookies.jwtToken;
        const refreshToken = cookies.jwt_refresh_token;
        const x_user_id = cookies.system_user_id;
        const sessionId = cookies.session_id;
        const accessSecret = Buffer.from(process.env.JWT_ACCESS_SECRET_KEY.padEnd(32, '0'));
        const refreshSecret = Buffer.from(process.env.JWT_REFRESH_SECRET_KEY.padEnd(32, '0'));
        const reject = (message, clearCookies = false) => {
            if (clearCookies)
                this.authService.clearAuthCookies(response);
            response.status(401).json({ message, sessionExpired: true, redirectUrl: '/sign-in' });
            return false;
        };
        if (!sessionId)
            return reject('Session ID missing');
        if (!x_user_id)
            return reject('User ID missing');
        const decryptedUserId = (0, crypto_utils_1.decrypt)(x_user_id.toString());
        const numericUserId = Number(decryptedUserId);
        if (isNaN(numericUserId))
            return reject('Invalid user ID');
        const session = await this.sessionRepository.findOne({
            where: { session_id: sessionId, user_id: numericUserId },
        });
        if (!session || !session.is_active || session.is_blocked) {
            return reject('Session is inactive or blocked', true);
        }
        if (session.force_logout === true) {
            await this.sessionRepository.update(session.session_id, {
                is_active: false,
                logout_at: new Date(),
                force_logout: false,
            });
            return reject('You have been logged out by admin.', true);
        }
        const user = await this.registerUserLogin.findOne({
            where: { user_id: numericUserId },
        });
        if (!user || !user.is_active)
            return reject('User is inactive');
        if (!accessToken) {
            return reject('Access token missing', !!refreshToken === false);
        }
        try {
            const decoded = this.jwtService.verify(accessToken, { secret: accessSecret });
            request.user = decoded;
            await this.sessionRepository.update(sessionId, { last_seen: new Date() });
            return true;
        }
        catch (accessError) {
            if (accessError.name !== 'TokenExpiredError') {
                return reject('Invalid access token');
            }
            if (!refreshToken) {
                return reject('Session expired', true);
            }
            try {
                this.jwtService.verify(refreshToken, { secret: refreshSecret });
            }
            catch (refreshError) {
                const message = refreshError.name === 'TokenExpiredError'
                    ? 'Session expired due to inactivity. Please log in again.'
                    : 'Invalid refresh token';
                return reject(message, true);
            }
            try {
                const fullUser = await this.userRepository.findOne({
                    where: { user_id: numericUserId, verified: true },
                    relations: ['organization'],
                });
                if (!fullUser)
                    return reject('User not found', true);
                const isMatch = await bcrypt.compare(refreshToken, fullUser.refreshToken);
                if (!isMatch) {
                    console.log('❌ Refresh token hash mismatch');
                    return reject('Invalid session', true);
                }
                const refreshDecoded = this.jwtService.decode(refreshToken);
                const tokenAgeSeconds = Math.floor(Date.now() / 1000) - (refreshDecoded?.iat ?? 0);
                if (tokenAgeSeconds < 30) {
                    console.log(`⚡ Token fresh (${tokenAgeSeconds}s) — skipping re-issue`);
                    request.user = refreshDecoded;
                    await this.sessionRepository.update(sessionId, { last_seen: new Date() });
                    return true;
                }
                const standardRefreshMs = this.parseDurationToMs(process.env.JWT_REFRESH_EXPIRATION ?? '45m');
                const tokenLifespanMs = (refreshDecoded.exp - refreshDecoded.iat) * 1000;
                const wasRememberMe = tokenLifespanMs > standardRefreshMs;
                const accessExpiry = wasRememberMe
                    ? (process.env.JWT_ACCESS_EXPIRATION_REMEMBER ?? process.env.JWT_ACCESS_EXPIRATION)
                    : process.env.JWT_ACCESS_EXPIRATION;
                const refreshExpiry = wasRememberMe
                    ? (process.env.JWT_REFRESH_EXPIRATION_REMEMBER ?? process.env.JWT_REFRESH_EXPIRATION)
                    : process.env.JWT_REFRESH_EXPIRATION;
                const tokens = await this.tokenService.generateTokens(fullUser, accessExpiry, refreshExpiry);
                const cookieOpts = (0, cookie_config_1.authCookieOptions)(wasRememberMe ? { maxAge: (0, cookie_config_1.getRememberMeMaxAgeMs)() } : {});
                response.cookie('jwtToken', tokens.accessToken, cookieOpts);
                response.cookie('jwt_refresh_token', tokens.refreshToken, cookieOpts);
                const newDecoded = this.jwtService.verify(tokens.accessToken, { secret: accessSecret });
                request.user = newDecoded;
                await this.sessionRepository.update(sessionId, { last_seen: new Date() });
                console.log(`✅ Sliding session refreshed for user ${numericUserId}`);
                return true;
            }
            catch (err) {
                console.error('❌ Token refresh error:', err);
                response.status(500).json({
                    message: 'Authentication error. Please try again.',
                    sessionExpired: false,
                });
                return false;
            }
        }
    }
    parseDurationToMs(duration) {
        const unit = duration.slice(-1);
        const value = parseInt(duration.slice(0, -1), 10);
        switch (unit) {
            case 's': return value * 1_000;
            case 'm': return value * 60 * 1_000;
            case 'h': return value * 60 * 60 * 1_000;
            case 'd': return value * 24 * 60 * 60 * 1_000;
            default: return 45 * 60 * 1_000;
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(user_repository_1.UserRepository)),
    __param(4, (0, typeorm_1.InjectRepository)(sessions_entity_1.Session)),
    __param(5, (0, typeorm_1.InjectRepository)(register_user_login_entity_1.RegisterUserLogin)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        token_service_1.TokenService,
        auth_service_1.AuthService,
        user_repository_1.UserRepository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], JwtAuthGuard);
