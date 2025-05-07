// src/app/layout.tsx
'use client';

import './globals.css';

import type { Metadata } from "next";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

import { Sidebar } from '@/components/Sidebar'; // Import the new Sidebar
import { TopNav } from '@/components/TopNav'; // Import the new TopNav
import { Providers } from '@/providers'; // Assuming this is needed for context/state

// Metadata for the application
export const metadata: Metadata = {
  title: 'IM AVA',
  description: 'AI-driven SMS communication platform',
};

// AppLayout component that handles the main layout with the new Sidebar and TopNav
function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define routes where the new layout should NOT be shown (e.g., auth pages)
  const noLayoutRoutes = ['/sign-in', '/sign-up', '/'];
  const shouldShowLayout = pathname !== null && !noLayoutRoutes.includes(pathname);

  if (!shouldShowLayout) {
    return <>{children}</>; // Render children directly for routes without the new layout
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-black/95 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />
      <Sidebar /> {/* Use the new Sidebar */}
      <div className="flex-1 flex flex-col transition-all duration-300 relative" style={{
        paddingLeft: "5rem" // Adjust padding to accommodate the collapsed sidebar width
      }}>
        <TopNav /> {/* Use the new TopNav */}
        <main className="flex-1 overflow-auto p-8"> {/* Add padding to the main content */}
          {children}
        </main>
      </div>
    </div>
  );
}

const appearance = {
  baseTheme: dark,
  layout: {
    logoImageUrl: '/images/im-ava-logo.png',
    logoLinkUrl: '/',
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={appearance}>
      <html lang="en">
        <body >
          <AppLayout>{children}</AppLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
