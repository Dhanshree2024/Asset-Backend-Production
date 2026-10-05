import { ListViewDto } from "./list-view.dto";
export declare const AccountMasterListViewConfig: Partial<ListViewDto> & {
    primaryKey: string;
    join_keys: Record<string, string[]>;
    relations: Array<string>;
    selectedColumns: Record<string, string[]>;
    sortable_columns: string[];
    display_names: Record<string, string>;
    column_visibility: Record<string, boolean>;
    non_db_relations: string[];
    column_order: string[];
    filterable_columns: {
        display_name: string;
        column: string;
        type: 'text' | 'select' | 'boolean' | 'number' | 'date';
        dynamicOptionsFrom?: string;
        options?: {
            label: string;
            value: any;
        }[];
    }[];
};
