
import { Tenant } from '@/types/Tenant';

export type Column = {
  key: string;
  label: string;
  value: string;
  link?: string;
  endIcon?: string;
  isEditable?: boolean;
  type?: 'input' | 'number' | 'textarea';
};

export const useTenantFields = (currentTenant: Tenant) => {

  const halfSizeColumns: Column[] = [
    {
      key: 'cui',
      label: 'CUI:',
      value: currentTenant.cui || "nedefinit",
    },
  ];

  const fullSizeColumns: Column[] = [
    // ...(!currentTenant.takenBy && currentTenant.assignedTo
    //   ? [
    //       {
    //         key: 'assignedTo',
    //         label: 'Alocat către:',
    //         value: getNameFromUserId(currentTenant.assignedTo) || 'Unknown',
    //         link: `/users/${currentTenant.assignedTo}`,
    //       },
    //     ]
    //   : []),
    // ...(currentSubcomponent?.budget && currentBudget !== null
    //   ? [
    //       {
    //         key: 'budget.value',
    //         label: 'Buget total subproiect:',
    //         value: currentBudget,
    //         endIcon: currentSubcomponent.budget.currency,
    //         isEditable: can(Domain.TASK, CrudOperations.UPDATE),
    //         type: 'number' as const,
    //       },
    //     ]
    //   : []),
    // ...(currentSubcomponent?.budget && remainingBudget !== null
    //   ? [
    //       {
    //         key: 'budget.remainingBudget',
    //         label: 'Buget rămas:',
    //         value: remainingBudget,
    //         endIcon: currentSubcomponent.budget.currency,
    //         type: 'number' as const,
    //       },
    //     ]
    //   : []),
  ];

  return { halfSizeColumns, fullSizeColumns };
};
