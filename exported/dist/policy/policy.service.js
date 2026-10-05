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
exports.PolicyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const asset_category_entity_1 = require("../assets-data/asset-categories/entities/asset-category.entity");
const assets_project_entity_1 = require("../assets-data/assets-projects/entities/assets-project.entity");
const request_context_service_1 = require("../common/context/request-context.service");
const notifications_helper_1 = require("../common/notifications/notifications.helper");
const keyset_pagination_1 = require("../common/pagination/keyset-pagination");
const redis_service_1 = require("../common/redis/redis.service");
const branches_entity_1 = require("../organizational-profile/entity/branches.entity");
const department_entity_1 = require("../organizational-profile/entity/department.entity");
const locations_entity_1 = require("../organizational-profile/entity/locations.entity");
const organizational_user_entity_1 = require("../organizational-profile/entity/organizational-user.entity");
const typeorm_2 = require("typeorm");
const create_policy_dto_1 = require("./dto/create-policy.dto");
const acknowledgement_entity_1 = require("./entities/acknowledgement.entity");
const policy_master_entity_1 = require("./entities/policy-master.entity");
const policy_version_entity_1 = require("./entities/policy-version.entity");
let PolicyService = class PolicyService {
    constructor(dataSource, requestContext, redisService, notificationHelper, userRepository) {
        this.dataSource = dataSource;
        this.requestContext = requestContext;
        this.redisService = redisService;
        this.notificationHelper = notificationHelper;
        this.userRepository = userRepository;
    }
    buildPolicyDocumentJson(file) {
        if (!file)
            return undefined;
        return JSON.stringify([
            {
                name: file.originalname,
                path: `/uploads/policy_documents/${file.filename}`,
                size: file.size,
                type: file.mimetype,
                uploadedDate: new Date(),
            },
        ]);
    }
    async createPolicy(dto, userId, file) {
        console.log('CreatePolicyDto BEFORE', dto);
        let applicableTo = [];
        const rawApplicableTo = dto.applicable_to;
        if (rawApplicableTo !== undefined && rawApplicableTo !== null) {
            if (Array.isArray(rawApplicableTo)) {
                applicableTo = rawApplicableTo
                    .map(Number)
                    .filter((id) => !Number.isNaN(id));
            }
            else if (typeof rawApplicableTo === 'string') {
                const rawValue = rawApplicableTo.trim();
                if (rawValue) {
                    try {
                        const parsed = JSON.parse(rawValue);
                        if (Array.isArray(parsed)) {
                            applicableTo = parsed
                                .map(Number)
                                .filter((id) => !Number.isNaN(id));
                        }
                        else if (parsed !== null && parsed !== undefined) {
                            const id = Number(parsed);
                            if (!Number.isNaN(id)) {
                                applicableTo = [id];
                            }
                        }
                    }
                    catch {
                        if (rawValue.startsWith('{') && rawValue.endsWith('}')) {
                            applicableTo = rawValue
                                .slice(1, -1)
                                .split(',')
                                .map((id) => Number(id.trim().replace(/^"|"$/g, '')))
                                .filter((id) => !Number.isNaN(id));
                        }
                        else {
                            applicableTo = rawValue
                                .split(',')
                                .map((id) => Number(id.trim()))
                                .filter((id) => !Number.isNaN(id));
                        }
                    }
                }
            }
        }
        console.log('CreatePolicyDto AFTER applicableTo', applicableTo);
        const resolvableTypeToUserField = {
            [policy_master_entity_1.AssignTypeEnum.BRANCH]: 'branch_id',
            [policy_master_entity_1.AssignTypeEnum.DEPARTMENT]: 'department_id',
            [policy_master_entity_1.AssignTypeEnum.LOCATION]: 'location_id',
        };
        const result = await this.dataSource.transaction(async (manager) => {
            const policyRepo = manager.getRepository(policy_master_entity_1.PolicyMaster);
            const versionRepo = manager.getRepository(policy_version_entity_1.PolicyVersion);
            const ackRepo = manager.getRepository(acknowledgement_entity_1.PolicyAcknowledgement);
            const userRepoTx = manager.getRepository(organizational_user_entity_1.User);
            const policy = policyRepo.create({
                policy_name: dto.policy_name,
                category: dto.category,
                applicable_type: dto.applicable_type,
                applicable_to: applicableTo,
                is_active: true,
                is_deleted: 0,
                created_by: userId,
                updated_by: userId,
            });
            const savedPolicy = await policyRepo.save(policy);
            const isPublish = dto.action === create_policy_dto_1.PolicyPublishAction.PUBLISH;
            const version = versionRepo.create({
                policy_id: savedPolicy.policy_id,
                version: dto.version || '1',
                status: isPublish ? policy_version_entity_1.PolicyStatus.PUBLISHED : policy_version_entity_1.PolicyStatus.DRAFT,
                is_current: isPublish,
                is_archived: false,
                released_date: isPublish ? new Date() : null,
                policy_content: dto.policy_content,
                policy_document: file ? this.buildPolicyDocumentJson(file) : null,
                created_by: userId,
                updated_by: userId,
            });
            const savedVersion = await versionRepo.save(version);
            let ackRows = [];
            if (dto.applicable_type && applicableTo.length > 0) {
                const userField = resolvableTypeToUserField[dto.applicable_type];
                if (userField) {
                    const matchedUsers = await userRepoTx
                        .createQueryBuilder('u')
                        .select(['u.user_id', `u.${userField}`])
                        .where(`u.${userField} IN (:...targetIds)`, {
                        targetIds: applicableTo,
                    })
                        .andWhere('u.is_deleted = :isDeleted', { isDeleted: 0 })
                        .andWhere('u.is_active = :isActive', { isActive: 1 })
                        .getMany();
                    ackRows = matchedUsers.map((u) => ackRepo.create({
                        policy_id: savedPolicy.policy_id,
                        policy_version_id: savedVersion.policy_version_id,
                        applicable_type: dto.applicable_type,
                        applicable_to_id: u.user_id,
                        target_id: Number(u[userField]),
                        is_acknowledged: false,
                        is_seen: false,
                        created_by: userId,
                        updated_by: userId,
                    }));
                }
                else if (dto.applicable_type === policy_master_entity_1.AssignTypeEnum.PROJECT) {
                    ackRows = applicableTo.map((targetId) => ackRepo.create({
                        policy_id: savedPolicy.policy_id,
                        policy_version_id: savedVersion.policy_version_id,
                        applicable_type: dto.applicable_type,
                        applicable_to_id: Number(targetId),
                        target_id: Number(targetId),
                        is_acknowledged: false,
                        is_seen: false,
                        created_by: userId,
                        updated_by: userId,
                    }));
                }
                else {
                    ackRows = applicableTo.map((targetId) => ackRepo.create({
                        policy_id: savedPolicy.policy_id,
                        policy_version_id: savedVersion.policy_version_id,
                        applicable_type: dto.applicable_type,
                        applicable_to_id: Number(targetId),
                        target_id: null,
                        is_acknowledged: false,
                        is_seen: false,
                        created_by: userId,
                        updated_by: userId,
                    }));
                }
                if (ackRows.length) {
                    await ackRepo.save(ackRows);
                }
            }
            return {
                isPublish,
                policy: savedPolicy,
                version: savedVersion,
                ackRows,
            };
        });
        if (result.isPublish) {
            const notifyUserIds = [
                ...new Set(result.ackRows.map((r) => r.applicable_to_id)),
            ];
            await this.sendPolicyPublishedNotificationAsync({
                policy: result.policy,
                version: result.version,
                applicable_to: notifyUserIds,
            });
        }
        return {
            status: true,
            message: result.isPublish
                ? 'Policy published successfully'
                : 'Policy saved as draft successfully',
            data: {
                policy: result.policy,
                version: result.version,
            },
        };
    }
    async sendPolicyPublishedNotificationAsync(notificationData) {
        console.log('sendPolicyPublishedNotificationAsync called');
        const { policy, version, applicable_to } = notificationData;
        console.log('notificationData', notificationData);
        try {
            if (!applicable_to?.length) {
                console.log(`No applicable users found for policy ${policy.policy_id}. Notification skipped.`);
                return;
            }
            const userIds = [
                ...new Set(applicable_to
                    .map(Number)
                    .filter((id) => Number.isInteger(id) && id > 0)),
            ];
            if (!userIds.length) {
                console.log(`No valid user IDs found for policy ${policy.policy_id}. Notification skipped.`);
                return;
            }
            console.log(`📢 Sending policy published notification to user IDs:`, userIds);
            const users = await this.userRepository
                .createQueryBuilder('user')
                .select([
                'user.user_id',
                'user.first_name',
                'user.last_name',
                'user.users_business_email',
                'user.phone_number',
            ])
                .where('user.user_id IN (:...userIds)', {
                userIds,
            })
                .andWhere('user.is_deleted = :isDeleted', {
                isDeleted: 0,
            })
                .andWhere('user.is_active = :isActive', {
                isActive: 1,
            })
                .getMany();
            if (!users.length) {
                console.log(`No active users found for policy ${policy.policy_id}. Notification skipped.`);
                return;
            }
            console.log(`👥 Active users found for policy ${policy.policy_id}:`, users.map((user) => ({
                user_id: user.user_id,
                email: user.users_business_email,
                phone: user.phone_number,
            })));
            const recipients = users.map((user) => ({
                recipient_type: 'user',
                recipient_id: String(user.user_id),
                recipient_email: user.users_business_email,
                recipient_contact: user.phone_number,
            }));
            console.log('📨 Recipients prepared:', recipients);
            const contextData = {
                policy: {
                    policy_id: String(policy.policy_id),
                    policy_version_id: String(version.policy_version_id),
                    policy_name: policy.policy_name,
                    policy_version: String(version.version),
                },
            };
            console.log('📋 Policy notification context:', contextData);
            const EVENT_ID = 63;
            await this.notificationHelper.triggerEventNotification({
                eventId: EVENT_ID,
                contextData,
                recipients,
                meta: {
                    trace_id: `POLICY_PUBLISHED_${policy.policy_id}_${version.policy_version_id}`,
                },
            });
            console.log(`📧 Policy published notification triggered successfully for policy ${policy.policy_id} to ${recipients.length} user(s)`);
            console.log('📧 Notification recipients:', recipients.map((recipient) => ({
                recipient_id: recipient.recipient_id,
                email: recipient.recipient_email,
            })));
        }
        catch (err) {
            console.error(`❌ Failed to send policy published notification for policy ${policy?.policy_id}:`, err);
        }
    }
    async findOne(policy_id) {
        const policyRepo = this.dataSource.getRepository(policy_master_entity_1.PolicyMaster);
        const policy = await policyRepo.findOne({
            where: { policy_id },
            relations: ['versions'],
            order: { versions: { version: 'DESC' } },
        });
        if (!policy) {
            throw new common_1.NotFoundException(`Policy ${policy_id} not found`);
        }
        await this.attachListMetadata([policy]);
        return policy;
    }
    async updatePolicy(policy_id, dto, userId) {
        const policyRepo = this.dataSource.getRepository(policy_master_entity_1.PolicyMaster);
        const policy = await policyRepo.findOne({ where: { policy_id } });
        if (!policy) {
            throw new common_1.NotFoundException(`Policy ${policy_id} not found`);
        }
        Object.assign(policy, dto, { updated_by: userId });
        return policyRepo.save(policy);
    }
    async createVersion(dto, userId, file) {
        console.log('createVersion', dto);
        console.log('createVersion BEFORE', dto);
        const applicableTo = typeof dto.applicable_to === 'string'
            ? JSON.parse(dto.applicable_to)
                .map(Number)
                .filter((id) => !Number.isNaN(id))
            : Array.isArray(dto.applicable_to)
                ? dto.applicable_to
                    .map(Number)
                    .filter((id) => !Number.isNaN(id))
                : [];
        console.log('applicableTo AFTER', applicableTo);
        const result = await this.dataSource.transaction(async (manager) => {
            const policyRepo = manager.getRepository(policy_master_entity_1.PolicyMaster);
            const versionRepo = manager.getRepository(policy_version_entity_1.PolicyVersion);
            const ackRepo = manager.getRepository(acknowledgement_entity_1.PolicyAcknowledgement);
            const policy = await policyRepo.findOne({
                where: {
                    policy_id: dto.policy_id,
                },
            });
            if (!policy) {
                throw new common_1.NotFoundException(`Policy ${dto.policy_id} not found`);
            }
            const latest = await versionRepo
                .createQueryBuilder('v')
                .where('v.policy_id = :policy_id', {
                policy_id: dto.policy_id,
            })
                .orderBy('v.version', 'DESC')
                .setLock('pessimistic_write')
                .getOne();
            const nextVersion = dto.version?.trim()
                ? dto.version.trim()
                : latest
                    ? String(Number(latest.version) + 1)
                    : '1';
            const isPublish = dto.action ===
                create_policy_dto_1.PolicyPublishAction.PUBLISH;
            if (isPublish) {
                await versionRepo
                    .createQueryBuilder()
                    .update(policy_version_entity_1.PolicyVersion)
                    .set({
                    status: policy_version_entity_1.PolicyStatus.ARCHIVED,
                    is_current: false,
                    is_archived: true,
                    updated_by: userId,
                })
                    .where('policy_id = :policy_id', {
                    policy_id: dto.policy_id,
                })
                    .andWhere('is_current = true')
                    .execute();
            }
            const version = versionRepo.create({
                policy_id: dto.policy_id,
                version: nextVersion,
                status: isPublish
                    ? policy_version_entity_1.PolicyStatus.PUBLISHED
                    : policy_version_entity_1.PolicyStatus.DRAFT,
                is_current: isPublish,
                is_archived: false,
                released_date: isPublish
                    ? new Date()
                    : null,
                policy_content: dto.policy_content,
                policy_document: file
                    ? this.buildPolicyDocumentJson(file)
                    : (latest?.policy_document ??
                        null),
                created_by: userId,
                updated_by: userId,
            });
            const savedVersion = await versionRepo.save(version);
            if (dto.applicable_type) {
                await policyRepo.update(dto.policy_id, {
                    applicable_type: dto.applicable_type,
                    applicable_to: applicableTo,
                    category: dto.category,
                    updated_by: userId,
                });
            }
            if (dto.applicable_type &&
                applicableTo.length) {
                const ackRows = applicableTo.map((targetId) => ackRepo.create({
                    policy_id: dto.policy_id,
                    policy_version_id: savedVersion.policy_version_id,
                    applicable_type: dto.applicable_type,
                    applicable_to_id: Number(targetId),
                    is_acknowledged: false,
                    is_seen: false,
                    created_by: userId,
                    updated_by: userId,
                }));
                await ackRepo.save(ackRows);
            }
            return {
                policy,
                version: savedVersion,
                isPublish,
            };
        });
        if (result.isPublish) {
            await this.sendPolicyPublishedNotificationAsync({
                policy: result.policy,
                version: result.version,
                applicable_to: applicableTo,
            });
        }
        return {
            status: true,
            message: result.isPublish
                ? 'Policy version published successfully'
                : 'Policy version saved as draft successfully',
            data: {
                policy: result.policy,
                version: result.version,
            },
        };
    }
    async updateDraftVersion(policy_id, versionId, dto, userId, file) {
        console.log('updateDraftVersion BEFORE', dto);
        let applicableTo;
        if (dto.applicable_to !== undefined && dto.applicable_to !== null) {
            if (typeof dto.applicable_to === 'string') {
                try {
                    const parsed = JSON.parse(dto.applicable_to);
                    applicableTo = Array.isArray(parsed)
                        ? parsed.map(Number).filter((id) => !Number.isNaN(id))
                        : [];
                }
                catch (error) {
                    throw new common_1.BadRequestException('applicable_to must be a valid JSON array');
                }
            }
            else if (Array.isArray(dto.applicable_to)) {
                applicableTo = dto.applicable_to
                    .map(Number)
                    .filter((id) => !Number.isNaN(id));
            }
            else {
                applicableTo = [];
            }
        }
        console.log('updateDraftVersion AFTER applicableTo', applicableTo);
        let categoryIds;
        if (dto.category !== undefined && dto.category !== null) {
            if (Array.isArray(dto.category)) {
                categoryIds = dto.category
                    .map(Number)
                    .filter((id) => !Number.isNaN(id));
            }
            else if (typeof dto.category === 'string') {
                const trimmed = dto.category.trim();
                if (!trimmed) {
                    categoryIds = [];
                }
                else {
                    try {
                        const parsed = JSON.parse(trimmed);
                        categoryIds = Array.isArray(parsed)
                            ? parsed.map(Number).filter((id) => !Number.isNaN(id))
                            : [];
                    }
                    catch {
                        categoryIds = trimmed
                            .split(',')
                            .map((v) => Number(v.trim()))
                            .filter((id) => !Number.isNaN(id));
                    }
                }
            }
            else {
                categoryIds = [];
            }
        }
        console.log('updateDraftVersion AFTER categoryIds', categoryIds);
        return this.dataSource.transaction(async (manager) => {
            const policyRepo = manager.getRepository(policy_master_entity_1.PolicyMaster);
            const versionRepo = manager.getRepository(policy_version_entity_1.PolicyVersion);
            const ackRepo = manager.getRepository(acknowledgement_entity_1.PolicyAcknowledgement);
            const policy = await policyRepo.findOne({
                where: { policy_id },
            });
            if (!policy) {
                throw new common_1.NotFoundException(`Policy ${policy_id} not found`);
            }
            const version = await versionRepo.findOne({
                where: {
                    policy_version_id: versionId,
                    policy_id,
                },
            });
            if (!version) {
                throw new common_1.NotFoundException(`Version ${versionId} not found for policy ${policy_id}`);
            }
            if (version.status !== policy_version_entity_1.PolicyStatus.DRAFT) {
                throw new common_1.BadRequestException('Only DRAFT versions can be edited');
            }
            if (dto.policy_name !== undefined) {
                policy.policy_name = dto.policy_name;
            }
            if (categoryIds !== undefined) {
                policy.category = categoryIds;
            }
            if (dto.applicable_type !== undefined) {
                policy.applicable_type = dto.applicable_type;
            }
            if (applicableTo !== undefined) {
                policy.applicable_to = applicableTo;
            }
            policy.updated_by = userId;
            await policyRepo.save(policy);
            if (dto.policy_content !== undefined) {
                version.policy_content = dto.policy_content;
            }
            if (file) {
                version.policy_document = this.buildPolicyDocumentJson(file);
            }
            version.updated_by = userId;
            await versionRepo.save(version);
            if (dto.applicable_type !== undefined && applicableTo !== undefined) {
                await ackRepo.delete({
                    policy_id,
                    policy_version_id: versionId,
                });
                if (applicableTo.length > 0) {
                    const ackRows = applicableTo.map((targetId) => ackRepo.create({
                        policy_id,
                        policy_version_id: versionId,
                        applicable_type: dto.applicable_type,
                        applicable_to_id: Number(targetId),
                        is_acknowledged: false,
                        is_seen: false,
                        created_by: userId,
                        updated_by: userId,
                    }));
                    await ackRepo.save(ackRows);
                }
            }
            return {
                policy,
                version,
            };
        });
    }
    async publishVersion(policy_id, versionId, userId) {
        const result = await this.dataSource.transaction(async (manager) => {
            const policyRepo = manager.getRepository(policy_master_entity_1.PolicyMaster);
            const versionRepo = manager.getRepository(policy_version_entity_1.PolicyVersion);
            const target = await versionRepo.findOne({
                where: {
                    policy_version_id: versionId,
                    policy_id,
                },
            });
            if (!target) {
                throw new common_1.NotFoundException(`Version ${versionId} not found for policy ${policy_id}`);
            }
            if (target.status === policy_version_entity_1.PolicyStatus.PUBLISHED) {
                throw new common_1.BadRequestException('Version is already published');
            }
            const policy = await policyRepo.findOne({
                where: {
                    policy_id,
                    is_deleted: 0,
                },
            });
            if (!policy) {
                throw new common_1.NotFoundException(`Policy ${policy_id} not found`);
            }
            await versionRepo
                .createQueryBuilder()
                .update(policy_version_entity_1.PolicyVersion)
                .set({
                status: policy_version_entity_1.PolicyStatus.ARCHIVED,
                is_current: false,
                is_archived: true,
                updated_by: userId,
            })
                .where('policy_id = :policy_id', { policy_id })
                .andWhere('is_current = true')
                .execute();
            target.status = policy_version_entity_1.PolicyStatus.PUBLISHED;
            target.is_current = true;
            target.is_archived = false;
            target.released_date = new Date();
            target.updated_by = userId;
            const savedVersion = await versionRepo.save(target);
            return {
                policy,
                version: savedVersion,
            };
        });
        let applicableTo = [];
        const rawApplicableTo = result.policy.applicable_to;
        if (Array.isArray(rawApplicableTo)) {
            applicableTo = rawApplicableTo
                .map(Number)
                .filter((id) => Number.isInteger(id) && id > 0);
        }
        else if (typeof rawApplicableTo === 'string') {
            const rawValue = rawApplicableTo.trim();
            if (rawValue) {
                try {
                    const parsed = JSON.parse(rawValue);
                    if (Array.isArray(parsed)) {
                        applicableTo = parsed
                            .map(Number)
                            .filter((id) => Number.isInteger(id) && id > 0);
                    }
                    else {
                        const id = Number(parsed);
                        if (Number.isInteger(id) && id > 0) {
                            applicableTo = [id];
                        }
                    }
                }
                catch {
                    if (rawValue.startsWith('{') && rawValue.endsWith('}')) {
                        applicableTo = rawValue
                            .slice(1, -1)
                            .split(',')
                            .map((id) => Number(id.trim().replace(/^"|"$/g, '')))
                            .filter((id) => Number.isInteger(id) && id > 0);
                    }
                    else {
                        applicableTo = rawValue
                            .split(',')
                            .map((id) => Number(id.trim()))
                            .filter((id) => Number.isInteger(id) && id > 0);
                    }
                }
            }
        }
        await this.sendPolicyPublishedNotificationAsync({
            policy: result.policy,
            version: result.version,
            applicable_to: applicableTo,
        });
        return {
            status: true,
            message: 'Policy version published successfully',
            data: {
                policy: result.policy,
                version: result.version,
            },
        };
    }
    async unpublishVersion(policy_id, versionId, userId) {
        return this.dataSource.transaction(async (manager) => {
            const versionRepo = manager.getRepository(policy_version_entity_1.PolicyVersion);
            const target = await versionRepo.findOne({
                where: { policy_version_id: versionId, policy_id },
            });
            if (!target) {
                throw new common_1.NotFoundException(`Version ${versionId} not found for policy ${policy_id}`);
            }
            if (target.status !== policy_version_entity_1.PolicyStatus.PUBLISHED || !target.is_current) {
                throw new common_1.BadRequestException('Only the currently published version can be unpublished');
            }
            target.status = policy_version_entity_1.PolicyStatus.ARCHIVED;
            target.is_current = false;
            target.is_archived = false;
            target.updated_by = userId;
            return versionRepo.save(target);
        });
    }
    async markAllAcknowledged(policy_id, versionId, userId) {
        const versionRepo = this.dataSource.getRepository(policy_version_entity_1.PolicyVersion);
        const ackRepo = this.dataSource.getRepository(acknowledgement_entity_1.PolicyAcknowledgement);
        const target = await versionRepo.findOne({
            where: {
                policy_version_id: versionId,
                policy_id,
            },
        });
        if (!target) {
            throw new common_1.NotFoundException(`Version ${versionId} not found for policy ${policy_id}`);
        }
        await ackRepo
            .createQueryBuilder()
            .update(acknowledgement_entity_1.PolicyAcknowledgement)
            .set({
            is_acknowledged: true,
            is_seen: true,
            is_forced_ack: true,
            updated_by: userId,
        })
            .where('policy_id = :policy_id', { policy_id })
            .andWhere('policy_version_id = :versionId', { versionId })
            .andWhere('is_acknowledged = false')
            .execute();
        return {
            status: true,
            message: 'All pending acknowledgements marked as acknowledged',
        };
    }
    async getUserByPublicID(public_user_id) {
        const userExists = await this.dataSource
            .getRepository(organizational_user_entity_1.User)
            .findOne({ where: { register_user_login_id: public_user_id } });
        if (!userExists) {
            throw new common_1.HttpException({ status: common_1.HttpStatus.BAD_REQUEST, message: 'Invalid user ID' }, common_1.HttpStatus.BAD_REQUEST);
        }
        return userExists.user_id;
    }
    async attachListMetadata(rows) {
        if (!rows.length)
            return;
        console.log('rows attachListMetadata', rows);
        const parseIdArray = (value) => {
            if (!value)
                return [];
            const values = Array.isArray(value)
                ? value
                : value
                    .replace(/^\{|\}$/g, '')
                    .split(',')
                    .map((v) => v.trim().replace(/^"|"$/g, ''));
            return values.map(Number).filter((id) => Number.isInteger(id) && id > 0);
        };
        const userIds = new Set();
        const categoryIds = new Set();
        for (const p of rows) {
            if (p.created_by)
                userIds.add(p.created_by);
            if (p.updated_by)
                userIds.add(p.updated_by);
            if (p.applicable_type === policy_master_entity_1.AssignTypeEnum.USER) {
                parseIdArray(p.applicable_to).forEach((id) => userIds.add(id));
            }
            if (p.category) {
                (Array.isArray(p.category)
                    ? p.category.map((v) => String(v).trim())
                    : String(p.category)
                        .split(',')
                        .map((v) => v.trim()))
                    .filter(Boolean)
                    .forEach((id) => categoryIds.add(Number(id)));
            }
        }
        const users = userIds.size
            ? await this.dataSource
                .getRepository(organizational_user_entity_1.User)
                .createQueryBuilder('u')
                .select(['u.user_id', 'u.first_name', 'u.middle_name', 'u.last_name'])
                .where('u.user_id IN (:...userIds)', {
                userIds: [...userIds].filter((id) => id != null && !isNaN(id)),
            })
                .getMany()
            : [];
        const userNameById = new Map(users.map((u) => [
            u.user_id,
            [u.first_name, u.middle_name, u.last_name].filter(Boolean).join(' '),
        ]));
        const categories = categoryIds.size
            ? await this.dataSource
                .getRepository(asset_category_entity_1.AssetCategory)
                .createQueryBuilder('c')
                .select(['c.main_category_id', 'c.main_category_name'])
                .where('c.main_category_id IN (:...ids)', { ids: [...categoryIds] })
                .getMany()
            : [];
        const categoryNameById = new Map(categories.map((c) => [c.main_category_id, c.main_category_name]));
        const versionIds = rows.flatMap((p) => (p.versions || []).map((v) => v.policy_version_id));
        const ackCounts = versionIds.length
            ? await this.dataSource
                .getRepository(acknowledgement_entity_1.PolicyAcknowledgement)
                .createQueryBuilder('ak')
                .select('ak.policy_version_id', 'policy_version_id')
                .addSelect('COUNT(*)', 'total_count')
                .addSelect('SUM(CASE WHEN ak.is_acknowledged = true THEN 1 ELSE 0 END)', 'accepted_count')
                .where('ak.policy_version_id IN (:...ids)', { ids: versionIds })
                .groupBy('ak.policy_version_id')
                .getRawMany()
            : [];
        const ackByVersionId = new Map(ackCounts.map((r) => [
            Number(r.policy_version_id),
            {
                total_count: Number(r.total_count),
                accepted_count: Number(r.accepted_count),
            },
        ]));
        for (const p of rows) {
            p.created_by_name = p.created_by
                ? (userNameById.get(p.created_by) ?? null)
                : null;
            p.updated_by_name = p.updated_by
                ? (userNameById.get(p.updated_by) ?? null)
                : null;
            const applicableIds = parseIdArray(p.applicable_to);
            p.applicable_to_names =
                p.applicable_type === policy_master_entity_1.AssignTypeEnum.USER && applicableIds.length
                    ? applicableIds.map((id) => ({
                        id,
                        name: userNameById.get(id) ?? String(id),
                    }))
                    : null;
            const catIds = p.category
                ? (Array.isArray(p.category)
                    ? p.category.map((v) => String(v).trim())
                    : String(p.category)
                        .split(',')
                        .map((v) => v.trim()))
                    .filter(Boolean)
                    .map(Number)
                : [];
            p.category_names = catIds.length
                ? catIds.map((id) => ({
                    id,
                    name: categoryNameById.get(id) ?? String(id),
                }))
                : null;
            let policyLevelAckPct = 0;
            (p.versions || []).forEach((v, i) => {
                const counts = ackByVersionId.get(v.policy_version_id);
                const total_count = counts?.total_count ?? 0;
                const accepted_count = counts?.accepted_count ?? 0;
                const pending_count = total_count - accepted_count;
                const acknowledgement_percentage = total_count
                    ? Math.round((accepted_count / total_count) * 100)
                    : 0;
                v.total_count = total_count;
                v.accepted_count = accepted_count;
                v.pending_count = pending_count;
                v.acknowledgement_percentage = acknowledgement_percentage;
                if (v.is_current || i === 0) {
                    policyLevelAckPct = acknowledgement_percentage;
                }
            });
            p.acknowledgement_percentage = policyLevelAckPct;
        }
    }
    async findAll(schema, dto) {
        console.log("get policy,", dto);
        const d = dto;
        const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
        const searchArray = dto.search || [];
        const filtersArray = dto.filters || [];
        const sortArray = dto.sort || [];
        const cursorToken = typeof d.cursor === 'string' ? d.cursor : null;
        const direction = d.direction === 'prev' ? 'prev' : 'next';
        const jumpToLast = d.jumpToLast === true || dto.isLastPageMode === true;
        const jumpPage = d.page ? Number(d.page) : undefined;
        const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
        const policyRepo = this.dataSource.getRepository(policy_master_entity_1.PolicyMaster);
        const buildBaseQuery = (qb) => qb.where('p.is_deleted = 0');
        const applySearchAndFilters = (qb) => {
            searchArray.forEach((s, i) => {
                if (!s.values?.length)
                    return;
                const value = s.values
                    .map((v) => v.trim())
                    .filter(Boolean)
                    .join(' ');
                qb.andWhere(`p.policy_name ILIKE :s${i}`, { [`s${i}`]: `%${value}%` });
            });
            const filters = {};
            filtersArray.forEach((f) => {
                filters[f.column] = f.values || [];
            });
            if (filters.category?.length) {
                const categoryIds = filters.category
                    .map((v) => Number(v))
                    .filter((v) => !Number.isNaN(v));
                if (categoryIds.length) {
                    qb.andWhere(`
      EXISTS (
        SELECT 1
        FROM unnest(
          string_to_array(
            TRIM(BOTH '"' FROM p.category::text),
            ','
          )
        ) AS cat(value)
        WHERE TRIM(cat.value)::int IN (:...categoryIds)
      )
      `, { categoryIds });
                }
            }
            if (filters.status?.length) {
                qb.andWhere(`EXISTS (SELECT 1 FROM policy_version pv WHERE pv.policy_id = p.policy_id AND UPPER(pv.status) IN (:...statuses))`, {
                    statuses: filters.status.map((v) => String(v).trim().toUpperCase()),
                });
            }
        };
        const searchStr = searchArray[0]?.values?.join(' ').trim() || undefined;
        const categoryFilter = filtersArray.find((f) => f.column === 'category')?.values;
        const statusFilter = filtersArray.find((f) => f.column === 'status')?.values;
        const countKey = this.getListCacheKey(schema, {
            search: searchStr,
            category: categoryFilter,
            status: statusFilter,
            page: jumpPage ?? 1,
            limit,
        });
        const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => {
            const countQb = buildBaseQuery(policyRepo.createQueryBuilder('p'));
            applySearchAndFilters(countQb);
            return countQb.getCount();
        }, 30);
        const sortableMap = {
            policy_id: 'p.policy_id',
            policy_name: 'p.policy_name',
            created_at: 'p.created_at',
        };
        const idColumn = 'policy_id';
        const idDbColumn = 'p.policy_id';
        const defaultSort = { column: 'created_at', order: 'DESC' };
        const qb = buildBaseQuery(policyRepo.createQueryBuilder('p'));
        applySearchAndFilters(qb);
        qb.select('p.policy_id', 'policy_id');
        let plan;
        if (jumpToLast) {
            plan = (0, keyset_pagination_1.buildKeyset)({
                qb,
                columnMap: sortableMap,
                sort: sortArray,
                defaultSort,
                idColumn,
                idDbColumn,
                cursor: null,
                direction: 'prev',
            });
        }
        else if (usingOffset) {
            plan = (0, keyset_pagination_1.buildKeyset)({
                qb,
                columnMap: sortableMap,
                sort: sortArray,
                defaultSort,
                idColumn,
                idDbColumn,
                cursor: null,
                direction: 'next',
            });
            (0, keyset_pagination_1.applyOffsetRaw)(qb, jumpPage, limit);
        }
        else {
            plan = (0, keyset_pagination_1.buildKeyset)({
                qb,
                columnMap: sortableMap,
                sort: sortArray,
                defaultSort,
                idColumn,
                idDbColumn,
                cursor: cursorToken,
                direction,
            });
        }
        const idResult = usingOffset
            ? await qb.getRawMany()
            : await qb.limit(limit + 1).getRawMany();
        const idRows = idResult.map((r) => ({
            ...r,
            [plan.sortColumn]: r[plan.sortColumn],
            [idColumn]: Number(r.policy_id),
        }));
        const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
        let policyIds;
        let meta;
        if (usingOffset) {
            policyIds = idRows.map((r) => r[idColumn]);
            const first = idRows[0];
            const last = idRows[idRows.length - 1];
            meta = (0, keyset_pagination_1.buildListMeta)({
                page: {
                    data: idRows,
                    startCursor: first
                        ? (0, keyset_pagination_1.encodeCursor)({
                            v: first[plan.sortColumn] ?? null,
                            id: first[idColumn],
                        })
                        : null,
                    endCursor: last
                        ? (0, keyset_pagination_1.encodeCursor)({
                            v: last[plan.sortColumn] ?? null,
                            id: last[idColumn],
                        })
                        : null,
                    hasNextPage: jumpPage < totalPages,
                    hasPrevPage: jumpPage > 1,
                },
                limit,
                total,
                currentPage: jumpPage,
            });
        }
        else {
            const page = (0, keyset_pagination_1.finalizePage)({
                rows: idRows,
                limit,
                plan,
                idColumn,
                hadCursor: !!cursorToken,
            });
            policyIds = page.data.map((r) => r[idColumn]);
            if (jumpToLast) {
                page.hasNextPage = false;
                page.hasPrevPage = total > page.data.length;
            }
            meta = (0, keyset_pagination_1.buildListMeta)({
                page,
                limit,
                total,
                currentPage: jumpToLast ? totalPages : 1,
            });
        }
        if (!policyIds.length) {
            return { status: true, rows: [], count: 0, total, meta };
        }
        const rows = await policyRepo
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.versions', 'v')
            .where('p.policy_id IN (:...policyIds)', { policyIds })
            .andWhere('p.is_deleted = 0')
            .getMany();
        const orderMap = new Map(policyIds.map((id, index) => [id, index]));
        rows.sort((a, b) => (orderMap.get(a.policy_id) ?? 0) - (orderMap.get(b.policy_id) ?? 0));
        rows.forEach((policy) => {
            policy.versions = [...(policy.versions || [])].sort((a, b) => Number(b.version) - Number(a.version));
        });
        await this.attachListMetadata(rows);
        return { status: true, rows, count: rows.length, total, meta };
    }
    getListCacheKey(schema, q) {
        const searchKey = q.search?.trim().toLowerCase() || 'all';
        const categoryKey = q.category?.length
            ? [...q.category].sort().join(',')
            : 'all';
        const statusKey = q.status?.length ? [...q.status].sort().join(',') : 'all';
        return [
            'policies',
            schema,
            `search:${searchKey}`,
            `category:${categoryKey}`,
            `status:${statusKey}`,
            `page:${q.page}`,
            `limit:${q.limit}`,
        ].join(':');
    }
    async findMyPolicies(schema, userId, dto) {
        const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
        const cursorToken = typeof dto.cursor === 'string' ? dto.cursor : null;
        const direction = dto.direction === 'prev' ? 'prev' : 'next';
        const jumpToLast = dto.jumpToLast === true;
        const jumpPage = dto.page ? Number(dto.page) : undefined;
        const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
        const dynamicFilters = dto.dynamicFilters || {};
        const categoryFilters = Array.isArray(dynamicFilters.category)
            ? dynamicFilters.category
                .map((value) => String(value).trim())
                .filter(Boolean)
            : [];
        const statusFilters = Array.isArray(dynamicFilters.status)
            ? dynamicFilters.status
                .map((value) => String(value).trim().toLowerCase())
                .filter(Boolean)
            : [];
        const searchQuery = String(dto.searchQuery || '').trim();
        const policyRepo = this.dataSource.getRepository(policy_master_entity_1.PolicyMaster);
        const acknowledgementRepo = this.dataSource.getRepository(acknowledgement_entity_1.PolicyAcknowledgement);
        const user = await this.dataSource.getRepository(organizational_user_entity_1.User).findOne({
            where: {
                user_id: userId,
            },
            select: ['user_id', 'department_id', 'branch_id'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
        const buildBaseQuery = (qb) => qb
            .innerJoin('pm.versions', 'pv', 'pv.is_current = true')
            .innerJoin(acknowledgement_entity_1.PolicyAcknowledgement, 'ak', `
        ak.policy_id = pm.policy_id
        AND ak.policy_version_id = pv.policy_version_id
        AND (
          (
            ak.applicable_type = :userType
            AND ak.applicable_to_id = :userId
          )
          ${user.department_id
            ? `
                OR (
                  ak.applicable_type = :departmentType
                  AND ak.applicable_to_id = :departmentId
                )
              `
            : ''}
          ${user.branch_id
            ? `
                OR (
                  ak.applicable_type = :branchType
                  AND ak.applicable_to_id = :branchId
                )
              `
            : ''}
        )
        `, {
            userType: policy_master_entity_1.AssignTypeEnum.USER,
            userId,
            departmentType: policy_master_entity_1.AssignTypeEnum.DEPARTMENT,
            departmentId: user.department_id,
            branchType: policy_master_entity_1.AssignTypeEnum.BRANCH,
            branchId: user.branch_id,
        })
            .where('pm.is_deleted = 0')
            .andWhere('pm.is_active = true');
        const applySearchAndFilters = (qb) => {
            if (searchQuery) {
                qb.andWhere(`
        (
          LOWER(pm.policy_name) LIKE LOWER(:search)
          OR LOWER(pm.category::text) LIKE LOWER(:search)
        )
        `, {
                    search: `%${searchQuery}%`,
                });
            }
            if (categoryFilters.length) {
                const categoryConditions = [];
                const categoryParams = {};
                categoryFilters.forEach((category, index) => {
                    categoryConditions.push(`
            (
              (
                pg_typeof(pm.category) = 'jsonb'::regtype
                AND pm.category @> to_jsonb(:categoryId${index}::int)
              )
              OR
              (
                pg_typeof(pm.category) <> 'jsonb'::regtype
                AND string_to_array(pm.category::text, ',') && ARRAY[:categoryStr${index}]::text[]
              )
            )
          `);
                    categoryParams[`categoryId${index}`] = Number(category);
                    categoryParams[`categoryStr${index}`] = category;
                });
                qb.andWhere(`(${categoryConditions.join(' OR ')})`, categoryParams);
            }
            if (statusFilters.length) {
                const statusConditions = [];
                const statusParams = {};
                if (statusFilters.includes('pending')) {
                    statusConditions.push(`
      ak.is_acknowledged = false
    `);
                }
                if (statusFilters.includes('acknowledged')) {
                    statusConditions.push(`
      ak.is_acknowledged = true
    `);
                }
                if (statusFilters.includes('archived')) {
                    statusConditions.push(`
      LOWER(pv.status) = 'archived'
    `);
                }
                if (statusConditions.length) {
                    qb.andWhere(`(${statusConditions.join(' OR ')})`, statusParams);
                }
            }
            return qb;
        };
        const countKey = `my_policies:${schema}:${userId}:${JSON.stringify({
            categoryFilters,
            statusFilters,
            searchQuery,
            page: jumpPage ?? 1,
            limit,
        })}`;
        const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => {
            const countQb = buildBaseQuery(policyRepo.createQueryBuilder('pm'));
            applySearchAndFilters(countQb);
            return countQb.getCount();
        }, 30);
        const idColumn = 'pm_policy_id';
        const idDbColumn = 'pm.policy_id';
        const sortableMap = {
            pm_policy_id: 'pm.policy_id',
            pm_policy_name: 'pm.policy_name',
            pm_category: 'pm.category',
            pv_released_date: 'pv.released_date',
            pv_created_at: 'pv.created_at',
        };
        const defaultSort = {
            column: 'pv_released_date',
            order: 'DESC',
        };
        const sortArray = (dto.sort || []).length
            ? dto.sort.map((s) => ({
                column: s.column.startsWith('pv_') || s.column.startsWith('pm_')
                    ? s.column
                    : `pv_${s.column}`,
                order: s.order,
            }))
            : [defaultSort];
        const qb = buildBaseQuery(policyRepo.createQueryBuilder('pm')).select([
            'pm.policy_id',
            'pm.policy_name',
            'pm.category',
            'pm.created_by',
            'pm.applicable_type',
            'pm.applicable_to',
            'pv.policy_version_id',
            'pv.version',
            'pv.status',
            'pv.released_date',
            'pv.policy_content',
            'pv.policy_document',
            'pv.created_at',
            'ak.ak_id',
            'ak.applicable_type',
            'ak.applicable_to_id',
            'ak.is_acknowledged',
            'ak.updated_at',
        ]);
        applySearchAndFilters(qb);
        let plan;
        if (jumpToLast) {
            plan = (0, keyset_pagination_1.buildKeyset)({
                qb,
                columnMap: sortableMap,
                sort: sortArray,
                defaultSort,
                idColumn,
                idDbColumn,
                cursor: null,
                direction: 'prev',
            });
        }
        else if (usingOffset) {
            plan = (0, keyset_pagination_1.buildKeyset)({
                qb,
                columnMap: sortableMap,
                sort: sortArray,
                defaultSort,
                idColumn,
                idDbColumn,
                cursor: null,
                direction: 'next',
            });
            (0, keyset_pagination_1.applyOffsetRaw)(qb, jumpPage, limit);
        }
        else {
            plan = (0, keyset_pagination_1.buildKeyset)({
                qb,
                columnMap: sortableMap,
                sort: sortArray,
                defaultSort,
                idColumn,
                idDbColumn,
                cursor: cursorToken,
                direction,
            });
        }
        const result = usingOffset
            ? await qb.limit(limit).getRawMany()
            : await qb.limit(limit + 1).getRawMany();
        const rows = result.map((r) => ({
            ...r,
            [plan.sortColumn]: r[plan.sortColumn],
            [idColumn]: Number(r.pm_policy_id),
        }));
        const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
        let policyIds;
        let meta;
        if (usingOffset) {
            policyIds = rows.map((r) => r[idColumn]);
            const first = rows[0];
            const last = rows[rows.length - 1];
            meta = (0, keyset_pagination_1.buildListMeta)({
                page: {
                    data: rows,
                    startCursor: first
                        ? (0, keyset_pagination_1.encodeCursor)({
                            v: first[plan.sortColumn] ?? null,
                            id: first[idColumn],
                        })
                        : null,
                    endCursor: last
                        ? (0, keyset_pagination_1.encodeCursor)({
                            v: last[plan.sortColumn] ?? null,
                            id: last[idColumn],
                        })
                        : null,
                    hasNextPage: jumpPage < totalPages,
                    hasPrevPage: jumpPage > 1,
                },
                limit,
                total,
                currentPage: jumpPage,
            });
        }
        else {
            const page = (0, keyset_pagination_1.finalizePage)({
                rows,
                limit,
                plan,
                idColumn,
                hadCursor: !!cursorToken,
            });
            policyIds = page.data.map((r) => r[idColumn]);
            if (jumpToLast) {
                page.hasNextPage = false;
                page.hasPrevPage = total > page.data.length;
            }
            meta = (0, keyset_pagination_1.buildListMeta)({
                page,
                limit,
                total,
                currentPage: jumpToLast ? totalPages : 1,
            });
        }
        if (!policyIds.length) {
            return {
                status: true,
                rows: [],
                meta,
            };
        }
        const policies = await policyRepo
            .createQueryBuilder('pm')
            .innerJoinAndSelect('pm.versions', 'pv', 'pv.is_current = true')
            .where('pm.policy_id IN (:...policyIds)', {
            policyIds,
        })
            .select([
            'pm.policy_id',
            'pm.policy_name',
            'pm.category',
            'pm.created_by',
            'pm.applicable_type',
            'pm.applicable_to',
            'pv.policy_version_id',
            'pv.version',
            'pv.status',
            'pv.released_date',
            'pv.policy_content',
            'pv.policy_document',
        ])
            .getMany();
        const orderMap = new Map(policyIds.map((id, index) => [id, index]));
        policies.sort((a, b) => (orderMap.get(a.policy_id) ?? 0) - (orderMap.get(b.policy_id) ?? 0));
        const versionIds = policies
            .map((policy) => policy.versions?.[0]?.policy_version_id)
            .filter((id) => !!id);
        const acknowledgementMap = new Map();
        if (versionIds.length) {
            const acknowledgementQb = acknowledgementRepo
                .createQueryBuilder('ak')
                .where('ak.policy_version_id IN (:...versionIds)', {
                versionIds,
            })
                .andWhere(`
          (
            (
              ak.applicable_type = :userType
              AND ak.applicable_to_id = :userId
            )
            ${user.department_id
                ? `
                  OR (
                    ak.applicable_type = :departmentType
                    AND ak.applicable_to_id = :departmentId
                  )
                `
                : ''}
            ${user.branch_id
                ? `
                  OR (
                    ak.applicable_type = :branchType
                    AND ak.applicable_to_id = :branchId
                  )
                `
                : ''}
          )
          `, {
                userType: policy_master_entity_1.AssignTypeEnum.USER,
                userId,
                departmentType: policy_master_entity_1.AssignTypeEnum.DEPARTMENT,
                departmentId: user.department_id,
                branchType: policy_master_entity_1.AssignTypeEnum.BRANCH,
                branchId: user.branch_id,
            });
            const acknowledgementRows = await acknowledgementQb.getMany();
            for (const ack of acknowledgementRows) {
                const key = `${ack.policy_id}_${ack.policy_version_id}`;
                const existing = acknowledgementMap.get(key);
                if (!existing) {
                    acknowledgementMap.set(key, ack);
                }
                else if (ack.applicable_type === policy_master_entity_1.AssignTypeEnum.USER) {
                    acknowledgementMap.set(key, ack);
                }
            }
        }
        const enrichedRows = await Promise.all(policies.map(async (policy) => {
            const currentVersion = policy.versions?.[0];
            const policyVersionId = currentVersion?.policy_version_id;
            let categoryNames = [];
            if (policy.category) {
                const categoryIds = (Array.isArray(policy.category)
                    ? policy.category
                    : String(policy.category).split(','))
                    .map((id) => Number(String(id).trim()))
                    .filter((id) => !Number.isNaN(id));
                if (categoryIds.length) {
                    try {
                        const categories = await this.dataSource
                            .createQueryBuilder()
                            .select('c.main_category_id', 'main_category_id')
                            .addSelect('c.main_category_name', 'main_category_name')
                            .from(`${schema}.asset_main_category`, 'c')
                            .where('c.main_category_id IN (:...ids)', {
                            ids: categoryIds,
                        })
                            .getRawMany();
                        const categoryNameById = new Map(categories.map((c) => [
                            Number(c.main_category_id),
                            c.main_category_name,
                        ]));
                        categoryNames = categoryIds.map((id) => ({
                            id,
                            name: categoryNameById.get(id) ?? String(id),
                        }));
                    }
                    catch (error) {
                        console.log('Category fetch failed:', error instanceof Error ? error.message : error);
                        categoryNames = categoryIds.map((id) => ({
                            id,
                            name: String(id),
                        }));
                    }
                }
            }
            let createdByName = 'Unknown';
            try {
                if (policy.created_by) {
                    const createdByUser = await this.dataSource
                        .getRepository(organizational_user_entity_1.User)
                        .findOne({
                        where: {
                            user_id: Number(policy.created_by),
                        },
                        select: ['first_name', 'last_name', 'middle_name'],
                    });
                    if (createdByUser) {
                        createdByName = [
                            createdByUser.first_name,
                            createdByUser.middle_name,
                            createdByUser.last_name,
                        ]
                            .filter(Boolean)
                            .join(' ');
                    }
                }
            }
            catch (error) {
                console.log('User fetch failed:', error instanceof Error ? error.message : error);
            }
            let acknowledgeStatus = 'Pending';
            let acknowledgedAt = null;
            let canAcknowledge = false;
            if (policyVersionId) {
                const ackKey = `${policy.policy_id}_${policyVersionId}`;
                const ack = acknowledgementMap.get(ackKey);
                if (ack) {
                    acknowledgeStatus = ack.is_acknowledged
                        ? 'Acknowledged'
                        : 'Pending';
                    acknowledgedAt = ack.is_acknowledged ? ack.updated_at : null;
                    canAcknowledge = ack.applicable_type === policy_master_entity_1.AssignTypeEnum.USER;
                }
            }
            return {
                ak_id: policy.policy_id,
                policy_id: policy.policy_id,
                policy_name: policy.policy_name,
                category: policy.category,
                category_names: categoryNames,
                created_by: policy.created_by ? Number(policy.created_by) : null,
                created_by_name: createdByName,
                policy_version_id: policyVersionId,
                version: currentVersion?.version,
                status: currentVersion?.status,
                released_date: currentVersion?.released_date,
                policy_content: currentVersion?.policy_content,
                policy_document: currentVersion?.policy_document,
                acknowledge_status: acknowledgeStatus,
                acknowledged_at: acknowledgedAt,
                can_acknowledge: canAcknowledge,
            };
        }));
        return {
            status: true,
            rows: enrichedRows,
            meta,
        };
    }
    async getMyPolicyVersionContext(userId, policy_id, versionId) {
        const policyRepo = this.dataSource.getRepository(policy_master_entity_1.PolicyMaster);
        const versionRepo = this.dataSource.getRepository(policy_version_entity_1.PolicyVersion);
        const ackRepo = this.dataSource.getRepository(acknowledgement_entity_1.PolicyAcknowledgement);
        const policy = await policyRepo.findOne({
            where: {
                policy_id,
                is_deleted: 0,
            },
        });
        if (!policy) {
            throw new common_1.NotFoundException(`Policy ${policy_id} not found`);
        }
        const version = await versionRepo.findOne({
            where: {
                policy_version_id: versionId,
                policy_id,
            },
        });
        if (!version) {
            throw new common_1.NotFoundException(`Version ${versionId} not found for policy ${policy_id}`);
        }
        const existingAck = await ackRepo
            .createQueryBuilder('ak')
            .where('ak.policy_id = :policy_id', {
            policy_id,
        })
            .andWhere('ak.policy_version_id = :versionId', {
            versionId,
        })
            .andWhere(`
        (
          ak.applicable_type = :userType
          AND ak.applicable_to_id = :userId
        )
      `, {
            userType: policy_master_entity_1.AssignTypeEnum.USER,
            userId,
        })
            .getOne();
        if (existingAck) {
            return {
                policy,
                version,
                ack: existingAck,
            };
        }
        const user = await this.dataSource.getRepository(organizational_user_entity_1.User).findOne({
            where: {
                user_id: userId,
            },
            select: ['user_id', 'department_id', 'branch_id'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
        const ackRows = await ackRepo
            .createQueryBuilder('ak')
            .where('ak.policy_id = :policy_id', {
            policy_id,
        })
            .andWhere('ak.policy_version_id = :versionId', {
            versionId,
        })
            .andWhere(`
        (
          (
            ak.applicable_type = :userType
            AND ak.applicable_to_id = :userId
          )
          ${user.department_id
            ? `
                OR (
                  ak.applicable_type = :departmentType
                  AND ak.applicable_to_id = :departmentId
                )
              `
            : ''}
          ${user.branch_id
            ? `
                OR (
                  ak.applicable_type = :branchType
                  AND ak.applicable_to_id = :branchId
                )
              `
            : ''}
        )
      `, {
            userType: policy_master_entity_1.AssignTypeEnum.USER,
            userId,
            departmentType: policy_master_entity_1.AssignTypeEnum.DEPARTMENT,
            departmentId: user.department_id,
            branchType: policy_master_entity_1.AssignTypeEnum.BRANCH,
            branchId: user.branch_id,
        })
            .getMany();
        if (!ackRows.length) {
            throw new common_1.NotFoundException('This policy is not assigned to you.');
        }
        const sourceAck = ackRows[0];
        const newUserAck = ackRepo.create({
            policy_id,
            policy_version_id: versionId,
            applicable_type: policy_master_entity_1.AssignTypeEnum.USER,
            applicable_to_id: userId,
            is_acknowledged: false,
            is_seen: sourceAck.is_seen ?? false,
            created_by: userId,
            updated_by: userId,
        });
        const savedUserAck = await ackRepo.save(newUserAck);
        return {
            policy,
            version,
            ack: savedUserAck,
        };
    }
    async findMyPolicyDetail(userId, policy_id, versionId) {
        const { policy, version, ack } = await this.getMyPolicyVersionContext(userId, policy_id, versionId);
        let categoryNames = [];
        if (policy.category) {
            const categoryValue = policy.category;
            const categoryIds = Array.isArray(categoryValue)
                ? categoryValue
                    .map((id) => Number(id))
                    .filter((id) => !Number.isNaN(id))
                : typeof categoryValue === 'string'
                    ? categoryValue
                        .split(',')
                        .map((id) => Number(id.trim()))
                        .filter((id) => !Number.isNaN(id))
                    : [];
            if (categoryIds.length) {
                const categories = await this.dataSource
                    .getRepository(asset_category_entity_1.AssetCategory)
                    .createQueryBuilder('c')
                    .select(['c.main_category_id', 'c.main_category_name'])
                    .where('c.main_category_id IN (:...ids)', { ids: categoryIds })
                    .getMany();
                const categoryNameById = new Map(categories.map((c) => [
                    Number(c.main_category_id),
                    c.main_category_name,
                ]));
                categoryNames = categoryIds.map((id) => ({
                    id,
                    name: categoryNameById.get(id) ?? String(id),
                }));
            }
        }
        let createdByName = 'Unknown';
        if (policy.created_by) {
            const createdByUser = await this.dataSource.getRepository(organizational_user_entity_1.User).findOne({
                where: { user_id: Number(policy.created_by) },
                select: ['first_name', 'last_name', 'middle_name'],
            });
            if (createdByUser) {
                createdByName = [
                    createdByUser.first_name,
                    createdByUser.middle_name,
                    createdByUser.last_name,
                ]
                    .filter(Boolean)
                    .join(' ');
            }
        }
        return {
            ak_id: policy.policy_id,
            policy_id: policy.policy_id,
            policy_name: policy.policy_name,
            category: policy.category,
            category_names: categoryNames,
            created_by: policy.created_by ? Number(policy.created_by) : null,
            created_by_name: createdByName,
            policy_version_id: version.policy_version_id,
            version: version.version,
            status: version.status,
            released_date: version.released_date,
            policy_content: version.policy_content,
            policy_document: version.policy_document,
            acknowledge_status: ack.is_acknowledged ? 'Acknowledged' : 'Pending',
            acknowledged_at: ack.is_acknowledged ? ack.updated_at : null,
            can_acknowledge: ack.applicable_type === policy_master_entity_1.AssignTypeEnum.USER,
        };
    }
    async sendPolicyReminder(policy_id, versionId, userId) {
        const policyRepo = this.dataSource.getRepository(policy_master_entity_1.PolicyMaster);
        const versionRepo = this.dataSource.getRepository(policy_version_entity_1.PolicyVersion);
        const ackRepo = this.dataSource.getRepository(acknowledgement_entity_1.PolicyAcknowledgement);
        const policy = await policyRepo.findOne({
            where: {
                policy_id: Number(policy_id),
                is_deleted: 0,
            },
        });
        if (!policy) {
            throw new common_1.NotFoundException(`Policy ${policy_id} not found`);
        }
        const target = await versionRepo.findOne({
            where: {
                policy_version_id: Number(versionId),
                policy_id: Number(policy_id),
            },
        });
        if (!target) {
            throw new common_1.NotFoundException(`Version ${versionId} not found for policy ${policy_id}`);
        }
        console.log('POLICY MASTER:', policy);
        console.log('POLICY VERSION:', target);
        const pendingAcks = await ackRepo.find({
            where: {
                policy_id: Number(policy_id),
                policy_version_id: Number(versionId),
                is_acknowledged: false,
            },
        });
        if (!pendingAcks.length) {
            return {
                status: true,
                message: 'No pending acknowledgements. Reminder not sent.',
            };
        }
        const userIds = pendingAcks
            .map((ack) => Number(ack.applicable_to_id))
            .filter((id) => !Number.isNaN(id));
        if (!userIds.length) {
            return {
                status: true,
                message: 'No pending users found. Reminder not sent.',
            };
        }
        const users = await this.userRepository
            .createQueryBuilder('user')
            .select([
            'user.user_id',
            'user.first_name',
            'user.last_name',
            'user.users_business_email',
            'user.phone_number',
        ])
            .where('user.user_id IN (:...userIds)', {
            userIds,
        })
            .andWhere('user.is_deleted = :isDeleted', {
            isDeleted: 0,
        })
            .andWhere('user.is_active = :isActive', {
            isActive: 1,
        })
            .getMany();
        console.log('POINT:1');
        if (!users.length) {
            return {
                status: true,
                message: 'No active pending users found. Reminder not sent.',
            };
        }
        const recipients = users.map((user) => ({
            recipient_type: 'user',
            recipient_id: String(user.user_id),
            recipient_email: user.users_business_email,
            recipient_contact: user.phone_number,
        }));
        const EVENT_ID = 64;
        const contextData = {
            policy: {
                policy_id: String(policy.policy_id),
                policy_version_id: String(target.policy_version_id),
                policy_name: policy.policy_name,
                policy_version: String(target.version),
            },
        };
        console.log('Reminder contextData:', contextData);
        console.log('Reminder recipients:', recipients);
        await this.notificationHelper.triggerEventNotification({
            eventId: EVENT_ID,
            contextData,
            recipients,
            meta: {
                trace_id: `POLICY_REMINDER_${policy_id}_${versionId}`,
            },
        });
        return {
            status: true,
            message: `Reminder sent to ${recipients.length} pending user(s)`,
            data: {
                policy_id: Number(policy_id),
                policy_version_id: Number(versionId),
                recipients_count: recipients.length,
            },
        };
    }
    async acknowledgePolicy(policy_id, versionId, userId) {
        const ackRepo = this.dataSource.getRepository(acknowledgement_entity_1.PolicyAcknowledgement);
        const userRepo = this.dataSource.getRepository(organizational_user_entity_1.User);
        const user = await userRepo.findOne({
            where: {
                user_id: userId,
            },
            select: ['user_id', 'department_id', 'branch_id'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User ${userId} not found`);
        }
        const conditions = [
            {
                applicable_type: policy_master_entity_1.AssignTypeEnum.USER,
                applicable_to_id: userId,
            },
        ];
        if (user.department_id) {
            conditions.push({
                applicable_type: policy_master_entity_1.AssignTypeEnum.DEPARTMENT,
                applicable_to_id: user.department_id,
            });
        }
        if (user.branch_id) {
            conditions.push({
                applicable_type: policy_master_entity_1.AssignTypeEnum.BRANCH,
                applicable_to_id: user.branch_id,
            });
        }
        const ackRows = await ackRepo.find({
            where: conditions.map((condition) => ({
                policy_id,
                policy_version_id: versionId,
                ...condition,
            })),
            order: {
                applicable_type: 'ASC',
            },
        });
        if (!ackRows.length) {
            throw new common_1.BadRequestException('Acknowledgement record not found for this policy.');
        }
        const ackRow = ackRows.find((ack) => ack.applicable_type === policy_master_entity_1.AssignTypeEnum.USER) ??
            ackRows[0];
        ackRow.is_acknowledged = true;
        ackRow.is_seen = true;
        ackRow.updated_by = userId;
        return ackRepo.save(ackRow);
    }
    async getAcknowledgements(policy_id, policy_version_id, ackType, dto) {
        const limit = Math.min(Math.max(Number(dto.pagination?.limit || 10), 1), 100);
        const cursorToken = typeof dto.cursor === 'string' ? dto.cursor : null;
        const direction = dto.direction === 'prev' ? 'prev' : 'next';
        const jumpToLast = dto.jumpToLast === true;
        const jumpPage = dto.page
            ? Number(dto.page)
            : undefined;
        const usingOffset = !!jumpPage && jumpPage > 1 && !jumpToLast;
        const ackRepo = this.dataSource.getRepository(acknowledgement_entity_1.PolicyAcknowledgement);
        const buildBaseQuery = (qb) => qb
            .where('ak.policy_id = :policy_id', { policy_id })
            .andWhere('ak.policy_version_id = :policy_version_id', {
            policy_version_id,
        });
        const applyTypeFilter = (qb) => {
            if (ackType === 'ACCEPTED') {
                qb.andWhere('ak.is_acknowledged = true');
            }
            else if (ackType === 'NOT_ACCEPTED') {
                qb.andWhere('ak.is_acknowledged = false');
            }
        };
        const countKey = `policy_ack:${policy_id}:${policy_version_id}:${ackType}:1:${limit}`;
        const total = await (0, keyset_pagination_1.getCachedCount)(this.redisService, countKey, async () => {
            const countQb = buildBaseQuery(ackRepo.createQueryBuilder('ak'));
            applyTypeFilter(countQb);
            return countQb.getCount();
        }, 30);
        const idColumn = 'ak_ak_id';
        const idDbColumn = 'ak.ak_id';
        const sortableMap = {
            ak_ak_id: 'ak.ak_id',
            ak_created_at: 'ak.created_at',
            ak_applicable_type: 'ak.applicable_type',
        };
        const defaultSort = { column: 'ak_created_at', order: 'DESC' };
        const sortArray = (dto.sort || []).length
            ? dto.sort.map((s) => ({
                column: `ak_${s.column}`,
                order: s.order,
            }))
            : [defaultSort];
        const qb = buildBaseQuery(ackRepo
            .createQueryBuilder('ak')
            .leftJoin(organizational_user_entity_1.User, 'u', `ak.applicable_type = 'USER' AND ak.applicable_to_id = u.user_id`)
            .leftJoin(branches_entity_1.Branch, 'b', `ak.applicable_type = 'BRANCH' AND ak.applicable_to_id = b.branch_id`)
            .leftJoin(department_entity_1.Department, 'd', `ak.applicable_type = 'DEPARTMENT' AND ak.applicable_to_id = d.department_id`)
            .leftJoin(assets_project_entity_1.AssetsProject, 'p', `ak.applicable_type = 'PROJECT' AND ak.applicable_to_id = p.project_id`)
            .leftJoin(locations_entity_1.Locations, 'l', `ak.applicable_type = 'LOCATION' AND ak.applicable_to_id = l.location_id`)
            .select([
            'ak.ak_id',
            'ak.policy_id',
            'ak.policy_version_id',
            'ak.applicable_type',
            'ak.applicable_to_id',
            'ak.is_acknowledged',
            'ak.is_forced_ack',
            'ak.is_seen',
            'ak.created_at',
            'ak.updated_at',
            'ak.created_by',
            'ak.updated_by',
            `CASE
          WHEN ak.applicable_type = 'USER' THEN CONCAT(u.first_name, ' ', COALESCE(u.last_name, ''))
          WHEN ak.applicable_type = 'BRANCH' THEN b.branch_name
          WHEN ak.applicable_type = 'DEPARTMENT' THEN d.department_name
          WHEN ak.applicable_type = 'PROJECT' THEN p.project_name
          WHEN ak.applicable_type = 'LOCATION' THEN l.location_name
          ELSE ak.applicable_to_id::text
        END AS applicable_to_name`,
        ]));
        applyTypeFilter(qb);
        let plan;
        if (jumpToLast) {
            plan = (0, keyset_pagination_1.buildKeyset)({
                qb,
                columnMap: sortableMap,
                sort: sortArray,
                defaultSort,
                idColumn,
                idDbColumn,
                cursor: null,
                direction: 'prev',
            });
        }
        else if (usingOffset) {
            plan = (0, keyset_pagination_1.buildKeyset)({
                qb,
                columnMap: sortableMap,
                sort: sortArray,
                defaultSort,
                idColumn,
                idDbColumn,
                cursor: null,
                direction: 'next',
            });
            (0, keyset_pagination_1.applyOffsetRaw)(qb, jumpPage, limit);
        }
        else {
            plan = (0, keyset_pagination_1.buildKeyset)({
                qb,
                columnMap: sortableMap,
                sort: sortArray,
                defaultSort,
                idColumn,
                idDbColumn,
                cursor: cursorToken,
                direction,
            });
        }
        const idResult = usingOffset
            ? await qb.getRawMany()
            : await qb.limit(limit + 1).getRawMany();
        const idRows = idResult.map((r) => ({
            ...r,
            [plan.sortColumn]: r[plan.sortColumn],
            [idColumn]: Number(r[idColumn]),
        }));
        const totalPages = total > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
        let ackIds;
        let meta;
        if (usingOffset) {
            ackIds = idRows.map((r) => r[idColumn]);
            const first = idRows[0];
            const last = idRows[idRows.length - 1];
            meta = (0, keyset_pagination_1.buildListMeta)({
                page: {
                    data: idRows,
                    startCursor: first
                        ? (0, keyset_pagination_1.encodeCursor)({
                            v: first[plan.sortColumn] ?? null,
                            id: first[idColumn],
                        })
                        : null,
                    endCursor: last
                        ? (0, keyset_pagination_1.encodeCursor)({
                            v: last[plan.sortColumn] ?? null,
                            id: last[idColumn],
                        })
                        : null,
                    hasNextPage: jumpPage < totalPages,
                    hasPrevPage: jumpPage > 1,
                },
                limit,
                total,
                currentPage: jumpPage,
            });
        }
        else {
            const page = (0, keyset_pagination_1.finalizePage)({
                rows: idRows,
                limit,
                plan,
                idColumn,
                hadCursor: !!cursorToken,
            });
            ackIds = page.data.map((r) => r[idColumn]);
            if (jumpToLast) {
                page.hasNextPage = false;
                page.hasPrevPage = total > page.data.length;
            }
            meta = (0, keyset_pagination_1.buildListMeta)({
                page,
                limit,
                total,
                currentPage: jumpToLast ? totalPages : 1,
            });
        }
        if (!ackIds.length) {
            return { status: true, rows: [], count: 0, total, meta };
        }
        const rows = await ackRepo
            .createQueryBuilder('ak')
            .leftJoin(organizational_user_entity_1.User, 'u', `ak.applicable_type = 'USER' AND ak.applicable_to_id = u.user_id`)
            .leftJoin(branches_entity_1.Branch, 'b', `ak.applicable_type = 'BRANCH' AND ak.applicable_to_id = b.branch_id`)
            .leftJoin(department_entity_1.Department, 'd', `ak.applicable_type = 'DEPARTMENT' AND ak.applicable_to_id = d.department_id`)
            .leftJoin(assets_project_entity_1.AssetsProject, 'p', `ak.applicable_type = 'PROJECT' AND ak.applicable_to_id = p.project_id`)
            .leftJoin(locations_entity_1.Locations, 'l', `ak.applicable_type = 'LOCATION' AND ak.applicable_to_id = l.location_id`)
            .select([
            'ak.ak_id',
            'ak.policy_id',
            'ak.policy_version_id',
            'ak.applicable_type',
            'ak.applicable_to_id',
            'ak.is_acknowledged',
            'ak.is_forced_ack',
            'ak.is_seen',
            'ak.created_at',
            'ak.updated_at',
            'ak.created_by',
            'ak.updated_by',
            `CASE
        WHEN ak.applicable_type = 'USER' THEN CONCAT(u.first_name, ' ', COALESCE(u.last_name, ''))
        WHEN ak.applicable_type = 'BRANCH' THEN b.branch_name
        WHEN ak.applicable_type = 'DEPARTMENT' THEN d.department_name
        WHEN ak.applicable_type = 'PROJECT' THEN p.project_name
        WHEN ak.applicable_type = 'LOCATION' THEN l.location_name
        ELSE ak.applicable_to_id::text
      END AS applicable_to_name`,
        ])
            .where('ak.ak_id IN (:...ackIds)', { ackIds })
            .getRawMany();
        const orderMap = new Map(ackIds.map((id, index) => [id, index]));
        rows.sort((a, b) => (orderMap.get(Number(a.ak_ak_id)) ?? 0) -
            (orderMap.get(Number(b.ak_ak_id)) ?? 0));
        return { status: true, rows, count: rows.length, total, meta };
    }
};
exports.PolicyService = PolicyService;
exports.PolicyService = PolicyService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, typeorm_1.InjectRepository)(organizational_user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        request_context_service_1.RequestContextService,
        redis_service_1.RedisService,
        notifications_helper_1.NotificationHelper,
        typeorm_2.Repository])
], PolicyService);
