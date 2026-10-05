"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAssetCostCenterDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_asset_cost_center_dto_1 = require("./create-asset-cost-center.dto");
class UpdateAssetCostCenterDto extends (0, mapped_types_1.PartialType)(create_asset_cost_center_dto_1.CreateAssetCostCenterDto) {
}
exports.UpdateAssetCostCenterDto = UpdateAssetCostCenterDto;
