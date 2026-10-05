"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseMetric = exports.AssetType = exports.WarrantyType = exports.ItemType = void 0;
var ItemType;
(function (ItemType) {
    ItemType["PHYSICAL"] = "Physical";
    ItemType["VIRTUAL"] = "Virtual";
})(ItemType || (exports.ItemType = ItemType = {}));
var WarrantyType;
(function (WarrantyType) {
    WarrantyType["WARRANTY_DETAILS"] = "WARRANTY DETAILS";
    WarrantyType["SUPPORT"] = "SUPPORT";
    WarrantyType["AMC"] = "AMC";
    WarrantyType["SERVICE"] = "SERVICE";
    WarrantyType["SUBSCRIPTION"] = "SUBSCRIPTION";
})(WarrantyType || (exports.WarrantyType = WarrantyType = {}));
var AssetType;
(function (AssetType) {
    AssetType["TANGIBLE"] = "TANGIBLE";
    AssetType["INTANGIBLE"] = "INTANGIBLE";
})(AssetType || (exports.AssetType = AssetType = {}));
var LicenseMetric;
(function (LicenseMetric) {
    LicenseMetric["PER_DEVICE"] = "PER_DEVICE";
    LicenseMetric["PER_USER"] = "PER_USER";
    LicenseMetric["HYBRID"] = "HYBRID";
    LicenseMetric["SITE"] = "SITE";
    LicenseMetric["FREE"] = "FREE";
})(LicenseMetric || (exports.LicenseMetric = LicenseMetric = {}));
