"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAssetSubcategoryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_asset_subcategory_dto_1 = require("./create-asset-subcategory.dto");
class UpdateAssetSubcategoryDto extends (0, mapped_types_1.PartialType)(create_asset_subcategory_dto_1.CreateAssetSubcategoryDto) {
}
exports.UpdateAssetSubcategoryDto = UpdateAssetSubcategoryDto;
