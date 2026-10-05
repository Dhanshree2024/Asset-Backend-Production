import { CreateAssetsStatusDto } from './create-assets-status.dto';
declare const DeleteAssetsStatusDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateAssetsStatusDto>>;
export declare class DeleteAssetsStatusDto extends DeleteAssetsStatusDto_base {
    status_type_id: number;
    status_type_ids?: number[];
    working_status_type_id: number;
    status_color_code: string;
}
export {};
