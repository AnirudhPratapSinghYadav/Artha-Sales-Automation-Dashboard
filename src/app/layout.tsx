import React from 'react';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { AppShell } from '@/components/layout/AppShell';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata = {
  title: {
    template: '%s | Artha Sales Automation',
    default: 'Artha Sales Automation',
  },
  description: 'AI-driven Sales CRM and Automation Platform for Artha',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} font-sans`}>
        <AuthProvider>
          <ToastProvider>
            <AppShell>
              {children}
              <CommandPalette />
            </AppShell>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
