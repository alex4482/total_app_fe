import { useCallback, useEffect, useState } from 'react';

import useTenantsStore, { TenantDetailsHandler } from '@/stores/useTenantsStore.tsx';
import FilePondPluginFileRename from 'filepond-plugin-file-rename';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { FilePond, registerPlugin } from 'react-filepond';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';

import { revertFile, uploadFile } from '@/clients/documents-client';
import { FilePondFile, FilePondInitialFile } from 'filepond';

import { uploadLocation } from '@/types/Files';

registerPlugin(FilePondPluginFileRename);
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export interface FileMetadata {
  id?: string;
  name: string;
}

export interface UploadResponse {
  data: {
    savedDocuments: {
      databaseId: string;
      name: string;
      id: string;
    }[];
  };
}

export interface FileUploadProps {
  filePondRef: React.RefObject<FilePond>;
  addContentForm: any; // Consider using proper form type
  handleGetTenantHistory: TenantDetailsHandler;
  handleGetTenantDetails: TenantDetailsHandler;
  selectedTab: string;
  onFilesChange: (count: number, names: string[]) => void;
}

const useFilePondServer = (
  // userId: string,
  tenantId: string,
  fileType: string,
  callbacks: {
    onUploadSuccess: (currentTenantId: string) => void;
    onFilesChange: (count: number, names: string[]) => void;
  }
) => {
  const handleUpload = useCallback(
    async (fieldName: string, file: File): Promise<string[]> => {
      const formData = new FormData();
      formData.append(fieldName, file, file.name);
      // formData.append('userId', userId);
      formData.append('locationId', tenantId);
      formData.append('fileTypes', fileType);
      // formData.append('locationType', uploadLocation.TASK);

      const response = await uploadFile(formData);
      const { savedDocuments } = (response as UploadResponse).data;

      callbacks.onUploadSuccess(tenantId);

      return savedDocuments.map(doc => doc.databaseId);
    },
    [tenantId, fileType, callbacks]
  );

  const handleRevert = useCallback(
    async (uniqueFileId: string) => {
      await revertFile(uniqueFileId, tenantId);
    },
    [tenantId]
  );

  return { handleUpload, handleRevert };
};

export default function FileUpload({
  filePondRef,
  addContentForm,
  handleGetTenantHistory,
  handleGetTenantDetails,
  selectedTab,
  onFilesChange,
}: FileUploadProps) {
  const [files, setFiles] = useState<(Blob | FilePondInitialFile)[]>([]);
  const { currentElement: currentTenant } = useTenantsStore();

  const tenantId = currentTenant?.id ?? '';
  const fileType = addContentForm.getValues('fileType') ?? '';
  const costs = addContentForm.getValues('costs') ?? [];

  const { handleUpload, handleRevert } = useFilePondServer(
    tenantId,
    fileType,
    {
      onUploadSuccess: tenantId => {
        handleGetTenantHistory(tenantId);
      },
      onFilesChange,
    }
  );

  const handleFilePondUpdate = useCallback(
    (fileItems: FilePondFile[]) => {
      setFiles(fileItems.map(fileItem => fileItem.file));

      const names = fileItems.map(fileItem => fileItem.file.name);
      onFilesChange(fileItems.length, names);
    },
    [onFilesChange]
  );

  useEffect(() => {
    setFiles([]);
  }, [selectedTab]);

  return (
    <FilePond
      ref={filePondRef}
      files={files}
      onupdatefiles={handleFilePondUpdate}
      allowMultiple
      maxFiles={10}
      name="files"
      acceptedFileTypes={['image/*', 'application/pdf', 'text/plain']}
      instantUpload={false}
      server={{
        process: async (fieldName, file, _, load, error) => {
          try {
            const fileIds = await handleUpload(fieldName, file as File);
            load(fileIds);
          } catch {
            error('File upload failed');
          }
        },
        revert: async (uniqueFileId, load, error) => {
          try {
            await handleRevert(uniqueFileId);
            setFiles(prevFiles =>
              prevFiles.filter(file => file !== uniqueFileId)
            );
            if (currentTenant) {
              handleGetTenantDetails(currentTenant.id);
            }
            load();
          } catch {
            error('File revert failed');
          }
        },
      }}
    />
  );
}
