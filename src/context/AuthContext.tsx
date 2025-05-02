'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const FirebaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Setting up onAuthStateChanged listener.');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('AuthContext: User detected -', user.uid);
        setUser(user);
      } else {
        console.log('AuthContext: No user detected.');
        setUser(null);
      }
      setLoading(false);
      console.log('AuthContext: Loading set to false.');
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('AuthContext: Cleaning up onAuthStateChanged listener.');
      unsubscribe();
    }
  }, []);

  if (loading) {
     console.log('AuthContext: Still loading authentication state...');
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  console.log('AuthContext: Rendering provider with user:', user?.uid, 'loading:', loading);
  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
