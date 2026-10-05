import { DataSource } from 'typeorm';
export declare class DateFormatService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    formatDateDynamic(date: Date | string): Promise<string>;
    convertToPgInterval(input: string): Promise<string>;
    formatPgInterval(pgInterval: any): {
        hours: number;
        minutes: number;
    };
    formatIntervalToText(interval: any): string;
    formatTimeString(time: string | Date): string;
    calculateNetWorkingHours(startTime: Date, endTime: Date): any;
    convertPgIntervalToMilliseconds(interval: any): number;
}
