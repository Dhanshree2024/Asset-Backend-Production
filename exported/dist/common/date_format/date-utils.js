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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateFormatService = void 0;
const common_1 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
const organizational_profile_entity_1 = require("../../organizational-profile/entity/organizational-profile.entity");
const typeorm_1 = require("typeorm");
const ms_1 = __importDefault(require("ms"));
let DateFormatService = class DateFormatService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async formatDateDynamic(date) {
        if (!date) {
            throw new Error('Date is null or undefined');
        }
        const organizationProfile = await this.dataSource.getRepository(organizational_profile_entity_1.OrganizationalProfile)
            .createQueryBuilder('organizational_profile')
            .getOne();
        console.log('ssssssssss', organizationProfile?.dateformat);
        if (!organizationProfile) {
            throw new Error('Organization profile not found.');
        }
        const dateformat = organizationProfile.dateformat || 'dd/MM/yyyy';
        const parsedDate = typeof date === 'string' ? new Date(date) : date;
        console.log(parsedDate);
        if (isNaN(parsedDate.getTime())) {
            throw new Error('Invalid date provided');
        }
        console.log(dateformat);
        console.log(parsedDate);
        return (0, date_fns_1.format)(parsedDate, dateformat);
    }
    async convertToPgInterval(input) {
        if (!input)
            return '00:00:00';
        const durationMs = (0, ms_1.default)(input);
        const totalSeconds = Math.floor(durationMs / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    formatPgInterval(pgInterval) {
        if (!pgInterval)
            return { hours: 0, minutes: 0 };
        if (typeof pgInterval === 'string') {
            const [hours, minutes] = pgInterval.split(':').map(Number);
            return { hours, minutes };
        }
        const hours = pgInterval.hours || 0;
        const minutes = pgInterval.minutes || 0;
        return { hours, minutes };
    }
    formatIntervalToText(interval) {
        const { hours, minutes } = this.formatPgInterval(interval);
        const parts = [];
        if (hours > 0)
            parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
        if (minutes > 0)
            parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
        return parts.length ? parts.join(' ') : '0 mins';
    }
    formatTimeString(time) {
        if (!time)
            return '-';
        const date = new Date(time);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    }
    calculateNetWorkingHours(startTime, endTime) {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const durationMs = end - start;
        const totalMinutes = Math.floor(durationMs / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return {
            totalWorkingMinutes: totalMinutes,
            totalWorkingTime: [
                hours ? `${hours} hr${hours > 1 ? 's' : ''}` : '',
                minutes ? `${minutes} min${minutes > 1 ? 's' : ''}` : '',
            ]
                .filter(Boolean)
                .join(' ') || '0 mins',
        };
    }
    convertPgIntervalToMilliseconds(interval) {
        const hours = interval?.hours || 0;
        const minutes = interval?.minutes || 0;
        const seconds = interval?.seconds || 0;
        return (hours * 3600 + minutes * 60 + seconds) * 1000;
    }
};
exports.DateFormatService = DateFormatService;
exports.DateFormatService = DateFormatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DateFormatService);
