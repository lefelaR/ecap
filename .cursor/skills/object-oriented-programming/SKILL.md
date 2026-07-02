---
name: object-oriented-programming
description: >-
  Hardens ECAP code with object-oriented design — encapsulation, domain entities,
  services, repositories, and thin adapters. Use when refactoring, adding
  business logic, reviewing architecture, or when the user mentions OOP, domain
  models, encapsulation, SOLID, or hardening code.
---

# Object-Oriented Programming (ECAP)

Use OOP to **put behavior with data** and **keep adapters thin**. Pair with the [atomic skill](../atomic/SKILL.md) for file placement; this skill governs *how* logic is structured inside those files.

## Core rules

| Principle | ECAP rule |
|-----------|-----------|
| **Encapsulation** | Domain rules live on entities or dedicated services — not in handlers, route files, or React components |
| **Tell, don't ask** | Call `report.canBeViewedBy(session)` — don't read fields in the handler and branch |
| **Single responsibility** | One reason to change per class/module |
| **Dependency injection** | Services receive repositories via constructor; wire in `ServiceContainer` |
| **Immutability at boundaries** | Entities expose getters / `toJSON()`; mutate only through entity methods |

## Backend (`backend/src/`)

### Layer responsibilities

```
Handler   → parse HTTP, auth check, call one service method, map response
Service   → orchestrate use case; no DynamoDB calls inline
Repository→ persistence only; returns entities, not raw DTOs
Entity    → domain behavior + factories; no HTTP or DB imports
```

### Entity pattern

- **Private constructor** + `static create()` / `static fromRecord()`
- **Behavior methods** for access rules and state transitions
- **Serialization** via `toJSON()` for handlers

```typescript
// ✅ Entity owns the rule
report.canBeViewedBy(session)

// ❌ Handler duplicates domain logic
if (session.type === 'Application Admin') { ... }
```

### Service pattern

- One use case per public method (`createReport`, `updateReport`, `listAuthorities`)
- Validate inputs at service boundary; throw `ApiError` or domain errors
- Delegate persistence to repositories; delegate email/notifications to sibling services

### Handler pattern

Max ~30 lines: `RequestContext` → session → `parseJsonBody` → one service call → `HttpResponse`.

Never: filter reports, compute reference numbers, or send email in a handler.

### Hardening checklist (backend)

```
- [ ] New business rule? → Entity method or Service method, not handler
- [ ] Repeated field checks? → Extract to entity (`isAdmin()`, `canBeViewedBy()`)
- [ ] New table access? → New repository method; service calls it
- [ ] Cross-entity workflow? → Service orchestrates; entities stay focused
- [ ] Handler imports repository? → Fix — handler imports service only
```

## Frontend (`frontend/`)

Frontend is mostly functional React, but apply OOP **where state and rules cluster**:

| OOP-style module | Location | Owns |
|------------------|----------|------|
| **Domain types** | `lib/types.ts` | Shapes only — no behavior |
| **Pure rule functions** | `lib/` | Stateless helpers (`getPostLoginRedirect`, validators) |
| **Service modules** | `services/` | Session, HTTP, auth, store — cohesive APIs |
| **Class when warranted** | `services/http.ts` | `HttpService` with configured client |

### Frontend rules

- **Components** render and dispatch events — no embedded access-control matrices
- **API routes** (`app/api/`) are handlers: auth → one service call → response
- **Reuse server session** via `establishSession` / `getSession` — don't duplicate auth logic in components
- **Prefer modules over classes** unless you need instance state (HTTP client, repository singleton)

### Hardening checklist (frontend)

```
- [ ] Access rule used in 2+ places? → Move to `services/auth.ts` or entity-like helper
- [ ] Component > 80 lines with fetch + rules + UI? → Split organism + service
- [ ] API route with business logic? → Extract to `services/`
- [ ] Raw fetch scattered? → Centralize in `appApi` or domain service client
- [ ] Session check in page? → Use `SessionProvider` + guard organism or API 401
```

## Refactor workflow

When hardening existing code:

1. **Find leaked logic** — search handlers/components for `if (session.type`, `status ===`, ward filters
2. **Extract behavior** — move to entity method (backend) or `services/` helper (frontend)
3. **Thin the adapter** — handler/route calls one service method
4. **Inject dependencies** — backend via `ServiceContainer`; frontend via imports from `@/services/`
5. **Verify boundaries** — entities never import `aws-lambda`, `next/server`, or React

## Anti-patterns

| Anti-pattern | Fix |
|--------------|-----|
| Anemic entity (only getters, logic in service) | Move rule back to entity if it's about the entity's data |
| God service (500+ lines, many unrelated methods) | Split by use case (`ReportService`, `AuthorityService`) |
| Handler does filtering + validation + save | Service method; handler delegates |
| Duplicate `canAccessReport` in frontend and backend | Backend entity is source of truth; frontend mirrors via shared rule doc or thin copy in `auth.ts` |
| Static mutable global state | Repository singleton with explicit `getInstance()` or DI container |
| React component encodes role matrix | `useSession()` + shared helper or disabled UI from one function |

## SOLID (ECAP mapping)

| Letter | ECAP application |
|--------|------------------|
| **S** | `ReportService.createReport` — not `ReportService.doEverything` |
| **O** | Extend via new entity methods or new service; avoid editing handlers for every rule |
| **L** | Repositories return entities; callers rely on entity interface |
| **I** | Small service surfaces; don't expose repository internals |
| **D** | `ReportService` depends on `ServiceReportRepository` abstraction, not DynamoDB SDK in service |

## Additional resources

- ECAP refactor examples: [examples.md](examples.md)
- File placement (atoms → pages): [atomic skill](../atomic/SKILL.md)
