import type { CreateTenantProps, Tenant } from '@/types/Tenant';

import api from '.';

const tenantUrlKeyword = 'tenants';

export const listTenants = async (
  tenantId?: string
) => {
  let url = '/' + tenantUrlKeyword;
  if (tenantId) {
    url += `?tenantId=${tenantId}&`;
  }

  return await api.get(url);
};

// de modif
export const updateTenant = async (
  id: string,
  updatedTenantFields: Partial<Tenant>
) => {
  return await api.post('/' + tenantUrlKeyword + `/${id}`, updatedTenantFields);
};

export const getTenantDetails = async (tenantId: string) => {
  return await api.get(`/tenants/${tenantId}`);
};

export const createTenant = async (tenant: CreateTenantProps) => {
  return await api.post('/' + tenantUrlKeyword, tenant);
};

export const deleteTenant = async (id: string) => {
  return await api.delete(`/${tenantUrlKeyword}/${id}`);
};
