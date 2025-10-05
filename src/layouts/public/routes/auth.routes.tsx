import { useAuthContext } from '@/Auth';
import Login from '@/pages/login/Login';
import { Navigate, type RouteObject } from 'react-router-dom';

const RedirectIfAuthenticated = ({ children }: { children: React.JSX.Element }) => {
  const { currentSession } = useAuthContext();
  return currentSession.isAuthenticated ? (
    <Navigate to="/" replace />
  ) : (
    children
  );
};

export const authRoutes: RouteObject[] = [
  {
    path: 'login',
    element: (
      <RedirectIfAuthenticated>
        <Login />
      </RedirectIfAuthenticated>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
];
