// src/app/(app)/error.tsx
'use client' // Error components must be Client Components

import { useEffect } from 'react'
// Removed Shadcn Button import

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center p-4">
      {/* Replaced Card with div */}
      <div className="w-full max-w-md text-center bg-white dark:bg-gray-800 rounded-lg shadow p-6">
         {/* Replaced CardHeader with div */}
         <div>
           {/* Replaced CardTitle with h2 */}
           <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Something went wrong!</h2>
           {/* Replaced CardDescription with p */}
           <p className="text-gray-500 dark:text-gray-400 mt-2">An unexpected error occurred within the application.</p>
         </div>
         {/* Replaced CardContent with div */}
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {error.message || "An unknown error occurred."}
          </p>
           {/* Replace Shadcn Button with standard HTML button */}
           <button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}

// Remove Card component if it's part of Shadcn and not replaced
// For simplicity, using a basic div structure instead of Card
