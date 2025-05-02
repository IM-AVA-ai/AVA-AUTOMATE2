'use client';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';
// Removed Shadcn/ui Button import

export default function Home() {
  // Removed the automatic redirect to simplify debugging the 404 error.
  // Now rendering a simple page with a link to the dashboard.

  return (
    <div className="flex flex-col min-h-screen items-center justify-center space-y-4 p-4">
       {/* Optional: Keep a loading indicator or message if preferred */}
       {/* <Loader2 className="h-8 w-8 animate-spin text-primary" /> */}
       {/* <p className="ml-2">Loading...</p> */}

       <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome</h1>
       <p className="text-gray-500 dark:text-gray-400">Click the button below to go to the dashboard.</p>
       {/* Replace Button component with a styled Link */}
       <Link
         href="/dashboard"
         className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
         Go to Dashboard
       </Link>
       <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
         If you see this page, the root route is working. If clicking the button gives a 404, the issue is with the /dashboard route setup.
       </p>
    </div>
  );
}
