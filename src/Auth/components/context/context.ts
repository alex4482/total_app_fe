import { createContext } from 'react';

import { type AuthResponse, type AuthState } from '../types';

type AuthContext = {
  currentSession: AuthState;
  logInUser: (data: AuthResponse) => void;
  logOutUser: () => void;
};

export const AuthContext = createContext<AuthContext>({
  currentSession: {
    isAuthenticated: false,
    tokens: null,
  },
  logInUser: () => {},
  logOutUser: () => {},
});
