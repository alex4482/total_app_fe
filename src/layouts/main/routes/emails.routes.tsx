import Emails from '@/pages/emails/Emails.tsx';
import type { RouteObject } from 'react-router-dom';

export const emailsRoutes: RouteObject[] = [
  {
    path: '/emails',
    children: [
      {
        index: true,
        element: <Emails />,
      },
    ],
  },
];
