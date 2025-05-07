'use client';

import React from 'react';
import Link from 'next/link'; // Use Next.js Link
import { usePathname } from 'next/navigation'; // Use Next.js usePathname
import { Button, Tooltip } from '@heroui/react'; // Keep HeroUI components
import { Icon } from '@iconify/react'; // Keep Iconify

const navItems = [
  { name: 'Dashboard', icon: 'lucide:layout-dashboard', path: '/dashboard' },
  { name: 'Leads', icon: 'lucide:users', path: '/dashboard/leads' }, // Adjusted path for Next.js App Router
  { name: 'Campaigns', icon: 'lucide:megaphone', path: '/dashboard/campaigns' }, // Adjusted path
  { name: 'Conversations', icon: 'lucide:message-circle', path: '/dashboard/conversations' }, // Adjusted path
  { name: 'AI Agents', icon: 'lucide:bot', path: '/dashboard/agents' }, // Adjusted path
  { name: 'Playground', icon: 'lucide:play', path: '/dashboard/playground' }, // Adjusted path
];

export const Sidebar = () => {
  const pathname = usePathname(); // Use Next.js usePathname
  const [isCompact, setIsCompact] = React.useState(true);

  const isActive = (path: string) => {
    return pathname === path || (pathname.startsWith(path) && path !== '/dashboard');
  };

  return (
    <div className={`bg-black/95 border-r border-white/5 fixed left-0 top-0 h-screen transition-all duration-300 backdrop-blur-xl
      ${isCompact ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`flex items-center gap-3 p-6 ${isCompact ? 'justify-center' : ''}`}>
          <Icon icon="lucide:bot" className="text-purple-400 text-2xl" />
          {!isCompact && (
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              IM AVA
            </h1>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          {navItems.map((item) => (
            <Tooltip
              key={item.name}
              content={isCompact ? item.name : ""}
              placement="right"
            >
              <Link
                href={item.path} // Use Next.js href
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all duration-300 mb-2 cursor-pointer
                  ${isCompact ? 'justify-center' : ''}
                  ${
                    isActive(item.path) // Use Next.js active check
                      ? 'bg-black/60 text-white border border-purple-500/20 shadow-lg shadow-purple-500/20'
                      : 'text-white/70 border border-transparent'
                  }
                  hover:bg-black/40 hover:text-white hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/20
                `}
              >
                <Icon icon={item.icon} className={`text-xl ${
                  isActive(item.path) ? 'text-purple-400' : 'group-hover:text-purple-400' // Use Next.js active check
                }`} />
                {!isCompact && <span>{item.name}</span>}
              </Link>
            </Tooltip>
          ))}
        </nav>

        {/* Footer with Settings and Toggle */}
        <div className="p-4 border-t border-white/5">
          <Tooltip
            content={isCompact ? "Settings" : ""}
            placement="right"
          >
            <Link
              href="/dashboard/settings" // Adjusted path
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer
                text-white/70 border border-transparent
                hover:bg-black/40 hover:text-white hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/20
                mb-3 ${isCompact ? 'justify-center' : ''}
              `}
            >
              <Icon icon="lucide:settings" className="text-xl" />
              {!isCompact && <span>Settings</span>}
            </Link>
          </Tooltip>

          <Tooltip
            content={isCompact ? "Expand Sidebar" : "Collapse Sidebar"}
            placement="right"
          >
            <Button
              isIconOnly
              variant="light"
              className={`w-full flex items-center justify-center text-white/70 hover:text-purple-400 ${
                isCompact ? '' : 'mt-2'
              }`}
              onPress={() => setIsCompact(!isCompact)}
            >
              <Icon
                icon={isCompact ? 'lucide:chevron-right' : 'lucide:chevron-left'}
                className="text-xl"
              />
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
