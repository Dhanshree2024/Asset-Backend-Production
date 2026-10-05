"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeCursor = encodeCursor;
exports.decodeCursor = decodeCursor;
exports.buildKeyset = buildKeyset;
exports.applyOffsetRaw = applyOffsetRaw;
exports.finalizePage = finalizePage;
exports.buildListMeta = buildListMeta;
exports.getCachedCount = getCachedCount;
function encodeCursor(payload) {
    if (!payload)
        return null;
    const json = JSON.stringify(payload);
    return Buffer.from(json, 'utf8').toString('base64url');
}
function decodeCursor(token) {
    if (!token)
        return null;
    try {
        const json = Buffer.from(token, 'base64url').toString('utf8');
        const parsed = JSON.parse(json);
        if (parsed && 'id' in parsed)
            return parsed;
        return null;
    }
    catch {
        return null;
    }
}
function normDir(order) {
    return String(order || '').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
}
function opposite(order) {
    return order === 'ASC' ? 'DESC' : 'ASC';
}
function buildKeyset(opts) {
    const { qb, columnMap, sort, defaultSort, idColumn, idDbColumn, cursor, direction = 'next', paramPrefix = 'ks', predicate = 'where', timestampSort = false, } = opts;
    const requested = sort && sort.length > 0 ? sort[0] : defaultSort;
    const sortColumn = requested.column && columnMap[requested.column]
        ? requested.column
        : defaultSort.column;
    const sortDbColumn = columnMap[sortColumn];
    const requestedOrder = normDir(requested.order ?? defaultSort.order);
    const isPrev = direction === 'prev';
    const scanOrder = isPrev ? opposite(requestedOrder) : requestedOrder;
    qb.orderBy(sortDbColumn, scanOrder, 'NULLS LAST').addOrderBy(idDbColumn, scanOrder);
    const decoded = decodeCursor(cursor);
    if (decoded) {
        const op = scanOrder === 'ASC' ? '>' : '<';
        const vParam = `${paramPrefix}_v`;
        const idParam = `${paramPrefix}_id`;
        const vRef = timestampSort ? `:${vParam}::timestamptz` : `:${vParam}`;
        const add = (sql, params) => predicate === 'having'
            ? qb.andHaving(sql, params)
            : qb.andWhere(sql, params);
        if (decoded.v === null || decoded.v === undefined) {
            add(`${idDbColumn} ${op} :${idParam}`, { [idParam]: decoded.id });
        }
        else {
            add(`(${sortDbColumn} ${op} ${vRef} OR (${sortDbColumn} = ${vRef} AND ${idDbColumn} ${op} :${idParam}))`, { [vParam]: decoded.v, [idParam]: decoded.id });
        }
    }
    return { sortColumn, requestedOrder, reversed: isPrev };
}
function applyOffsetRaw(qb, page, limit) {
    const safePage = Math.max(1, Math.floor(page || 1));
    qb.offset((safePage - 1) * limit).limit(limit);
    return qb;
}
function finalizePage(opts) {
    const { limit, plan, idColumn, hadCursor } = opts;
    let rows = [...opts.rows];
    const hasExtra = rows.length > limit;
    if (hasExtra)
        rows.pop();
    if (plan.reversed)
        rows.reverse();
    const first = rows[0];
    const last = rows[rows.length - 1];
    const startCursor = first
        ? encodeCursor({ v: first[plan.sortColumn] ?? null, id: first[idColumn] })
        : null;
    const endCursor = last
        ? encodeCursor({ v: last[plan.sortColumn] ?? null, id: last[idColumn] })
        : null;
    let hasNextPage;
    let hasPrevPage;
    if (plan.reversed) {
        hasNextPage = true;
        hasPrevPage = hasExtra;
    }
    else {
        hasNextPage = hasExtra;
        hasPrevPage = hadCursor;
    }
    return { data: rows, startCursor, endCursor, hasNextPage, hasPrevPage };
}
function buildListMeta(input) {
    const { page, limit, total = null, currentPage = 1 } = input;
    const totalPages = total != null && limit > 0 ? Math.max(1, Math.ceil(total / limit)) : null;
    return {
        total,
        totalPages,
        currentPage,
        limit,
        count: page.data.length,
        hasNextPage: page.hasNextPage,
        hasPrevPage: page.hasPrevPage,
        startCursor: page.startCursor,
        endCursor: page.endCursor,
        nextCursor: page.hasNextPage ? page.endCursor : null,
        prevCursor: page.hasPrevPage ? page.startCursor : null,
    };
}
async function getCachedCount(redis, cacheKey, countFn, ttlSeconds = 5, knownTotal) {
    if (knownTotal !== undefined && knownTotal !== null) {
        const k = Number(knownTotal);
        if (!Number.isNaN(k))
            return k;
    }
    try {
        const cached = await redis.get(cacheKey);
        if (cached !== null && cached !== undefined) {
            const n = typeof cached === 'string' ? parseInt(cached, 10) : Number(cached);
            if (!Number.isNaN(n))
                return n;
        }
    }
    catch {
    }
    const total = await countFn();
    try {
        await redis.set(cacheKey, String(total), ttlSeconds);
    }
    catch {
    }
    return total;
}
