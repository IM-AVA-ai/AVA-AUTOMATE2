
"use client";
import React, { useEffect, useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { MoonIcon, SunIcon } from 'lucide-react';
import { NavbarContent, NavbarItem, Button, Badge, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { Icon } from '@iconify/react'; 

export default function Header({ className }: { className?: string }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // Added state for unread count

  useEffect(() => {
    const storedTheme = localStorage.getItem('darkMode') === 'true';
    setDarkMode(storedTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('darkMode', darkMode.toString());
      if (darkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }, [darkMode, mounted]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className={`fixed top-0 left-0 w-full bg-gray-800 text-white p-4 z-10 flex justify-between items-center ${className}`}>
      <h1>My App</h1>
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-700 transition">
          {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>

        {/* Notification Icon and Popover */}
        <NavbarContent justify="end" className="gap-4">
          <NavbarItem>
            <Popover placement="bottom-end">
              <PopoverTrigger>
                <Button isIconOnly variant="light" radius="full">
                  <Badge content={unreadCount} color="danger" size="sm" className={unreadCount === 0 ? "hidden" : ""}>
                    <Icon icon="lucide:bell" className="text-xl" />
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-4 w-80">
                  <h4 className="text-medium font-semibold mb-3">Notifications</h4>
                  <div className="flex flex-col gap-3">
                    {/* Notification items would go here */}
                    <p>You have {unreadCount} unread notifications.</p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </NavbarItem>
        </NavbarContent>

        {/* Clerk Authentication Buttons */}
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
}
