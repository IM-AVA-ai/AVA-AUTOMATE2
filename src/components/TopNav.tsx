'use client';

import React from 'react';
import Link from 'next/link'; // Use Next.js Link
import { Navbar, NavbarContent, NavbarItem, Button, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react'; // Keep HeroUI components
import { Icon } from '@iconify/react'; // Keep Iconify
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'; // Import Clerk components

export const TopNav = () => {
  const quickActions = [
    { label: 'Add Lead', icon: 'lucide:user-plus', path: '/dashboard/leads/create' }, // Adjusted path for Next.js App Router
    { label: 'Start Campaign', icon: 'lucide:rocket', path: '/dashboard/campaigns/create' }, // Adjusted path
    { label: 'View Conversations', icon: 'lucide:messages-square', path: '/dashboard/conversations' }, // Adjusted path
    { label: 'Create Agent', icon: 'lucide:cpu', path: '/dashboard/agents/create' }, // Adjusted path
  ];

  return (
    <Navbar
      className="bg-black/95 border-b border-white/5 backdrop-blur-xl"
      maxWidth="full"
    >
      <NavbarContent justify="start" className="gap-3">
        {quickActions.map((action) => (
          <NavbarItem key={action.label}>
            <Link href={action.path}> {/* Use Next.js Link */}
              <Button
                size="sm"
                variant="flat"
                startContent={<Icon icon={action.icon} className="text-lg" />}
                className="bg-black/40 text-white/70 hover:text-purple-400 hover:bg-white/5
                border border-white/5 hover:border-purple-500/20 transition-all duration-300"
              >
                {action.label}
              </Button>
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-4">
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            className="text-white/70 hover:text-purple-400 transition-colors"
          >
            <Icon icon="lucide:bell" className="text-xl" />
          </Button>
        </NavbarItem>
        <NavbarItem>
          {/* Integrate Clerk UserButton */}
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
