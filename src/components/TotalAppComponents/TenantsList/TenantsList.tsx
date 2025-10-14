
import { useState } from 'react';
import type { Tenant } from '@/types/Tenant';
import useTenantsStore from '@/stores/useTenantsStore';

import TenantFilters from './TenantFilters';
import TenantElement from './TenantElement';


export const TenantList: React.FC = () => {
  const [filterPF, setFilterPF] = useState<'all' | 'pf' | 'pj'>('all');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [search, setSearch] = useState('');
  //const PAGE_SIZE = 20;
  const {
    elements: tenants,
    // loading,
  // setVariableByName: setTenantListVariable,
    setCurrentElement,
    currentElement,
  } = useTenantsStore();



  const shouldExcludeTenant = (tenant: Tenant) => {
    if (filterPF === 'pf' && !tenant.pf) return true;
    if (filterPF === 'pj' && tenant.pf) return true;
    if (filterActive === 'active' && !tenant.active) return true;
    if (filterActive === 'inactive' && tenant.active) return true;
    if (search && !tenant.name.toLowerCase().includes(search.toLowerCase())) return true;
    return false;
  };

  return (
    <div className="bg-background">
      <div className="flex w-full flex-col">
        <div className="mt-5 flex w-full flex-col items-center gap-1 px-10">
          <TenantFilters
            filterPF={filterPF}
            setFilterPF={setFilterPF}
            filterActive={filterActive}
            setFilterActive={setFilterActive}
            search={search}
            setSearch={setSearch}
          />
          <button
            className="mb-2 px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white font-bold text-lg"
            title="Adauga chirias nou"
            onClick={() => setCurrentElement({
              id: '',
              name: '',
              cui: '',
              emails: [],
              phoneNumbers: [],
              observations: [],
              pf: false,
              active: false, // default INACTIV
              attachmentIds: [],
            })}
          >
            +
          </button>
          {tenants
            .filter((tenant: Tenant) => !shouldExcludeTenant(tenant))
            .map((tenant: Tenant) => (
              <TenantElement
                key={tenant.id}
                tenant={tenant}
                selected={tenant.id === currentElement?.id}
                onSelect={setCurrentElement}
              />
            ))}

        </div>
      </div>
    </div>
  );
};
