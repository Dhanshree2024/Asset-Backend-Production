"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportExportUtil = void 0;
const XlsxPopulate = __importStar(require("xlsx-populate"));
class ImportExportsMethods {
    constructor() { }
    async generateExcelTemplate({ sheetName, instructions = [], headers = [], dropdownData = {}, startRow = 8, }) {
        const workbook = await XlsxPopulate.fromBlankAsync();
        const mainSheet = workbook.sheet(0);
        mainSheet.name(sheetName);
        const dataSheet = workbook.addSheet("Data");
        instructions.forEach((text, index) => {
            mainSheet
                .cell(index + 1, 1)
                .value(text)
                .style({ bold: true, fontColor: "0000FF" });
        });
        const headerRow = startRow - 1;
        headers.forEach((h, i) => {
            const cell = mainSheet
                .cell(headerRow, i + 1)
                .value(h.label)
                .style({ bold: true });
            if (h.required)
                cell.style({ fill: "FFCCCC" });
            mainSheet.column(i + 1).width(25);
        });
        const dropdownRanges = {};
        let colCounter = 1;
        Object.keys(dropdownData).forEach((key) => {
            const values = dropdownData[key];
            values.forEach((v, i) => dataSheet.cell(i + 1, colCounter).value(v));
            dropdownRanges[key] = `Data!$${String.fromCharCode(64 + colCounter)}$1:$${String.fromCharCode(64 + colCounter)}$${values.length}`;
            colCounter++;
        });
        const maxRows = 1048576;
        headers.forEach((h, index) => {
            if (h.dropdown) {
                const formula = dropdownRanges[h.dropdown];
                mainSheet
                    .range(`${String.fromCharCode(65 + index)}${startRow}:${String.fromCharCode(65 + index)}${maxRows}`)
                    .dataValidation({
                    type: "list",
                    formula1: formula,
                    allowBlank: true,
                    error: "Invalid selection.",
                });
            }
        });
        dataSheet.hidden(true);
        return workbook.outputAsync();
    }
}
exports.ImportExportUtil = new ImportExportsMethods();
