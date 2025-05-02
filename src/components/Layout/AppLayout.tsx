'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // Keep useRouter if needed for navigation checks
import { Button } from '@/components/ui/button';
// Removed firebase/auth imports: signOut, auth
// Removed useToast
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Bot,
  MessageSquare,
  Settings,
  LogOut, // Keep LogOut icon visually, but remove functionality
  Briefcase,
  Bell,
} from 'lucide-react';
// Removed useAuth hook

export function AppLayout({ children }: { children: React.ReactNode }) {
  // Removed useAuth hook usage
  const router = useRouter(); // Keep for checking active routes
  // Removed useToast

  // Removed handleLogout function

  // Removed useEffect for checking auth state

  // Removed loading check, always render the layout now

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            {/* Placeholder Logo */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
            </svg>
            <span className="text-lg font-semibold text-foreground group-data-[collapsible=icon]:hidden">AVA Automate</span>
          </Link>
           {/* Trigger is only visible on mobile */}
          <SidebarTrigger className="md:hidden" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
               {/* TODO: Fix pathname usage - useRouter doesn't provide pathname directly in App Router */}
               {/* For now, remove isActive prop or implement pathname logic correctly */}
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Leads">
                <Link href="/leads">
                  <Users />
                  <span>Leads</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="AI Agents">
                <Link href="/agents">
                  <Bot />
                  <span>AI Agents</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Campaigns">
                <Link href="/campaigns">
                  <Briefcase />
                  <span>Campaigns</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Messages">
                <Link href="/messages">
                  <MessageSquare />
                  <span>Messages</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Notifications">
                <Link href="/notifications">
                  <Bell />
                  <span>Notifications</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                    <Link href="/settings">
                    <Settings />
                    <span>Settings</span>
                    </Link>
                </SidebarMenuButton>
             </SidebarMenuItem>
            {/* Keep logout visually but disable functionality */}
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Logout" disabled>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full flex-col">
           {/* Header can go here if needed, e.g., breadcrumbs, user menu */}
           <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
             <SidebarTrigger />
             {/* Add other header elements like user menu for mobile */}
           </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
