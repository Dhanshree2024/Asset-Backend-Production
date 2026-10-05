"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireSpecial = exports.RequireAction = exports.PERMISSION_META = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISSION_META = 'asset_permission_requirement';
const RequireAction = (module, submodule, action) => (0, common_1.SetMetadata)(exports.PERMISSION_META, {
    kind: 'action',
    module,
    submodule,
    action,
});
exports.RequireAction = RequireAction;
const RequireSpecial = (module, submodule, attrKey) => (0, common_1.SetMetadata)(exports.PERMISSION_META, {
    kind: 'special',
    module,
    submodule,
    attrKey,
});
exports.RequireSpecial = RequireSpecial;
