"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageFileFilter = exports.generateSimpleStorage = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const fs = __importStar(require("fs"));
const generateSimpleStorage = (type) => {
    return (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            const rawOrgName = req.body.org || req.cookies?.organization_name || 'default-org';
            const safeOrgName = rawOrgName.replace(/[^a-zA-Z0-9_-]/g, '');
            const folder = `uploads/${safeOrgName}`;
            fs.mkdirSync(folder, { recursive: true });
            cb(null, folder);
        },
        filename: (req, file, cb) => {
            const ext = (0, path_1.extname)(file.originalname);
            const date = new Date().toISOString().split('T')[0];
            const rawOrgName = req.body.org || req.cookies?.organization_name || 'org';
            const orgName = rawOrgName.replace(/[^a-zA-Z0-9_-]/g, '');
            const userId = req.body.userId || '0000';
            const username = req.body.username || 'user';
            const safeUsername = username.replace(/[^a-zA-Z0-9_-]/g, '');
            let filename = '';
            if (type === 'company') {
                filename = `org-${orgName}-${date}${ext}`;
            }
            else {
                filename = `user-${userId}-${safeUsername}-${date}${ext}`;
            }
            cb(null, filename);
        },
    });
};
exports.generateSimpleStorage = generateSimpleStorage;
const imageFileFilter = (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpeg|png|jpg)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
exports.imageFileFilter = imageFileFilter;
