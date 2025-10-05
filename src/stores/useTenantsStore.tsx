  import type { Tenant } from '@/types/Tenant';
  import { createAbstractElementsStore } from './useAbstractStore';
  

  export type TenantDetailsHandler = (tenantId: string) => Promise<void>;

  const useTenantsStore = createAbstractElementsStore<Tenant>();
    
  // const useTenantsStore = create<TenantsStoreState>(set => ({
  //   tenants: [],
  //   currentTenant: null,
  //   highlightedTenantId: undefined,
  //   fromTenantList: false,
  //   isTenantDetailsOpen: false,
  //   loading: false,
  //   hasMore: true,
  //   toggleTenantDetailsOpen: (isOpen: boolean) =>
  //     set({ isTenantDetailsOpen: isOpen }),
  //   setVariableByName: (key, value) => set(state => ({ ...state, [key]: value })),
  //   setCurrentTenant: (tenant: Tenant | null) =>
  //     set({ currentTenant: tenant, isTenantDetailsOpen: !!tenant }),

  // }));

  export default useTenantsStore;
  
  