import { SearchDto } from './search.dto';
import { FilterConditionDto } from './filters.dto';
import { SortConditionDto } from './sorting.dto';
import { PaginationDto } from './pagination.dto';
import { DateBetweenDto } from './date-between.dto';
import { RangeFilterDto } from './range-filter.dto';
export declare class ListViewDtoForExcleExport {
    search?: SearchDto[];
    filters?: FilterConditionDto[];
    sort?: SortConditionDto[];
    pagination?: PaginationDto;
    visible_columns?: string[];
    date_between?: DateBetweenDto;
    range_filters?: RangeFilterDto[];
    ids?: number[];
    selectedIds?: number[];
    isSelectAll?: boolean;
    excludeIds?: number[];
}
