import type { ReactNode } from 'react';
import { PageBanner } from '../atoms/PageBanner';

interface PageTemplateProps {
  badge: string;
  badgeClass?: string;
  title: string;
  lead?: string;
  centered?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

export function PageTemplate({ badge, badgeClass, title, lead, centered, children, footer }: PageTemplateProps) {
  return (
    <main className="container py-5">
      <PageBanner badge={badge} badgeClass={badgeClass} title={title} lead={lead} centered={centered} />
      {children}
      {footer}
    </main>
  );
}
