import { useState } from 'react';

import { createTenant } from '@/clients/tenants-client.ts';
import useGeneralStore from '@/stores/useGeneralStore.tsx';
import useTenantsStore from '@/stores/useTenantsStore';
import useFetchTenants from '@/util/hooks/useFetchTenants';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, buttonVariants } from '@/components/ui/button.tsx';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
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
import { ObservationUrgency } from '@/types/Observation';
import { CreateTenantProps } from '@/types/Tenant';

export default function AddTenantModal() {
  const { toast } = useToast();
  const { isMobile } = useGeneralStore();
  const {
    isCreateElementOpen,
    toggleElementCreateOpen,
  } = useTenantsStore();
  const { handleFetchTenants } = useFetchTenants();

  const [isCreating, setIsCreating] = useState(false);

  const observationSchema = z.object({
    message: z.string().min(1, "Mesajul nu poate fi gol."),
    type: z.enum(ObservationUrgency),
  });

  const formSchema = z.object({
    name: z
      .string()
      .min(3, 'Numele chiriasului este prea scurt! Minim 3 caractere.'),
    cui: z
      .string().optional(),
    emails: z.array(
      z.string().email()
    ).optional(),
    phoneNumbers: z.array(
      z.string()
    ).optional(),
    observations: z.array(observationSchema).optional(),
    pf: z.boolean(),
  });

  const tenantForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      cui: '',
      emails: [],
      observations: [],
      phoneNumbers: [],
      pf: false,
    },
  });
  
  const { fields: fieldsEmail, append: appendEmail, remove: removeEmail } =
    useFieldArray({
      control: tenantForm.control,
      name: "emails" as never,
    });
    
  const { fields: fieldsPN, append: appendPN, remove: removePN } =
    useFieldArray({
      control: tenantForm.control,
      name: "phoneNumbers" as never,
    });
  
  const { fields: fieldsObs, append: appendObs, remove: removeObs } =
    useFieldArray({
      control: tenantForm.control,
      name: "observations",
    });

  const handleCreateTenant = async (values: CreateTenantProps) => {
    try {
      setIsCreating(true);
      const response = await createTenant(values);
      if (response.status >= 200 && response.status < 300) {
        toast({
          description: 'Chiriasul a fost creat cu succes!',
        });
        clearValues();
        toggleElementCreateOpen(false);
        handleFetchTenants();
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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
              <FormField
                control={tenantForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numele chiriasului</FormLabel>
                    <FormControl className="mt-0">
                      <Input
                        autoComplete="off"
                        className="mt-0 w-full"
                        placeholder="Introduceti numele chiriasului..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={tenantForm.control}
                name="cui"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CUI</FormLabel>
                    <FormControl className="mt-0">
                      <Input
                        autoComplete="off"
                        className="mt-0 w-full"
                        placeholder="..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={tenantForm.control}
                name="pf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Persoana fizica?</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(!!checked)}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                        <span className="text-sm text-muted-foreground">
                          Marchează dacă este persoană fizică
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={tenantForm.control}
                name="emails"
                render={() => (
                <FormItem>
                  <FormLabel>Emailuri</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {fieldsEmail.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <Input
                            type="email"
                            placeholder={`Email ${index + 1}`}
                            {...tenantForm.register(`emails.${index}`)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeEmail(index)}
                          >
                            −
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="mt-1 self-start"
                        onClick={() => appendEmail('')}
                      >
                        + Adaugă email
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />
              <FormField
                control={tenantForm.control}
                name="phoneNumbers"
                render={() => (
                <FormItem>
                  <FormLabel>Numere de telefon</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {fieldsPN.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <Input
                            {...tenantForm.register(`phoneNumbers.${index}`)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removePN(index)}
                          >
                            −
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="mt-1 self-start"
                        onClick={() => appendPN("")}
                      >
                        + Adaugă numar de telefon
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />
              <FormField
                control={tenantForm.control}
                name="observations"
                render={() => (
                <FormItem>
                  <FormLabel>Alte observatii</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-3">
                      {/* Lista observațiilor */}
                      {fieldsObs.map((f, index) => (
                        <div key={f.id} className="rounded-xl border p-3 flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            {/* Select urgență */}
                            <Controller
                              control={tenantForm.control}
                              name={`observations.${index}.type`}
                              render={({ field }) => (
                                <select
                                  className="rounded-lg border px-2 py-1 text-sm"
                                  value={field.value}
                                  onChange={(e) =>
                                    field.onChange(e.target.value as ObservationUrgency)
                                  }
                                >
                                  <option value={ObservationUrgency.SIMPLE}>Simplu</option>
                                  <option value={ObservationUrgency.TODO}>De făcut</option>
                                  <option value={ObservationUrgency.URGENT}>URGENT</option>
                                </select>
                              )}
                            />

                            {/* Buton ștergere */}
                            <button
                              type="button"
                              className="ml-auto rounded-lg border px-2 py-1 text-sm hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => removeObs(index)}
                            >
                              −
                            </button>
                          </div>

                          {/* Mesaj observație */}
                          <textarea
                            className="w-full rounded-lg border p-2"
                            rows={3}
                            placeholder="Scrie observația…"
                            {...tenantForm.register(`observations.${index}.message`)}
                          />
                        </div>
                      ))}

                      {/* Buton adăugare */}
                      <button
                        type="button"
                        className="self-start rounded-lg border px-3 py-1 text-sm hover:bg-accent"
                        onClick={() =>
                          appendObs({
                            message: "",
                            type: ObservationUrgency.SIMPLE,
                          })
                        }
                      >
                        + Adaugă observație
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
                )}
              />
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
