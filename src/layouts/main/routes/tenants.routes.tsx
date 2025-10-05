import Tenant from '@/pages/tenants/Tenants';
import type { RouteObject } from 'react-router-dom';

export const tenantsRoutes: RouteObject[] = [
  {
    path: '/tenants',
    children: [
      {
        index: true,
        element: <Tenant />,
      },
    ],
  },
];
