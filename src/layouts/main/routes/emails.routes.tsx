import EmailPresets from '@/pages/email-presets/EmailPresets.tsx';
import type { RouteObject } from 'react-router-dom';

export const emailsRoutes: RouteObject[] = [
  {
    path: '/email-presets',
    children: [
      {
        index: true,
        element: <EmailPresets />,
      },
    ],
  },
];
