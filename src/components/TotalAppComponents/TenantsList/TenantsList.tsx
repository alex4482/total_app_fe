
import { useState } from 'react';
import type { Tenant } from '@/types/Tenant';
import useTenantsStore from '@/stores/useTenantsStore';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { deleteTenant } from '@/clients/tenants-client';
import useFetchTenants from '@/util/hooks/useFetchTenants';

import TenantFilters from './TenantFilters';
import TenantElement from './TenantElement';


export const TenantList: React.FC = () => {
  const [filterPF, setFilterPF] = useState<'all' | 'pf' | 'pj'>('all');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [search, setSearch] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { handleFetchTenants } = useFetchTenants();
  
  //const PAGE_SIZE = 20;
  const {
    elements: tenants,
    // loading,
  // setVariableByName: setTenantListVariable,
    setCurrentElement,
    currentElement,
    setVariableByName,
  } = useTenantsStore();



  const shouldExcludeTenant = (tenant: Tenant) => {
    if (filterPF === 'pf' && !tenant.pf) return true;
    if (filterPF === 'pj' && tenant.pf) return true;
    if (filterActive === 'active' && !tenant.active) return true;
    if (filterActive === 'inactive' && tenant.active) return true;
    if (search && !tenant.name.toLowerCase().includes(search.toLowerCase())) return true;
    return false;
  };

  const handleDeleteTenant = async () => {
    if (!currentElement?.id) return;
    
    try {
      setIsDeleting(true);
      await deleteTenant(currentElement.id);
      
      // Șterge imediat tenant-ul din lista locală pentru UI instant
      const updatedElements = tenants.filter(t => t.id !== currentElement.id);
      setVariableByName('elements', updatedElements);
      
      // Închide dialog-ul și resetează UI-ul
      setShowDeleteDialog(false);
      setVariableByName('currentElement', null);
      
      // Reîmprospătează lista de tenanți de la server pentru a fi siguri
      await handleFetchTenants();
      
      toast({
        description: 'Chiriașul a fost șters cu succes!',
      });
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast({
        description: 'A apărut o eroare la ștergerea chiriașului!',
        variant: 'destructive',
      });
      // Re-fetch pentru a restaura starea corectă în caz de eroare
      await handleFetchTenants();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
    <div className="bg-background">
      <div className="flex w-full flex-col">
        <div className="mt-5 flex w-full flex-col items-center gap-1 px-10">
          <TenantFilters
            filterPF={filterPF}
            setFilterPF={setFilterPF}
            filterActive={filterActive}
            setFilterActive={setFilterActive}
            search={search}
            setSearch={setSearch}
          />
          {/* Butoane de acțiuni */}
          <div className="mb-2 flex gap-2 w-full">
            <button
              className="flex-1 px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white font-bold text-lg"
              title="Adaugă chiriaș nou"
              onClick={() => setCurrentElement({
                id: '',
                name: '',
                cui: '',
                emails: [],
                phoneNumbers: [],
                observations: [],
                pf: false,
                active: false, // default INACTIV
                attachmentIds: [],
              })}
            >
              +
            </button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={!currentElement?.id}
              className="gap-2"
              title="Șterge chiriaș selectat"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {tenants
            .filter((tenant: Tenant) => !shouldExcludeTenant(tenant))
            .map((tenant: Tenant) => (
              <TenantElement
                key={tenant.id}
                tenant={tenant}
                selected={tenant.id === currentElement?.id}
                onSelect={setCurrentElement}
              />
            ))}

        </div>
      </div>
    </div>

    {/* Dialog de confirmare ștergere */}
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ești sigur că vrei să ștergi acest chiriaș?</DialogTitle>
          <DialogDescription>
            Această acțiune nu poate fi anulată. Chiriașul "{currentElement?.name}" va fi șters permanent din sistem.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowDeleteDialog(false)}
            disabled={isDeleting}
          >
            Anulează
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteTenant}
            disabled={isDeleting}
          >
            {isDeleting ? 'Se șterge...' : 'Șterge'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};
