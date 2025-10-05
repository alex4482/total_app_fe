import { useCallback } from 'react';

import { listTenants } from '@/clients/tenants-client.ts'; // Replace with actual tenant client
import useTenantsStore from '@/stores/useTenantsStore.tsx'; // Replace with your tenant store
import useTenantsExtrasStore from '@/stores/useTenantsExtrasStore.tsx'; // Replace with your tenant store

import { Tenant } from '@/types/Tenant';

const useFetchTenants = () => {
  const { setVariableByName: setVariableExtrasByName } = useTenantsExtrasStore(); // Replace with your actual store method
  const { setVariableByName } = useTenantsStore(); // Replace with your actual store method
  const handleFetchTenants = useCallback(async () => {
    try {
      // Optionally enable tenant loading state if needed
      // setVariableByName('areTenantsLoading', true);

      const response = await listTenants(); // Fetch tenants via API
      const fetchedTenants = response.data;

      // Categorize tenants by status
      const activeTenants: Tenant[] = [];
      const inactiveTenants: Tenant[] = [];

      fetchedTenants.forEach((tenant: Tenant) => {
        if (tenant.active === true) {
          activeTenants.push(tenant);
        } else if (tenant.active === false) {
          inactiveTenants.push(tenant);
        } 
      });
      setVariableExtrasByName('activeTenants', activeTenants);
      setVariableExtrasByName('inactiveTenants', inactiveTenants);

    } catch (error) {
      console.error('Failed to fetch tenants: ', error);
    } finally {
      // Optionally disable tenant loading state if needed
      // setVariableByName('areTenantsLoading', false);
    }
  }, [setVariableByName]);

  // const handleFetchUploadedFileTypes = useCallback(
  //   async (currentTenant: Tenant) => {
  //     try {
  //       if (!currentTenant) {
  //         throw new Error('Current tenant is null');
  //       }
  //       const response = await getDocumentTypes(currentTenant.id);
  //       setVariableByName('currentFileTypes', response.data);
  //     } catch (error) {
  //       console.error('Failed to uploaded file types for tenant: ', error);
  //     }
  //   },
  //   [setVariableByName]
  // );

  return { handleFetchTenants};//, handleFetchUploadedFileTypes };
};

export default useFetchTenants;
