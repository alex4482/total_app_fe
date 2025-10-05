
import { Observation } from './Observation.ts';
import type { Tenant } from './Tenant.ts';

export interface RentalSpace {
    name: string;
    officialName: string; //in registre
    observations?: Observation[];
    occupant?: Tenant;
    mp: number;
}

