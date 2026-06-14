import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/fontawesome-free/5.0.2/css/all.css';
import './globals.css';
import { AppToaster } from '../components/atoms/AppToaster';
import { NavBar } from '../components/organisms/NavBar';

export const metadata: Metadata = {
  title: 'ECAP - Electronic Councillor Action Platform',
  description: 'National municipal reporting and admin system for service delivery and crime response.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppToaster />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
