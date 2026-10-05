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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sms_config_entity_1 = require("../../organizational-profile/public_schema_entity/sms-config.entity");
let SmsService = class SmsService {
    constructor(smsConfigRepo) {
        this.smsConfigRepo = smsConfigRepo;
    }
    async getActiveConfig() {
        const config = await this.smsConfigRepo.findOne({
            where: { is_active: true },
            order: { created_at: 'DESC' }
        });
        if (!config) {
            throw new common_1.InternalServerErrorException('SMS configuration not found');
        }
        return config;
    }
    async sendOtp(mobile, otp, name = 'User') {
        const config = await this.getActiveConfig();
        try {
            const text = `Dear ${name}, Your OTP for login is ${otp}. please do not share with anyone. _${config.sender_id}`;
            const url = `${config.base_url}?apikey=${config.api_key}` +
                `&type=${config.sms_type}` +
                `&text=${encodeURIComponent(text)}` +
                `&to=91${mobile}` +
                `&sender=${config.sender_id}`;
            const response = await axios_1.default.get(url);
            return { success: true, data: response.data };
        }
        catch (error) {
            console.error('SMS Error:', error.response?.data || error.message);
            throw new common_1.InternalServerErrorException('Failed to send SMS');
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sms_config_entity_1.SmsConfig)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SmsService);
