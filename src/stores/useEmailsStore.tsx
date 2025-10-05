  import type { EmailSendData } from '@/types/Emails';
  import { createAbstractElementsStore } from './useAbstractStore';

  const useEmailsStore = createAbstractElementsStore<EmailSendData>();
  

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
  