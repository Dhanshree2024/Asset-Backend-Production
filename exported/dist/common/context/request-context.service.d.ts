export declare class RequestContextService {
    private readonly storage;
    run(callback: () => void): void;
    set(key: string, value: any): void;
    get<T>(key: string): T | undefined;
}
