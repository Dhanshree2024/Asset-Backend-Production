"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListQueryEngine = void 0;
class ListQueryEngine {
    constructor(qb) {
        this.qb = qb;
    }
    applyVisibleColumns(visibleColumns = {}, alias = 'v') {
        const cols = Object.keys(visibleColumns).filter((key) => visibleColumns[key]);
        if (!cols.length) {
            this.qb.select(`${alias}.*`);
            return this;
        }
        this.qb.select(cols.map((c) => `${alias}.${c}`));
        return this;
    }
    applySearch(searchArray = [], searchableColumns = [], alias = 'v') {
        searchArray.forEach((s, index) => {
            const value = s?.values?.join(' ')?.trim();
            if (!value)
                return;
            const conditions = searchableColumns.map((col) => `${alias}.${col} ILIKE :s${index}`);
            this.qb.andWhere(`(${conditions.join(' OR ')})`, {
                [`s${index}`]: `%${value}%`,
            });
        });
        return this;
    }
    applyFilters(filters = [], intColumns = [], alias = 'v') {
        for (const f of filters) {
            if (!f.values?.length)
                continue;
            const isInt = intColumns.includes(f.column);
            const values = f.values
                .map((v) => (isInt ? Number(v) : v))
                .filter((v) => v !== null && v !== undefined);
            if (!values.length)
                continue;
            if (isInt) {
                this.qb.andWhere(values.length > 1
                    ? `${alias}.${f.column} IN (:...${f.column})`
                    : `${alias}.${f.column} = :${f.column}`, {
                    [f.column]: values.length > 1 ? values : values[0],
                });
            }
            else {
                this.qb.andWhere(`${alias}.${f.column} ILIKE :${f.column}`, {
                    [f.column]: `%${values[0]}%`,
                });
            }
        }
        return this;
    }
    applyCursor(cursor, idField, alias = 'v', order = 'DESC') {
        if (!cursor?.id)
            return this;
        if (order === 'DESC') {
            this.qb.andWhere(`${alias}.${idField} < :cursor`, { cursor: cursor.id });
        }
        else {
            this.qb.andWhere(`${alias}.${idField} > :cursor`, { cursor: cursor.id });
        }
        return this;
    }
    applySort(sortArray = [], defaultColumn, alias = 'v') {
        if (!sortArray.length) {
            this.qb.orderBy(`${alias}.${defaultColumn}`, 'DESC');
            return this;
        }
        for (const s of sortArray) {
            if (!s.column)
                continue;
            this.qb.addOrderBy(`${alias}.${s.column}`, s.order?.toUpperCase() === 'DESC'
                ? 'DESC'
                : 'ASC');
        }
        return this;
    }
    applyDateFilter(dateBetween, alias = 'v') {
        if (!dateBetween?.column)
            return this;
        const start = dateBetween.start
            ? new Date(dateBetween.start)
            : null;
        const end = dateBetween.end
            ? new Date(dateBetween.end)
            : null;
        if (start)
            start.setHours(0, 0, 0, 0);
        if (end)
            end.setHours(23, 59, 59, 999);
        if (start && end) {
            this.qb.andWhere(`${alias}.${dateBetween.column} BETWEEN :start AND :end`, { start, end });
        }
        else if (start) {
            this.qb.andWhere(`${alias}.${dateBetween.column} >= :start`, { start });
        }
        else if (end) {
            this.qb.andWhere(`${alias}.${dateBetween.column} <= :end`, { end });
        }
        return this;
    }
    applyRangeFilters(rangeFilters = [], alias = 'v') {
        for (const rf of rangeFilters) {
            if (!rf.column)
                continue;
            if (rf.from !== undefined) {
                this.qb.andWhere(`${alias}.${rf.column} >= :min_${rf.column}`, {
                    [`min_${rf.column}`]: rf.from,
                });
            }
            if (rf.to !== undefined) {
                this.qb.andWhere(`${alias}.${rf.column} <= :max_${rf.column}`, {
                    [`max_${rf.column}`]: rf.to,
                });
            }
        }
        return this;
    }
    build(payload, config) {
        this.applyVisibleColumns(payload.visible_columns)
            .applySearch(payload.search, config.searchableColumns)
            .applyFilters(payload.filters, config.intColumns)
            .applyDateFilter(payload.date_between)
            .applyRangeFilters(payload.range_filters)
            .applyCursor(payload.cursor, config.cursorField, config.alias, config.order)
            .applySort(payload.sort, config.defaultSort);
        return this;
    }
    getQueryBuilder() {
        return this.qb;
    }
}
exports.ListQueryEngine = ListQueryEngine;
