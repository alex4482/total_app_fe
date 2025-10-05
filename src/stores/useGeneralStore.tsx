import { create } from 'zustand';

import type { Currency } from '@/types/General.ts';

interface GeneralState {
  isMobile: boolean;
  setMobile: (isMobile: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (isSearchOpen: boolean) => void;
  currencies: Currency[];
  setVariableByName: <K extends keyof GeneralState>(
    key: K,
    value: GeneralState[K]
  ) => void;
}

const useGeneralStore = create<GeneralState>(set => ({
  isMobile: false,
  setMobile: (isMobile: boolean) => set({ isMobile }),
  isSearchOpen: false,
  currencies: ['RON', 'EUR'],
  setIsSearchOpen: (isSearchOpen: boolean) => set({ isSearchOpen }),
  setVariableByName: (key, value) => set(state => ({ ...state, [key]: value })),
}));

export default useGeneralStore;
