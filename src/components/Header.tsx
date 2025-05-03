
"use client";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';

export default function Header({ className }: { className?: string }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

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
        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-700 transition">
          {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>
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