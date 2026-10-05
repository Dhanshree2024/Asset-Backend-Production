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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mail_config_service_1 = require("../common/mail/mail-config.service");
const mail_service_1 = require("../common/mail/mail.service");
const render_email_1 = require("../common/mail/render-email");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
const asset_limitation_entity_1 = require("../organizational-profile/public_schema_entity/asset-limitation.entity");
const register_organization_entity_1 = require("./entities/register-organization.entity");
const register_user_login_entity_1 = require("./entities/register-user-login.entity");
const OrganisationSchemaManager_1 = require("./utils/OrganisationSchemaManager");
let OrganizationService = class OrganizationService {
    constructor(dataSource, mailService, mailConfigService, httpService, notificationHelper, assetLimitRepo, registerUserLoginRepo) {
        this.dataSource = dataSource;
        this.mailService = mailService;
        this.mailConfigService = mailConfigService;
        this.httpService = httpService;
        this.notificationHelper = notificationHelper;
        this.assetLimitRepo = assetLimitRepo;
        this.registerUserLoginRepo = registerUserLoginRepo;
    }
    async createOrganization(createOrganizationDto, context) {
        const { companyName, firstName, lastName, businessEmail, phoneNumber, industryId, org_billing_id, } = createOrganizationDto;
        if (!companyName ||
            !firstName ||
            !lastName ||
            !businessEmail ||
            !industryId) {
            throw new common_1.BadRequestException({
                statusCode: 400,
                message: 'Validation failed: Missing required fields.',
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(businessEmail)) {
            throw new common_1.BadRequestException({
                statusCode: 400,
                message: 'Invalid email format.',
            });
        }
        const [localPart, domain] = businessEmail.trim().toLowerCase().split('@');
        const normalizedEmail = domain === 'gmail.com' || domain === 'googlemail.com'
            ? `${localPart.split('+')[0].replace(/\./g, '')}@${domain}`
            : `${localPart}@${domain}`;
        console.log('businessEmail, normalizedEmail', businessEmail, normalizedEmail);
        try {
            const existingUserGlobal = await this.dataSource
                .getRepository(register_user_login_entity_1.RegisterUserLogin)
                .findOne({
                where: { business_email: normalizedEmail },
                relations: ['organization'],
            });
            const existingOrg = await this.dataSource
                .getRepository(register_organization_entity_1.RegisterOrganization)
                .findOne({
                where: { organization_name: companyName },
                relations: ['users'],
            });
            if (phoneNumber) {
                const checkPhoneQuery = `
        SELECT user_id
        FROM public.register_user_login
        WHERE phone_number = $1;
      `;
                const phoneResult = await this.dataSource.query(checkPhoneQuery, [
                    phoneNumber,
                ]);
                if (phoneResult.length > 0) {
                    throw new common_1.BadRequestException({
                        statusCode: 400,
                        message: 'Phone number already exists. Please try logging in.',
                    });
                }
            }
            if (existingOrg &&
                existingUserGlobal &&
                existingUserGlobal.organization.organization_name === companyName) {
                if (!existingUserGlobal.verified) {
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    const otpExpiry = new Date(new Date().getTime() + 5 * 60 * 1000);
                    existingUserGlobal.otp = newOtp;
                    existingUserGlobal.otp_expiry = otpExpiry;
                    await this.dataSource
                        .getRepository(register_user_login_entity_1.RegisterUserLogin)
                        .save(existingUserGlobal);
                    return {
                        statusCode: 200,
                        message: 'OTP resent. Please check your email for verification.',
                        data: {
                            userId: existingUserGlobal.user_id,
                        },
                    };
                }
                else {
                    return {
                        statusCode: 200,
                        message: 'Email already verified. Please log in.',
                        data: {
                            redirectToLogin: true,
                            userId: existingUserGlobal.user_id,
                        },
                    };
                }
            }
            if (!existingOrg && existingUserGlobal) {
                if (existingUserGlobal.verified) {
                    throw new common_1.BadRequestException({
                        statusCode: 400,
                        message: 'You already started registration with this email. Your details were updated and a new OTP has been sent to continue verification.',
                    });
                }
                else {
                    existingUserGlobal.first_name = firstName;
                    existingUserGlobal.last_name = lastName;
                    existingUserGlobal.phone_number = phoneNumber;
                    existingUserGlobal.org_billing_id = org_billing_id;
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    const otpExpiry = new Date(new Date().getTime() + 5 * 60 * 1000);
                    existingUserGlobal.otp = newOtp;
                    existingUserGlobal.otp_expiry = otpExpiry;
                    await this.dataSource
                        .getRepository(register_user_login_entity_1.RegisterUserLogin)
                        .save(existingUserGlobal);
                    return {
                        statusCode: 200,
                        message: 'Email exists but not yet verified. User details updated. OTP resent for verification.',
                        data: {
                            userId: existingUserGlobal.user_id,
                        },
                    };
                }
            }
            if (existingOrg && !existingUserGlobal) {
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpiry = new Date(new Date().getTime() + 5 * 60 * 1000);
                const newUser = this.dataSource
                    .getRepository(register_user_login_entity_1.RegisterUserLogin)
                    .create({
                    organization: existingOrg,
                    first_name: firstName,
                    last_name: lastName,
                    business_email: normalizedEmail,
                    ...(phoneNumber && { phone_number: phoneNumber }),
                    otp,
                    otp_expiry: otpExpiry,
                    is_primary_user: 'Y',
                    passwordReset: 'Y',
                    org_billing_id,
                });
                const savedUser = await this.dataSource
                    .getRepository(register_user_login_entity_1.RegisterUserLogin)
                    .save(newUser);
                return {
                    statusCode: 200,
                    message: 'User added under existing organization. Verify the OTP sent to the email.',
                    data: {
                        schema: existingOrg.organization_schema_name,
                        userId: savedUser.user_id,
                    },
                };
            }
            if (!existingOrg && !existingUserGlobal) {
                const schemaName = companyName
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9]+/g, '_')
                    .replace(/^_+|_+$/g, '');
                const organization = this.dataSource
                    .getRepository(register_organization_entity_1.RegisterOrganization)
                    .create({
                    organization_name: companyName,
                    organization_schema_name: schemaName,
                    industry_type_id: industryId,
                });
                const savedOrg = await this.dataSource
                    .getRepository(register_organization_entity_1.RegisterOrganization)
                    .save(organization);
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpiry = new Date(new Date().getTime() + 5 * 60 * 1000);
                const user = this.dataSource.getRepository(register_user_login_entity_1.RegisterUserLogin).create({
                    organization: savedOrg,
                    first_name: firstName,
                    last_name: lastName,
                    business_email: normalizedEmail,
                    phone_number: phoneNumber,
                    otp,
                    otp_expiry: otpExpiry,
                    is_primary_user: 'Y',
                    passwordReset: 'Y',
                    org_billing_id,
                });
                const savedUser = await this.dataSource
                    .getRepository(register_user_login_entity_1.RegisterUserLogin)
                    .save(user);
                return {
                    statusCode: 200,
                    message: 'Organization created successfully. Verify the OTP sent to the email.',
                    data: {
                        schema: schemaName,
                        userId: savedUser.user_id,
                    },
                };
            }
            throw new common_1.BadRequestException({
                statusCode: 400,
                message: 'Unexpected registration condition encountered.',
            });
        }
        catch (error) {
            console.error('Error creating organization:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                statusCode: 500,
                message: 'Internal server error.',
                details: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resendOtp(resendOtpDto, context) {
        try {
            const { userId, required_for } = resendOtpDto;
            if (!userId) {
                throw new common_1.BadRequestException({
                    statusCode: 400,
                    message: 'User ID is required.',
                });
            }
            const userRepo = this.dataSource.getRepository(register_user_login_entity_1.RegisterUserLogin);
            const user = await userRepo.findOne({ where: { user_id: userId } });
            if (!user) {
                throw new common_1.NotFoundException({
                    statusCode: 404,
                    message: 'User not found.',
                });
            }
            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date();
            otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);
            user.otp = newOtp;
            user.otp_expiry = otpExpiry;
            try {
                await userRepo.save(user);
            }
            catch (error) {
                throw new common_1.InternalServerErrorException({
                    statusCode: 500,
                    message: 'Failed to update OTP in database.',
                    error: error.message,
                });
            }
            const fullname = `${user.first_name} ${user.last_name}`;
            const emailSubject = required_for === 'Password Reset'
                ? 'OTP for Reset Password'
                : required_for === '2Auth OTP Resend'
                    ? 'OTP for Login Verification'
                    : 'OTP for NORBIK Account Verification';
            const emailTemplate = required_for === 'Password Reset'
                ? render_email_1.EmailTemplate.PASSWORD_RESET
                : required_for === '2Auth OTP Resend'
                    ? render_email_1.EmailTemplate.AUTH_LOGIN_VERIFICATION
                    : render_email_1.EmailTemplate.LOGIN_VERIFICATION;
            try {
                await this.mailService.sendEmail(user.business_email, emailSubject, await (0, render_email_1.renderEmail)(emailTemplate, { name: fullname, otp: newOtp }, this.mailConfigService));
            }
            catch (error) {
                throw new common_1.InternalServerErrorException({
                    statusCode: 500,
                    message: 'Failed to send OTP email.',
                    error: error.message,
                });
            }
            return {
                status: 200,
                message: 'New OTP sent successfully.',
            };
        }
        catch (error) {
            throw error instanceof common_1.HttpException
                ? error
                : new common_1.InternalServerErrorException({
                    statusCode: 500,
                    message: 'An unexpected error occurred.',
                    error: error.message,
                });
        }
    }
    async verifyOtp(userId) {
        const userRepo = this.dataSource.getRepository(register_user_login_entity_1.RegisterUserLogin);
        const user = await userRepo.findOne({
            where: { user_id: userId, verified: false },
            relations: ['organization'],
        });
        if (!user) {
            throw new common_1.BadRequestException({
                statusCode: 400,
                message: 'No user found or already verified!',
                details: { userId },
            });
        }
        console.log('Verifying OTP for user:', user.business_email);
        const schemaManager = new OrganisationSchemaManager_1.OrganizationSchemaManager(this.dataSource, this.mailConfigService, this.mailService, this.httpService, this.notificationHelper);
        await schemaManager.createOrganizationSchemaAndTables(user);
        return {
            statusCode: 200,
            message: 'Your account setup is complete. Please check your email for login credentials and proceed to sign in.',
        };
    }
    async createCustomerOrganization(createOrganizationDto, context) {
        const { companyName, firstName, lastName, businessEmail, phoneNumber, industryId, org_billing_id } = createOrganizationDto;
        console.log('createOrganizationDto', createOrganizationDto);
        if (!companyName ||
            !firstName ||
            !lastName ||
            !businessEmail ||
            !phoneNumber ||
            !industryId) {
            throw new common_1.BadRequestException({
                statusCode: 400,
                message: 'Validation failed: Missing required fields.',
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(businessEmail)) {
            throw new common_1.BadRequestException({
                statusCode: 400,
                message: 'Invalid email format.',
            });
        }
        const [localPart, domain] = businessEmail.trim().toLowerCase().split('@');
        const normalizedEmail = domain === 'gmail.com' || domain === 'googlemail.com'
            ? `${localPart.split('+')[0].replace(/\./g, '')}@${domain}`
            : `${localPart}@${domain}`;
        console.log('businessEmail, normalizedEmail', businessEmail, normalizedEmail);
        try {
            const existingUserGlobal = await this.dataSource
                .getRepository(register_user_login_entity_1.RegisterUserLogin)
                .findOne({
                where: { business_email: normalizedEmail },
                relations: ['organization'],
            });
            const existingOrg = await this.dataSource
                .getRepository(register_organization_entity_1.RegisterOrganization)
                .findOne({
                where: { organization_name: companyName },
                relations: ['users'],
            });
            console.log('existingUserGlobal,existingOrg', existingUserGlobal, existingOrg);
            if (existingOrg &&
                existingUserGlobal &&
                existingUserGlobal.organization.organization_name === companyName) {
                if (!existingUserGlobal.verified) {
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    const otpExpiry = new Date(new Date().getTime() + 5 * 60 * 1000);
                    existingUserGlobal.otp = newOtp;
                    existingUserGlobal.otp_expiry = otpExpiry;
                    existingUserGlobal.org_billing_id = org_billing_id;
                    await this.dataSource
                        .getRepository(register_user_login_entity_1.RegisterUserLogin)
                        .save(existingUserGlobal);
                    return {
                        statusCode: 200,
                        message: 'OTP resent. Please check your email for verification.',
                        data: {
                            userId: existingUserGlobal.user_id,
                        },
                    };
                }
                else {
                    return {
                        statusCode: 200,
                        message: 'Email already verified. Please log in.',
                        data: {
                            redirectToLogin: true,
                            userId: existingUserGlobal.user_id,
                        },
                    };
                }
            }
            if (!existingOrg && existingUserGlobal) {
                if (existingUserGlobal.verified) {
                    throw new common_1.BadRequestException({
                        statusCode: 400,
                        message: 'You already started registration with this email. Your details were updated and a new OTP has been sent to continue verification.',
                    });
                }
                else {
                    existingUserGlobal.first_name = firstName;
                    existingUserGlobal.last_name = lastName;
                    existingUserGlobal.phone_number = phoneNumber;
                    existingUserGlobal.org_billing_id = org_billing_id;
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    const otpExpiry = new Date(new Date().getTime() + 5 * 60 * 1000);
                    existingUserGlobal.otp = newOtp;
                    existingUserGlobal.otp_expiry = otpExpiry;
                    await this.dataSource
                        .getRepository(register_user_login_entity_1.RegisterUserLogin)
                        .save(existingUserGlobal);
                    return {
                        statusCode: 200,
                        message: 'Email exists but not yet verified. User details updated. OTP resent for verification.',
                        data: {
                            userId: existingUserGlobal.user_id,
                        },
                    };
                }
            }
            if (existingOrg && !existingUserGlobal) {
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpiry = new Date(new Date().getTime() + 5 * 60 * 1000);
                const newUser = this.dataSource
                    .getRepository(register_user_login_entity_1.RegisterUserLogin)
                    .create({
                    organization: existingOrg,
                    first_name: firstName,
                    last_name: lastName,
                    business_email: normalizedEmail,
                    phone_number: phoneNumber,
                    otp,
                    otp_expiry: otpExpiry,
                    is_primary_user: 'Y',
                    passwordReset: 'Y',
                    org_billing_id,
                });
                const savedUser = await this.dataSource
                    .getRepository(register_user_login_entity_1.RegisterUserLogin)
                    .save(newUser);
                return {
                    statusCode: 200,
                    message: 'User added under existing organization. Verify the OTP sent to the email.',
                    data: {
                        schema: existingOrg.organization_schema_name,
                        userId: savedUser.user_id,
                    },
                };
            }
            if (!existingOrg && !existingUserGlobal) {
                const schemaName = companyName.toLowerCase().replace(/\s+/g, '_');
                const organization = this.dataSource
                    .getRepository(register_organization_entity_1.RegisterOrganization)
                    .create({
                    organization_name: companyName,
                    organization_schema_name: schemaName,
                    industry_type_id: industryId,
                });
                const savedOrg = await this.dataSource
                    .getRepository(register_organization_entity_1.RegisterOrganization)
                    .save(organization);
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpiry = new Date(new Date().getTime() + 5 * 60 * 1000);
                const user = this.dataSource.getRepository(register_user_login_entity_1.RegisterUserLogin).create({
                    organization: savedOrg,
                    organization_id: savedOrg.organization_id,
                    first_name: firstName,
                    last_name: lastName,
                    business_email: normalizedEmail,
                    phone_number: phoneNumber,
                    otp,
                    otp_expiry: otpExpiry,
                    is_primary_user: 'Y',
                    passwordReset: 'Y',
                    org_billing_id,
                    username: normalizedEmail,
                    is_active: 1,
                    is_deleted: 0,
                });
                const savedUser = await this.dataSource
                    .getRepository(register_user_login_entity_1.RegisterUserLogin)
                    .save(user);
                const schemaManager = new OrganisationSchemaManager_1.OrganizationSchemaManager(this.dataSource, this.mailConfigService, this.mailService, this.httpService, this.notificationHelper);
                await schemaManager.createOrganizationSchemaAndTables(user);
                return {
                    statusCode: 200,
                    message: 'Organization created successfully. Verify the OTP sent to the email.',
                    data: {
                        schema: schemaName,
                        userId: savedUser.user_id,
                    },
                };
            }
            throw new common_1.BadRequestException({
                statusCode: 400,
                message: 'Unexpected registration condition encountered.',
            });
        }
        catch (error) {
            console.error('Error creating organization:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                statusCode: 500,
                message: 'Internal server error.',
                details: error.message,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async storeOrgLimitationsInAssetDB(orgId, billingOrgId, limitations) {
        try {
            console.log("🧠 Service HIT");
            console.log(`👉 orgId: ${orgId}, billingOrgId: ${billingOrgId}`);
            const repo = this.dataSource.getRepository(asset_limitation_entity_1.AssetLimitation);
            await repo.delete({ orgId });
            const formatted = limitations.map((l) => ({
                orgId,
                billingOrgId,
                planId: l.plan_id ?? null,
                featureId: l.feature_id,
                mappingId: l.mapping_id ?? null,
                overrideValue: l.override_value ?? null,
                defaultValue: l.default_value ?? null,
                isActive: true,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                currentUsage: l.feature_id === 3 ? '1' : '0',
            }));
            await repo.save(formatted);
            console.log(`✅ Stored ${formatted.length} limitations for org_id ${orgId}`);
        }
        catch (error) {
            console.error('❌ Failed to store limitations:', error);
            throw error;
        }
    }
    async getByBillingOrgId(billingOrgId) {
        const user = await this.registerUserLoginRepo.findOne({
            where: {
                org_billing_id: billingOrgId,
                is_deleted: 0,
            },
            relations: ['organization'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`No organization found for billingOrgId ${billingOrgId}`);
        }
        const orgId = user.organization_id;
        const limitations = await this.assetLimitRepo.find({
            where: {
                orgId: orgId,
                isDeleted: false,
            },
        });
        return {
            billingOrgId,
            orgId,
            limitations,
        };
    }
    async updateAssetLimitations(billingOrgId, limitations) {
        const updated = [];
        for (const limit of limitations) {
            let existing = await this.assetLimitRepo.findOne({
                where: {
                    billingOrgId,
                    planId: limit.plan_id,
                    featureId: limit.feature_id,
                    isDeleted: false,
                },
            });
            if (!existing) {
                const newLimitation = this.assetLimitRepo.create({
                    billingOrgId,
                    planId: limit.plan_id,
                    featureId: limit.feature_id,
                    mappingId: limit.mapping_id ?? null,
                    overrideValue: limit.override_value,
                    defaultValue: limit.default_value ?? null,
                    isActive: limit.is_active ?? true,
                    isDeleted: limit.is_deleted ?? false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                const saved = await this.assetLimitRepo.save(newLimitation);
                updated.push(saved);
            }
            else {
                existing.overrideValue = limit.override_value;
                existing.defaultValue = limit.default_value ?? existing.defaultValue;
                existing.isActive = limit.is_active ?? existing.isActive;
                existing.isDeleted = limit.is_deleted ?? existing.isDeleted;
                existing.updatedAt = new Date();
                const saved = await this.assetLimitRepo.save(existing);
                updated.push(saved);
            }
        }
        return updated;
    }
    async getRestrictionByFeatureId(orgId, featureId) {
        try {
            const repo = this.assetLimitRepo;
            const restriction = await repo.findOne({
                where: {
                    orgId,
                    featureId,
                    isDeleted: false,
                    isActive: true,
                },
            });
            return restriction;
        }
        catch (error) {
            console.error('❌ Error in getRestrictionByFeatureId:', error);
            throw new Error('Failed to fetch restriction by feature');
        }
    }
    async updateUsageCount(orgId, featureId, currentValue) {
        const existing = await this.assetLimitRepo.findOne({
            where: { orgId, featureId, isDeleted: false },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Limitation not found for orgId ${orgId} and featureId ${featureId}`);
        }
        let newUsageValue = 0;
        const oldUsage = Number(existing.currentUsage) || 0;
        if (currentValue.startsWith('increment')) {
            const parts = currentValue.split(':');
            const incrementBy = parts[1] ? parseInt(parts[1], 10) || 1 : 1;
            newUsageValue = oldUsage + incrementBy;
        }
        else if (currentValue.startsWith('decrement')) {
            const parts = currentValue.split(':');
            const decrementBy = parts[1] ? parseInt(parts[1], 10) || 1 : 1;
            newUsageValue = Math.max(0, oldUsage - decrementBy);
        }
        else if (!isNaN(Number(currentValue))) {
            newUsageValue = Number(currentValue);
        }
        else {
            newUsageValue = currentValue;
        }
        existing.currentUsage = String(newUsageValue);
        existing.updatedAt = new Date();
        const saved = await this.assetLimitRepo.save(existing);
        return {
            orgId,
            featureId,
            currentUsage: saved.currentUsage,
            updatedAt: saved.updatedAt,
            billingOrgId: saved.billingOrgId,
        };
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __param(5, (0, typeorm_1.InjectRepository)(asset_limitation_entity_1.AssetLimitation)),
    __param(6, (0, typeorm_1.InjectRepository)(register_user_login_entity_1.RegisterUserLogin)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        mail_service_1.MailService,
        mail_config_service_1.MailConfigService,
        axios_1.HttpService,
        notifications_helper_1.NotificationHelper,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrganizationService);
