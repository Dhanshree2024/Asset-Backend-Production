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
exports.saveBase64ImageSubcategory = exports.saveBase64Image = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const slugify_1 = require("./slugify");
const saveBase64Image = async (base64, categoryName) => {
    const matches = base64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!matches)
        throw new Error('Invalid base64 image');
    let ext = matches[1].split('/')[1];
    const data = matches[2];
    if (ext === 'svg+xml')
        ext = 'svg';
    const buffer = Buffer.from(data, 'base64');
    const slug = (0, slugify_1.slugify)(categoryName);
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
    const fileName = `${slug}_${timestamp}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'uploads', 'category-icons');
    if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });
    const fullPath = path.join(uploadDir, fileName);
    fs.writeFileSync(fullPath, buffer);
    return `uploads/category-icons/${fileName}`;
};
exports.saveBase64Image = saveBase64Image;
const saveBase64ImageSubcategory = async (base64, categoryName) => {
    const matches = base64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!matches)
        throw new Error('Invalid base64 image');
    let ext = matches[1].split('/')[1];
    const data = matches[2];
    if (ext === 'svg+xml')
        ext = 'svg';
    const buffer = Buffer.from(data, 'base64');
    const slug = (0, slugify_1.slugify)(categoryName);
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
    const fileName = `${slug}_${timestamp}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'uploads', 'subcategory-icons');
    if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });
    const fullPath = path.join(uploadDir, fileName);
    fs.writeFileSync(fullPath, buffer);
    return `uploads/subcategory-icons/${fileName}`;
};
exports.saveBase64ImageSubcategory = saveBase64ImageSubcategory;
