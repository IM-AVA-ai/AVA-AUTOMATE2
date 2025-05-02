'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  console.log('Home Page: Auth state - loading:', loading, 'user:', user?.uid);

  useEffect(() => {
    console.log('Home Page Effect: Auth state - loading:', loading, 'user:', user?.uid);
    if (!loading) {
      if (user) {
        console.log('Home Page Effect: User found, redirecting to /dashboard');
        router.replace('/dashboard');
      } else {
        console.log('Home Page Effect: No user found, redirecting to /login');
        router.replace('/login');
      }
    } else {
       console.log('Home Page Effect: Still loading auth state...');
    }
  }, [user, loading, router]);

  // Render loading indicator while waiting for auth state and redirection
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2">Loading...</p>
    </div>
  );
}
