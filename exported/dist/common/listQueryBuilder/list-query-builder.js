"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListQueryBuilder = void 0;
class ListQueryBuilder {
    constructor(qb) {
        this.qb = qb;
        this.alias = qb.expressionMap.mainAlias
            ? qb.expressionMap.mainAlias.name
            : "t";
    }
    applySearch(search, columns) {
        if (!search?.length || !columns?.length)
            return this;
        search.forEach((s, index) => {
            const value = s.values?.[0] || "";
            const aliasKey = `search_${index}`;
            const conditions = columns
                .map(col => `${this.alias}.${col} ILIKE :${aliasKey}`)
                .join(" OR ");
            this.qb.andWhere(`(${conditions})`, {
                [aliasKey]: `%${value}%`
            });
        });
        return this;
    }
    applyFilters(filters) {
        if (!filters?.length)
            return this;
        filters.forEach((f) => {
            if (!f.column || !f.values?.length)
                return;
            const values = f.values;
            const cleanedValues = values.map(v => isNaN(Number(v)) ? v : Number(v));
            this.qb.andWhere(`${this.alias}.${f.column} IN (:...vals_${f.column})`, { [`vals_${f.column}`]: cleanedValues });
        });
        return this;
    }
    applyRangeFilters(rangeFilters) {
        if (!rangeFilters?.length)
            return this;
        rangeFilters.forEach((rf, index) => {
            if (!rf.column)
                return;
            if (rf.from !== undefined) {
                this.qb.andWhere(`${this.alias}.${rf.column} >= :range_from_${index}`, { [`range_from_${index}`]: rf.from });
            }
            if (rf.to !== undefined) {
                this.qb.andWhere(`${this.alias}.${rf.column} <= :range_to_${index}`, { [`range_to_${index}`]: rf.to });
            }
        });
        return this;
    }
    applyDateBetween(dateBetween) {
        if (!dateBetween?.column || !dateBetween?.date)
            return this;
        const [colStart, colEnd] = dateBetween.column
            .split(",")
            .map(c => c.trim());
        const date = new Date(dateBetween.date);
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        this.qb.andWhere(`(${this.alias}.${colStart} BETWEEN :start AND :end OR 
              ${this.alias}.${colEnd} BETWEEN :start AND :end)`, { start, end });
        return this;
    }
    applyIds(ids, primaryKey) {
        if (!ids?.length)
            return this;
        this.qb.andWhere(`${this.alias}.${primaryKey} IN (:...ids)`, { ids });
        return this;
    }
    applySorting(sort, defaultSort) {
        if (sort?.length) {
            sort.forEach(s => {
                const order = s.order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
                this.qb.addOrderBy(`${this.alias}.${s.column}`, order);
            });
        }
        else {
            this.qb.orderBy(`${this.alias}.${defaultSort.column}`, defaultSort.order || "ASC");
        }
        return this;
    }
    applyVisibleColumns(visibleColumns) {
        const cols = Object.entries(visibleColumns)
            .filter(([_, show]) => show)
            .map(([col]) => `${this.alias}.${col}`);
        if (cols.length)
            this.qb.select(cols);
        return this;
    }
    applyPagination(page = 1, limit = 10) {
        this.qb.skip((page - 1) * limit).take(limit);
        return this;
    }
    build() {
        return this.qb;
    }
}
exports.ListQueryBuilder = ListQueryBuilder;
