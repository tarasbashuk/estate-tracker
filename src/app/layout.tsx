import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { CssBaseline } from '@mui/material';

import { LocaleProvider } from '@/components/layout/LocaleProvider';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { getLocale } from '@/lib/i18n-server';

import './globals.css';

export const metadata: Metadata = {
  title: 'Estate Tracker',
  description: 'Private rental property management app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <ClerkProvider>
      <html lang={locale}>
        <body>
          <AppRouterCacheProvider>
            <ThemeProvider>
              <LocaleProvider locale={locale}>
                <CssBaseline />
                {children}
              </LocaleProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
