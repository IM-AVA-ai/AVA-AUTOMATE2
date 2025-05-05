// src/app/layout.tsx
import '@/lib/globals.css';
import { Providers } from '@/lib/providers';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import AppLayout from './app-layout';


export const metadata: Metadata = {
  title: 'IM AVA',
  description: 'AI-driven SMS communication platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Providers>
             <AppLayout>{children}</AppLayout>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}