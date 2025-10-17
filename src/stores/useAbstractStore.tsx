  import { create, StoreApi, UseBoundStore } from 'zustand';
  
  export interface AbstractElementsStoreState<A> {
    // TODO: DE SCHIMBAT
    elements: A[];
    elementToBeDeleted: A | null;
    loading: boolean;   
    currentElement: A | null;
    highlightedElementId: string | undefined,
    fromElementList: boolean,
    isElementDetailsOpen: boolean,
    hasMore: boolean,
    isCreateElementOpen: boolean,
    isSearchElementOpen: boolean,
    appliedFilters: { value: string; label: string }[];
    toggleElementCreateOpen: (isOpen: boolean) => void;
    toggleElementSearchOpen: (isOpen: boolean) => void;
    toggleElementDetailsOpen: (isOpen: boolean) => void;
    setVariableByName: <K extends keyof AbstractElementsStoreState<A>>(
      key: K,
      value: AbstractElementsStoreState<A>[K]
    ) => void;
    setCurrentElement: (element: A | null) => void;
  }
  
  export function createAbstractElementsStore<A>() :
  UseBoundStore<
  StoreApi<AbstractElementsStoreState<A>>
> {
  return create<AbstractElementsStoreState<A>>(set => ({
    elements: [],
    elementToBeDeleted: null,
    currentElement: null,
    highlightedElementId: undefined,
    fromElementList: false,
    isElementDetailsOpen: false,
    loading: false,
    hasMore: true,
    isCreateElementOpen: false,
    isSearchElementOpen: false,
    appliedFilters: [],
    toggleElementCreateOpen: (isOpen: boolean) =>
      set({ isCreateElementOpen: isOpen }),
    toggleElementSearchOpen: (isOpen: boolean) =>
      set({ isSearchElementOpen: isOpen }),
    toggleElementDetailsOpen: (isOpen: boolean) =>
      set({ isElementDetailsOpen: isOpen }),
    setVariableByName: (key, value) => set(() => ({ [key]: value } as Partial<AbstractElementsStoreState<A>> )),
    setCurrentElement: (element: A | null) =>
      set({ currentElement: element, isElementDetailsOpen: !!element }),

  }));
}
  