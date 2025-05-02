'use client';

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
import { useIsMobile } from '@/hooks/use-mobile'; // Keep using this hook

// Simplified Sidebar component using Tailwind
function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile); // Open by default on desktop

  useEffect(() => {
    // Adjust sidebar state when switching between mobile/desktop
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'));
  };

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center gap-2" title="AVA Automate Dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-blue-600 dark:text-blue-400">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
          </svg>
          <span className="text-lg font-semibold">AVA Automate</span>
        </Link>
        {isMobile && (
          <button onClick={() => setIsSidebarOpen(false)} className="p-1">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {[
          { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/leads', label: 'Leads', icon: Users },
          { href: '/campaigns', label: 'Campaigns', icon: Send },
          { href: '/messages', label: 'Messages', icon: MessageSquare },
          { href: '/agents', label: 'AI Agents', icon: Bot },
          { href: '/analytics', label: 'Analytics', icon: BarChart2 },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={isMobile ? () => setIsSidebarOpen(false) : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive(href)
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {[
          { href: '/notifications', label: 'Notifications', icon: Bell },
          { href: '/settings', label: 'Settings', icon: Settings },
        ].map(({ href, label, icon: Icon }) => (
           <Link
             key={href}
             href={href}
             onClick={isMobile ? () => setIsSidebarOpen(false) : undefined}
             className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
               isActive(href)
                 ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                 : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
             }`}
           >
             <Icon className="h-5 w-5" />
             <span>{label}</span>
           </Link>
        ))}
         <button
             disabled
             className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-500 cursor-not-allowed"
           >
             <LogOut className="h-5 w-5" />
             <span>Logout</span>
           </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Sidebar */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-40 flex transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
            {sidebarContent}
          </div>
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 shadow-md flex flex-col">
          {sidebarContent}
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        {isMobile && (
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white dark:bg-gray-800 px-4 shadow-sm">
            <button onClick={() => setIsSidebarOpen(true)} className="p-1">
              <PanelLeft className="h-6 w-6" />
            </button>
            <span className="font-semibold">AVA Automate</span>
          </header>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
