// src/app/layout.tsx
'use client';

import '../globals.css';

// import { Providers } from './providers';
import { Providers } from '@/providers';
import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes'

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Bot,
  MessageSquare,
  Settings,
  LogOut,
  Send,
  Bell,
  BarChart2,
  PanelLeft,
  X,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile'; // Ensure this path is correct
import Image from 'next/image';

// Metadata for the application
export const metadata: Metadata = {
  title: 'IM AVA',
  description: 'AI-driven SMS communication platform',
};

// AppLayout component that handles the main layout and the conditional sidebar
function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  // Define routes where the sidebar should NOT be shown
  const noSidebarRoutes = ['/sign-in', '/sign-up', '/'];
  const shouldShowSidebar = !noSidebarRoutes.includes(pathname);

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const isActive = (href: string) => {
    return href === pathname || (pathname && pathname.startsWith(href) && href !== '/dashboard');
  };

  const sidebarContent = (
    <>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center gap-2" title="AVA Automate Dashboard">
          <Image src="/images/favicon.png" alt="AVA Automate Logo" width={32} height={32} />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">AVA Automate</span> {/* Brand Name */}
        </Link>
        {isMobile && ( // Close button for mobile view
          <button onClick={() => setIsSidebarOpen(false)} className="p-1 text-gray-500 dark:text-gray-400">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {[ // Navigation links
          { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/dashboard/leads', label: 'Leads', icon: Users },
          { href: '/dashboard/campaigns', label: 'Campaigns', icon: Send },
          { href: '/dashboard/conversations', label: 'Conversations', icon: MessageSquare },
          { href: '/dashboard/agents', label: 'AI Agents', icon: Bot },
          { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
        ].map(({ href, label, icon: Icon }) => ( // Map over nav items
          <Link
            key={href}
            href={href}
            onClick={isMobile ? () => setIsSidebarOpen(false) : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(href) ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {[ // Additional links in the sidebar footer
          { href: '/notifications', label: 'Notifications', icon: Bell },
          { href: '/settings', label: 'Settings', icon: Settings },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={isMobile ? () => setIsSidebarOpen(false) : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(href) ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
        <button disabled className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Conditionally render sidebar */}
      {shouldShowSidebar && (
        <>
          {/* Mobile Sidebar Overlay */}
          {isMobile && isSidebarOpen && (
            <div className="fixed inset-0 z-30 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)} aria-hidden="true"></div>
          )}
          {/* Mobile Sidebar */}
          {isMobile && (
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 flex-shrink-0 bg-white dark:bg-gray-800 shadow-lg flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              {sidebarContent}
            </aside>
          )}
          {/* Desktop Sidebar */}
          {!isMobile && (
            <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 shadow-md flex flex-col border-r border-gray-200 dark:border-gray-700">{sidebarContent}</aside>
          )}
        </>
      )}
      {/* Main content area */}
      <div className={`flex-1 flex flex-col ${shouldShowSidebar ? '' : ''}`}>
        {/* Mobile Header (only if sidebar is present) */}
        {isMobile && shouldShowSidebar && (
          <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-white dark:bg-gray-800 px-4 shadow-sm">
            <button onClick={() => setIsSidebarOpen(true)} className="p-1 text-gray-600 dark:text-gray-300">
              <PanelLeft className="h-6 w-6" />
            </button>
            <span className="font-semibold text-gray-900 dark:text-white">AVA Automate</span>
            {/* Add other header items like profile dropdown if needed */}
          </header>
        )}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

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
