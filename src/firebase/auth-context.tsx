// src/firebase/auth-context.tsx
import { createContext, useContext } from 'react';

interface AuthContextType {
  user: any; 
}

const AuthContext = createContext<AuthContextType>({ user: null });

export function useAuth() {
  return useContext(AuthContext).user;
}