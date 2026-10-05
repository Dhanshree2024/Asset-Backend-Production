"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAssetWorkingStatusDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_asset_working_status_dto_1 = require("./create-asset-working-status.dto");
class UpdateAssetWorkingStatusDto extends (0, mapped_types_1.PartialType)(create_asset_working_status_dto_1.CreateAssetWorkingStatusDto) {
}
exports.UpdateAssetWorkingStatusDto = UpdateAssetWorkingStatusDto;
