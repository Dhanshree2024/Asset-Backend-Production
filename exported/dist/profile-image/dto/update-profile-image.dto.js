"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileImageDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_profile_image_dto_1 = require("./create-profile-image.dto");
class UpdateProfileImageDto extends (0, mapped_types_1.PartialType)(create_profile_image_dto_1.CreateProfileImageDto) {
}
exports.UpdateProfileImageDto = UpdateProfileImageDto;
