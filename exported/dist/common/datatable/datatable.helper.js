"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTableHelper = void 0;
class DataTableHelper {
    static async applyPagination(qb, query) {
        console.log("Received Query Params: ", query);
        const limit = query.limit || 10;
        let parsedFilters = {};
        if (query.filters) {
            try {
                parsedFilters =
                    typeof query.filters === "string"
                        ? JSON.parse(decodeURIComponent(query.filters))
                        : query.filters;
            }
            catch (error) {
                console.error("Invalid filters format:", error);
                parsedFilters = {};
            }
        }
        let parsedSearchFields = [];
        if (typeof query.searchFields === "string") {
            try {
                parsedSearchFields = JSON.parse(query.searchFields);
            }
            catch (error) {
                console.error("Failed to parse searchFields:", error);
                parsedSearchFields = [query.searchFields];
            }
        }
        else if (Array.isArray(query.searchFields)) {
            parsedSearchFields = query.searchFields;
        }
        console.log("Final searchFields array:", parsedSearchFields);
        let parsedOrderBy = [];
        if (typeof query.orderBy === "string") {
            try {
                parsedOrderBy = JSON.parse(query.orderBy);
            }
            catch (error) {
                console.error("Failed to parse orderBy:", error);
                parsedOrderBy = [];
            }
        }
        else if (Array.isArray(query.orderBy) && query.orderBy.every(item => Array.isArray(item) && item.length === 2)) {
            parsedOrderBy = query.orderBy;
        }
        console.log("Final orderBy array:", parsedOrderBy);
        const entityMetadata = qb.connection.getMetadata(qb.alias);
        const numericColumns = entityMetadata.columns
            .filter(col => ["int", "bigint", "smallint", "decimal", "numeric", "integer"].includes(col.type))
            .map(col => col.propertyName);
        console.log("Detected Numeric Columns: ", numericColumns);
        if (query.search && parsedSearchFields.length > 0) {
            const searchConditions = parsedSearchFields
                .map(field => {
                if (numericColumns.includes(field)) {
                    return `${qb.alias}.${field} = :search`;
                }
                return `${qb.alias}.${field}::TEXT ILIKE :search`;
            })
                .join(" OR ");
            const isNumericSearch = !isNaN(Number(query.search));
            qb.andWhere(`(${searchConditions})`, {
                search: isNumericSearch ? Number(query.search) : `%${query.search}%`,
            });
        }
        Object.keys(parsedFilters).forEach(field => {
            qb.andWhere(`${qb.alias}.${field} = :${field}`, {
                [field]: parsedFilters[field],
            });
        });
        if (parsedOrderBy.length > 0) {
            parsedOrderBy.forEach(([column, direction]) => {
                qb.addOrderBy(`${qb.alias}.${column}`, direction);
            });
        }
        else {
            qb.orderBy(`${qb.alias}.created_at`, "DESC");
        }
        qb.take(limit);
        const data = await qb.getMany();
        const nextCursor = data.length ? data[data.length - 1][parsedOrderBy[0]?.[0] || "created_at"] : null;
        return { data, nextCursor };
    }
}
exports.DataTableHelper = DataTableHelper;
