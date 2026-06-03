# ECAP - Electronic Councillor Action Platform

A Next.js prototype for national municipal reporting and admin workflows.

## What is included

- Public user reporting pages for service delivery and anonymous crime incidents
- Authority dashboard pages for ward-based reports and incident status actions
- Application admin pages for registering authorities and assigning rights
- Basic API route for reports with sample in-memory storage
- No data deletion: support for cancelled and duplicate incidents in the UI

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open `http://localhost:3000`

## Project structure

- `app/` - Next.js App Router pages and layouts
- `app/api/reports/route.ts` - Demo report API
- `lib/types.ts` - shared TypeScript model definitions

## Notes

This scaffold is built to represent the ECAP user story and supports the roles:
- Public User
- Authority (SAPS, JMPD, councillor, urban inspector)
- Application Admin

The product is designed to preserve report integrity, support anonymous crime reporting, and route incidents to the correct ward or responsible entity.
