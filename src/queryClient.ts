import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { toast } from './components/ui/use-toast';

const RESPONSE_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const RESPONSE_CACHE_TIME = 1000 * 60 * 30; // 30 minutes
const REQUEST_RETRY_COUNT = 3;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: RESPONSE_STALE_TIME,
      gcTime: RESPONSE_CACHE_TIME,
      retry(failureCount, error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status) {
            return error.response.status < 400;
          }
        }

        return failureCount < REQUEST_RETRY_COUNT;
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query?.meta?.skipGlobalErrorHandling) {
        return;
      }

      if (axios.isAxiosError(error)) {
        toast({
          title: 'Am intampinat o eroare!',
          description:
            error.response?.data?.message || 'Nu stiu ce s-a intamplat!',
          variant: 'destructive',
        });
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation?.meta?.skipGlobalErrorHandling) {
        return;
      }

      if (axios.isAxiosError(error)) {
        toast({
          title: 'Am intampinat o eroare!',
          description:
            error.response?.data?.message || 'Nu stiu ce s-a intamplat!',
          variant: 'destructive',
        });
      }
    },
  }),
});
