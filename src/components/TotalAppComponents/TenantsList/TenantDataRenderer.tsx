import type { Tenant } from '@/types/Tenant';

export const TenantDataRenderer = ({ tenant }: { tenant: Tenant }) => {
    const obs = tenant.observations?.join('\n');
    return <span> {tenant.name} {tenant.active} </span>;

};
