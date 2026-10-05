"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantRepository = getTenantRepository;
exports.withTenantRepository = withTenantRepository;
async function getTenantRepository(dataSource, entity, schema) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query(`SET search_path TO ${schema}, public`);
    return queryRunner.manager.getRepository(entity);
}
async function withTenantRepository(dataSource, entity, schema, callback) {
    const queryRunner = dataSource.createQueryRunner();
    try {
        await queryRunner.connect();
        await queryRunner.query(`SET search_path TO ${schema}, public`);
        const repo = queryRunner.manager.getRepository(entity);
        await callback(repo);
    }
    finally {
        await queryRunner.release();
    }
}
