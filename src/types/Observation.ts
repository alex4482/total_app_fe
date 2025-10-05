export interface Observation {
    id: string;
    message: string;
    type: ObservationUrgency;
}

export enum ObservationUrgency {
    SIMPLE = "SIMPLE",
    URGENT = "URGENT",
    TODO = "TODO",
}
