import { useState, useCallback } from 'react';
import {
  uploadTempFiles,
  commitFiles,
  listFiles,
  type TempUploadDto,
  type FileDto,
  type OwnerType,
  type CommitFilesParams,
} from '@/clients/files-client';

export interface FileUploadState {
  // Fișiere temporare (încărcate dar necommit-uite)
  tempFiles: TempUploadDto[];
  // Fișiere permanente (commit-uite)
  committedFiles: FileDto[];
  // Stări de loading
  isUploading: boolean;
  isCommitting: boolean;
  isLoadingFiles: boolean;
  // Progres upload (0-100)
  uploadProgress: number;
  // Erori
  error: string | null;
}

interface UseFileUploadOptions {
  ownerType: OwnerType;
  ownerId?: number;
  onUploadComplete?: (files: TempUploadDto[]) => void;
  onCommitComplete?: (files: FileDto[]) => void;
  onError?: (error: string) => void;
}

/**
 * Hook refolosibil pentru gestionarea upload-ului de fișiere
 * Suportă upload temporar, commit și listare fișiere
 */
export function useFileUpload(options: UseFileUploadOptions) {
  const { ownerType, ownerId, onUploadComplete, onCommitComplete, onError } = options;

  const [state, setState] = useState<FileUploadState>({
    tempFiles: [],
    committedFiles: [],
    isUploading: false,
    isCommitting: false,
    isLoadingFiles: false,
    uploadProgress: 0,
    error: null,
  });

  /**
   * Încarcă fișierele existente de pe server
   */
  const loadFiles = useCallback(async () => {
    if (!ownerId) return;

    setState(prev => ({ ...prev, isLoadingFiles: true, error: null }));

    try {
      const files = await listFiles(ownerType, ownerId);
      setState(prev => ({
        ...prev,
        committedFiles: files,
        isLoadingFiles: false,
      }));
    } catch (error) {
      const errorMsg = 'Eroare la încărcarea fișierelor';
      setState(prev => ({
        ...prev,
        error: errorMsg,
        isLoadingFiles: false,
      }));
      onError?.(errorMsg);
      console.error('Error loading files:', error);
    }
  }, [ownerType, ownerId, onError]);

  /**
   * Upload fișiere în zona temporară
   */
  const uploadFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    setState(prev => ({ ...prev, isUploading: true, error: null, uploadProgress: 0 }));

    try {
      // Simulează progres pentru feedback vizual
      setState(prev => ({ ...prev, uploadProgress: 30 }));
      
      const uploadedFiles = await uploadTempFiles(files);
      
      setState(prev => ({
        ...prev,
        tempFiles: [...prev.tempFiles, ...uploadedFiles],
        isUploading: false,
        uploadProgress: 100,
      }));

      onUploadComplete?.(uploadedFiles);

      // Reset progress după 1s
      setTimeout(() => {
        setState(prev => ({ ...prev, uploadProgress: 0 }));
      }, 1000);
    } catch (error) {
      const errorMsg = 'Eroare la încărcarea fișierelor';
      setState(prev => ({
        ...prev,
        error: errorMsg,
        isUploading: false,
        uploadProgress: 0,
      }));
      onError?.(errorMsg);
      console.error('Error uploading files:', error);
    }
  }, [onUploadComplete, onError]);

  /**
   * Verifică dacă există fișiere temporare cu același nume ca fișierele commit-uite
   * @returns Object cu fișierele duplicate și non-duplicate
   */
  const checkDuplicates = useCallback(() => {
    const committedNames = new Set(state.committedFiles.map(f => f.filename.toLowerCase()));
    
    const duplicates = state.tempFiles.filter(tf => 
      committedNames.has(tf.filename.toLowerCase())
    );
    
    const nonDuplicates = state.tempFiles.filter(tf => 
      !committedNames.has(tf.filename.toLowerCase())
    );
    
    return {
      duplicates,
      nonDuplicates,
      hasDuplicates: duplicates.length > 0,
    };
  }, [state.tempFiles, state.committedFiles]);

  /**
   * Commit fișiere temporare (asociază cu entitatea)
   */
  const commitTempFiles = useCallback(async (overwrite: boolean = false) => {
    if (state.tempFiles.length === 0 || !ownerId) return;

    setState(prev => ({ ...prev, isCommitting: true, error: null }));

    try {
      const params: CommitFilesParams = {
        ownerType,
        ownerId,
        tempIds: state.tempFiles.map(f => f.tempId),
        overwrite,
      };

      const committedFilesList = await commitFiles(params);

      setState(prev => ({
        ...prev,
        committedFiles: [...prev.committedFiles, ...committedFilesList],
        tempFiles: [], // Clear temp files după commit
        isCommitting: false,
      }));

      onCommitComplete?.(committedFilesList);
    } catch (error) {
      const errorMsg = 'Eroare la salvarea fișierelor';
      setState(prev => ({
        ...prev,
        error: errorMsg,
        isCommitting: false,
      }));
      onError?.(errorMsg);
      console.error('Error committing files:', error);
    }
  }, [state.tempFiles, ownerId, ownerType, onCommitComplete, onError]);

  /**
   * Commit specific files by tempIds with overwrite option
   * @param tempIds - Array of tempIds to commit
   * @param overwrite - Whether to overwrite existing files
   */
  const commitSpecificFiles = useCallback(async (tempIds: string[], overwrite: boolean = false) => {
    if (tempIds.length === 0 || !ownerId) return;

    const params: CommitFilesParams = {
      ownerType,
      ownerId,
      tempIds,
      overwrite,
    };

    const committedFilesList = await commitFiles(params);

    // Remove committed temp files from state
    setState(prev => ({
      ...prev,
      committedFiles: [...prev.committedFiles, ...committedFilesList],
      tempFiles: prev.tempFiles.filter(tf => !tempIds.includes(tf.tempId)),
    }));

    return committedFilesList;
  }, [ownerId, ownerType]);

  /**
   * Șterge un fișier temporar (înainte de commit)
   */
  const removeTempFile = useCallback((tempId: string) => {
    setState(prev => ({
      ...prev,
      tempFiles: prev.tempFiles.filter(f => f.tempId !== tempId),
    }));
  }, []);

  /**
   * Șterge toate fișierele temporare
   */
  const clearTempFiles = useCallback(() => {
    setState(prev => ({ ...prev, tempFiles: [] }));
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    ...state,
    
    // Actions
    uploadFiles,
    commitTempFiles,
    commitSpecificFiles,
    loadFiles,
    removeTempFile,
    clearTempFiles,
    clearError,
    checkDuplicates,
  };
}
