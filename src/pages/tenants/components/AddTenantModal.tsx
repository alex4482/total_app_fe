import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { createTenant } from '@/clients/tenants-client.ts';
import useGeneralStore from '@/stores/useGeneralStore.tsx';
import useTenantsStore from '@/stores/useTenantsStore';
import useFetchTenants from '@/util/hooks/useFetchTenants';

import { Button, buttonVariants } from '@/components/ui/button.tsx';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer.tsx';
import { Form } from '@/components/ui/form.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast.ts';
import { CreateTenantProps } from '@/types/Tenant';

import { tenantFormSchema, TenantFormValues } from './validationSchemas';
import { TenantFormFields } from './TenantFormFields';

export default function AddTenantModal() {
  const { toast } = useToast();
  const { isMobile } = useGeneralStore();
  const {
    isCreateElementOpen,
    toggleElementCreateOpen,
  } = useTenantsStore();
  const { handleFetchTenants } = useFetchTenants();

  const [isCreating, setIsCreating] = useState(false);

  const tenantForm = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      name: '',
      cui: '',
      emails: [],
      observations: [],
      phoneNumbers: [],
      pf: false,
    },
  });

  const handleCreateTenant = async (values: CreateTenantProps) => {
    try {
      setIsCreating(true);
      console.log('Sending to API:', values);
      const response = await createTenant(values);
      if (response.status >= 200 && response.status < 300) {
        toast({
          description: 'Chiriasul a fost creat cu succes!',
        });
        clearValues();
        toggleElementCreateOpen(false);
        
        // Refresh tenants list
        await handleFetchTenants();
        
        // Selectează tenant-ul nou creat și deschide panoul de detalii
        if (response.data) {
          const newTenant = response.data;
          useTenantsStore.getState().setVariableByName('currentElement', newTenant);
          useTenantsStore.getState().toggleElementDetailsOpen(true);
        }
      } else {
        toast({
          description: 'A aparut o eroare la crearea chiriasului!',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        description: 'A aparut o eroare la crearea chiriasului!',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const onSubmit = (values: TenantFormValues) => {
    console.log('Form values being submitted:', values);
    handleCreateTenant(values);
  };

  const handleModalOpenChange = (open: boolean) => {
    toggleElementCreateOpen(open);
    if (!open) {
      // Assuming you want to clear errors when the modal closes
      tenantForm.clearErrors([
        'cui',
        'emails',
        'name',
        'observations',
        'pf',
        'phoneNumbers'
      ]);
    }
  };

  const clearValues = () => {
    tenantForm.setValue('name', '');
    tenantForm.setValue('cui', '');
    tenantForm.setValue('emails', []);
    tenantForm.setValue('phoneNumbers', []);
    tenantForm.setValue('pf', false);
    tenantForm.setValue('observations', []);
  };

  //DRAWER ON MOBILE, SHEET ON LARGER SCREENS
  const Container = isMobile ? Drawer : Sheet;
  const ContainerContent = isMobile ? DrawerContent : SheetContent;
  const ContainerHeader = isMobile ? DrawerHeader : SheetHeader;
  const ContainerTitle = isMobile ? DrawerTitle : SheetTitle;
  const ContainerDescription = isMobile ? DrawerDescription : SheetDescription;
  const ContainerFooter = isMobile ? DrawerFooter : SheetFooter;

  return (
    <Container open={isCreateElementOpen} onOpenChange={handleModalOpenChange}>
      <ContainerContent className="mx-auto max-h-[90vh] w-full px-4 sm:max-h-[100vh] sm:max-w-[500px]">
        <ContainerHeader>
          <ContainerTitle>Creeaza un nou tenant</ContainerTitle>
          <ContainerDescription>
            Introduceti detaliile tenant-ului pe care vreti sa il creati.
          </ContainerDescription>
        </ContainerHeader>
        <ScrollArea className="my-2 h-[84vh]">
          <Form {...tenantForm}>
            <form
              onSubmit={tenantForm.handleSubmit(onSubmit)}
              id="createTenantForm"
              className="space-y-2 sm:mx-3"
            >
              <TenantFormFields form={tenantForm} />
            </form>
          </Form>
        </ScrollArea>
        <ContainerFooter>
          <Button
            type="submit"
            form="createTenantForm"
            className={`${buttonVariants({
              variant: 'primaryYellow',
            })}`}
            disabled={isCreating}
          >
            Adauga chirias
          </Button>
        </ContainerFooter>
      </ContainerContent>
    </Container>
  );
}
