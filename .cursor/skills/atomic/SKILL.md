---
name: atomic
description: >-
  Guides ECAP feature development using Atomic Design — atoms, molecules,
  organisms, templates, and pages. Use when creating new UI components,
  features, screens, services, or files, or when the user mentions atomic
  design, component structure, or where to place new code.
---

# Atomic Design

Build every new feature bottom-up: small reusable pieces compose into larger ones. Never jump straight to a full page or monolithic file.

## The five levels

| Level | What it is | Rule |
|-------|-----------|------|
| **Atoms** | Smallest unit; no feature context | Single responsibility; no API calls |
| **Molecules** | 2–5 atoms combined | One interaction or data display |
| **Organisms** | Self-contained UI or logic section | Composes molecules; may fetch data |
| **Templates** | Page layout and slot structure | No real data; defines regions |
| **Pages** | Template + real data and routing | Thin; delegates to organisms |

## Frontend (`frontend/`)

### Folder map

```
frontend/
├── components/
│   ├── atoms/        # Button, Badge, FormField, Spinner, MapPin
│   ├── molecules/    # PageBanner, ReportCard, StatTile, LookupField
│   ├── organisms/    # ReportForm, StatusPanel, AuthorityDashboard
│   └── templates/    # PublicReportTemplate, AdminTemplate
├── app/              # Pages (Next.js routes only)
├── lib/              # Atoms: types, labels, constants
└── services/         # Organisms: HttpService, domain API logic
```

### Where new code goes

| Adding… | Place in… | Example |
|---------|-----------|---------|
| Type, label map, constant | `lib/` | `lib/types.ts`, `lib/labels.ts` |
| Single UI primitive | `components/atoms/` | `FormField.tsx`, `StatusBadge.tsx` |
| Small composed UI | `components/molecules/` | `PageBanner.tsx`, `StatTile.tsx` |
| Feature section with state/API | `components/organisms/` | `ReportForm.tsx`, `StatusPanel.tsx` |
| Page shell (banner + slots) | `components/templates/` | `DashboardTemplate.tsx` |
| Route entry point | `app/<route>/page.tsx` | `app/statistics/page.tsx` |
| HTTP / shared logic | `services/` | `services/http.ts` |

### Page pattern (keep routes thin)

```tsx
// app/statistics/page.tsx — Page
export default function StatisticsPage() {
  return (
    <DashboardTemplate title="Service delivery statistics">
      <StatisticsPanel />
    </DashboardTemplate>
  );
}
```

Extract inline JSX from existing pages into atoms → molecules → organisms before adding new features alongside them.

### Decision checklist

Before creating a file, ask:

1. **Can an existing atom/molecule be reused?** — Extend it; don't duplicate.
2. **Is this a single primitive?** → `atoms/`
3. **Does it combine primitives without its own data fetching?** → `molecules/`
4. **Does it own a feature section (form, list, dashboard panel)?** → `organisms/`
5. **Does it only define layout regions?** → `templates/`
6. **Is it a Next.js route?** → `app/` only; import organisms inside.

## Backend (`backend/src/`)

Apply the same composition mindset to server code.

| Level | Backend equivalent | Location |
|-------|-------------------|----------|
| Atoms | Types, entities, utils | `domain/types/`, `domain/entities/`, `utils/` |
| Molecules | Shared infra helpers | `common/` (HttpResponse, RequestContext) |
| Molecules | Data access | `repositories/` |
| Organisms | Business use cases | `services/` |
| Templates | Thin HTTP adapters | `handlers/` |
| Pages | Wiring / DI | `container/ServiceContainer.ts` |

### Rules

- **Handlers** — parse request, call one service method, return response. No business rules.
- **Services** — orchestrate repositories and entities; one use case per method.
- **Repositories** — DynamoDB access only; no domain rules.
- **Entities** — domain behavior (`canBeViewedBy`, `toJSON`); no HTTP or DB code.

## New feature workflow

Copy and track:

```
- [ ] 1. Identify atoms needed (types, labels, UI primitives)
- [ ] 2. Build or reuse molecules (composed UI / small helpers)
- [ ] 3. Build organisms (feature sections / services)
- [ ] 4. Create template if page layout is new
- [ ] 5. Wire page route (frontend app/ or backend handler)
- [ ] 6. Confirm no monolithic file > 1 level of concern
```

## Anti-patterns

- ❌ 200-line `page.tsx` with form, map, API calls, and success state inline
- ❌ New feature as a single `utils.ts` dumping ground
- ❌ Handler with filtering, validation, and persistence in one function
- ❌ Duplicating `PageBanner` markup in every route instead of a molecule
- ✅ Compose existing atoms/molecules; add new levels only when reuse is real

## Additional resources

- ECAP-specific examples: [examples.md](examples.md)
