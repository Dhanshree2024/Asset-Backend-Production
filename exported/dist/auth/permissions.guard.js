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
var PermissionsGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cookie_1 = require("cookie");
const fs = __importStar(require("fs"));
const jose_1 = require("jose");
const path = __importStar(require("path"));
const permissions_decorator_1 = require("./permissions.decorator");
let PermissionsGuard = PermissionsGuard_1 = class PermissionsGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    static getPublicKey() {
        if (!PermissionsGuard_1.publicKey) {
            PermissionsGuard_1.publicKey = (async () => {
                const pem = fs.readFileSync(path.resolve(process.cwd(), process.env.JWT_PUBLIC_KEY || './keys/public.pem'), 'utf8');
                return (0, jose_1.importSPKI)(pem, 'RS256');
            })();
        }
        return PermissionsGuard_1.publicKey;
    }
    static norm(v) {
        return (v || '').toString().trim().toLowerCase();
    }
    static evaluate(modules, req) {
        const N = PermissionsGuard_1.norm;
        const mod = (modules || []).find((m) => N(m?.name) === N(req.module));
        if (!mod)
            return false;
        const subs = Array.isArray(mod.submodules) ? mod.submodules : [];
        if (!subs.length)
            return false;
        const sub = subs.find((s) => N(s?.name) === N(req.submodule));
        if (!sub)
            return false;
        if (req.kind === 'action') {
            return (sub.actions || []).some((a) => N(a?.code) === N(req.action) && a?.isAllowed === true);
        }
        return (sub.attrs || []).some((a) => N(a?.key) === N(req.attrKey) && a?.isSelected === true);
    }
    async canActivate(context) {
        const requirement = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSION_META, [context.getHandler(), context.getClass()]);
        if (!requirement)
            return true;
        const enforce = false;
        const request = context.switchToHttp().getRequest();
        const cookies = (0, cookie_1.parse)(request.headers?.cookie || '');
        const route = `${request.method} ${request.url}`;
        const deny = (reason, detail) => {
            const line = `[PermissionsGuard] ${enforce ? 'DENY' : 'DENY(log-only)'} ` +
                `${route} :: ${JSON.stringify(requirement)} :: ${reason}` +
                (detail ? `\n    ${detail}` : '');
            console.warn(line);
            if (!enforce)
                return true;
            throw new common_1.ForbiddenException('You do not have permission to perform this action');
        };
        const token = cookies.permissionToken;
        if (!token || token === 'null' || token === 'undefined') {
            return deny('permissionToken cookie missing or null', 'cookies present: ' + JSON.stringify(Object.keys(cookies)) +
                ' — if the user logged in via 2FA/OTP, re-login after deploying the ' +
                'verifyLoginOtp mint fix');
        }
        let payload;
        try {
            const key = await PermissionsGuard_1.getPublicKey();
            ({ payload } = await (0, jose_1.jwtVerify)(token, key, { algorithms: ['RS256'] }));
        }
        catch (err) {
            const line = `[PermissionsGuard] token invalid on ${route}: ${err?.message}`;
            console.warn(line);
            if (!enforce)
                return true;
            throw new common_1.UnauthorizedException('Permission token invalid or expired');
        }
        const claims = payload?.permPayload ?? payload;
        const sessionId = cookies.session_id;
        if (sessionId && claims?.sessionId && claims.sessionId !== sessionId) {
            return deny('permissionToken does not match the current session', `token.sessionId=${claims.sessionId} cookie.session_id=${sessionId}`);
        }
        const modules = claims?.permissions?.modules ?? claims?.permissions ?? [];
        const list = Array.isArray(modules) ? modules : [];
        const allowed = PermissionsGuard_1.evaluate(list, requirement);
        if (!allowed) {
            const N = PermissionsGuard_1.norm;
            const mod = list.find((m) => N(m?.name) === N(requirement.module));
            let detail;
            if (!list.length) {
                detail = 'token carries NO modules at all (permissions claim empty)';
            }
            else if (!mod) {
                detail =
                    `module "${requirement.module}" not in token. Available: ` +
                        JSON.stringify(list.map((m) => m?.name));
            }
            else {
                const subs = Array.isArray(mod.submodules) ? mod.submodules : [];
                const sub = subs.find((x) => N(x?.name) === N(requirement.submodule));
                if (!subs.length) {
                    detail = `module "${mod.name}" has ZERO submodules (see A4 in the fix plan)`;
                }
                else if (!sub) {
                    detail =
                        `submodule "${requirement.submodule}" not under "${mod.name}". Available: ` +
                            JSON.stringify(subs.map((x) => x?.name));
                }
                else if (requirement.kind === 'action') {
                    detail =
                        `actions on "${mod.name} / ${sub.name}": ` +
                            JSON.stringify((sub.actions || []).map((a) => `${a?.code}=${a?.isAllowed}`));
                }
                else {
                    detail =
                        `attrs on "${mod.name} / ${sub.name}": ` +
                            JSON.stringify((sub.attrs || []).map((a) => `${a?.key}=${a?.isSelected}`));
                }
            }
            return deny('permission not granted to this role', detail);
        }
        return true;
    }
};
exports.PermissionsGuard = PermissionsGuard;
PermissionsGuard.publicKey = null;
exports.PermissionsGuard = PermissionsGuard = PermissionsGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], PermissionsGuard);
