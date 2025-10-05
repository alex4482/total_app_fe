import api from '@/clients/index.ts';
import { CreateTenantProps, Tenant } from '@/types/Tenant';

export const TenantsApiClient = {
  getTenants: async (): Promise<Tenant[]> => {
    return (await api.get<Tenant[]>('/tenants')).data;
  },

  getTenantDetails: async (tenantId: string): Promise<Tenant> => {
    return (await api.get<Tenant>(`/tenants/${tenantId}`)).data;
  },

  getTenantHistory: async (tenantId: string) => {
    return (await api.get(`/events?locationId=${tenantId}`)).data;
  },

  createTenant: async (createTenantProps: CreateTenantProps) => {
    return (await api.post('/tenants', createTenantProps)).data;
  },

  updateTenant: async (id: string, updatedTenantFields: Partial<Tenant>) => {
    return (await api.patch(`/tenants/${id}`, updatedTenantFields)).data;
  },

  deleteTenant: async (id: string) => {
    return (await api.delete(`/tenants/${id}`)).data;
  },

  getDocumentTypes: async (id: string) => {
    return (await api.get(`/tenants/${id}/documentTypes`)).data;
  },
};
