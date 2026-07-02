import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { Roboto } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/fontawesome-free/5.0.2/css/all.css';
import './globals.css';
import { AppToaster } from '@/components/atoms/AppToaster';
import { ConditionalTopNav } from '@/components/organisms/ConditionalTopNav';
import { PageLoadingProvider } from '@/components/organisms/PageLoadingProvider';
import { SessionProvider } from '@/components/organisms/SessionProvider';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ECAP - Electronic Councillor Action Platform',
  description: 'National municipal reporting and admin system for service delivery and crime response.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <SessionProvider>
          <Suspense fallback={null}>
            <PageLoadingProvider>
              <AppToaster />
              <ConditionalTopNav />
              {children}
            </PageLoadingProvider>
          </Suspense>
        </SessionProvider>
      </body>
    </html>
  );
}
