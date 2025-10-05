import { useEffect } from 'react';
import type { Tenant } from '@/types/Tenant';
import { TenantDataRenderer } from './TenantDataRenderer';

import useTenantsStore from '@/stores/useTenantsStore';
import { ReceiptText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
// import BeatLoader from 'react-spinners/BeatLoader';
import { Button } from '@/components/ui/button';

import { listTenants } from '@/clients/tenants-client'; 

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import InfiniteScroll from '@/components/ui/infinite-scroll.tsx';

const TenantElement = ({ tenant }: { tenant: Tenant }) => {
  const { setVariableByName: setTenantListVariable } = useTenantsStore();
  const navigate = useNavigate();

  return (
    <Card className="container flex justify-between p-2">
      <div className="w-10/12 md:w-11/12">
        <CardHeader className="p-3">
          <CardTitle className="overflow-hidden overflow-ellipsis text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl">
            <Link
              className="text-yellow-500 hover:underline"
              to={`/tenants/${tenant.id}`}
            >
              @{tenant.name}
            </Link>
          </CardTitle>
          <CardDescription className="overflow-hidden overflow-ellipsis">
            <TenantDataRenderer
              tenant={tenant}
            />
          </CardDescription>
        </CardHeader>
      </div>
      <div className="flex w-2/12 items-center justify-end md:w-1/12 md:pr-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            // TODO: am nevoie?
            setTenantListVariable('highlightedElementId', tenant.id);
            setTenantListVariable('fromElementList', true);
            navigate(`/tenants/${tenant.id}`);
          }}
        >
          <ReceiptText className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export const TenantList: React.FC = () => {
  //const PAGE_SIZE = 20;
  const {
    elements: tenants,
   // page,
   // hasMore,
    loading,
    setVariableByName: setTenantListVariable,
  } = useTenantsStore();

  const next = async () => {
    setTenantListVariable('loading', true);
    setTimeout(async () => {
      console.log(1);
      const res = await listTenantsMock();
      const data = res.data;
      setTenantListVariable('elements', [...tenants, ...data]);
     // setTenantListVariable('page', page + 1);

      //if (data.length < PAGE_SIZE) {
      //  setTenantListVariable('hasMore', false);
      //}
      setTenantListVariable('loading', false);
    }, 800);
  };

  useEffect(() => {
    return () => {
      setTenantListVariable('elements', listTenantsMock().data
      );
      setTenantListVariable('hasMore', true);
    };
  }, []);

  const listTenantsMock = () => {return {data:
    [
     {
    id: "luna-bistro",
    name: "Luna Bistro",
    pf: false,
    active: true,
    attachmentIds: ["att_001", "att_014"]
  },
  {
    id: "ioan-popescu",
    name: "Ioan Popescu",
    pf: true,
    active: true,
    attachmentIds: []
  },
  {
    id: "verde-market",
    name: "Verde Market",
    pf: false,
    active: false,
    attachmentIds: []
  },
  {
    id: "ana-ionescu",
    name: "Ana Ionescu",
    pf: true,
    active: true,
    attachmentIds: ["att_102"]
  },
  {
    id: "delta-tech",
    name: "Delta Tech",
    pf: false,
    active: true,
    attachmentIds: ["att_200", "att_201", "att_202"]
  }
  ]};}

  const shouldExcludeTenant = (tenant: Tenant) => {
    // TODO FIX THIS DUPLICATION ISSUE BETTER
    return (!tenant.active);
  };

  return (
    <div>
      <div className="flex w-full flex-col">
        <div className="mt-5 flex w-full flex-col items-center gap-1 px-10">
          {tenants
            .filter((tenant: Tenant) => !shouldExcludeTenant(tenant))
            .map((tenant: Tenant) => (
              <TenantElement key={tenant.id} tenant={tenant} />
            ))}
          { <InfiniteScroll
            hasMore={false}
            isLoading={loading}
            next={next}
            threshold={1}
          >
             {/* {hasMore && <BeatLoader color="#F59E0B" className="my-4" />} */}
          </InfiniteScroll> }
        </div>
      </div>
    </div>
  );
};
