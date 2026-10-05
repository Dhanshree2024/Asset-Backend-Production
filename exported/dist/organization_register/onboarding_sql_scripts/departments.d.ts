import { DataSource } from 'typeorm';
export declare class DepartmentsScript {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    createDepartmentsTable(schemaName: string): Promise<void>;
    insertOrganizationDepartmentTable(schemaName: string, departments: {
        department_name: string;
    }[]): Promise<void>;
}
