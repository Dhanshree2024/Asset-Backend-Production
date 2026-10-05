"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAssetCategoryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_asset_category_dto_1 = require("./create-asset-category.dto");
class UpdateAssetCategoryDto extends (0, mapped_types_1.PartialType)(create_asset_category_dto_1.CreateAssetCategoryDto) {
}
exports.UpdateAssetCategoryDto = UpdateAssetCategoryDto;
