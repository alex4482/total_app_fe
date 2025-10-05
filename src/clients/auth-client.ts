import type { AuthTokens } from '@/Auth';
import type { LoginProps } from '@/pages/login/Login.tsx';

import api from '.';

export function getAuthTokens(): AuthTokens | null {
  try {
    const tokenString = localStorage.getItem('authTokens');
    return tokenString ? (JSON.parse(tokenString) as AuthTokens) : null;
  } catch {
    return null;
  }
}

// export function getUserDetails(): User | null {
//   try {
//     const userString = localStorage.getItem('userDetails');
//     return userString ? (JSON.parse(userString) as User) : null;
//   } catch {
//     return null;
//   }
// }

export const refreshToken = async () => {
  //const user = getUserDetails();
  const tokens = getAuthTokens();
  return await api.post('/auth/refresh-token', {
    //email: user?.email,
    refreshToken: tokens?.refreshToken,
  });
};

export const loginUser = async (data: LoginProps) => {
  return await api.post('/auth/login', data);
};

