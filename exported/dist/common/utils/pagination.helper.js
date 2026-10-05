"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyCursorOrOffsetPagination = applyCursorOrOffsetPagination;
exports.buildPaginationResult = buildPaginationResult;
exports.applyCursorPagination = applyCursorPagination;
exports.newapplyCursorPagination = newapplyCursorPagination;
exports.applyLocationTransferCursorPagination = applyLocationTransferCursorPagination;
exports.applyMaintenanceCursorPagination = applyMaintenanceCursorPagination;
exports.applyScrapCursorPagination = applyScrapCursorPagination;
exports.applySearch = applySearch;
const typeorm_1 = require("typeorm");
function applyCursorOrOffsetPagination({ qb, alias, cursor, idField = 'maintenance_id', order = 'DESC', }) {
    console.log('cursor', cursor);
    const orderColumn = `${alias}.${idField}`;
    const cursorId = cursor?.id;
    if (Object.keys(qb.expressionMap.orderBys).length === 0) {
        qb.orderBy(orderColumn, order);
    }
    if (cursorId !== undefined && cursorId !== null) {
        qb.andWhere(`${orderColumn} ${order === 'DESC' ? '<' : '>'} :cursorId`, {
            cursorId,
        });
    }
    return qb;
}
function buildPaginationResult({ data, limit, idField = 'id', dateField = 'created_at', }) {
    const hasNextPage = data.length > limit;
    if (hasNextPage)
        data.pop();
    const firstItem = data[0];
    const lastItem = data[data.length - 1];
    return {
        data,
        meta: {
            limit,
            hasNextPage,
            nextCursor: lastItem
                ? {
                    created_at: lastItem[dateField],
                    id: lastItem[idField],
                }
                : null,
            prevCursor: firstItem
                ? {
                    created_at: firstItem[dateField],
                    id: firstItem[idField],
                }
                : null,
        },
    };
}
function applyCursorPagination({ qb, alias, cursor, idField, order = 'DESC', }) {
    console.log('CUSRSER', cursor);
    const column = `${alias}.${idField}`;
    if (Object.keys(qb.expressionMap.orderBys).length === 0) {
        qb.expressionMap.orderBys = {
            [`${alias}.${idField}`]: {
                order,
                nulls: 'NULLS LAST',
            },
        };
    }
    if (cursor?.id) {
        qb.andWhere(`${column} ${order === 'DESC' ? '<' : '>'} :cursorId`, {
            cursorId: cursor.id,
        });
    }
    return qb;
}
function newapplyCursorPagination({ qb, alias, cursor, idField, sortField, order = 'DESC', }) {
    const idColumn = `${alias}.${idField}`;
    const actualSortField = sortField || idField;
    const sortColumn = actualSortField.startsWith(`${alias}.`)
        ? actualSortField
        : actualSortField.includes('.')
            ? actualSortField
            : `${alias}.${actualSortField}`;
    if (Object.keys(qb.expressionMap.orderBys).length === 0) {
        qb.expressionMap.orderBys = {
            [sortColumn]: { order, nulls: 'NULLS LAST' },
            [idColumn]: { order, nulls: 'NULLS LAST' },
        };
    }
    if (!cursor?.id || cursor?.sortValue === undefined)
        return qb;
    const isBackward = cursor.direction === 'backward';
    console.log('=================================');
    console.log('CURSOR PAGINATION');
    console.log('Cursor:', cursor);
    console.log('Backward:', isBackward);
    console.log('Order:', order);
    if (isBackward) {
        console.log('BACKWARD PAGINATION');
        if (order === 'DESC') {
            console.log('Applying WHERE:');
            console.log(`
Backward DESC WHERE

${sortColumn} > ${cursor.sortValue}
OR
(${sortColumn} = ${cursor.sortValue}
AND ${idColumn} > ${cursor.id})
`);
            qb.andWhere(`(
          ${sortColumn} > :sortValue
          OR (
            ${sortColumn} = :sortValue
            AND ${idColumn} > :cursorId
          )
        )`, { sortValue: cursor.sortValue, cursorId: cursor.id });
        }
        else {
            console.log('Applying WHERE:');
            console.log(`
Forward DESC WHERE

${sortColumn} < ${cursor.sortValue}
OR
(${sortColumn} = ${cursor.sortValue}
AND ${idColumn} < ${cursor.id})
`);
            qb.andWhere(`(
          ${sortColumn} < :sortValue
          OR (
            ${sortColumn} = :sortValue
            AND ${idColumn} < :cursorId
          )
        )`, { sortValue: cursor.sortValue, cursorId: cursor.id });
        }
    }
    else {
        console.log('FORWARD CHECK');
        if (order === 'DESC') {
            console.log('INSIDE DESC');
            qb.andWhere(`(
          ${sortColumn} < :sortValue
          OR (
            ${sortColumn} = :sortValue
            AND ${idColumn} < :cursorId
          )
        )`, { sortValue: cursor.sortValue, cursorId: cursor.id });
        }
        else {
            console.log('INSIDE ASC');
            qb.andWhere(`(
          ${sortColumn} > :sortValue
          OR (
            ${sortColumn} = :sortValue
            AND ${idColumn} > :cursorId
          )
        )`, { sortValue: cursor.sortValue, cursorId: cursor.id });
        }
    }
    return qb;
}
function applyLocationTransferCursorPagination({ qb, alias, cursor, order = 'DESC', }) {
    if (!cursor?.requested_at || !cursor?.location_transfer_id)
        return qb;
    if (order === 'DESC') {
        qb.andWhere(`(
        ${alias}.requested_at < :requestedAt::timestamp
        OR (
          ${alias}.requested_at = :requestedAt::timestamp
          AND ${alias}.location_transfer_id < :locationTransferId
        )
      )`, {
            requestedAt: cursor.requested_at,
            locationTransferId: cursor.location_transfer_id,
        });
    }
    else {
        qb.andWhere(`(
        ${alias}.requested_at > :requestedAt::timestamp
        OR (
          ${alias}.requested_at = :requestedAt::timestamp
          AND ${alias}.location_transfer_id > :locationTransferId
        )
      )`, {
            requestedAt: cursor.requested_at,
            locationTransferId: cursor.location_transfer_id,
        });
    }
    return qb;
}
function applyMaintenanceCursorPagination({ qb, alias, cursor, order = 'DESC', }) {
    if (!cursor?.created_at || !cursor?.maintenance_id)
        return qb;
    if (order === 'DESC') {
        qb.andWhere(`(
        ${alias}.created_at < :createdAt::timestamp
        OR (
          ${alias}.created_at = :createdAt::timestamp
          AND ${alias}.maintenance_id < :maintenanceId
        )
      )`, {
            createdAt: cursor.created_at,
            maintenanceId: cursor.maintenance_id,
        });
    }
    else {
        qb.andWhere(`(
        ${alias}.created_at > :createdAt::timestamp
        OR (
          ${alias}.created_at = :createdAt::timestamp
          AND ${alias}.maintenance_id > :maintenanceId
        )
      )`, {
            createdAt: cursor.created_at,
            maintenanceId: cursor.maintenance_id,
        });
    }
    return qb;
}
function applyScrapCursorPagination({ qb, alias, cursor, order = 'DESC', }) {
    if (cursor?.created_at == null || cursor?.scrap_id == null) {
        return qb;
    }
    if (order === 'DESC') {
        qb.andWhere(`(
        ${alias}.created_at < :createdAt::timestamp
        OR (
          ${alias}.created_at = :createdAt::timestamp
          AND ${alias}.scrap_id < :scrapId
        )
      )`, {
            createdAt: cursor.created_at,
            scrapId: cursor.scrap_id,
        });
    }
    else {
        qb.andWhere(`(
        ${alias}.created_at > :createdAt::timestamp
        OR (
          ${alias}.created_at = :createdAt::timestamp
          AND ${alias}.scrap_id > :scrapId
        )
      )`, {
            createdAt: cursor.created_at,
            scrapId: cursor.scrap_id,
        });
    }
    return qb;
}
function applySearch(qb, search, columns) {
    if (!search?.trim())
        return qb;
    qb.andWhere(new typeorm_1.Brackets((subQb) => {
        columns.forEach((column, index) => {
            const condition = `${column} ILIKE :search`;
            if (index === 0) {
                subQb.where(condition, {
                    search: `%${search}%`,
                });
            }
            else {
                subQb.orWhere(condition);
            }
        });
    }));
    return qb;
}
