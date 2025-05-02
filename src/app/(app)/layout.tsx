'use client';

import React from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname
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
  Users, // Leads
  Bot, // AI Agents
  MessageSquare, // Messages
  Settings,
  LogOut, // Keep LogOut icon visually, but remove functionality
  Send, // Campaigns (Using Send icon as Briefcase might be less relevant)
  Bell, // Notifications
  BarChart2, // Analytics/Insights (Optional)
} from 'lucide-react';
import { Separator } from '@/components/ui/separator'; // Added for visual separation

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current pathname

  // Helper function to determine if a link is active
  const isActive = (href: string) => {
    // Handle exact match for dashboard, otherwise check startsWith for nested routes if any
    if (href === '/dashboard') {
      return pathname === href;
    }
    // Make sure '/leads/import' doesn't activate '/leads' incorrectly if needed
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'));
  };


  return (
    <SidebarProvider defaultOpen={true}>
      {/* Using 'icon' collapsible style for desktop */}
      <Sidebar collapsible="icon">
        <SidebarHeader className="flex items-center justify-between p-2">
          <Link href="/dashboard" className="flex items-center gap-2 p-2" title="AVA Automate Dashboard">
            {/* Placeholder Logo */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z"/>
            </svg>
            {/* Hide text when collapsed */}
            <span className="text-lg font-semibold text-foreground group-data-[collapsible=icon]:hidden">AVA Automate</span>
          </Link>
           {/* Mobile Trigger - kept inside header for layout consistency */}
          <SidebarTrigger className="md:hidden" />
        </SidebarHeader>
        <Separator className="bg-sidebar-border" /> {/* Visual separator */}
        <SidebarContent className="p-2"> {/* Added padding to content area */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard" isActive={isActive('/dashboard')}>
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <Separator className="bg-sidebar-border my-1 group-data-[collapsible=icon]:hidden" /> {/* Separator for sections */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Leads" isActive={isActive('/leads')}>
                <Link href="/leads">
                  <Users />
                  <span>Leads</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              {/* Using Send icon for Campaigns */}
              <SidebarMenuButton asChild tooltip="Campaigns" isActive={isActive('/campaigns')}>
                <Link href="/campaigns">
                  <Send />
                  <span>Campaigns</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
              <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Messages" isActive={isActive('/messages')}>
                <Link href="/messages">
                  <MessageSquare />
                  <span>Messages</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <Separator className="bg-sidebar-border my-1 group-data-[collapsible=icon]:hidden" /> {/* Separator for sections */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="AI Agents" isActive={isActive('/agents')}>
                <Link href="/agents">
                  <Bot />
                  <span>AI Agents</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             {/* Optional Analytics/Insights Page Link - Uncomment when ready */}

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Analytics" isActive={isActive('/analytics')}>
                <Link href="/analytics">
                  <BarChart2 />
                  <span>Analytics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarContent>
         <Separator className="bg-sidebar-border" /> {/* Visual separator */}
        <SidebarFooter className="p-2"> {/* Added padding to footer */}
           <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Notifications" isActive={isActive('/notifications')}>
                    <Link href="/notifications">
                    <Bell />
                    <span>Notifications</span>
                    </Link>
                </SidebarMenuButton>
             </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings" isActive={isActive('/settings')}>
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
      {/* SidebarInset wraps the main content area */}
      <SidebarInset>
        <div className="flex h-full flex-col">
           {/* Mobile Header: Only shown on small screens */}
           <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
             <SidebarTrigger />
              {/* You can add a smaller logo or title here for mobile if needed */}
             <span className="font-semibold text-foreground">AVA Automate</span>
             {/* Add User menu for mobile here if needed */}
           </header>
           {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8"> {/* Added more padding */}
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AppLayout; // Ensure this is the default export
