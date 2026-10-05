export declare function ipToInt(ip: string): number;
export declare function expandCidr(cidr: string): string[];
export declare function ipInCidr(ip: string, cidr: string): boolean;
export declare function normaliseMac(s: string | null | undefined): string | null;
export declare function isBogusMac(mac: string | null | undefined): boolean;
export declare function execCmd(cmd: string, timeoutMs?: number): Promise<string>;
export declare function pool<T, R>(items: T[], worker: (item: T, index: number) => Promise<R>, concurrency: number): Promise<R[]>;
