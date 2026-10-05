import { DataSource } from 'typeorm';
export declare class EmployeeService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    fetchEmployees(): Promise<any>;
}
