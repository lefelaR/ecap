import type { ReactNode } from 'react';
import { AdminSideNav } from '@/components/organisms/AdminSideNav';

interface AdminShellTemplateProps {
  children: ReactNode;
}

export function AdminShellTemplate({ children }: AdminShellTemplateProps) {
  return (
    <div className="admin-shell">
      <div className="admin-shell__layout">
        <aside className="admin-shell__sidebar">
          <AdminSideNav />
        </aside>
        <main className="admin-shell__main">{children}</main>
      </div>
    </div>
  );
}
