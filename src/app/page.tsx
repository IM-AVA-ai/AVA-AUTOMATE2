'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Removed useAuth
import { Loader2 } from 'lucide-react';

export default function Home() {
  // Removed useAuth
  const router = useRouter();

  // Removed auth-related console logs

  useEffect(() => {
    // Directly redirect to the dashboard since authentication is removed
    console.log('Home Page Effect: Redirecting to /dashboard');
    router.replace('/dashboard');
  }, [router]);

  // Render loading indicator while redirecting
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2">Loading...</p>
    </div>
  );
}
