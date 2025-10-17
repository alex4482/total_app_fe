import { Controller, UseFormReturn, useFieldArray } from 'react-hook-form';
import { TenantFormValues } from './validationSchemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { TenantTypeToggle } from '@/components/TotalAppComponents';
import { ObservationUrgency } from '@/types/Observation';

interface TenantFormFieldsProps {
  form: UseFormReturn<TenantFormValues>;
}

export function TenantFormFields({ form }: TenantFormFieldsProps) {
  const { fields: fieldsEmail, append: appendEmail, remove: removeEmail } =
    useFieldArray({
      control: form.control,
      name: "emails" as never,
    });
    
  const { fields: fieldsPN, append: appendPN, remove: removePN } =
    useFieldArray({
      control: form.control,
      name: "phoneNumbers" as never,
    });
  
  const { fields: fieldsObs, append: appendObs, remove: removeObs } =
    useFieldArray({
      control: form.control,
      name: "observations",
    });

  return (
    <>
      {/* Name field */}
      <FormField
        control={form.control}
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

      {/* CUI field */}
      <FormField
        control={form.control}
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

      {/* Person type toggle */}
      <FormField
        control={form.control}
        name="pf"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tip persoană</FormLabel>
            <FormControl>
              <TenantTypeToggle
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email fields array */}
      <FormField
        control={form.control}
        name="emails"
        render={() => (
          <FormItem>
            <FormLabel>Emailuri</FormLabel>
            <FormControl>
              <div className="flex flex-col gap-2">
                {fieldsEmail.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Controller
                      control={form.control}
                      name={`emails.${index}`}
                      render={({ field: controllerField }) => (
                        <Input
                          type="email"
                          placeholder={`Email ${index + 1}`}
                          {...controllerField}
                          className="flex-1"
                        />
                      )}
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

      {/* Phone number fields array */}
      <FormField
        control={form.control}
        name="phoneNumbers"
        render={() => (
          <FormItem>
            <FormLabel>Numere de telefon</FormLabel>
            <FormControl>
              <div className="flex flex-col gap-2">
                {fieldsPN.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Controller
                      control={form.control}
                      name={`phoneNumbers.${index}`}
                      render={({ field: controllerField }) => (
                        <Input
                          placeholder={`Telefon ${index + 1}`}
                          {...controllerField}
                          className="flex-1"
                        />
                      )}
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

      {/* Observations fields array */}
      <FormField
        control={form.control}
        name="observations"
        render={() => (
          <FormItem>
            <FormLabel>Alte observatii</FormLabel>
            <FormControl>
              <div className="flex flex-col gap-3">
                {fieldsObs.map((f, index) => (
                  <div key={f.id} className="rounded-xl border p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {/* Select urgency */}
                      <Controller
                        control={form.control}
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

                      {/* Delete button */}
                      <button
                        type="button"
                        className="ml-auto rounded-lg border px-2 py-1 text-sm hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeObs(index)}
                      >
                        −
                      </button>
                    </div>

                    {/* Observation message */}
                    <Controller
                      control={form.control}
                      name={`observations.${index}.message`}
                      render={({ field: controllerField }) => (
                        <textarea
                          className="w-full rounded-lg border p-2"
                          rows={3}
                          placeholder="Scrie observația…"
                          {...controllerField}
                        />
                      )}
                    />
                  </div>
                ))}

                {/* Add observation button */}
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
    </>
  );
}
