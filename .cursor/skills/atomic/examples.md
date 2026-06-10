# Atomic Design — ECAP Examples

## Frontend refactor target

`app/public/page.tsx` today mixes map, form, API, and success screen. Atomic split:

| Level | Extract to |
|-------|-----------|
| Atoms | `atoms/FormField.tsx`, `atoms/ReportTypeToggle.tsx` |
| Molecules | `molecules/PageBanner.tsx`, `molecules/LocationPicker.tsx` |
| Organisms | `organisms/ReportForm.tsx`, `organisms/ReportSuccess.tsx` |
| Template | `templates/PublicReportTemplate.tsx` |
| Page | `app/public/page.tsx` — imports template + organisms |

## Molecule example

```tsx
// components/molecules/PageBanner.tsx
interface PageBannerProps {
  badge: string;
  title: string;
  lead: string;
}

export function PageBanner({ badge, title, lead }: PageBannerProps) {
  return (
    <section className="page-banner">
      <span className="badge rounded-pill bg-secondary text-white">{badge}</span>
      <h1 className="display-6 fw-bold mt-3">{title}</h1>
      <p className="lead mb-0">{lead}</p>
    </section>
  );
}
```

## Organism example

```tsx
// components/organisms/StatisticsPanel.tsx
'use client';

import { useEffect, useState } from 'react';
import { StatTile } from '../molecules/StatTile';
import { http } from '../../services/http';
import type { PublicStats } from '../../lib/types';

export function StatisticsPanel() {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    http.get<PublicStats>('/stats').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return null;

  return (
    <div className="row g-4">
      <StatTile label="Total reports" value={stats.totalReports} />
      <StatTile label="Resolved" value={stats.resolvedReports} variant="success" />
    </div>
  );
}
```

## Backend stack example — create report

```
Atom       domain/types/CreateReportInput
Atom       domain/entities/ServiceReport.create()
Molecule   repositories/ServiceReportRepository.save()
Organism   services/ReportService.createReport()
Template   handlers/reports/createReport.handler  → calls ReportService
Page       container/ServiceContainer              → wires dependencies
```

## Naming conventions

- Atoms: noun — `FormField`, `StatusBadge`
- Molecules: noun phrase — `PageBanner`, `ReportCard`
- Organisms: feature noun — `ReportForm`, `AuthorityDashboard`
- Templates: `*Template` suffix — `DashboardTemplate`
- Pages: route folder + `page.tsx` — `app/admin/page.tsx`
