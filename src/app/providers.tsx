
'use client';
// src/app/providers.tsx
 import { HeroUIProvider } from '@heroui/react';
 import { ToastProvider } from '@heroui/toast';

 export function Providers({ children }: { children: React.ReactNode }) {
   return (
     <HeroUIProvider>
       <div className="relative">
         <ToastProvider>{children}</ToastProvider>
       </div>
     </HeroUIProvider>
   );
 }