import { TenantList } from '@/components/TotalAppComponents/TenantsList/TenantsList';

import '../../styles/globals.css';
import AddTenantModal from './components/AddTenantModal';
import TenantDetails from './components/tenant-details/TenantDetails';
// ...existing code...

import useTenantsStore from '@/stores/useTenantsStore.tsx';
import useFetchTenants from '@/util/hooks/useFetchTenants';


import { useEffect } from 'react';

export default function Tenants() {
  const { currentElement: currentTenant } = useTenantsStore();
  const { handleFetchTenants } = useFetchTenants();

  useEffect(() => {
    handleFetchTenants();
  }, [handleFetchTenants]);

  return (
    <div className="flex h-full w-full flex-row">
      {/* Left: Scrollable Tenants List */}
      <div className="w-full sm:w-1/3 md:w-1/4 border-r dark:border-b-slate-700 overflow-y-auto bg-background">
        <TenantList />
      </div>
      {/* Right: Tenant Details or Add Tenant */}
      <div className="flex-1 flex flex-col items-center justify-start p-4">
        {currentTenant ? (
          <TenantDetails />
        ) : (
          <div className="w-full max-w-xl">
            <h2 className="text-xl font-semibold mb-4">Select a tenant or create a new one</h2>
            <AddTenantModal />
          </div>
        )}
      </div>
    </div>
  );
}
 




