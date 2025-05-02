'use client';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  // Removed the automatic redirect to simplify debugging the 404 error.
  // Now rendering a simple page with a link to the dashboard.

  return (
    <div className="flex flex-col min-h-screen items-center justify-center space-y-4 p-4">
       {/* Optional: Keep a loading indicator or message if preferred */}
       {/* <Loader2 className="h-8 w-8 animate-spin text-primary" /> */}
       {/* <p className="ml-2">Loading...</p> */}

       <h1 className="text-2xl font-semibold">Welcome</h1>
       <p className="text-muted-foreground">Click the button below to go to the dashboard.</p>
       <Button asChild>
         <Link href="/dashboard">Go to Dashboard</Link>
       </Button>
       <p className="text-sm text-muted-foreground mt-4">
         If you see this page, the root route is working. If clicking the button gives a 404, the issue is with the /dashboard route setup.
       </p>
    </div>
  );
}
