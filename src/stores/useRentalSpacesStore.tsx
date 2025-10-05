import { RentalSpace } from '@/types/RentalSpace';
import { createAbstractElementsStore } from './useAbstractStore';

const useRentalSpacesStore = createAbstractElementsStore<RentalSpace>();
  
export default useRentalSpacesStore;