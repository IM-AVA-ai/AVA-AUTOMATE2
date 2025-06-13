// This file contains the callback page to validate the salesforce OAuth code.
'use client';

// react and next imports
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// third party imports
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie'

// common components
import { Card } from '@/components/ui/card';


export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams?.get('code');
  const error = searchParams?.get('error');


  const handleCallback = async () => {
    try {
      const response = await fetch(`/api/auth/salesforce/callback?code=${code}`);
      if (!response.ok) {
        throw new Error('Failed to validate code');
      }
      const responseJson = await response.json();
      Cookies.set('__sf_accessToken', responseJson.accessToken,{
      });
      Cookies.set('__sf_instanceUrl', responseJson.instanceUrl,{
      });
      Cookies.set('__sf_refreshToken', responseJson.refreshToken),{
      };
      router.push('/dashboard/leads');
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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">Validating your credentials</h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we connect to Salesforce...
          </p>
        </div>
      </Card>
    </div>
  );
}