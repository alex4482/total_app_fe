
import useTenantsStore from '@/stores/useTenantsStore.tsx';
import TenantDetailsForm from './TenantDetailsForm';
import TenantAttachments from './TenantAttachments';
import React, { useRef } from 'react';
// import { Paperclip, FileText } from 'lucide-react';
// Mocked attachments for demonstration
const mockAttachments = [
  { id: 'file1', name: 'contract.pdf', type: 'pdf' },
  { id: 'file2', name: 'factura_octombrie.png', type: 'image' },
  { id: 'file3', name: 'notificare.docx', type: 'doc' },
];
import { createTenant } from '@/clients/tenants-client';
import useFetchTenants from '@/util/hooks/useFetchTenants';

// Add missing enum or import for ObservationUrgency if not already present


const TenantDetails: React.FC = () => {
  const { currentElement: currentTenant } = useTenantsStore();
  const { handleFetchTenants } = useFetchTenants();
  const [name, setName] = React.useState(currentTenant?.name || '');
  const [cui, setCui] = React.useState(currentTenant?.cui || '');
  const [emails, setEmails] = React.useState<string[]>(currentTenant?.emails || []);
  const [phoneNumbers, setPhoneNumbers] = React.useState<string[]>(currentTenant?.phoneNumbers || []);
  const [observations, setObservations] = React.useState(currentTenant?.observations || []);
  const [pf, setPf] = React.useState(currentTenant?.pf || false);
  const [editMode, setEditMode] = React.useState(false);

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

  if (!currentTenant) return null;

  // Handlers for add/remove


  const handleSave = async () => {
    if (!currentTenant) return;
    // Always use createTenant for both new and edit
    await createTenant({
      name,
      emails,
      phoneNumbers,
      observations,
      pf,
      active: currentTenant.active,
      attachmentIds: currentTenant.attachmentIds,
    });
    setEditMode(false);
    await handleFetchTenants();
  };

  // Dropzone logic
  const [attachments, setAttachments] = React.useState(mockAttachments);
  const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!editMode) return;
    const files = Array.from(e.dataTransfer.files);
    // Mock upload: just add to attachments list
    setAttachments((prev) => [
      ...prev,
      ...files.map((file, idx) => ({
        id: 'mock_' + Date.now() + '_' + idx,
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'doc',
      })),
    ]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editMode) return;
    const files = e.target.files ? Array.from(e.target.files) : [];
    setAttachments((prev) => [
      ...prev,
      ...files.map((file, idx) => ({
        id: 'mock_' + Date.now() + '_' + idx,
        name: file.name,
        type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'doc',
      })),
    ]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
  <>
    <div className="flex w-full flex-row gap-4">
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
      <TenantAttachments
        attachments={attachments}
        editMode={editMode}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onFileInput={handleFileInput}
        fileInputRef={fileInputRef}
      />
    </div>
  </>
  );
};

export default TenantDetails;
