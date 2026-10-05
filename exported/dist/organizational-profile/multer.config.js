"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerOptions = exports.multerStorage = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const crypto_utils_1 = require("../common/encryption_decryption/crypto-utils");
exports.multerStorage = (0, multer_1.diskStorage)({
    destination: './uploads',
    filename: (req, file, cb) => {
        const orgId = (0, crypto_utils_1.decrypt)(req.cookies.organization_id);
        const timestamp = Date.now();
        const ext = (0, path_1.extname)(file.originalname);
        const filename = `org-${orgId}-${timestamp}${ext}`;
        cb(null, filename);
    },
});
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
exports.multerOptions = {
    storage: exports.multerStorage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Only jpg, png, svg files are allowed'), false);
        }
        cb(null, true);
    },
};
