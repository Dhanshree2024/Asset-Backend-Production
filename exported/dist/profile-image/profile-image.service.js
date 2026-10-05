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
exports.ProfileImageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const organizational_profile_entity_1 = require("../organizational-profile/entity/organizational-profile.entity");
const DEFAULT_PROFILE_IMAGE = '/uploads/default-placeholder.png';
let ProfileImageService = class ProfileImageService {
    getUserImagePath(arg0) {
        throw new Error('Method not implemented.');
    }
    getOrgLogoPath(orgId) {
        throw new Error('Method not implemented.');
    }
    constructor(userRepository, orgRepo) {
        this.userRepository = userRepository;
        this.orgRepo = orgRepo;
    }
    async saveUserImage(userId, imagePath) {
        const user = await this.userRepository.findOne({
            where: { user_id: userId },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.profile_image = imagePath;
        await this.userRepository.save(user);
        return user;
    }
    async resetUserImage(userId) {
        const user = await this.userRepository.findOne({ where: { user_id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.profile_image = DEFAULT_PROFILE_IMAGE;
        await this.userRepository.save(user);
        return user;
    }
    async saveCompanyImage(orgId, imagePath) {
        const org = await this.orgRepo.findOne({
            where: { organization_profile_id: orgId },
        });
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        org.org_profile_image_address = imagePath;
        await this.orgRepo.save(org);
        return org;
    }
    async resetCompanyImage(orgId) {
        const org = await this.orgRepo.findOne({
            where: { organization_profile_id: orgId },
        });
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        org.org_profile_image_address = DEFAULT_PROFILE_IMAGE;
        await this.orgRepo.save(org);
        return org;
    }
};
exports.ProfileImageService = ProfileImageService;
exports.ProfileImageService = ProfileImageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(organizational_user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(organizational_profile_entity_1.OrganizationalProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProfileImageService);
