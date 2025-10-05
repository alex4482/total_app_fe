// import DownloadDocument from '@/pages/documents/DownloadDocument';
// import ViewDocument from '@/pages/documents/ViewDocument';

import type { RouteObject } from "react-router-dom";

export const documentsRoutes: RouteObject[] = [
  {
    path: 'documents',
    children: [
      {
        path: 'download/:documentId',
        // element: <DownloadDocument />,
      },
      {
        path: 'view/:documentId',
        // element: <ViewDocument />,
      },
    ],
  },
];
