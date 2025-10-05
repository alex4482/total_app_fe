import { useAuthContext } from '@/Auth';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';

import { MainLayout, mainRoutes } from './main';
import { PublicLayout } from './public';
import { authRoutes } from './public/routes';
import { RootLayout, rootRoutes } from './root';
import React from 'react';

const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const { currentSession } = useAuthContext();
  const location = useLocation();
  if (!currentSession.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: mainRoutes,
      },
      {
        element: <PublicLayout />,
        children: authRoutes,
      },
      {
        element: <RootLayout />,
        children: rootRoutes,
      },
    ],
  },
]);
