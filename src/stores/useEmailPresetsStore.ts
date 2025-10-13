import { create } from 'zustand';
import type { EmailPreset, EmailFile } from '@/types/EmailPresets';

interface EmailPresetsState {
  presets: EmailPreset[];
  files: EmailFile[];
  selectedPresetId: string | null;
  selectedPresetIds: string[];
  isLoading: boolean;
  isEditMode: boolean;
  isSendMode: boolean;
  uploadLoading: boolean;
  error: string | null;
  setPresets: (presets: EmailPreset[]) => void;
  setFiles: (files: EmailFile[]) => void;
  setSelectedPresetId: (id: string | null) => void;
  setSelectedPresetIds: (ids: string[]) => void;
  setIsLoading: (loading: boolean) => void;
  setIsEditMode: (edit: boolean) => void;
  setIsSendMode: (send: boolean) => void;
  setUploadLoading: (loading: boolean) => void;
  setError: (err: string | null) => void;
}

export const useEmailPresetsStore = create<EmailPresetsState>(set => ({
  presets: [],
  files: [],
  selectedPresetId: null,
  selectedPresetIds: [],
  isLoading: false,
  isEditMode: false,
  isSendMode: false,
  uploadLoading: false,
  error: null,
  setPresets: (presets) => set({ presets }),
  setFiles: (files) => set({ files }),
  setSelectedPresetId: (id) => set({ selectedPresetId: id }),
  setSelectedPresetIds: (ids) => set({ selectedPresetIds: ids }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsEditMode: (edit) => set({ isEditMode: edit }),
  setIsSendMode: (send) => set({ isSendMode: send }),
  setUploadLoading: (loading) => set({ uploadLoading: loading }),
  setError: (err) => set({ error: err }),
}));
