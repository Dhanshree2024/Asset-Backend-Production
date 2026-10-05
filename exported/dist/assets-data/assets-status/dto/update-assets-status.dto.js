"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAssetsStatusDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_assets_status_dto_1 = require("./create-assets-status.dto");
class UpdateAssetsStatusDto extends (0, mapped_types_1.PartialType)(create_assets_status_dto_1.CreateAssetsStatusDto) {
}
exports.UpdateAssetsStatusDto = UpdateAssetsStatusDto;
