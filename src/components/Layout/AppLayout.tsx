'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { useToast } from '@/hooks/use-toast';
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
  LogOut,
  Briefcase,
  Bell,
} from 'lucide-react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged out successfully' });
      router.push('/login');
    } catch (error: any) {
      toast({
        title: 'Logout failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Redirect to login if not authenticated and not loading
  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Render nothing or a loading indicator while checking auth state
  if (loading || !user) {
    return null; // Or a loading spinner
  }

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
              <SidebarMenuButton asChild isActive={router.pathname === '/dashboard'} tooltip="Dashboard">
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={router.pathname === '/leads'} tooltip="Leads">
                <Link href="/leads">
                  <Users />
                  <span>Leads</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={router.pathname === '/agents'} tooltip="AI Agents">
                <Link href="/agents">
                  <Bot />
                  <span>AI Agents</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={router.pathname === '/campaigns'} tooltip="Campaigns">
                <Link href="/campaigns">
                  <Briefcase />
                  <span>Campaigns</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={router.pathname === '/messages'} tooltip="Messages">
                <Link href="/messages">
                  <MessageSquare />
                  <span>Messages</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={router.pathname === '/notifications'} tooltip="Notifications">
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
                <SidebarMenuButton asChild isActive={router.pathname === '/settings'} tooltip="Settings">
                    <Link href="/settings">
                    <Settings />
                    <span>Settings</span>
                    </Link>
                </SidebarMenuButton>
             </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
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
