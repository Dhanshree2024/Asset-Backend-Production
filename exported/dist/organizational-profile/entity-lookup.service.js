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
exports.EntityLookupService = void 0;
const common_1 = require("@nestjs/common");
const organizational_user_entity_1 = require("./entity/organizational-user.entity");
const department_entity_1 = require("./entity/department.entity");
const branches_entity_1 = require("./entity/branches.entity");
const typeorm_1 = require("@nestjs/typeorm");
const locations_entity_1 = require("./entity/locations.entity");
const asset_mapping_entity_1 = require("../asset-mapping/entities/asset-mapping.entity");
const assets_project_entity_1 = require("../assets-data/assets-projects/entities/assets-project.entity");
const typeorm_2 = require("typeorm");
let EntityLookupService = class EntityLookupService {
    constructor(userRepository, assetsProjectRepository, branchRepository, departmentRepository, locationRepository, assetMappingRepository) {
        this.userRepository = userRepository;
        this.assetsProjectRepository = assetsProjectRepository;
        this.branchRepository = branchRepository;
        this.departmentRepository = departmentRepository;
        this.locationRepository = locationRepository;
        this.assetMappingRepository = assetMappingRepository;
    }
    async getBranch(id) {
        const b = await this.branchRepository.findOne({ where: { branch_id: id } });
        return b ? { id: b.branch_id, name: b.branch_name } : null;
    }
    async getLocation(id) {
        const l = await this.locationRepository.findOne({ where: { location_id: id } });
        return l ? { id: l.location_id, name: l.location_name } : null;
    }
    async getProject(id) {
        const p = await this.assetsProjectRepository.findOne({ where: { project_id: id } });
        return p ? { id: p.project_id, name: p.project_name } : null;
    }
    async getUser(id) {
        const u = await this.userRepository.findOne({ where: { user_id: id } });
        return u ? { id: u.user_id, name: `${u.first_name} ${u.last_name}` } : null;
    }
    async getDepartment(id) {
        const d = await this.departmentRepository.findOne({ where: { department_id: id } });
        return d ? { id: d.department_id, name: d.department_name } : null;
    }
    async checkLocationHaveAssignedAsset(locationId) {
        const count = await this.assetMappingRepository.count({
            where: {
                is_deleted: 0,
                is_active: 1,
            },
        });
        return count > 0;
    }
    async checkProjectHaveAssignedAsset(projectId) {
        const count = await this.assetMappingRepository.count({
            where: {
                is_deleted: 0,
                is_active: 1,
            },
        });
        return count > 0;
    }
    async checkItemHaveAssignedAsset(itemId) {
        const count = await this.assetMappingRepository
            .createQueryBuilder('mapping')
            .innerJoin('mapping.asset', 'asset')
            .where('asset.asset_item_id = :itemId', { itemId })
            .andWhere('mapping.is_deleted = 0')
            .andWhere('mapping.is_active = 1')
            .getCount();
        return count > 0;
    }
};
exports.EntityLookupService = EntityLookupService;
exports.EntityLookupService = EntityLookupService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(organizational_user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(assets_project_entity_1.AssetsProject)),
    __param(2, (0, typeorm_1.InjectRepository)(branches_entity_1.Branch)),
    __param(3, (0, typeorm_1.InjectRepository)(department_entity_1.Department)),
    __param(4, (0, typeorm_1.InjectRepository)(locations_entity_1.Locations)),
    __param(5, (0, typeorm_1.InjectRepository)(asset_mapping_entity_1.AssetMappingRepository)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EntityLookupService);
