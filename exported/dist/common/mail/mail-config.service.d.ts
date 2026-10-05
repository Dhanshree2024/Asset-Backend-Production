import { Repository } from 'typeorm';
import { MailConfig } from './entities/email-config.entity';
export declare class MailConfigService {
    private readonly mailConfigRepository;
    constructor(mailConfigRepository: Repository<MailConfig>);
    getMailConfig(): Promise<MailConfig | null>;
}
