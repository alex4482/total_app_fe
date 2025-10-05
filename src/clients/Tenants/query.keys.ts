export const TenantsQueryKeys = {
  tenants: ['tenants'],
  tenantsDetails: (tenantId: string) => ['tenants', tenantId],
  tenantHistory: (tenantId: string) => ['tenants', tenantId, 'history'],
  documentTypes: (tenantId: string) => ['tenants', tenantId, 'documentTypes'],
};
