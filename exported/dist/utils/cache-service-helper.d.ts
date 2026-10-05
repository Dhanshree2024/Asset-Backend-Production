import { ListViewDto } from 'src/common/listviewDTO/list-view.dto';
export declare function buildListCacheKey({ prefix, dto, schema, login_user_id }: {
    prefix: string;
    dto?: ListViewDto;
    schema: any;
    login_user_id: any;
}): string;
