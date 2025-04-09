import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

import { AppStoreProvider } from '@/components/layout/app-store-provider';
import { ThemeProvider } from '@/components/layout/theme-provider';
import UserAuthProvider from '@/components/layout/user-auth-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Mofolio',
    template: '%s - Mofolio',
  },
  description:
    'A trading journal tool that helps traders visually track and manage their portfolios.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppStoreProvider>
            {children}
            <UserAuthProvider />
          </AppStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
