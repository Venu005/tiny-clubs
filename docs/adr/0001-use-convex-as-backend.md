# ADR 0001: Use Convex as the application backend

- **Status:** Accepted
- **Date:** 2026-07-25
- **Deciders:** tiny-clubs maintainers

## Context

tiny-clubs is a cross-platform Expo app that needs:

- Real-time data for club/product views
- Type-safe APIs shared between the mobile client and backend
- Separate development, staging, and production backends
- Fast local iteration without managing servers, databases, and WebSocket infrastructure separately

The starter app already ships with Convex functions, schema, and a React Native client integration.

## Decision

Use **Convex** as the sole application backend for tiny-clubs.

The Expo client connects through `ConvexProvider` and generated APIs in `convex/_generated/api`. Backend logic lives in TypeScript functions under `convex/`, with schema defined in `convex/schema.ts`.

Environment-specific Convex deployment URLs are selected in the client by `EXPO_PUBLIC_APP_ENVIRONMENT` via `app/backendConfig.js`.

## Rationale

| Factor | Why Convex fits |
| --- | --- |
| Real-time updates | Queries subscribe automatically; product lists update without custom WebSocket code |
| Type safety | Generated `api` and `Doc` types connect schema, functions, and React hooks |
| Developer speed | `npx convex dev` provisions a dev deployment and syncs functions locally |
| Environment separation | Separate Convex deployments map cleanly to development, staging, and production profiles |
| Operational surface | No self-managed API server, database, or pub/sub layer for this MVP scope |

## Alternatives considered

### Custom Node/Express API + PostgreSQL

Rejected for the current phase because it adds deployment, migration, and real-time plumbing before product features exist.

### Firebase / Supabase

Rejected because the project already standardizes on Convex in code and CI (`pnpm test:convex`), and the team wants end-to-end TypeScript from schema to client.

### Convex only for production, mock backend locally

Rejected because environment separation is handled with distinct Convex deployments rather than mocks, keeping staging behavior closer to production.

## Consequences

### Positive

- One language and toolchain for backend and app configuration tests
- Reactive UI with minimal client-side sync code
- Convex tests run in CI with `convex-test` and Vitest

### Negative / trade-offs

- Backend logic must follow Convex patterns (queries, mutations, schema validators)
- Each environment requires its own Convex deployment URL
- Auth, file storage, and third-party integrations must use Convex-compatible patterns when added later

## Related documents

- [Environments runbook](../runbooks/environments.md)
- [Account and ownership prerequisites](../sprint/account-and-ownership-prerequisites.md)
- `.env.example` — required client environment variables
