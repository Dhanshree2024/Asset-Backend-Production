"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAssetDatumDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_asset_datum_dto_1 = require("./create-asset-datum.dto");
class UpdateAssetDatumDto extends (0, mapped_types_1.PartialType)(create_asset_datum_dto_1.CreateAssetDatumDto) {
}
exports.UpdateAssetDatumDto = UpdateAssetDatumDto;
