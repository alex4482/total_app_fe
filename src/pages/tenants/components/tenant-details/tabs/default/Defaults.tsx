import { updateTenant } from '@/clients/tenants-client';
import useTenantsStore from '@/stores/useTenantsStore';
import BeatLoader from 'react-spinners/BeatLoader';

import { Tenant } from '@/types/Tenant';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

import { DetailField } from './Fields';
import { useTenantFields } from './hooks';
import useTenantsExtrasStore from '@/stores/useTenantsExtrasStore';
import ObservationsIndent from '../../../ObservationsIndent';

export default function Default() {
 
  const { currentElement: currentTenant } =
    useTenantsStore();
  const { areTenantDetailsLoading
   } =
    useTenantsExtrasStore();
  // const { can } = useAuthContext();

  if (!currentTenant) return null;
  const { halfSizeColumns, fullSizeColumns } = useTenantFields(currentTenant);

  const handleUpdateField = async (
    tenantId: string,
    field: keyof Tenant,
    value: Object
  ) => {
    try {
      await performUpdate(tenantId, field, value);
      toast({
        description: 'Modificare salvată cu succes!',
        variant: 'success',
      });
    } catch (error) {
      toast({
        description: 'A apărut o eroare la salvarea modificării!',
        variant: 'destructive',
      });
      console.error('Failed to update tenant field: ', error);
    }
  };

  const performUpdate = async (
    tenantId: string,
    field: keyof Tenant,
    value: Object
  ) => {
    const fieldParts = field.split('.');
    const updateData = fieldParts.reduceRight((acc, key) => {
      return { [key]: acc };
    }, value as any) as Partial<Tenant>;
      
    await updateTenant(tenantId, { ...updateData});
  };

  return areTenantDetailsLoading ? (
    <div className="flex w-full flex-col items-center">
      <BeatLoader color="#F59E0B" />
    </div>
  ) : (
    <>
      {' '}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex flex-col md:w-1/2">
        {/* //TODO FILL */}
        </div>
        <div className="flex flex-col gap-4 md:w-1/2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[...halfSizeColumns].map((column, index) => (
              <DetailField
                key={index}
                column={column}
                tenantId={currentTenant.id}
                handleUpdateField={handleUpdateField}
              />
            ))}
          </div>

          {[...fullSizeColumns].map((column, index) => (
            <DetailField
              key={index}
              column={column}
              tenantId={currentTenant.id}
              handleUpdateField={handleUpdateField}
            />
          ))}

          {currentTenant.observations && (
            <div>
              <Label className="mb-1 block font-medium">Observatii:</Label>
              <ObservationsIndent
                observations={currentTenant.observations}
                parentId={currentTenant.id}
                onSave={(parentId, _field, value) => handleUpdateField(parentId, 'observations', value)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
