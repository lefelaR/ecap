# OOP — ECAP Examples

## Backend: move rule from handler to entity

**Before (leaked logic in handler):**

```typescript
// ❌ handler
if (report.anonymous && session.type !== 'SAPS') {
  return HttpResponse.json(403, { error: 'Forbidden.' });
}
```

**After:**

```typescript
// ✅ entity — ServiceReport.canBeViewedBy(session)
// ✅ handler
if (!report.canBeViewedBy(session)) {
  throw ApiError.forbidden();
}
```

## Backend: entity factory + private constructor

```typescript
export class Authority {
  private constructor(private readonly record: AuthorityRecord) {}

  static fromRecord(record: AuthorityRecord): Authority {
    return new Authority(record);
  }

  static create(input: CreateAuthorityInput): Authority {
    return new Authority({
      id: `auth-${Date.now()}`,
      ...input,
      canViewAnonymousCrime: input.type === 'SAPS' || input.type === 'JMPD',
    });
  }

  isAdmin(): boolean {
    return this.record.type === 'Application Admin';
  }

  toSessionUser(): SessionUser {
    return { authorityId: this.id, name: this.record.name, /* ... */ };
  }
}
```

## Backend: thin handler

```typescript
export const handler = HandlerFactory.create(async (event) => {
  const ctx = new RequestContext(event);
  const session = await container.authService.resolveSession(ctx.sessionId);
  if (!session) throw ApiError.unauthorized();

  const body = await ctx.parseJsonBody<UpdateReportInput>();
  const report = await container.reportService.updateReport(ctx.pathId!, session, body);

  return HttpResponse.ok(report.toJSON());
});
```

## Backend: service orchestrates, repository persists

```typescript
export class ReportService {
  constructor(
    private readonly reportRepository: ServiceReportRepository,
    private readonly emailService: EmailNotificationService,
  ) {}

  async createReport(input: CreateReportInput): Promise<ServiceReport> {
    // validate → factory → save → side effect
    const referenceNumber = await ReferenceNumberGenerator.next(() =>
      this.reportRepository.getMaxReferenceSequence(),
    );
    const report = ServiceReport.create(input, referenceNumber);
    await this.reportRepository.save(report);
    await this.emailService.sendConfirmation(report);
    return report;
  }
}
```

## Frontend: thin API route

```typescript
// app/api/stats/route.ts
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }
  const data = await readData();
  return NextResponse.json(computeStats(data.reports));
}
```

## Frontend: service module owns session lifecycle

```typescript
// services/auth.ts — single place for session rules
export async function establishSession(user: SessionUser): Promise<string> {
  const record = await createSession(user, SESSION_TTL_HOURS);
  return record.id;
}

export async function getSession(): Promise<SessionUser | null> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;
  const record = await getSessionById(sessionId);
  return record?.user ?? null;
}
```

## Frontend: component delegates to service + context

```typescript
// ✅ organism — no role matrix inline
export function StatisticsPanel() {
  const { session, ready } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      router.push('/authentication/login?redirect=/statistics');
      return;
    }
    fetch('/api/stats', { credentials: 'include' }).then(/* ... */);
  }, [ready, session, router]);
}
```

## Refactor target: harden `canAccessReport`

Today `frontend/services/auth.ts` mirrors backend `ServiceReport.canBeViewedBy`. When changing access rules:

1. Update `ServiceReport.canBeViewedBy` (backend source of truth)
2. Update `canAccessReport` in `frontend/services/auth.ts` to match
3. Grep for stray `session.type ===` / `ward ===` in components — remove duplicates

## When NOT to add a class

| Situation | Use instead |
|-----------|-------------|
| One-off pure transform | Function in `lib/` |
| React UI only | Component (function) |
| Form validators | `lib/formik/auth-forms.ts` validate functions |
| Config constants | `lib/` or `config/` |

Add a **class** when you need: constructed dependencies, encapsulated mutable state, or a family of methods on one resource (`HttpService`, `ReportService`, `Authority`).
