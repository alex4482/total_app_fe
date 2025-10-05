import { type ReactNode, useEffect, useMemo, useState } from 'react';

import type { AuthResponse, AuthState } from '../types';
import { AuthContext } from './context';

type Props = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: Props) => {
  const [currentSession, setCurrentSession] = useState<AuthState>(() => {
    const savedTokens = localStorage.getItem('authTokens');

    if (savedTokens) {
      try {
        const tokens = JSON.parse(savedTokens);
        return {
          isAuthenticated: true,
          tokens,
        };
      } catch {
        return { isAuthenticated: false,  tokens: null };
      }
    }
    return { isAuthenticated: false,  tokens: null };
  });

  const logInUser = (data: AuthResponse) => {
    const newSession = {
      isAuthenticated: true,
      tokens: data.tokens,
    };
    setCurrentSession(newSession as AuthState);
    localStorage.setItem('authTokens', JSON.stringify(data.tokens));
  };

  const logOutUser = () => {
    setCurrentSession({
      isAuthenticated: false,
      tokens: null,
    });
    localStorage.removeItem('authTokens');
  };

  useEffect(() => {
    const syncSessionWithStorage = setInterval(() => {
      const hasTokens = localStorage.getItem('authTokens');
      if (!hasTokens) {
        logOutUser();
      }
    }, 5000);
    return () => {
      clearInterval(syncSessionWithStorage);
    };
  }, [logOutUser]);

  const output = useMemo(() => {
    return {
      currentSession,
      logInUser,
      logOutUser,
    };
  }, [currentSession, logInUser, logOutUser]);

  return <AuthContext.Provider value={output}>{children}</AuthContext.Provider>;
};
