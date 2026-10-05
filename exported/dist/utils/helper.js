"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSerialNumber = generateSerialNumber;
function generateSerialNumber(asset = null) {
    const activeAsset = asset;
    const prefix = activeAsset?.substring(0, 3).toUpperCase() || 'AST';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomNum}`;
}
;
