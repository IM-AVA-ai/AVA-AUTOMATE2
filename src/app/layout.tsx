// src/app/layout.tsx
import { Providers } from '@/app/providers';
import Header from '@/components/Header';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'AVA Automate',
  description: 'AI-driven SMS communication platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body >
        <Providers>
          <Header className="container mx-auto" />
          <main className="container mx-auto">{children}</main>
        </Providers>
      </body>
    </html>
  );
};
