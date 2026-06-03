import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'ECAP - Electronic Councillor Action Platform',
  description: 'National municipal reporting and admin system for service delivery and crime response.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
