import {
  CreateTenantProps,
  Tenant,
} from '@/types/Tenant.ts';

import { TenantsQueryKeys } from './query.keys';
import { TenantsApiClient } from './tenantsApiClient';

export const getTenants = () => {
  return {
    queryKey: TenantsQueryKeys.tenants,
    queryFn: TenantsApiClient.getTenants,
  };
};

export const getTenantDetails = (tenantId: string) => {
  return {
    queryKey: TenantsQueryKeys.tenantsDetails(tenantId),
    queryFn: () => TenantsApiClient.getTenantDetails(tenantId),
  };
};

export const getTenantHistory = (tenantId: string) => {
  return {
    queryKey: TenantsQueryKeys.tenantHistory(tenantId),
    queryFn: () => TenantsApiClient.getTenantHistory(tenantId),
  };
};

export const getDocumentTypes = (tenantId: string) => {
  return {
    queryKey: TenantsQueryKeys.documentTypes(tenantId),
    queryFn: () => TenantsApiClient.getDocumentTypes(tenantId),
  };
};

// Mutation query functions
export const createTenantMutation = () => ({
  mutationFn: (tenantProps: CreateTenantProps) =>
    TenantsApiClient.createTenant(tenantProps),
});

export const updateTenantMutation = () => ({
  mutationFn: ({
    id,
    updatedFields,
  }: {
    id: string;
    updatedFields: Partial<Tenant>;
  }) => TenantsApiClient.updateTenant(id, updatedFields),
});


export const deleteTenantMutation = () => ({
  mutationFn: (id: string) => TenantsApiClient.deleteTenant(id),
});
