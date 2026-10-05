"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAssetItemsFieldsMappingDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_asset_items_fields_mapping_dto_1 = require("./create-asset-items-fields-mapping.dto");
class UpdateAssetItemsFieldsMappingDto extends (0, mapped_types_1.PartialType)(create_asset_items_fields_mapping_dto_1.CreateAssetItemsFieldsMappingDto) {
}
exports.UpdateAssetItemsFieldsMappingDto = UpdateAssetItemsFieldsMappingDto;
