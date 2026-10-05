import { SelectQueryBuilder } from "typeorm";
export declare class ListQueryBuilder<T> {
    private qb;
    private alias;
    constructor(qb: SelectQueryBuilder<T>);
    applySearch(search: any[], columns: string[]): this;
    applyFilters(filters: any[]): this;
    applyRangeFilters(rangeFilters: any[]): this;
    applyDateBetween(dateBetween: any): this;
    applyIds(ids: number[], primaryKey: string): this;
    applySorting(sort: any[], defaultSort: any): this;
    applyVisibleColumns(visibleColumns: Record<string, boolean>): this;
    applyPagination(page?: number, limit?: number): this;
    build(): SelectQueryBuilder<T>;
}
