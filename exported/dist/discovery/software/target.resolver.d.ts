import { Device } from '../interfaces/device.interface';
import { DeviceRepository } from '../store/device.repository';
import { TargetSelector } from './software.types';
export declare class TargetResolver {
    private readonly devices;
    constructor(devices: DeviceRepository);
    resolve(schema: string, selector: TargetSelector | null | undefined): Promise<Device[]>;
    matches(device: Device, selector: TargetSelector | null | undefined): boolean;
}
