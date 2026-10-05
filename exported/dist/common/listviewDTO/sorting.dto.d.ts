export declare class SortConditionDto {
    column: string;
    order: 'ASC' | 'DESC';
}
export declare class SortDto {
    sort: SortConditionDto[];
}
