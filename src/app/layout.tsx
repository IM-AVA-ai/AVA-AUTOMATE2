// src/app/layout.tsx
import '@/app/globals.css';
import { Providers } from '@/providers';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes'
import AppLayout from '@/app/app-layout';
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "IM AVA.ai - AI-Powered SMS Lead Engagement",
  description: 'Automate and streamline SMS-based communication for businesses with AI-driven lead engagement.',
  generator: 'v0.dev'
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
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans overflow-x-hidden`}>
          <ThemeProvider defaultTheme="dark" enableSystem disableTransitionOnChange>
            <Providers>
              <AppLayout>
                {children}
              </AppLayout>
            </Providers>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
