// src/app/layout.tsx
import '../globals.css';
import { Providers } from '@/providers';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes'
import AppLayout from '@/app/app-layout';


export const metadata: Metadata = {
  title: 'IM AVA',
  description: 'AI-driven SMS communication platform',
};

const appearance = {
  baseTheme: dark,
  layout: {
    logoImageUrl: '/images/im-ava-logo.png',
    logoLinkUrl: '/',
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={appearance}>
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
