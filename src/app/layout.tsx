// src/app/layout.tsx
import './globals.css';
import { Providers } from '@/app/providers';
import Header from '@/components/Header';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';


export const metadata: Metadata = {
  title: 'IM AVA',
  description: 'AI-driven SMS communication platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body >
          <Providers>

            <Header className="container mx-auto" />
            <main className="container mx-auto">{children}</main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
};
