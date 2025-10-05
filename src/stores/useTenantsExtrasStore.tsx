  import type { Tenant } from '@/types/Tenant';
  import { create } from 'zustand';
  
  export interface TenantsExtrasStoreState {
    // TODO: DE SCHIMBAT
    activeTenants: Tenant[];
    inactiveTenants: Tenant[];
    areTenantDetailsLoading: boolean;
    setVariableByName: <K extends keyof TenantsExtrasStoreState>(
      key: K,
      value: TenantsExtrasStoreState[K]
    ) => void;
  }

  const useTenantsExtrasStore = create<TenantsExtrasStoreState>(set => ({
    activeTenants: [],
    inactiveTenants: [],
    areTenantDetailsLoading: false,
    setVariableByName: (key, value) => set(state => ({ ...state, [key]: value })),
  }));
  

  export default useTenantsExtrasStore;
  