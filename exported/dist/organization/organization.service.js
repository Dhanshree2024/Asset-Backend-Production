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
exports.OrganizationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const nodemailer = __importStar(require("nodemailer"));
const register_user_login_entity_1 = require("./entities/register-user-login.entity");
const users_1 = require("./onboarding_sql_scripts/users");
const organization_profile_1 = require("./onboarding_sql_scripts/organization_profile");
let OrganizationService = class OrganizationService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async resendOtp(resendOtpDto, context) {
        const { userId } = resendOtpDto;
        const userRepo = this.dataSource.getRepository(register_user_login_entity_1.RegisterUserLogin);
        const user = await userRepo.findOne({
            where: { user_id: userId, verified: false },
        });
        if (!user) {
            throw new common_1.BadRequestException({
                statusCode: 400,
                message: 'User not found or already verified.',
            });
        }
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);
        user.otp = newOtp;
        user.otp_expiry = otpExpiry;
        await userRepo.save(user);
        await this.sendVerificationEmail(user.business_email, newOtp);
        return {
            statusCode: 201,
            message: 'New OTP sent successfully.',
        };
    }
    async verifyOtp(verifyOtpDto, context) {
        const { otp } = verifyOtpDto;
        const userRepo = this.dataSource.getRepository(register_user_login_entity_1.RegisterUserLogin);
        const user = await userRepo.findOne({
            where: { otp, verified: false },
            relations: ['organization'],
        });
        if (!user) {
            throw new common_1.BadRequestException({
                statusCode: 400,
                message: 'Invalid OTP or user not found.',
                details: { otp },
            });
        }
        if (new Date() > user.otp_expiry) {
            throw new common_1.HttpException({
                statusCode: 410,
                message: 'OTP has expired.',
                details: { otp, expiryTime: user.otp_expiry },
            }, common_1.HttpStatus.GONE);
        }
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await this.hashPassword(randomPassword);
        user.verified = true;
        user.otp = null;
        user.otp_expiry = null;
        user.password = hashedPassword;
        await userRepo.save(user);
        const schemaName = `org_${user.organization.organization_schema_name}`;
        await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);
        const script = new users_1.UserScript(this.dataSource);
        script.createUserTable(schemaName);
        const hashedPassword1 = await script.insertUserTable(schemaName, user);
        const script1 = new organization_profile_1.OrganizationProfileScript(this.dataSource);
        script1.createOrganizationProfileTable(schemaName);
        script1.insertOrganizationProfileTable(schemaName, user);
        await this.sendOnboardingEmail(user.business_email, hashedPassword1);
        return {
            statusCode: 200,
            message: 'OTP verified, password updated, schema created, and onboarding email sent.',
        };
    }
    generateRandomPassword(length = 10) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        return password;
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    async sendVerificationEmail(email, otp) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your account',
            text: `Your OTP for verification is ${otp}. This OTP is valid for 15 minutes.`,
        };
        await transporter.sendMail(mailOptions);
    }
    async sendOnboardingEmail(email, password) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome and Thank You for Onboarding',
            text: `
          Welcome to our platform!
  
          Your account has been successfully created. 
          Here are your login details:
  
          Email: ${email}
          Password: ${password}
  
          Please use these credentials to log in.
  
          If you have any questions, feel free to contact us.
        `,
        };
        await transporter.sendMail(mailOptions);
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], OrganizationService);
