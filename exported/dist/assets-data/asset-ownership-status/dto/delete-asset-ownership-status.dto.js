"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAssetOwnershipStatusDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_asset_ownership_status_dto_1 = require("./create-asset-ownership-status.dto");
class DeleteAssetOwnershipStatusDto extends (0, mapped_types_1.PartialType)(create_asset_ownership_status_dto_1.CreateAssetOwnershipStatusDto) {
}
exports.DeleteAssetOwnershipStatusDto = DeleteAssetOwnershipStatusDto;
