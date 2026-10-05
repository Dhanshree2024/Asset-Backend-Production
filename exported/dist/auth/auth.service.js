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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const config_repository_1 = require("../config/config.repository");
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const uuid_1 = require("uuid");
const register_user_login_entity_1 = require("../organization_register/entities/register-user-login.entity");
const user_repository_1 = require("../user/user.repository");
const jose_1 = require("jose");
const cookie_1 = require("cookie");
const asset_items_service_1 = require("../assets-data/asset-items/asset-items.service");
const mail_service_1 = require("../common/mail/mail.service");
const render_email_1 = require("../common/mail/render-email");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
const redis_service_1 = require("../common/redis/redis.service");
const organizational_profile_entity_1 = require("../organizational-profile/entity/organizational-profile.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const casbin_rule_entity_1 = require("../organizational-profile/entity/policy-builder/casbin-rule.entity");
const organizational_profile_service_1 = require("../organizational-profile/organizational-profile.service");
const policy_builder_service_1 = require("../organizational-profile/policy-builder.service");
const sessions_entity_1 = require("../organizational-profile/public_schema_entity/sessions.entity");
const typeorm_2 = require("typeorm");
const cookie_config_1 = require("../common/config/cookie.config");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
const mail_config_service_1 = require("../common/mail/mail-config.service");
const token_service_1 = require("./token.service");
let AuthService = class AuthService {
    constructor(tokenService, redisService, mailConfigService, mailService, orgProfileService, assetItemsService, notificationHelper, userRepository, configRepository, sessionRepository, registerserRepository, organizationalProfileRepo, userRepo, casbinRuleRepo, policyBuilderService) {
        this.tokenService = tokenService;
        this.redisService = redisService;
        this.mailConfigService = mailConfigService;
        this.mailService = mailService;
        this.orgProfileService = orgProfileService;
        this.assetItemsService = assetItemsService;
        this.notificationHelper = notificationHelper;
        this.userRepository = userRepository;
        this.configRepository = configRepository;
        this.sessionRepository = sessionRepository;
        this.registerserRepository = registerserRepository;
        this.organizationalProfileRepo = organizationalProfileRepo;
        this.userRepo = userRepo;
        this.casbinRuleRepo = casbinRuleRepo;
        this.policyBuilderService = policyBuilderService;
    }
    async validateUser(loginDto, response, req) {
        const { email, password, rememberMe } = loginDto;
        const sanitizedIdentifier = email?.trim() || '';
        console.log('loginDto loginDto', { loginDto });
        try {
            const user = await this.userRepository.findUserWithMobileNumber(sanitizedIdentifier);
            if (!user) {
                throw new common_1.UnauthorizedException({
                    message: 'Invalid email or password',
                    statusCode: 401,
                });
            }
            if (user.is_active !== 1) {
                throw new common_1.UnauthorizedException({
                    message: 'User is deactivated. Contact administrator.',
                    statusCode: 401,
                });
            }
            const isPasswordValid = await this.userRepository.validatePassword(password, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException({
                    message: 'Invalid email or password',
                    statusCode: 401,
                });
            }
            await this.userRepository.update(user.user_id, {
                last_login_at: new Date(),
            });
            const latestUser = await this.userRepository.findOne({
                where: { user_id: user.user_id },
                select: ['user_id', 'invite_status', 'invite_expires_at'],
            });
            if (latestUser?.invite_status === register_user_login_entity_1.InviteStatus.EXPIRED) {
                throw new common_1.UnauthorizedException({
                    message: 'Your invitation has expired. Please contact administrator.',
                    statusCode: 401,
                });
            }
            if (latestUser?.invite_status === register_user_login_entity_1.InviteStatus.INVITED) {
                if (latestUser.invite_expires_at &&
                    new Date() > new Date(latestUser.invite_expires_at)) {
                    await this.userRepository.update({ user_id: user.user_id }, { invite_status: register_user_login_entity_1.InviteStatus.EXPIRED });
                    throw new common_1.UnauthorizedException({
                        message: 'Your invitation has expired. Please contact administrator.',
                        statusCode: 401,
                    });
                }
                const updateResult = await this.userRepository.update({
                    user_id: user.user_id,
                    invite_status: register_user_login_entity_1.InviteStatus.INVITED,
                }, {
                    invite_status: register_user_login_entity_1.InviteStatus.ACCEPTED,
                    invite_expires_at: null,
                });
                if (updateResult.affected === 0) {
                    throw new common_1.UnauthorizedException({
                        message: 'Invitation is no longer valid.',
                        statusCode: 401,
                    });
                }
                user.invite_status = register_user_login_entity_1.InviteStatus.ACCEPTED;
                await this.redisService.delByPattern('organization-users:*');
            }
            const mustChangePassword = user.force_password_change === true;
            if (!user.passwordSet) {
                await this.userRepository.update(user.user_id, {
                    passwordReset: 'Y',
                });
            }
            const organizationSchema = `org_${user.organization.organization_schema_name}`;
            await this.setSchema(organizationSchema);
            const query = `
        SELECT r.role_id, r.role_name, r.is_compulsary,
              u.user_id, u.first_name, u.last_name,
              u.profile_image, u.role_id, u.branch_access
        FROM ${organizationSchema}.users u
        LEFT JOIN ${organizationSchema}.organization_roles r
          ON u.role_id = r.role_id
        WHERE u.register_user_login_id = $1
          AND u.is_active = 1
          AND u.is_deleted = 0
        LIMIT 1;
      `;
            const result = await this.userRepository.query(query, [user.user_id]);
            if (!result || result.length === 0) {
                throw new common_1.BadRequestException('User is not active or role not found');
            }
            const { role_id, role_name, is_compulsary, branch_access } = result[0];
            await this.userRepository.query(`UPDATE ${organizationSchema}.users 
            SET last_login = NOW() 
            WHERE user_id = $1`, [result[0].user_id]);
            const branchAccessArray = branch_access || [];
            const policyData = await this.policyBuilderService.getPoliciesByRole(role_id.toString());
            const sidebarUser = await this.userRepo.findOne({
                where: { register_user_login_id: user.user_id },
                select: ['sidebarprefs', 'favorites_sidebar_menu', 'theme_preferences'],
            });
            const sidebarPreferences = sidebarUser?.sidebarprefs || null;
            const favourites = sidebarUser?.favorites_sidebar_menu || null;
            const themePreferences = sidebarUser?.theme_preferences || null;
            const organization = await this.organizationalProfileRepo.findOne({
                where: { organization_profile_id: 1 },
                select: ['othersetting', 'it_act_enabled', 'company_act_enabled'],
            });
            const othersettingsPreferences = {
                ...(organization?.othersetting || {}),
                it_act_enabled: organization?.it_act_enabled ?? false,
                company_act_enabled: organization?.company_act_enabled ?? false,
            };
            const rawSidebarMenus = await this.assetItemsService.getSidebarMenuOption();
            const barcodeandqrcodepref = await this.orgProfileService.getBarcodeQrSettings('Global');
            if (is_compulsary === true) {
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpiry = new Date();
                otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
                await this.userRepository.update(user.user_id, {
                    otp,
                    otp_expiry: otpExpiry,
                });
                await this.mailService.sendEmail(email, 'OTP for Login Verification', await (0, render_email_1.renderEmail)(render_email_1.EmailTemplate.AUTH_LOGIN_VERIFICATION, { name: `${user.first_name} ${user.last_name}`, otp }, this.mailConfigService));
            }
            const accessExpiry = rememberMe
                ? (process.env.JWT_ACCESS_EXPIRATION_REMEMBER ??
                    process.env.JWT_ACCESS_EXPIRATION)
                : process.env.JWT_ACCESS_EXPIRATION;
            const refreshExpiry = rememberMe
                ? (process.env.JWT_REFRESH_EXPIRATION_REMEMBER ??
                    process.env.JWT_REFRESH_EXPIRATION)
                : process.env.JWT_REFRESH_EXPIRATION;
            console.log('🔑 accessExpiry:', accessExpiry);
            console.log('🔑 refreshExpiry:', refreshExpiry);
            const tokens = await this.tokenService.generateTokens(user, accessExpiry, refreshExpiry);
            console.log('💾 Saving session...');
            const sessionId = (0, uuid_1.v4)();
            await this.sessionRepository.insert({
                user_id: user.user_id,
                session_id: sessionId,
                device_name: req.headers['user-agent'] || 'unknown',
                device_type: 'desktop',
                ip_address: req.ip,
                user_agent: req.headers['user-agent'],
                login_at: new Date(),
                last_seen: new Date(),
                is_active: true,
            });
            console.log('✅ Session saved');
            const permissions = policyData || {};
            console.log('🔐 Signing permission token...');
            const privateKey = fs.readFileSync(path.resolve(process.cwd(), process.env.JWT_PRIVATE_KEY || './keys/private.pem'), 'utf8');
            const privateKeyObj = await (0, jose_1.importPKCS8)(privateKey, 'RS256');
            const permissionToken = await new jose_1.SignJWT({
                sub: String(user.user_id),
                role_id,
                sessionId,
                permissions,
            })
                .setProtectedHeader({ alg: 'RS256' })
                .setIssuedAt()
                .setExpirationTime(process.env.PERM_TOKEN_EXPIRY || '1h')
                .sign(privateKeyObj);
            if (response) {
                this.setAuthCookies(response, tokens, (0, crypto_utils_1.encrypt)(user.user_id.toString()), (0, crypto_utils_1.encrypt)(result[0].user_id.toString()), (0, crypto_utils_1.encrypt)(result[0].role_id.toString()), (0, crypto_utils_1.encrypt)(user.organization.organization_schema_name), (0, crypto_utils_1.encrypt)(user.organization.organization_id.toString()), (0, crypto_utils_1.encrypt)(result[0]?.permissions), sessionId, req, permissionToken, branchAccessArray, rememberMe);
            }
            return {
                success: true,
                message: mustChangePassword
                    ? 'Password change required'
                    : 'Login successful',
                status: 200,
                data: {
                    permissionToken,
                    session_id: sessionId,
                    jwt_token: tokens.accessToken,
                    jwt_refresh_token: tokens.refreshToken,
                    user_id: user.user_id,
                    main_user_id: result[0].user_id,
                    organization_id: user.organization.organization_id,
                    billingOrgId: user.org_billing_id,
                    role_id,
                    role: { role_id, role_name, is_compulsary },
                    force_password_change: mustChangePassword,
                    loginusersidebarpref: sidebarPreferences,
                    favourites,
                    themePreferences,
                    projectandcostcenterpref: othersettingsPreferences,
                    rawSidebarMenus,
                    barcodeandqrcodepref,
                    passwordSet: user.passwordSet,
                    organization_schema_name: user.organization.organization_schema_name,
                    permissions,
                    userData: result[0],
                    profile_image: result[0].profile_image,
                    branch_access: branchAccessArray,
                },
            };
        }
        catch (error) {
            console.log('Error from login:', error);
            throw error instanceof common_1.UnauthorizedException ||
                error instanceof common_1.BadRequestException
                ? error
                : new common_1.InternalServerErrorException('Internal server error');
        }
    }
    setAuthCookies(response, tokens, encryptedUserId, encryptedMainUserId, encryptedRoleId, encryptedSchemaName, encryptedOrganizationId, encryptedPermissions, sessionId, req, permissionToken, branchAccessArray, rememberMe) {
        const cookieOptions = (0, cookie_config_1.authCookieOptions)(rememberMe ? { maxAge: (0, cookie_config_1.getRememberMeMaxAgeMs)() } : {});
        response.cookie('jwtToken', tokens.accessToken, cookieOptions);
        response.cookie('jwt_refresh_token', tokens.refreshToken, cookieOptions);
        response.cookie('system_user_id', encryptedUserId, cookieOptions);
        response.cookie('session_id', sessionId, cookieOptions);
        response.cookie('x-organization-schema', encryptedSchemaName, cookieOptions);
        response.cookie('organization_id', encryptedOrganizationId, cookieOptions);
        response.cookie('role_id', encryptedRoleId, cookieOptions);
        response.cookie('main_user_id', encryptedMainUserId, cookieOptions);
        if (encryptedPermissions !== undefined && encryptedPermissions !== null) {
            response.cookie('permissions', encryptedPermissions, cookieOptions);
        }
        if (permissionToken) {
            response.cookie('permissionToken', permissionToken, cookieOptions);
        }
        response.cookie('branch_access', JSON.stringify(branchAccessArray ?? []), cookieOptions);
    }
    clearAuthCookies(response) {
        const variants = [
            (0, cookie_config_1.clearCookieOptions)(),
            ...(0, cookie_config_1.legacyClearCookieOptionVariants)(),
        ];
        cookie_config_1.AUTH_COOKIE_NAMES.forEach((name) => {
            variants.forEach((opts) => {
                response.clearCookie(name, opts);
            });
        });
    }
    readTokenExpiryMs(token) {
        if (!token)
            return null;
        try {
            const payloadSegment = token.split('.')[1];
            if (!payloadSegment)
                return null;
            const payload = JSON.parse(Buffer.from(payloadSegment, 'base64').toString('utf8'));
            return payload?.exp ? payload.exp * 1000 : null;
        }
        catch {
            return null;
        }
    }
    async getSessionContext(req, response) {
        const cookies = req.cookies ?? (0, cookie_1.parse)(req.headers.cookie || '');
        const sessionId = cookies.session_id;
        const encryptedSystemUserId = cookies.system_user_id;
        if (!sessionId || !encryptedSystemUserId) {
            throw new common_1.UnauthorizedException('No active session');
        }
        let registerUserLoginId;
        try {
            registerUserLoginId = Number((0, crypto_utils_1.decrypt)(encryptedSystemUserId));
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid session');
        }
        if (!Number.isFinite(registerUserLoginId)) {
            throw new common_1.UnauthorizedException('Invalid session');
        }
        const session = await this.sessionRepository.findOne({
            where: { session_id: sessionId, user_id: registerUserLoginId },
        });
        if (!session || !session.is_active || session.is_blocked) {
            throw new common_1.UnauthorizedException('Session is inactive or blocked');
        }
        const account = await this.userRepository.findOne({
            where: { user_id: registerUserLoginId },
            relations: ['organization'],
        });
        if (!account || !account.organization) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const organizationSchema = `org_${account.organization.organization_schema_name}`;
        await this.setSchema(organizationSchema);
        const rows = await this.userRepository.query(`
        SELECT r.role_id, r.role_name, r.is_compulsary,
               u.user_id, u.first_name, u.last_name,
               u.profile_image, u.branch_access
        FROM ${organizationSchema}.users u
        LEFT JOIN ${organizationSchema}.organization_roles r
          ON u.role_id = r.role_id
        WHERE u.register_user_login_id = $1
          AND u.is_active = 1
          AND u.is_deleted = 0
        LIMIT 1;
      `, [registerUserLoginId]);
        if (!rows || rows.length === 0) {
            throw new common_1.UnauthorizedException('User is not active or role not found');
        }
        const tenantUser = rows[0];
        const roleId = tenantUser.role_id;
        const permissions = roleId
            ? ((await this.policyBuilderService.getPoliciesByRole(roleId.toString())) ?? {})
            : {};
        let permissionToken = null;
        try {
            const privateKey = fs.readFileSync(path.resolve(process.cwd(), process.env.JWT_PRIVATE_KEY || './keys/private.pem'), 'utf8');
            const privateKeyObj = await (0, jose_1.importPKCS8)(privateKey, 'RS256');
            permissionToken = await new jose_1.SignJWT({
                sub: String(registerUserLoginId),
                role_id: roleId,
                sessionId,
                permissions,
            })
                .setProtectedHeader({ alg: 'RS256' })
                .setIssuedAt()
                .setExpirationTime(process.env.PERM_TOKEN_EXPIRY || '1h')
                .sign(privateKeyObj);
        }
        catch (error) {
            console.error('Failed to sign permission token for /auth/me:', error);
        }
        if (response && permissionToken) {
            response.cookie('permissionToken', permissionToken, (0, cookie_config_1.authCookieOptions)());
        }
        const refreshExpiresAt = this.readTokenExpiryMs(cookies.jwt_refresh_token);
        const accessExpiresAt = this.readTokenExpiryMs(cookies.jwtToken);
        return {
            authenticated: true,
            user: {
                user_id: tenantUser.user_id,
                main_user_id: tenantUser.user_id,
                system_user_id: registerUserLoginId,
                first_name: tenantUser.first_name ?? account.first_name ?? null,
                last_name: tenantUser.last_name ?? account.last_name ?? null,
                email: account.business_email ?? null,
                profile_image: tenantUser.profile_image ?? null,
                passwordSet: account.passwordSet ?? null,
                force_password_change: account.force_password_change ?? false,
            },
            role: {
                role_id: roleId ?? null,
                role_name: tenantUser.role_name ?? null,
                is_compulsary: tenantUser.is_compulsary ?? false,
            },
            permissions,
            permissionToken,
            organization: {
                organization_id: account.organization.organization_id,
                organization_schema_name: account.organization.organization_schema_name,
                billingOrgId: account.org_billing_id ?? null,
            },
            branch_access: tenantUser.branch_access ?? [],
            session: {
                session_id: sessionId,
                access_expires_at: accessExpiresAt,
                refresh_expires_at: refreshExpiresAt,
                expires_in_ms: refreshExpiresAt
                    ? Math.max(0, refreshExpiresAt - Date.now())
                    : null,
            },
        };
    }
    async logout(req, res) {
        try {
            const cookies = (0, cookie_1.parse)(req.headers.cookie || '');
            const sessionId = cookies.session_id;
            if (sessionId) {
                await this.sessionRepository.update({ session_id: sessionId }, {
                    is_active: false,
                    logout_at: new Date(),
                });
            }
            await this.redisService.del('me-response');
            this.clearAuthCookies(res);
            return { message: 'Logged out successfully' };
        }
        catch (error) {
            console.error('Logout error:', error);
            throw new common_1.HttpException({ message: 'Logout failed', error: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async logoutAllSessions(userId, res) {
        try {
            await this.sessionRepository.update({ user_id: userId, is_active: true }, { is_active: false, logout_at: new Date() });
            this.clearAuthCookies(res);
            return { message: 'Logged out from all sessions successfully' };
        }
        catch (error) {
            console.error('Logout all sessions error:', error);
            throw new common_1.HttpException({ message: 'Logout failed', error: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async forceLogoutByUserId(localUserId) {
        try {
            const user = await this.userRepo.findOne({
                where: { user_id: localUserId },
            });
            if (!user || !user.register_user_login_id) {
                throw new common_1.NotFoundException('Public user ID not linked to local user');
            }
            const publicUserId = user.register_user_login_id;
            console.log('Force logout for publicUserId:', publicUserId);
            const sessions = await this.sessionRepository.find({
                where: { user_id: publicUserId, is_active: true },
            });
            console.log('Active sessions:', sessions);
            await this.sessionRepository
                .createQueryBuilder()
                .update()
                .set({
                force_logout: true,
                is_active: false,
                logout_at: new Date(),
            })
                .where('user_id = :uid', { uid: publicUserId })
                .andWhere('is_active = true')
                .execute();
            return {
                status: 'success',
                message: 'All sessions forcibly logged out for this user',
            };
        }
        catch (error) {
            console.error('Force logout error:', error);
            throw new common_1.HttpException({ message: 'Force logout failed', error: error.message }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async fetchUserLoginProfile(login_user_id) {
        const userExists = await this.userRepository.findOne({
            where: { user_id: login_user_id },
        });
        if (!userExists) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Invalid createdBy user ID',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        return userExists;
    }
    async fetchUserLoginProfile2(login_user_id) {
        const cacheKey = `user-profile:${login_user_id}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            console.log('REDIS HIT:PROFILE');
            return cached;
        }
        console.log('REDIS MISS:PROFILE');
        const userLogin = await this.userRepository.findOne({
            where: {
                user_id: login_user_id,
                is_deleted: 0,
            },
        });
        if (!userLogin) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                message: 'Invalid user ID',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const orgUser = await this.userRepo.findOne({
            where: {
                register_user_login_id: login_user_id,
                is_deleted: 0,
            },
            relations: [
                'user_role',
                'user_department',
                'user_designation',
                'organization',
            ],
        });
        const response = {
            ...userLogin,
            org_profile: orgUser || null,
            source: 'database',
        };
        await this.redisService.set(cacheKey, response, 300);
        return response;
    }
    async getApiKey() {
        return await this.configRepository.getJwtSecret();
    }
    async updatePassword(user_id, newPassword, response, currentPassword, req) {
        if (!user_id) {
            throw new common_1.BadRequestException('Invalid user ID');
        }
        const user = await this.userRepository.findOne({ where: { user_id } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (currentPassword) {
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Current password is incorrect');
            }
        }
        if (user.password && typeof user.password === 'string') {
            const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
            if (isSameAsCurrent) {
                throw new common_1.BadRequestException('New password cannot be the same as your current password.');
            }
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.userRepository.update(user_id, {
            password: hashedNewPassword,
            passwordSet: true,
            verified: true,
            passwordReset: 'N',
            force_password_change: false,
        });
        if (user.invite_status === register_user_login_entity_1.InviteStatus.INVITED) {
            if (!user.invite_expires_at || new Date() > user.invite_expires_at) {
                await this.userRepository.update(user.user_id, {
                    invite_status: register_user_login_entity_1.InviteStatus.EXPIRED,
                });
                throw new common_1.UnauthorizedException('Invite link has expired. Please request a new invitation.');
            }
        }
        if (user.invite_status === register_user_login_entity_1.InviteStatus.INVITED) {
            await this.userRepository.update(user_id, {
                invite_status: register_user_login_entity_1.InviteStatus.ACCEPTED,
                invite_expires_at: null,
            });
        }
        await this.redisService.delByPattern('organization-users:*');
        const fetchUser = await this.userRepository.findUserWithOrganizationSchema(user.business_email);
        const orgSchema = `org_${fetchUser.organization.organization_schema_name}`;
        await this.setSchema(orgSchema);
        await this.userRepository.query(`UPDATE ${orgSchema}.users 
     SET password = $1, updated_at = NOW() 
     WHERE register_user_login_id = $2`, [hashedNewPassword, user.user_id]);
        const result = await this.userRepository.query(`
    SELECT
      u.user_id,
      u.first_name,
      u.last_name,
      u.profile_image,
      u.branch_access,
      r.role_id,
      r.role_name,
      r.is_compulsary
    FROM ${orgSchema}.users u
    LEFT JOIN ${orgSchema}.organization_roles r 
      ON u.role_id = r.role_id
    WHERE u.register_user_login_id = $1
      AND u.is_active = 1
      AND u.is_deleted = 0
    LIMIT 1
  `, [user.user_id]);
        if (!result?.length) {
            throw new common_1.BadRequestException('User is not active or role not found');
        }
        const { role_id, is_compulsary, branch_access } = result[0];
        const now = new Date();
        await this.userRepository.query(`UPDATE ${orgSchema}.users 
          SET last_login = $1 
          WHERE user_id = $2`, [now, result[0].user_id]);
        await this.userRepository.update(user.user_id, {
            last_login_at: now,
        });
        const branchAccessArray = branch_access || [];
        const policyData = await this.policyBuilderService.getPoliciesByRole(role_id.toString());
        const permissions = policyData || {};
        const tokens = await this.tokenService.generateTokens(fetchUser);
        const sessionId = (0, uuid_1.v4)();
        const parser = new ua_parser_js_1.default(req?.headers['user-agent'] || '');
        const device = parser.getResult();
        const deviceName = device.device.vendor && device.device.model
            ? `${device.device.vendor} ${device.device.model}`
            : `${device.browser.name} on ${device.os.name}`;
        const deviceType = device.device.type || 'desktop';
        const browser = device.browser.name || 'Unknown';
        const os = device.os.name || 'Unknown';
        await this.sessionRepository.insert({
            user_id: user.user_id,
            session_id: sessionId,
            device_name: deviceName || `${browser} on ${os}`,
            device_type: deviceType,
            ip_address: req?.ip || null,
            location: null,
            user_agent: req?.headers['user-agent'],
            login_at: new Date(),
            last_seen: new Date(),
            is_active: true,
        });
        const permPayload = {
            sub: user.user_id,
            role_id: role_id,
            sessionId: sessionId,
            version: Date.now(),
            permissions,
        };
        const privateKey = fs.readFileSync(path.resolve(process.cwd(), process.env.JWT_PRIVATE_KEY || './keys/private.pem'), 'utf8');
        const alg = 'RS256';
        const privateKeyObj = await (0, jose_1.importPKCS8)(privateKey, alg);
        const permissionToken = await new jose_1.SignJWT({ permPayload })
            .setProtectedHeader({ alg })
            .setIssuedAt()
            .setExpirationTime(process.env.PERM_TOKEN_EXPIRY || '1h')
            .sign(privateKeyObj);
        this.setAuthCookies(response, tokens, (0, crypto_utils_1.encrypt)(user.user_id.toString()), (0, crypto_utils_1.encrypt)(result[0].user_id.toString()), (0, crypto_utils_1.encrypt)(result[0].role_id.toString()), (0, crypto_utils_1.encrypt)(fetchUser.organization.organization_schema_name), (0, crypto_utils_1.encrypt)(fetchUser.organization.organization_id.toString()), (0, crypto_utils_1.encrypt)(JSON.stringify(permissions)), sessionId, req || { hostname: 'localhost' }, permissionToken, branchAccessArray);
        return {
            status: 200,
            jwt_token: tokens.accessToken,
            jwt_refresh_token: tokens.refreshToken,
            user_id: fetchUser.user_id,
            passwordSet: fetchUser.passwordSet,
            organization_schema_name: fetchUser.organization.organization_schema_name,
            organization_id: fetchUser.organization.organization_id,
            permissions: permissions,
            permissionToken: permissionToken,
            profile_image: result[0]?.profile_image || null,
            role_id: role_id,
            is_compulsary: is_compulsary,
            main_user_id: result[0]?.user_id,
            session_id: sessionId,
            message: 'Password reset successful!!',
        };
    }
    async validatePasswordResetLink(userId) {
        const loginUser = await this.userRepository.findOne({
            where: { user_id: userId, passwordReset: 'Y' },
        });
        console.log('loginUser', loginUser);
        return loginUser ? true : false;
    }
    async sendOtpForPasswordReset(email) {
        const genericSuccessResponse = {
            status: 200,
            message: 'If an account exists with this email address, a verification code has been sent.',
            data: null,
        };
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return genericSuccessResponse;
        }
        if (user.invite_status === 'EXPIRED') {
            return genericSuccessResponse;
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
        try {
            await this.userRepository.update(user.user_id, {
                otp,
                otp_expiry: otpExpiry,
            });
            const FORGOT_PASSWORD_EVENT_ID = 1;
            const contextData = {
                updatedUser: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    otp: otp,
                    otp_code: otp,
                    user_otp: otp,
                    redirection_link: '',
                },
            };
            const recipients = [];
            if (user?.business_email) {
                recipients.push({
                    recipient_type: 'user',
                    recipient_id: String(user.user_id),
                    recipient_email: user.business_email,
                    recipient_contact: user.phone_number,
                });
            }
            try {
                await this.notificationHelper.triggerEventNotification({
                    eventId: FORGOT_PASSWORD_EVENT_ID,
                    contextData,
                    recipients,
                    meta: {
                        trace_id: `FORGOT_PASSWORD_${user.user_id}`,
                    },
                });
            }
            catch (err) {
                console.error('Notification failed:', err.message);
            }
            return {
                status: 200,
                message: 'If an account exists with this email address, a verification code has been sent.',
                data: user.user_id,
            };
        }
        catch (error) {
            console.error('Failed to process OTP reset:', error);
            throw new common_1.HttpException('Failed to process password reset request.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyForgotPasswordOtp(verifyOtpDto, res) {
        const { otp, user_id } = verifyOtpDto;
        const user = await this.userRepository.findOne({
            where: { otp, user_id },
        });
        if (!user) {
            throw new common_1.BadRequestException({
                statusCode: 400,
                message: 'Invalid OTP or user not found.',
            });
        }
        if (new Date() > user.otp_expiry) {
            throw new common_1.HttpException({
                statusCode: 410,
                message: 'OTP has expired.',
            }, common_1.HttpStatus.GONE);
        }
        await this.userRepository.update(user.user_id, {
            otp: null,
            otp_expiry: null,
        });
        return {
            statusCode: 200,
            message: 'OTP has been verified.',
        };
    }
    async setSchema(schema) {
        const queryRunner = this.userRepository.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            await queryRunner.query(`SET search_path TO ${schema}, public`);
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to set schema: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(7, (0, typeorm_1.InjectRepository)(user_repository_1.UserRepository)),
    __param(9, (0, typeorm_1.InjectRepository)(sessions_entity_1.Session)),
    __param(10, (0, typeorm_1.InjectRepository)(register_user_login_entity_1.RegisterUserLogin)),
    __param(11, (0, typeorm_1.InjectRepository)(organizational_profile_entity_1.OrganizationalProfile)),
    __param(12, (0, typeorm_1.InjectRepository)(organizational_user_entity_1.User)),
    __param(13, (0, typeorm_1.InjectRepository)(casbin_rule_entity_1.CasbinRule)),
    __metadata("design:paramtypes", [token_service_1.TokenService,
        redis_service_1.RedisService,
        mail_config_service_1.MailConfigService,
        mail_service_1.MailService,
        organizational_profile_service_1.OrganizationService,
        asset_items_service_1.AssetItemsService,
        notifications_helper_1.NotificationHelper,
        user_repository_1.UserRepository,
        config_repository_1.ConfigRepository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        policy_builder_service_1.PolicyBuilderService])
], AuthService);
