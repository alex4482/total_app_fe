import { useEffect } from 'react';
import useGeneralStore from './stores/useGeneralStore';
import { useMediaQuery } from '@/util/hooks/useMediaQuery.ts';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { ErrorPage, TotalAppErrorBoundary,
} from '@/components/TotalAppComponents';
import { AuthContextProvider } from './Auth';
import { router } from './layouts';
import { queryClient } from './queryClient.ts';
import { handleAxiosError } from '@/util';
import './styles/globals.css';

function App() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const setMobile = useGeneralStore(state => state.setMobile);

  useEffect(() => {
    setMobile(isMobile);
  }, [isMobile, setMobile]);

  return (
    <TotalAppErrorBoundary
      fallbackRender={({ error }) => (
        <ErrorPage
          title={handleAxiosError(error, 'Eroare la incarcarea paginii')}
        />
      )}
    >
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <AuthContextProvider>
          <RouterProvider router={router} />
        </AuthContextProvider>
      </QueryClientProvider>
    </TotalAppErrorBoundary>
  );
};


export default App
