"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildListCacheKey = buildListCacheKey;
function buildListCacheKey({ prefix, dto, schema, login_user_id }) {
    return `${prefix}:${schema}:${login_user_id ?? 'anonymous'}:${JSON.stringify({
        search: dto?.search ?? [],
        filters: dto?.filters ?? [],
        sort: dto?.sort ?? [],
        limit: dto?.pagination?.limit ?? 10,
        cursor: dto?.cursor ?? null,
        direction: dto?.direction ?? 'next',
        page: dto?.page ?? null,
        isLastPageMode: dto?.isLastPageMode ?? false,
    })}`;
}
