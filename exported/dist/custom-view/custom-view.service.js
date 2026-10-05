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
exports.CustomViewService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const custom_view_entity_1 = require("./entity/custom-view.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
let CustomViewService = class CustomViewService {
    constructor(customViewRepo, dataSource) {
        this.customViewRepo = customViewRepo;
        this.dataSource = dataSource;
    }
    async getUserByPublicID(public_user_id) {
        const userExists = await this.dataSource
            .getRepository(organizational_user_entity_1.User)
            .findOne({ where: { register_user_login_id: public_user_id } });
        console.log('public user id in asset', public_user_id);
        if (!userExists) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.BAD_REQUEST, message: 'Invalid user ID' }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            return userExists.user_id;
        }
    }
    async createCustomView(dto, user_id, organization_id) {
        try {
            const now = new Date();
            const normalizedViewName = dto.view_name.trim().toLowerCase();
            const existingView = await this.customViewRepo
                .createQueryBuilder('cv')
                .where('LOWER(TRIM(cv.view_name)) = :view_name', {
                view_name: normalizedViewName,
            })
                .andWhere('cv.user_id = :user_id', { user_id })
                .andWhere('cv.organization_id = :organization_id', {
                organization_id,
            })
                .getOne();
            if (existingView) {
                return {
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Custom view name already exists.',
                };
            }
            const newView = this.customViewRepo.create({
                view_name: dto.view_name.trim(),
                config: dto.config,
                user_id,
                organization_id,
                createdAt: now,
                updatedAt: now,
            });
            await this.customViewRepo.save(newView);
            return {
                status: common_1.HttpStatus.CREATED,
                message: 'Custom view created successfully.',
                data: newView,
            };
        }
        catch (error) {
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to create custom view.',
                error,
            };
        }
    }
    async deleteCustomView(id) {
        const view = await this.customViewRepo.findOne({ where: { custom_view_id: id } });
        if (!view)
            throw new common_1.NotFoundException('Custom View not found');
        view.is_active = false;
        view.is_deleted = true;
        view.updatedAt = new Date();
        await this.customViewRepo.save(view);
        return { message: 'Custom view deleted successfully' };
    }
    async getCustomViews(user_id, organization_id) {
        try {
            const views = await this.customViewRepo.find({
                where: { user_id, organization_id },
                order: { createdAt: 'DESC' },
                select: ['custom_view_id', 'view_name'],
            });
            return views;
        }
        catch (err) {
            console.error('Error fetching custom views:', err);
            throw err;
        }
    }
    async getCustomViewsByUser(user_id, organization_id) {
        try {
            const views = await this.customViewRepo.find({
                where: { user_id,
                    organization_id,
                    is_active: true
                },
                order: { createdAt: 'DESC' },
            });
            return views;
        }
        catch (error) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to fetch views', error }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CustomViewService = CustomViewService;
exports.CustomViewService = CustomViewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(custom_view_entity_1.CustomView)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], CustomViewService);
