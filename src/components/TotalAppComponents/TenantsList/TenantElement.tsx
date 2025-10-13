import React from 'react';
import type { Tenant } from '@/types/Tenant';

type TenantElementProps = {
  tenant: Tenant;
  selected: boolean;
  onSelect: (tenant: Tenant) => void;
};

const TenantElement: React.FC<TenantElementProps> = ({ tenant, selected, onSelect }) => (
  <button
    className={`container flex justify-between p-2 w-full text-left rounded border border-gray-200 transition ${selected ? 'bg-accent border-gray-500' : 'bg-background border-gray-800 hover:bg-accent'}`}
    onClick={() => onSelect(tenant)}
  >
    <div className="w-full flex items-center">
      <span className="text-base font-medium">{tenant.name}</span>
    </div>
  </button>
);

export default TenantElement;
