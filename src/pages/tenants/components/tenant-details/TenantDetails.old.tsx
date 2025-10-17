
import useTenantsStore from '@/stores/useTenantsStore.tsx';
import TenantDetailsForm from './TenantDetailsForm';
import React, { useEffect } from 'react';
import { createTenant, updateTenant } from '@/clients/tenants-client';
import { formatFileSize } from '@/clients/files-client';
import useFetchTenants from '@/util/hooks/useFetchTenants';
import { useToast } from '@/components/ui/use-toast';
import { FileList } from '@/components/TotalAppComponents';
import { useFileUpload } from '@/util/hooks/useFileUpload';
import { Button } from '@/components/ui/button';
import { FileIcon, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

// Add missing enum or import for ObservationUrgency if not already present


const TenantDetails: React.FC = () => {
  const { toast } = useToast();
  const { currentElement: currentTenant } = useTenantsStore();
  const { handleFetchTenants } = useFetchTenants();
  const [name, setName] = React.useState(currentTenant?.name || '');
  const [cui, setCui] = React.useState(currentTenant?.cui || '');
  const [emails, setEmails] = React.useState<string[]>(currentTenant?.emails || []);
  const [phoneNumbers, setPhoneNumbers] = React.useState<string[]>(currentTenant?.phoneNumbers || []);
  const [observations, setObservations] = React.useState(currentTenant?.observations || []);
  const [pf, setPf] = React.useState(currentTenant?.pf || false);
  const [editMode, setEditMode] = React.useState(false);
  
  // Dialog state for duplicate file warning
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
    // If new tenant (id is empty), start in edit mode
    setEditMode(currentTenant?.id === '');
  }, [currentTenant]);

  // Load files when tenant changes
  useEffect(() => {
    if (currentTenant?.id && currentTenant.id !== '') {
      fileUpload.loadFiles();
    }
  }, [currentTenant?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentTenant) return null;

  // Handlers for add/remove


  const handleSave = async () => {
    if (!currentTenant) return;
    
    // Validare nume - nu poate fi gol sau doar spații
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
        // Update existing tenant
        await updateTenant(currentTenant.id, tenantData);
        savedTenant = { ...currentTenant, ...tenantData };
        toast({
          description: 'Chiriasul a fost actualizat cu succes!',
        });
      } else {
        // Create new tenant
        const response = await createTenant(tenantData);
        savedTenant = response.data;
        toast({
          description: 'Chiriasul a fost creat cu succes!',
        });
        
        // Actualizează currentTenant în store cu ID-ul nou
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

  // Handler pentru commit manual (în caz că userul vrea să salveze doar fișierele)
  const handleCommitFiles = async () => {
    if (!currentTenant?.id || currentTenant.id === '') {
      toast({
        description: 'Salvează mai întâi chiriașul pentru a putea încărca fișiere!',
        variant: 'destructive',
      });
      return;
    }

    fileUpload.clearError();

    // Check for duplicate files
    const { duplicates, nonDuplicates, hasDuplicates } = fileUpload.checkDuplicates();
    
    try {
      // Step 1: Commit non-duplicate files immediately
      if (nonDuplicates.length > 0) {
        await fileUpload.commitSpecificFiles(
          nonDuplicates.map(f => f.tempId),
          false
        );
      }

      // Step 2: Show dialog for duplicate files
      if (hasDuplicates) {
        setDuplicateFiles(duplicates);
        // Pre-select all files for overwrite by default
        setSelectedOverwrites(new Set(duplicates.map(f => f.tempId)));
        setShowDuplicateDialog(true);
      } else if (nonDuplicates.length > 0) {
        // All files committed successfully
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

  // Handler for confirming file replacement
  const handleConfirmDuplicates = async () => {
    setShowDuplicateDialog(false);

    try {
      const filesToOverwrite = duplicateFiles.filter(f => selectedOverwrites.has(f.tempId));
      const filesToKeepBoth = duplicateFiles.filter(f => !selectedOverwrites.has(f.tempId));

      // Request 1: Overwrite selected files
      if (filesToOverwrite.length > 0) {
        await fileUpload.commitSpecificFiles(
          filesToOverwrite.map(f => f.tempId),
          true
        );
      }

      // Request 2: Keep both (rename) for unchecked files
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

  // Handler for canceling file upload
  const handleCancelUpload = () => {
    setShowDuplicateDialog(false);
    setSelectedOverwrites(new Set());
  };

  // Toggle individual file overwrite selection
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

  // Toggle all files
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
      {/* Formular detalii chiriaș */}
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
      
      {/* Secțiune fișiere - afișată doar pentru tenanți existenți */}
      {currentTenant?.id && currentTenant.id !== '' && (
        <div className="border-t pt-4">
          <div className="flex items-center mb-4 gap-2">
            <h3 className="text-lg font-semibold">Fișiere Atașate</h3>
            <div className="text-sm text-muted-foreground">
              -  Trage fișiere aici pentru a le încărca
            </div>
          </div>

          {/* FileList unificat cu drag & drop */}
          <FileList
            files={fileUpload.committedFiles}
            isLoading={fileUpload.isLoadingFiles}
            onRefresh={fileUpload.loadFiles}
            emptyMessage="Nu există fișiere încărcate. Trage fișiere aici pentru a le încărca."
            onFilesSelected={fileUpload.uploadFiles}
            isUploading={fileUpload.isUploading}
            uploadProgress={fileUpload.uploadProgress}
          />

          {/* Fișiere temporare + butoane commit */}
          {fileUpload.tempFiles.length > 0 && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Fișiere în așteptare ({fileUpload.tempFiles.length})</h4>
              </div>
              
              <div className="space-y-2">
                {fileUpload.tempFiles.map((file) => (
                  <div
                    key={file.tempId}
                    className="flex items-center justify-between p-2 bg-background border rounded"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileIcon className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm truncate">{file.filename}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatFileSize(file.sizeBytes)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileUpload.removeTempFile(file.tempId)}
                      disabled={fileUpload.isCommitting}
                      className="flex-shrink-0"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-start gap-2 pt-2">
                <Button
                  onClick={handleCommitFiles}
                  disabled={fileUpload.isCommitting}
                  className="bg-orange-500 hover:bg-orange-700 text-white transition-colors"
                >
                  {fileUpload.isCommitting ? 'Se salvează...' : 'Salvează Fișiere'}
                </Button>
                <Button
                  variant="outline"
                  onClick={fileUpload.clearTempFiles}
                  disabled={fileUpload.isCommitting}
                >
                  Anulează
                </Button>
              </div>
            </div>
          )}

          {fileUpload.error && (
            <div className="mt-2 text-sm text-destructive">
              {fileUpload.error}
            </div>
          )}
        </div>
      )}
      
      {/* Mesaj pentru tenanți noi */}
      {(!currentTenant?.id || currentTenant.id === '') && (
        <div className="border-t pt-6">
          <div className="text-center p-6 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Salvează mai întâi chiriașul pentru a putea încărca fișiere
            </p>
          </div>
        </div>
      )}
    </div>

    {/* Dialog pentru duplicate files warning */}
    <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Fișiere duplicate detectate
          </DialogTitle>
          <DialogDescription>
            Următoarele fișiere există deja. Bifează fișierele pe care vrei să le suprascrii.
            Fișierele nebifate vor fi păstrate (ambele versiuni).
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Select All checkbox */}
          <div className="flex items-center gap-2 p-3 border-b">
            <Checkbox
              id="select-all-overwrites"
              checked={selectedOverwrites.size === duplicateFiles.length && duplicateFiles.length > 0}
              onCheckedChange={toggleAllOverwrites}
            />
            <label
              htmlFor="select-all-overwrites"
              className="text-sm font-medium cursor-pointer"
            >
              Selectează toate ({duplicateFiles.length})
            </label>
          </div>

          {/* List of duplicate files with checkboxes */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {duplicateFiles.map((file) => (
              <div
                key={file.tempId}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded hover:bg-muted cursor-pointer transition-colors"
                onClick={() => toggleFileOverwrite(file.tempId)}
              >
                <Checkbox
                  id={`overwrite-${file.tempId}`}
                  checked={selectedOverwrites.has(file.tempId)}
                  onCheckedChange={() => toggleFileOverwrite(file.tempId)}
                  onClick={(e) => e.stopPropagation()}
                />
                <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <label
                  htmlFor={`overwrite-${file.tempId}`}
                  className="text-sm font-medium flex-1 cursor-pointer"
                >
                  {file.filename}
                </label>
                <span className="text-xs text-muted-foreground">
                  {selectedOverwrites.has(file.tempId) ? '🔄 Suprascrie' : '📁 Păstrează ambele'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancelUpload}
          >
            Anulează
          </Button>
          <Button
            onClick={handleConfirmDuplicates}
            className="bg-orange-500 hover:bg-orange-700 text-white transition-colors"
          >
            Salvează ({selectedOverwrites.size} suprascrise, {duplicateFiles.length - selectedOverwrites.size} păstrate)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  );
};

export default TenantDetails;
