import React, { createContext, ReactNode, useContext } from 'react';
import api from '../services/api';

interface AuthContextProviderProps {
  children: ReactNode;
}

interface AuthContextData {
  login: (user: string, password: string) => void;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  function login(user: string, password: string): void {
    const params = { user, password };
    const response = api.post('login', { params });
    console.log(response);
  }

  return (
    <AuthContext.Provider
      value={{
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  return useContext(AuthContext);
}
