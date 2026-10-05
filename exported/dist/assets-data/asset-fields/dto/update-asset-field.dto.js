"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAssetFieldDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_asset_field_dto_1 = require("./create-asset-field.dto");
class UpdateAssetFieldDto extends (0, mapped_types_1.PartialType)(create_asset_field_dto_1.CreateAssetFieldDto) {
}
exports.UpdateAssetFieldDto = UpdateAssetFieldDto;
