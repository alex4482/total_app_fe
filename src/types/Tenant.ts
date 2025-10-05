import { Observation } from "./Observation";

export type CreateTenantProps = Pick<
  Tenant,
  | 'name'
>;

export interface Tenant {
    id: string; // same as name- but lowercase
    name: string;
    cui?: string;
    emails?: string[];
    phoneNumbers?: string[];
    observations?: Observation[];
    pf: boolean;
    active: boolean;
    attachmentIds?: string[];
}

