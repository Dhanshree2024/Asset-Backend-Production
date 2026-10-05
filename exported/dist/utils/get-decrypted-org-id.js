"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecryptedOrgId = getDecryptedOrgId;
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
function getDecryptedOrgId(req) {
    const orgCookie = req.cookies.organization_id;
    const decrypted = (0, crypto_utils_1.decrypt)(orgCookie);
    if (!decrypted || isNaN(Number(decrypted))) {
        throw new Error('Invalid or missing organization ID');
    }
    return Number(decrypted);
}
