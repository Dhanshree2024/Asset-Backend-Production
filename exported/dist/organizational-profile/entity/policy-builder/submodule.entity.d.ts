import { Module } from './module.entity';
export declare class SubModule {
    id: number;
    name: string;
    code: string;
    description: string;
    module: Module;
    createdAt: Date;
    updatedAt: Date;
}
