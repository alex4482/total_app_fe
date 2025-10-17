import useTenantsStore from '@/stores/useTenantsStore.tsx';
import TenantDetailsForm from './TenantDetailsForm';
import React, { useEffect } from 'react';
import { createTenant, updateTenant } from '@/clients/tenants-client';
import useFetchTenants from '@/util/hooks/useFetchTenants';
import { useToast } from '@/components/ui/use-toast';
import { useFileUpload } from '@/util/hooks/useFileUpload';
import { TenantFilesSection } from './TenantFilesSection';
import { DuplicateFilesDialog } from './DuplicateFilesDialog';

const TenantDetails: React.FC = () => {
  const { toast } = useToast();
  const { currentElement: currentTenant } = useTenantsStore();
  const { handleFetchTenants } = useFetchTenants();
  
  // Tenant form state
  const [name, setName] = React.useState(currentTenant?.name || '');
  const [cui, setCui] = React.useState(currentTenant?.cui || '');
  const [emails, setEmails] = React.useState<string[]>(currentTenant?.emails || []);
  const [phoneNumbers, setPhoneNumbers] = React.useState<string[]>(currentTenant?.phoneNumbers || []);
  const [observations, setObservations] = React.useState(currentTenant?.observations || []);
  const [pf, setPf] = React.useState(currentTenant?.pf || false);
  const [editMode, setEditMode] = React.useState(false);
  
  // Duplicate files dialog state
  const [showDuplicateDialog, setShowDuplicateDialog] = React.useState(false);
  const [duplicateFiles, setDuplicateFiles] = React.useState<Array<{ tempId: string; filename: string }>>([]);
  const [selectedOverwrites, setSelectedOverwrites] = React.useState<Set<string>>(new Set());

  // File upload system
  const fileUpload = useFileUpload({
    ownerType: 'TENANT',
    ownerId: currentTenant?.id ? Number(currentTenant.id) : undefined,
    onCommitComplete: () => {
      toast({
        description: 'Fișierele au fost salvate cu succes!',
      });
    },
    onError: (error) => {
      toast({
        description: error,
        variant: 'destructive',
      });
    },
  });

  // Sync local state with currentTenant when it changes
  React.useEffect(() => {
    setName(currentTenant?.name || '');
    setCui(currentTenant?.cui || '');
    setEmails(currentTenant?.emails || []);
    setPhoneNumbers(currentTenant?.phoneNumbers || []);
    setObservations(currentTenant?.observations || []);
    setPf(currentTenant?.pf || false);
    setEditMode(currentTenant?.id === '');
  }, [currentTenant]);

  // Load files when tenant changes
  useEffect(() => {
    if (currentTenant?.id && currentTenant.id !== '') {
      fileUpload.loadFiles();
    }
  }, [currentTenant?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentTenant) return null;

  const handleSave = async () => {
    if (!currentTenant) return;
    
    // Validare nume
    if (!name || name.trim().length === 0) {
      toast({
        description: 'Numele chiriasului nu poate fi gol!',
        variant: 'destructive',
      });
      return;
    }

    if (name.trim().length < 3) {
      toast({
        description: 'Numele chiriasului este prea scurt! Minim 3 caractere.',
        variant: 'destructive',
      });
      return;
    }
    
    const tenantData = {
      name: name.trim(),
      cui,
      emails,
      phoneNumbers,
      observations,
      pf,
    };

    try {
      let savedTenant;
      
      if (currentTenant.id && currentTenant.id !== '') {
        await updateTenant(currentTenant.id, tenantData);
        savedTenant = { ...currentTenant, ...tenantData };
        toast({
          description: 'Chiriasul a fost actualizat cu succes!',
        });
      } else {
        const response = await createTenant(tenantData);
        savedTenant = response.data;
        toast({
          description: 'Chiriasul a fost creat cu succes!',
        });
        useTenantsStore.getState().setVariableByName('currentElement', savedTenant);
      }
      
      // Commit files dacă există fișiere temporare
      if (fileUpload.tempFiles.length > 0 && savedTenant?.id) {
        await fileUpload.commitTempFiles();
      }
      
      setEditMode(false);
      await handleFetchTenants();
    } catch (error) {
      console.error('Error saving tenant:', error);
      toast({
        description: 'A apărut o eroare la salvarea chiriasului!',
        variant: 'destructive',
      });
    }
  };

  const handleCommitFiles = async () => {
    if (!currentTenant?.id || currentTenant.id === '') {
      toast({
        description: 'Salvează mai întâi chiriașul pentru a putea încărca fișiere!',
        variant: 'destructive',
      });
      return;
    }

    fileUpload.clearError();
    const { duplicates, nonDuplicates, hasDuplicates } = fileUpload.checkDuplicates();
    
    try {
      // Commit non-duplicate files immediately
      if (nonDuplicates.length > 0) {
        await fileUpload.commitSpecificFiles(
          nonDuplicates.map(f => f.tempId),
          false
        );
      }

      // Show dialog for duplicate files
      if (hasDuplicates) {
        setDuplicateFiles(duplicates);
        setSelectedOverwrites(new Set(duplicates.map(f => f.tempId)));
        setShowDuplicateDialog(true);
      } else if (nonDuplicates.length > 0) {
        toast({
          description: 'Fișierele au fost salvate cu succes!',
        });
      }
    } catch (error) {
      console.error('Error committing files:', error);
      toast({
        description: 'Eroare la salvarea fișierelor',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmDuplicates = async () => {
    setShowDuplicateDialog(false);

    try {
      const filesToOverwrite = duplicateFiles.filter(f => selectedOverwrites.has(f.tempId));
      const filesToKeepBoth = duplicateFiles.filter(f => !selectedOverwrites.has(f.tempId));

      if (filesToOverwrite.length > 0) {
        await fileUpload.commitSpecificFiles(
          filesToOverwrite.map(f => f.tempId),
          true
        );
      }

      if (filesToKeepBoth.length > 0) {
        await fileUpload.commitSpecificFiles(
          filesToKeepBoth.map(f => f.tempId),
          false
        );
      }

      toast({
        description: 'Fișierele au fost salvate cu succes!',
      });
    } catch (error) {
      console.error('Error committing duplicate files:', error);
      toast({
        description: 'Eroare la salvarea fișierelor duplicate',
        variant: 'destructive',
      });
    }
  };

  const handleCancelUpload = () => {
    setShowDuplicateDialog(false);
    setSelectedOverwrites(new Set());
  };

  const toggleFileOverwrite = (tempId: string) => {
    setSelectedOverwrites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tempId)) {
        newSet.delete(tempId);
      } else {
        newSet.add(tempId);
      }
      return newSet;
    });
  };

  const toggleAllOverwrites = () => {
    if (selectedOverwrites.size === duplicateFiles.length) {
      setSelectedOverwrites(new Set());
    } else {
      setSelectedOverwrites(new Set(duplicateFiles.map(f => f.tempId)));
    }
  };

  return (
    <>
      <div className="flex w-full flex-col gap-1">
        <TenantDetailsForm
          name={name}
          setName={setName}
          cui={cui}
          setCui={setCui}
          emails={emails}
          setEmails={setEmails}
          phoneNumbers={phoneNumbers}
          setPhoneNumbers={setPhoneNumbers}
          observations={observations}
          setObservations={setObservations}
          pf={pf}
          setPf={setPf}
          editMode={editMode}
          setEditMode={setEditMode}
          currentTenant={currentTenant}
          handleSave={handleSave}
        />
        
        <TenantFilesSection
          tenantId={currentTenant?.id}
          committedFiles={fileUpload.committedFiles}
          tempFiles={fileUpload.tempFiles}
          isLoadingFiles={fileUpload.isLoadingFiles}
          isUploading={fileUpload.isUploading}
          isCommitting={fileUpload.isCommitting}
          uploadProgress={fileUpload.uploadProgress}
          error={fileUpload.error}
          onLoadFiles={fileUpload.loadFiles}
          onUploadFiles={fileUpload.uploadFiles}
          onCommitFiles={handleCommitFiles}
          onRemoveTempFile={fileUpload.removeTempFile}
          onClearTempFiles={fileUpload.clearTempFiles}
        />
      </div>

      <DuplicateFilesDialog
        open={showDuplicateDialog}
        onOpenChange={setShowDuplicateDialog}
        duplicateFiles={duplicateFiles}
        selectedOverwrites={selectedOverwrites}
        onToggleFileOverwrite={toggleFileOverwrite}
        onToggleAllOverwrites={toggleAllOverwrites}
        onConfirm={handleConfirmDuplicates}
        onCancel={handleCancelUpload}
      />
    </>
  );
};

export default TenantDetails;
