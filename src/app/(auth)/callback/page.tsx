// This file contains the callback page to validate the OAuth code.
'use client'; // This needs to be a Client Component

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react'; // Assuming you're using lucide-react icons
import { Card } from '@/components/ui/card'; // Using your Card component from reference
import Cookies from 'js-cookie'


export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams?.get('code');
  const error = searchParams?.get('error');


  const handleCallback = async () => {
    try {
      const response = await fetch(`/api/auth/google/callback?code=${code}`);
      if (!response.ok) {
        throw new Error('Failed to validate code');
      }
      const responseJson = await response.json();
      Cookies.set('__gc_accessToken', responseJson.access_token,{
        expires : new Date(responseJson.expiry_date)
      });
      Cookies.set('__gc_refreshToken', responseJson.refresh_token),{
        expires: new Date(Date.now() + responseJson.refresh_token_expires_in * 1000)
      };
      router.push('/dashboard');
    } catch (err) {
      console.error('Callback error:', err);
      router.push('/dashboard?error=auth_failed');
    }
  };

  useEffect(() => {
    if (!searchParams || !code || error) {
        router.push('/dashboard');
        return;
      }
    handleCallback();
  }, [code, error, router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" /> {/* Spinner icon */}
          <h2 className="text-xl font-semibold">Validating your credentials</h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we connect to Google...
          </p>
        </div>
      </Card>
    </div>
  );
}