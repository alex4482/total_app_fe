import { TenantList } from '@/components/TotalAppComponents';

import '../../styles/globals.css';
import AddTenantModal from './components/AddTenantModal';
import TenantTabs from './components/layout/TenantTabs';
import TenantDetails from './components/tenant-details/TenantDetails';
import { getTenantDetails } from '@/clients/tenants-client.ts';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import useTenantsStore from '@/stores/useTenantsStore.tsx';
import useFetchTenants from '@/util/hooks/useFetchTenants';
import useTenantsExtrasStore from '@/stores/useTenantsExtrasStore';


export default function Tenants() {

  const { tenantId } = useParams();
  const { setVariableByName, 
    setCurrentElement: setCurrentTenant, 
    currentElement: currentTenant } =
    useTenantsStore();
  const { setVariableByName: setVariableExtrasByName } =
    useTenantsExtrasStore();
  const [currentTab, setCurrentTab] = useState('completed');

  const { handleFetchTenants } = useFetchTenants();

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const handleGetTenantDetails = async (tenantId: string) => {
    try {
      setVariableExtrasByName('areTenantDetailsLoading', true);
      const response = await getTenantDetails(tenantId);
      setCurrentTenant(response.data);
      window.scrollTo(0, 0); // Scroll to top
    } catch (error) {
      console.log('Failed to fetch tenant details: ', error);
    } finally {
      setVariableExtrasByName('areTenantDetailsLoading', false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      handleGetTenantDetails(tenantId);
    }
    return () => {
      setCurrentTenant(null);
    };
  }, [tenantId]);


  return (
    <>
   <div className="flex h-full w-full flex-col">
        {/* <TenantsFilter /> */}
        <AddTenantModal />
        <div className="flex flex-1 sm:flex-row">
          {/* TABS AND PROJECT DETAILS */}
          <div
            className={`w-full ${
              tenantId ? 'hidden sm:flex sm:flex-1 sm:flex-row' : 
              'sm:hidden'
            } `}
          >
            <div className="flex flex-col sm:basis-2/6">
              <TenantTabs currentTab={currentTab} onChange={handleTabChange} />
            </div>
            <div className="relative flex flex-grow flex-col overflow-y-auto sm:basis-4/6">
              {tenantId && currentTenant && (
                <div className="mt-2 w-full">
                  <TenantDetails
                    handleGetTenantDetails={handleGetTenantDetails}
                    fetchTenants={handleFetchTenants}
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
     <div className="h-screen w-full p-4 md:p-6 bg-background">
      <div className="grid gap-4 md:gap-2 md:grid-cols-[1fr_2fr] h-full">
        <div className="flex-1">
          <TenantList />
        </div>  
        <div className="flex-1">
          <TenantList />
        </div>
      </div>
    </div> 
    </>
  );
}

 

