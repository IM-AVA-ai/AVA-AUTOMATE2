// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// Removed Toaster import from Shadcn
import { QueryProvider } from '@/components/Providers/QueryProvider';
import BasicToaster from '@/components/BasicToaster'; // Import the new basic toaster

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AVA Automate',
  description: 'AI-driven SMS communication platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <QueryProvider>
          {children}
          <BasicToaster /> {/* Use the new basic toaster */}
        </QueryProvider>
      </body>
    </html>
  );
}
