import { User } from './entity/organizational-user.entity';
import { Department } from './entity/department.entity';
import { Branch } from './entity/branches.entity';
import { Locations } from './entity/locations.entity';
import { AssetMappingRepository } from 'src/asset-mapping/entities/asset-mapping.entity';
import { AssetsProject } from 'src/assets-data/assets-projects/entities/assets-project.entity';
import { Repository } from 'typeorm';
export declare class EntityLookupService {
    private readonly userRepository;
    private readonly assetsProjectRepository;
    private readonly branchRepository;
    private readonly departmentRepository;
    private readonly locationRepository;
    private readonly assetMappingRepository;
    constructor(userRepository: Repository<User>, assetsProjectRepository: Repository<AssetsProject>, branchRepository: Repository<Branch>, departmentRepository: Repository<Department>, locationRepository: Repository<Locations>, assetMappingRepository: Repository<AssetMappingRepository>);
    getBranch(id: number): Promise<{
        id: number;
        name: string;
    }>;
    getLocation(id: number): Promise<{
        id: number;
        name: string;
    }>;
    getProject(id: number): Promise<{
        id: number;
        name: string;
    }>;
    getUser(id: number): Promise<{
        id: number;
        name: string;
    }>;
    getDepartment(id: number): Promise<{
        id: number;
        name: string;
    }>;
    checkLocationHaveAssignedAsset(locationId: number): Promise<boolean>;
    checkProjectHaveAssignedAsset(projectId: number): Promise<boolean>;
    checkItemHaveAssignedAsset(itemId: number): Promise<boolean>;
}
