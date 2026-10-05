export interface HttpProbeResult {
    server?: string;
    realm?: string;
    poweredBy?: string;
    title?: string;
}
export declare class HttpProbeService {
    private readonly logger;
    probe(ip: string, ports: number[]): Promise<HttpProbeResult>;
    private tryPort;
    private headerString;
    private extractRealm;
    private extractTitle;
}
