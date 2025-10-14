  import type { EmailPreset } from '@/types/EmailPresets';
  import { createAbstractElementsStore } from './useAbstractStore';

  const useEmailsStore = createAbstractElementsStore<EmailPreset>();
  

  // export interface EmailsState {
  //   presetsTree: { [key: string]: EmailSendData };
  //   arePresetsLoading: boolean;
  //   isEmailModalOpen: boolean;
  //   presetMessages: string[];
  //   presetTitles: string[];
  //   setVariableByName: <K extends keyof EmailsState>(
  //     key: K,
  //     value: EmailsState[K]
  //   ) => void;
  // }
  
  // const useEmailsStore = create<EmailsState>(set => ({
  //   presetsTree: {},
  //   arePresetsLoading: false,
  //   isEmailModalOpen: false,
  //   presetMessages: [],
  //   presetTitles: [],
  //   setVariableByName: (key, value) => set(state => ({ ...state, [key]: value })),
  // }));
  
  export default useEmailsStore;
  