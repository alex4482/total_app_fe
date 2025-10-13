import React from 'react';

type TenantFiltersProps = {
  filterPF: 'all' | 'pf' | 'pj';
  setFilterPF: (v: 'all' | 'pf' | 'pj') => void;
  filterActive: 'all' | 'active' | 'inactive';
  setFilterActive: (v: 'all' | 'active' | 'inactive') => void;
  search: string;
  setSearch: (v: string) => void;
};

const TenantFilters: React.FC<TenantFiltersProps> = ({
  filterPF,
  setFilterPF,
  filterActive,
  setFilterActive,
  search,
  setSearch,
}) => (
  <div className="flex flex-col gap-2 w-full mb-2">
    <input
      type="text"
      placeholder="Caută după nume..."
      value={search}
      onChange={e => setSearch(e.target.value)}
      className="px-2 py-1 rounded border border-gray-300 w-full"
    />
    <div className="flex gap-2 w-full">
      <select
        className="px-2 py-1 rounded border border-gray-300 flex-1 bg-background"
        value={filterPF}
        onChange={e => setFilterPF(e.target.value as 'all' | 'pf' | 'pj')}
      >
        <option value="all">PF/PJ</option>
        <option value="pf">PF</option>
        <option value="pj">PJ</option>
      </select>
      <select
        className="px-2 py-1 rounded border border-gray-300 flex-1 bg-background"
        value={filterActive}
        onChange={e => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
      >
        <option value="all">Activi/Inactivi</option>
        <option value="active">Activi</option>
        <option value="inactive">Inactivi</option>
      </select>
    </div>
  </div>
);

export default TenantFilters;
