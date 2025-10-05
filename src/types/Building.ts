
import { Observation } from './Observation.ts';

export interface Building {
    id: BuildingIdPair;
    observations?: Observation[];
    mp: number;
}

interface BuildingIdPair {
    name: string;
    location: BuildingLocation;
}

enum BuildingLocation {
    TOMESTI,
    LETCANI
}

