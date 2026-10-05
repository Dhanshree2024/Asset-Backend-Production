import { Device, DeviceCategory } from '../interfaces/device.interface';
import { OuiService } from './oui.service';
export interface ClassificationResult {
    category: DeviceCategory;
    confidence: number;
    modelHint?: string;
}
export declare class ClassifierService {
    private readonly ouiService;
    constructor(ouiService: OuiService);
    classify(d: Partial<Device>): ClassificationResult;
    private coarseFallback;
}
