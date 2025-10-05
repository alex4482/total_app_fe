import Homepage from '@/pages/homepage/Homepage';
import type { RouteObject } from 'react-router-dom';

import {
  emailsRoutes,
  tenantsRoutes,
  // filesRoutes,
  // historyRoutes,
  // projectsRoutes,
  // tasksRoutes,
  // userRoutes,
} from './routes';

export const mainRoutes: RouteObject[] = [
  { path: '/', element: <Homepage /> },
  ...tenantsRoutes,
];
