import type { ReactNode } from 'react';
import { AdminShellTemplate } from '@/components/templates/AdminShellTemplate';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShellTemplate>{children}</AdminShellTemplate>;
}
