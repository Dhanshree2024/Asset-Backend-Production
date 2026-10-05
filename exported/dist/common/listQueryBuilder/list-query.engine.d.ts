import { SelectQueryBuilder } from 'typeorm';
type AnyObj = Record<string, any>;
export declare class ListQueryEngine {
    private qb;
    constructor(qb: SelectQueryBuilder<any>);
    applyVisibleColumns(visibleColumns?: Record<string, boolean>, alias?: string): this;
    applySearch(searchArray?: any[], searchableColumns?: string[], alias?: string): this;
    applyFilters(filters?: any[], intColumns?: string[], alias?: string): this;
    applyCursor(cursor: any, idField: string, alias?: string, order?: 'ASC' | 'DESC'): this;
    applySort(sortArray: any[], defaultColumn: string, alias?: string): this;
    applyDateFilter(dateBetween: any, alias?: string): this;
    applyRangeFilters(rangeFilters?: any[], alias?: string): this;
    build(payload: any, config: AnyObj): this;
    getQueryBuilder(): SelectQueryBuilder<any>;
}
export {};
