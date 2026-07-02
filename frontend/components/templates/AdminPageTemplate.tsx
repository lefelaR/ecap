import type { ReactNode } from 'react';
import { PageBanner } from '@/components/atoms/PageBanner';

interface AdminPageTemplateProps {
  badge: string;
  badgeClass?: string;
  title: string;
  lead?: string;
  children: ReactNode;
}

export function AdminPageTemplate({ badge, badgeClass, title, lead, children }: AdminPageTemplateProps) {
  return (
    <>
      <PageBanner badge={badge} badgeClass={badgeClass} title={title} lead={lead} />
      {children}
    </>
  );
}
