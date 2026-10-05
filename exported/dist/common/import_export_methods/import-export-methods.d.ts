declare class ImportExportsMethods {
    constructor();
    generateExcelTemplate({ sheetName, instructions, headers, dropdownData, startRow, }: {
        sheetName: string;
        instructions: string[];
        headers: {
            label: string;
            required?: boolean;
            dropdown?: string;
        }[];
        dropdownData: Record<string, string[]>;
        startRow?: number;
    }): Promise<any>;
}
export declare const ImportExportUtil: ImportExportsMethods;
export {};
