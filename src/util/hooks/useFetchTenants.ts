import { useCallback } from 'react';

import { listTenants } from '@/clients/tenants-client.ts'; // Replace with actual tenant client
import useTenantsStore from '@/stores/useTenantsStore.tsx'; // Replace with your tenant store
import useTenantsExtrasStore from '@/stores/useTenantsExtrasStore.tsx'; // Replace with your tenant store

import { Tenant } from '@/types/Tenant';

const useFetchTenants = () => {
  const { setVariableByName: setVariableExtrasByName } = useTenantsExtrasStore();
  const { setVariableByName } = useTenantsStore();
  const handleFetchTenants = useCallback(async () => {
    try {
      // Optionally enable tenant loading state if needed
      // setVariableByName('areTenantsLoading', true);

      console.log('Fetching tenants from API...');
      const response = await listTenants(); // Fetch tenants via API
      
      // Handle different response formats - API might return array directly or wrapped in an object
      let fetchedTenants: Tenant[] = [];
      
      // Verifică dacă response.data este null, undefined sau missing
      if (!response.data) {
        console.log('Empty or null response data - treating as empty list');
        fetchedTenants = [];
      } else if (Array.isArray(response.data)) {
        fetchedTenants = response.data;
      } else if (Array.isArray(response.data.data)) {
        fetchedTenants = response.data.data;
      } else if (Array.isArray(response.data.tenants)) {
        fetchedTenants = response.data.tenants;
      } else {
        // Dacă response.data există dar nu e în formatul așteptat
        console.warn('Unexpected response format, treating as empty list:', response.data);
        fetchedTenants = [];
      }
      
      console.log('Fetched tenants:', fetchedTenants.length);

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
  // Update the main elements list so the UI refreshes
  console.log('Updating store with tenants:', fetchedTenants.length);
  // Force a new array reference to trigger re-render
  setVariableByName('elements', [...fetchedTenants]);
  console.log('Store updated successfully');

    } catch (error) {
      console.error('Failed to fetch tenants: ', error);
    } finally {
      // Optionally disable tenant loading state if needed
      // setVariableByName('areTenantsLoading', false);
    }
  }, [setVariableByName, setVariableExtrasByName]);

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
