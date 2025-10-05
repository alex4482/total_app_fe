import { Outlet } from 'react-router-dom';

export const PublicLayout = () => {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Outlet />
    </main>
  );
};
