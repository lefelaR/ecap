# ECAP - Electronic Councillor Action Platform

A Next.js application for national municipal reporting, authority workflows, and public transparency — aligned with the ECAP 2024 brief.

## Features

- **Public reporting** — service delivery and crime reports with map pin, geolocation, photos, contact details, and anonymous crime option
- **Reference numbers & email updates** — confirmation on submit and status-change notifications (logged to `data/ecap.json` in demo mode)
- **Status lookup** — citizens check progress, resolution time, and expenditure by reference number
- **Public statistics** — trends, category breakdown, hotspot wards, and total expenditure
- **Authority dashboard** — ward-filtered reports, resolve/duplicate/cancel actions, expenditure tracking
- **Admin panel** — register authorities (SAPS, JMPD, councillor, urban inspector) with area-limited rights
- **Role-based access** — demo login with session cookies; anonymous crime visible only to SAPS/JMPD/admin
- **Data integrity** — incidents marked cancelled or duplicate, never deleted

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Optional: set a Mapbox token for the reporting map:

```bash
echo "NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here" >> .env.local
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Demo accounts

Use **Login** and pick a demo authority:

| Account | Access |
|---------|--------|
| Application Admin | Full system + authority registration |
| Councillor – Ward 23 | Ward 23 service reports |
| SAPS Officer | Anonymous crime + safety reports |
| JMPD Inspector | Safety and traffic incidents |

## Project structure

- `app/public/` — public reporting flow
- `app/status/` — reference number lookup
- `app/statistics/` — public transparency dashboard
- `app/authority/` — authority issue management
- `app/admin/` — authority registration
- `app/api/` — REST API (reports, auth, stats, authorities)
- `lib/` — shared types and labels
- `services/` — auth, store, email, and statistics services
- `data/` — runtime JSON persistence (created on first run)

## Notes

- Persistence uses a local JSON file (`data/ecap.json`) suitable for demo/prototype use. Production would use a cloud database.
- Email is simulated (logged to console and stored in `data/ecap.json`). Wire `services/email.ts` to SMTP or a provider for production.
- Photo uploads capture filenames in the report record; production should store files in cloud object storage.
