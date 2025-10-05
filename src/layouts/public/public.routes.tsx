import type { RouteObject } from 'react-router-dom';

import { authRoutes } from './routes';

export const publicRoutes: RouteObject[] = [...authRoutes];
