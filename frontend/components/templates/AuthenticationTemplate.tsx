import type { ReactNode } from 'react';
import { PageTemplate } from './PageTemplate';

interface AuthenticationTemplateProps {
  title: string;
  lead: string;
  children: ReactNode;
}

export function AuthenticationTemplate({ title, lead, children }: AuthenticationTemplateProps) {
  return (
    <PageTemplate badge="Authentication" badgeClass="bg-primary" title={title} lead={lead} centered>
      <div className="mx-auto" style={{ maxWidth: 480 }}>
        {children}
      </div>
    </PageTemplate>
  );
}
