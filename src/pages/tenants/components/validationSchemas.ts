import { z } from 'zod';
import { ObservationUrgency } from '@/types/Observation';

export const observationSchema = z.object({
  message: z.string().min(1, "Mesajul nu poate fi gol."),
  type: z.enum(ObservationUrgency),
});

export const tenantFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Numele chiriasului nu poate fi gol!')
    .min(3, 'Numele chiriasului este prea scurt! Minim 3 caractere.')
    .refine((val) => val.trim().length > 0, 'Numele nu poate conține doar spații goale!'),
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

export type TenantFormValues = z.infer<typeof tenantFormSchema>;
