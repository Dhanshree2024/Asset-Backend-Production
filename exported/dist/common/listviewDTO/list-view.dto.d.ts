import { DateBetweenDto } from './date-between.dto';
import { FilterConditionDto } from './filters.dto';
import { PaginationDto } from './pagination.dto';
import { RangeFilterDto } from './range-filter.dto';
import { SearchDto } from './search.dto';
import { SortConditionDto } from './sorting.dto';
export declare class ListViewDto {
    search?: SearchDto[];
    filters?: FilterConditionDto[];
    sort?: SortConditionDto[];
    pagination?: PaginationDto;
    visible_columns?: string[];
    cursor?: any;
    direction?: 'next' | 'prev';
    page?: number;
    jumpToLast?: boolean;
    date_between?: DateBetweenDto;
    range_filters?: RangeFilterDto[];
    ids?: number[];
    knownTotal?: number;
    isLastPageMode?: boolean;
    getAll?: boolean;
    user_id: number;
    schema?: any;
    login_user_id?: any;
}
