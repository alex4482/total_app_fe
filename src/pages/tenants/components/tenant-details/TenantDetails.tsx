import { deleteTenant } from '@/clients/tenants-client.ts';
import useGeneralStore from '@/stores/useGeneralStore.tsx';
import useTenantsStore, { TenantDetailsHandler } from '@/stores/useTenantsStore.tsx';

import { Button, buttonVariants } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer.tsx';
import { toast } from '@/components/ui/use-toast.ts';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';


import useFetchTenants from '@/util/hooks/useFetchTenants.ts';
import { Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import TenantDetailsTabs from './TenantDetailsTabs.tsx';

export default function TenantDetails({
  handleGetTenantDetails,
  fetchTenants,
}: {
  handleGetTenantDetails: TenantDetailsHandler;
  fetchTenants: () => void;
}) {
  const { 
    currentElement: currentTenant, 
    isElementDetailsOpen: isTenantDetailsOpen, 
    toggleElementDetailsOpen: toggleTenantDetailsOpen } =
    useTenantsStore();
  const { isMobile } = useGeneralStore();
  const { 
    setVariableByName: setTenantsVariable, 
    elementToBeDeleted: tenantToBeDeleted } =
    useTenantsStore();
  const { handleFetchTenants } = useFetchTenants();
  const Container = isMobile ? Drawer : Card;
  const ContainerContent = isMobile ? DrawerContent : CardContent;
  const ContainerHeader = isMobile ? DrawerHeader : CardHeader;
  const ContainerTitle = isMobile ? DrawerTitle : CardTitle;
  const ContainerDescription = isMobile ? DrawerDescription : CardDescription;
  // const { can } = useAuthContext();

  const navigate = useNavigate();

  if (!currentTenant) return null;

  const handleTenantDetailsOpenChange = (open: boolean) => {
    if (!open) {
      fetchTenants();
      setTenantsVariable('currentElement', null);
      navigate('/tenants');
    }
    toggleTenantDetailsOpen(open);
    setTenantsVariable('elementToBeDeleted', null);
  };

  const handleDeleteTenant = async (tenantId: string) => {
    try {
      const response = await deleteTenant(tenantId);
      if (response.status >= 200 && response.status < 300) {
        toggleTenantDetailsOpen(false);
        handleFetchTenants();
        setTenantsVariable('elementToBeDeleted', null);
        toast({
          description: 'Chiriasul a fost sters cu succes!',
        });
        navigate('/tenants');
      } else {
        toast({
          description: 'A aparut o eroare la stergerea chiriasului!',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        description: 'A aparut o eroare la stergerea tenant-ului!',
        variant: 'destructive',
      });
    }
  };

  // useEffect(() => {
  //   if (currentTenant) {
  //     handleFetchUploadedFileTypes(currentTenant);
  //   }
  // }, [currentTenant]);

  if (tenantToBeDeleted) {
    return (
      <Container
        open={isTenantDetailsOpen}
        onOpenChange={handleTenantDetailsOpenChange}
      >
        <ContainerContent className="mx-auto flex max-h-[90vh] w-full flex-col items-center justify-center p-4 sm:max-h-[100vh] sm:w-1/2 sm:max-w-xl">
          <ContainerHeader className="md:px-4">
            <ContainerTitle className="mb-4 flex w-full items-center justify-center text-xl font-bold text-red-500">
              ATENTIE!
            </ContainerTitle>
            <ContainerDescription asChild>
              <div className="flex items-center justify-center">
                <p>
                  Stergeti chiriasul{' '}
                  <strong>{tenantToBeDeleted.name}</strong>?
                </p>
              </div>
            </ContainerDescription>
            <div className="flex items-center justify-center pt-5">
              <Button
                variant={'outline'}
                className="mr-2"
                onClick={() => setTenantsVariable('elementToBeDeleted', null)}
              >
                Anuleaza
              </Button>
              <Button
                className={`${buttonVariants({
                  variant: 'destructive',
                })} ml-2`}
                onClick={() => handleDeleteTenant(tenantToBeDeleted.id)}
              >
                Sterge chirias
              </Button>
            </div>
          </ContainerHeader>
        </ContainerContent>
      </Container>
    );
  }

  return (
    <div className="flex w-full flex-col pr-5 sm:min-w-[50rem]">
      <Container
        open={isTenantDetailsOpen}
        onOpenChange={handleTenantDetailsOpenChange}
        className="relative h-full"
      >
        {!isMobile && (
          <X
            className="absolute right-2 top-2 cursor-pointer text-gray-600 hover:text-gray-800"
            onClick={() => handleTenantDetailsOpenChange(false)}
          />
        )}
        <ContainerContent className="flex max-h-[90vh] flex-col sm:max-h-[100vh]">
          <ContainerHeader className="md:px-4">
            <ContainerTitle className="mb-4 flex w-full items-center justify-between text-xl font-bold">
              <div className="hidden w-full items-center justify-between md:flex">
                <div className="flex items-center">
                  <Button
                    size="icon"
                    className="mr-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() =>
                      setTenantsVariable('elementToBeDeleted', currentTenant)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center">
                    <span className="mr-2">{currentTenant.name}</span>
                    <span
                      className="w-auto"
                    >
                      {
                        (currentTenant.active === false && 'INACTIV') ||
                        (currentTenant.active === true && 'ACTIV')
                      }
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full md:hidden">
                <div className="text-center">
                  <span className="mr-2">{currentTenant.name}</span>
                </div>
                <div className="mt-2 flex w-full items-center justify-between">
                  <Button
                    size="icon"
                    className="mr-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() =>
                      setTenantsVariable('elementToBeDeleted', currentTenant)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {/* <div className="flex-grow text-center">
                    <span
                      className={`${getStatusClassName(
                        currentTenant.status
                      )} w-auto`}
                    >
                      {(currentTenant.status === 'NOT_STARTED' && 'NEPRELUAT') ||
                        (currentTenant.status === 'IN_PROGRESS' &&
                          'ÎN PROGRES') ||
                        (currentTenant.status === 'COMPLETED' && 'FINALIZAT')}
                    </span>
                  </div> */}
                  {/* <span className="ml-auto">
                    <StatusHelper approvals={currentTenant.approvals} />
                  </span> */}
                </div>
                <div className="hidden w-full items-center justify-between md:flex">
                  <div className="flex items-center">
                    <Button
                      size="icon"
                      className="mr-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() =>
                        setTenantsVariable('elementToBeDeleted', currentTenant)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    {/* <div className="flex items-center">
                      <span className="mr-2">{currentTenant.name}</span>
                      <span
                        className={`${getStatusClassName(
                          currentTenant.status
                        )} w-auto`}
                      >
                        {(currentTenant.status === 'NOT_STARTED' &&
                          'NEPRELUAT') ||
                          (currentTenant.status === 'IN_PROGRESS' &&
                            'ÎN PROGRES') ||
                          (currentTenant.status === 'COMPLETED' && 'FINALIZAT')}
                      </span>
                    </div>
                  </div>
                  <span className="flex-shrink-0">
                    <StatusHelper approvals={currentTenant.approvals} />
                  </span> */}
                  </div>
                </div>
              </div>
            </ContainerTitle>
            {/* {currentTenant.status !== 'COMPLETED' &&
              currentTenant.approvals.acquisitor.approved === false && (
                <ContainerDescription asChild>
                  <div className="flex items-center">
                    <CalendarClock /> Deadline:{' '}
                    {formatDate(currentTenant.deadline, 'date')}
                    <p className={`${getDeadlineColor(currentTenant)}`}>
                      &nbsp;
                      {getDeadlineDaysRemaining(currentTenant) > 0
                        ? getDeadlineDaysRemaining(currentTenant) === 1
                          ? `(o zi ramasa)`
                          : `(${getDeadlineDaysRemaining(
                              currentTenant
                            )} zile ramase)`
                        : Math.abs(getDeadlineDaysRemaining(currentTenant)) === 1
                          ? `(depasit cu o zi)`
                          : `(depasit cu ${Math.abs(
                              getDeadlineDaysRemaining(currentTenant)
                            )} zile)`}
                    </p>
                  </div>
                </ContainerDescription>
              )} */}
          </ContainerHeader>
          <div className="overflow-y-auto px-4">
            <TenantDetailsTabs/>
          </div>
        </ContainerContent>
      </Container>
    </div>
  );
}
