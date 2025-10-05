
import { uniqBy } from 'lodash';
import { Link } from 'react-router-dom';

import { Tenant } from '@/types/Tenant.ts';
import { Badge } from '@/components/ui/badge.tsx';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Progress } from '@/components/ui/progress.tsx';

import TenantDescriptionIndent from '../TenantObservationsIndent.tsx';
import Ribbon from './Ribbon.tsx';
import useTenantsStore from '@/stores/useTenantsStore.tsx';
import TenantObservationsIndent from '../TenantObservationsIndent.tsx';

export default function TenantCard({ tenant }: { tenant: Tenant }) {
  const { 
    appliedFilters, 
    setVariableByName, 
    currentElement: currentTenant } = useTenantsStore();

  const handleAddFilter = (filterName: string) => {
    const newFilters = [...appliedFilters];
      // newFilters.push({ label: filterName, value: projectId });
    setVariableByName('appliedFilters', uniqBy(newFilters, 'value'));
  };

  return (
    <Link to={`/tenants/${tenant.id}`}>
      <Card
        key={tenant.id}
        className="group relative flex h-full w-full transform cursor-pointer flex-col transition-transform hover:scale-101 md:flex-row"
      >
        <div
          className={`flex h-full w-full flex-row ${currentTenant?.id === tenant.id ? 'bg-input' : 'bg-accent'} p-1 font-bold text-avinciBlue-500 transition-colors duration-300 group-hover:bg-input md:w-2/6 md:flex-col md:items-center md:justify-center`}
        >
          <div className="ml-3 flex items-center justify-center md:ml-0 md:mt-2 md:w-full">
Vechi status
          </div>
          <div className="ml-3 flex flex-1 items-center justify-center text-center md:ml-0">
            <span className="flex max-h-full max-w-full break-words p-1 text-2xl leading-none">
              {tenant.name}
            </span>
          </div>
          <div className="hidden w-full flex-col items-center justify-center p-1 md:flex">
            {/* {Array.isArray(getConcatenatedTags(tenant)) &&
              getConcatenatedTags(tenant).map((tag, index) => (
                <Badge
                  onClick={event => {
                    handleAddFilter(tag);
                    event.stopPropagation();
                    event.preventDefault();
                  }}
                  key={index}
                  className="mb-1 cursor-pointer rounded-md bg-card text-center text-popover-foreground hover:border hover:border-gray-400 hover:bg-accent"
                >
                  {tag}
                </Badge>
              ))} */}
          </div>
        </div>
        <div className="relative m-2 flex h-full w-full flex-1 flex-col md:break-inside-avoid md:flex-col">
          <CardHeader className="flex flex-row items-start p-2 md:max-w-[75%]">
            <CardTitle className="text-xl">
              <span className="break-words">{tenant.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full flex-grow p-2">
            <div className="break-words py-2">
              <TenantObservationsIndent
              observations={tenant.observations ?? []}
              tenantId={tenant.id}
              />
            </div>
          </CardContent>
          {/* <div className="flex flex-row flex-1 flex-wrap justify-end">
          <div className="text-right text-sm text-gray-500">
              Creat de{' '}
              <Link
                to={`/users/${tenant.createdBy}`}
                className="text-yellow-500 hover:underline"
                onClick={event => {
                  event.stopPropagation();
                }}
              >
                @{getNameFromUserId(tenant.createdBy)}
              </Link>{' '}
              pe {formatDate(tenant.createdAt, 'datewithoutyear')}
            </div>
        </div> */}
          
        </div>
        
      </Card>
    </Link>
  );
}
