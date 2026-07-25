# Environments runbook

Last updated: 2026-07-25

Use this runbook to configure **development** and **staging** repeatably. Production follows the same variable model with the production Convex deployment.

## Overview

| Environment | Purpose | Client profile | Convex deployment |
| --- | --- | --- | --- |
| Development | Local coding and simulator testing | `development` | Dev deployment |
| Staging | Internal builds and release validation | `staging` | Staging deployment |
| Production | Store / user-facing releases | `production` | Production deployment |

The app reads `EXPO_PUBLIC_APP_ENVIRONMENT` (or EAS `APP_ENVIRONMENT_NAME` on builds) and selects the matching Convex URL in `app/backendConfig.js`.

---

## One-time setup

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Copy the environment template:

   ```sh
   cp .env.example .env.local
   ```

3. Start Convex in a separate terminal:

   ```sh
   npx convex dev
   ```

   Convex writes deployment metadata to `.env.local` (for example `CONVEX_DEPLOYMENT`). Keep `.env.local` out of git.

4. Fill every variable in the [Required variables](#required-variables) table below.

---

## Configure development

1. Set the profile selector in `.env.local`:

   ```env
   EXPO_PUBLIC_APP_ENVIRONMENT=development
   ```

2. Set the development backend URL:

   ```env
   EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT=<your-dev-deployment-url>
   ```

3. Optional fallback for older local setups:

   ```env
   EXPO_PUBLIC_CONVEX_URL=<same-as-development-url>
   ```

4. Start the app:

   ```sh
   pnpm start:development
   ```

5. Verify the home screen health banner shows `Environment: development` when `convex/health.status` is reachable.

### Development checklist

- [ ] `EXPO_PUBLIC_APP_ENVIRONMENT=development`
- [ ] `EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT` set
- [ ] `npx convex dev` running
- [ ] App loads without the “Backend unavailable” screen

---

## Configure staging

Staging uses a **separate Convex deployment**. Do not point staging builds at the development deployment.

1. Create or identify a staging Convex project/deployment in the [Convex dashboard](https://dashboard.convex.dev/).

2. Deploy backend functions to staging:

   ```sh
   npx convex deploy
   ```

   Use the Convex CLI prompt or project settings to target the staging deployment.

3. In `.env.local` (for local staging profile testing) or in EAS secrets / build env, set:

   ```env
   EXPO_PUBLIC_APP_ENVIRONMENT=staging
   EXPO_PUBLIC_CONVEX_URL_STAGING=<your-staging-deployment-url>
   ```

4. Run locally against staging:

   ```sh
   pnpm start:staging
   ```

5. For internal device builds, use the EAS **staging** profile (`eas.json` sets `EXPO_PUBLIC_APP_ENVIRONMENT=staging`). Provide `EXPO_PUBLIC_CONVEX_URL_STAGING` through EAS environment variables for that profile.

### Staging checklist

- [ ] Dedicated staging Convex deployment exists
- [ ] `EXPO_PUBLIC_CONVEX_URL_STAGING` set for local or EAS staging builds
- [ ] `EXPO_PUBLIC_APP_ENVIRONMENT=staging` for staging starts/builds
- [ ] Health banner shows `Environment: staging`

---

## Required variables

If a variable is missing, the app may show **Backend unavailable**. Use this table to find the exact name and source.

| Variable | Required for | Where to obtain the value |
| --- | --- | --- |
| `EXPO_PUBLIC_APP_ENVIRONMENT` | All local starts | Set to `development` or `staging` in `.env.local`. EAS build profiles in `eas.json` set this automatically for cloud builds. |
| `EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT` | Development profile | Convex dashboard → **Development** deployment → **Settings** → deployment URL (`https://<name>.convex.cloud`), or copy from `.env.local` after `npx convex dev` as `EXPO_PUBLIC_CONVEX_URL` / deployment URL. |
| `EXPO_PUBLIC_CONVEX_URL_STAGING` | Staging profile | Convex dashboard → **Staging** deployment → **Settings** → deployment URL. Create a separate deployment if one does not exist. |
| `EXPO_PUBLIC_CONVEX_URL_PRODUCTION` | Production profile | Convex dashboard → **Production** deployment → **Settings** → deployment URL. Required before production builds; not needed for dev/staging-only work. |
| `EXPO_PUBLIC_CONVEX_URL` | Development fallback | Same value as `EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT`. Used when the development-specific variable is unset. |

### Missing variable guide

| Symptom | Missing variable | Fix |
| --- | --- | --- |
| App shows “Backend unavailable” in development | `EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT` (and no fallback) | Set `EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT` from the Convex dev deployment URL |
| Staging build cannot reach backend | `EXPO_PUBLIC_CONVEX_URL_STAGING` | Add staging deployment URL to EAS env or `.env.local` |
| Wrong backend connected locally | `EXPO_PUBLIC_APP_ENVIRONMENT` | Set to `development` or `staging` to match the URL you configured |
| Convex CLI cannot sync functions | `CONVEX_DEPLOYMENT` (in `.env.local`, CLI-managed) | Run `npx convex dev` and log in; Convex writes this automatically |

---

## EAS build profiles

`eas.json` sets the profile name for each build:

| EAS profile | `EXPO_PUBLIC_APP_ENVIRONMENT` | Convex URL variable to provide |
| --- | --- | --- |
| `development` | `development` | `EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT` |
| `staging` | `staging` | `EXPO_PUBLIC_CONVEX_URL_STAGING` |
| `production` | `production` | `EXPO_PUBLIC_CONVEX_URL_PRODUCTION` |

Configure missing URL variables in the Expo/EAS project environment settings for each EAS environment (`development`, `staging`, `production`).

---

## Related documents

- [ADR 0001: Use Convex as the application backend](../adr/0001-use-convex-as-backend.md)
- [Account and ownership prerequisites](../sprint/account-and-ownership-prerequisites.md)
- `.env.example`
