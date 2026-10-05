"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizationMetadata = getOrganizationMetadata;
const crypto_utils_1 = require("../encryption_decryption/crypto-utils");
function getOrganizationMetadata(req) {
    const organizationID = req.cookies.organization_id;
    const decrypted_organizationID = (0, crypto_utils_1.decrypt)(organizationID);
    const org_id = decrypted_organizationID;
    const encryptedSchema = req.cookies['x-organization-schema'];
    const schemaName = (0, crypto_utils_1.decrypt)(encryptedSchema.toString());
    const schema = `org_${schemaName}`;
    const system_user_id = req.cookies.system_user_id;
    const decrypted_system_user_id = (0, crypto_utils_1.decrypt)(system_user_id.toString());
    const register_login_user_id = decrypted_system_user_id;
    let branchIds = [];
    try {
        branchIds = JSON.parse(req.cookies?.branch_access || '[]').map(Number);
    }
    catch (error) {
        console.error('Error parsing branch_access:', error);
        branchIds = [];
    }
    return { org_id, schema, register_login_user_id, branchIds };
}
