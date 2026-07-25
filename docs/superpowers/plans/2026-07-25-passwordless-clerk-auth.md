# Passwordless Clerk Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Clerk passwordless email OTP, native Google, and native Apple authentication for Tiny Clubs with Clerk sessions bridged into Convex.

**Architecture:** Clerk provides sessions and native provider flows; `ConvexProviderWithClerk` passes Clerk JWTs to Convex. Convex profile functions use `ctx.auth.getUserIdentity()` to mirror Clerk users into a `profiles` table and determine whether the user should see profile setup or the main app.

**Tech Stack:** Expo SDK 57, React 19.2, React Native 0.86, Expo Router, Clerk Expo, Convex, TypeScript, Jest, Vitest.

## Global Constraints

- Add Clerk Expo provider wiring with secure token persistence.
- Replace the plain Convex provider with `ConvexProviderWithClerk`.
- Add a custom Tiny Clubs sign-in route with email OTP, Google, and Apple actions.
- Add profile setup and protected app route boundaries.
- Add Convex auth configuration and authenticated profile functions.
- Add environment documentation without committing secrets.
- Add tests for auth state transitions, platform visibility, route decisions, error copy, and duplicate-submission prevention.
- Native provider flows require development, preview, or production native builds and are not expected to work in Expo Go.

---

## File Structure

- Modify `package.json` and `pnpm-lock.yaml`: add Clerk and native auth dependencies.
- Modify `app.json`: add Clerk, Google sign-in, Apple auth, and SecureStore config plugins plus Clerk Google `extra` values.
- Modify `.env.example`: document Clerk publishable key, Clerk JWT issuer domain, and Google client IDs.
- Modify `app/_layout.tsx`: wrap app with `ClerkProvider` and `ConvexProviderWithClerk`.
- Create `app/authConfig.ts`: validate public Clerk config and return a non-crashing config state.
- Create `app/(auth)/_layout.tsx`: redirect signed-in users away from auth routes.
- Create `app/(auth)/sign-in.tsx`: custom sign-in screen.
- Create `app/(app)/_layout.tsx`: protect signed-in routes and gate profile state.
- Move current `app/index.tsx` to `app/(app)/index.tsx`.
- Create `app/(app)/profile-setup.tsx`: minimal profile completion flow.
- Create `auth/routeDecision.ts`: pure route-decision helpers.
- Create `auth/errorMessages.ts`: normalize cancellation, OTP, offline, and callback errors.
- Create `auth/signInScreen.test.tsx`: UI/platform/error/loading tests.
- Create `auth/routeDecision.test.ts`: routing helper tests.
- Modify `convex/schema.ts`: add `profiles` table and `by_tokenIdentifier` index.
- Create `convex/auth.config.ts`: configure Clerk JWT issuer for Convex.
- Create `convex/profiles.ts`: `current` query and `completeSetup` mutation.
- Create `convex/profiles.test.ts`: authenticated profile sync tests.

### Task 1: Dependencies and Configuration

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `app.json`
- Modify: `.env.example`
- Create: `app/authConfig.ts`
- Test: `app/authConfig.test.ts`

**Interfaces:**
- Produces `resolveAuthConfig(env: Record<string, string | undefined>) => { clerkPublishableKey: string | null; clerkJwtIssuerDomain: string | null; isConfigured: boolean; message: string | null }`.

- [ ] **Step 1: Write failing auth config tests**

Test that missing `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` returns `isConfigured: false` with setup guidance and that present publishable key/issuer returns configured.

- [ ] **Step 2: Run red test**

Run: `pnpm test app/authConfig.test.ts --runInBand`

Expected: FAIL because `app/authConfig` does not exist.

- [ ] **Step 3: Install dependencies**

Run: `pnpm add @clerk/expo @clerk/expo-google-signin expo-secure-store expo-apple-authentication expo-crypto`

- [ ] **Step 4: Implement config**

Add `resolveAuthConfig`, update `app.json` plugins and Clerk public env docs. Use empty strings in `extra` fields so no real credentials are committed.

- [ ] **Step 5: Run green test**

Run: `pnpm test app/authConfig.test.ts --runInBand`

Expected: PASS.

### Task 2: Clerk and Convex Provider Bridge

**Files:**
- Modify: `app/_layout.tsx`
- Test: `app/rootLayoutAuth.test.tsx`

**Interfaces:**
- Consumes `resolveAuthConfig`.
- Produces root provider tree with `ClerkProvider`, `tokenCache`, and `ConvexProviderWithClerk`.

- [ ] **Step 1: Write failing provider test**

Mock `@clerk/expo`, `@clerk/expo/token-cache`, and `convex/react-clerk`; assert the layout uses `ConvexProviderWithClerk` when Clerk and Convex config are available and renders configuration guidance when Clerk config is missing.

- [ ] **Step 2: Run red test**

Run: `pnpm test app/rootLayoutAuth.test.tsx --runInBand`

Expected: FAIL because the root layout still uses plain `ConvexProvider`.

- [ ] **Step 3: Implement provider bridge**

Wrap the app in `ClerkProvider` with `tokenCache`, and replace `ConvexProvider` with `ConvexProviderWithClerk client={convex} useAuth={useAuth}`.

- [ ] **Step 4: Run green test**

Run: `pnpm test app/rootLayoutAuth.test.tsx --runInBand`

Expected: PASS.

### Task 3: Convex Profile Sync

**Files:**
- Modify: `convex/schema.ts`
- Create: `convex/auth.config.ts`
- Create: `convex/profiles.ts`
- Test: `convex/profiles.test.ts`

**Interfaces:**
- Produces `api.profiles.current` query returning `{ profileId, tokenIdentifier, clerkSubject, email, displayName, isComplete } | null`.
- Produces `api.profiles.completeSetup` mutation accepting `{ displayName: string }` and returning `{ isComplete: true }`.

- [ ] **Step 1: Write failing Convex tests**

Test authenticated `profiles.current` creates a profile from Clerk identity, unauthenticated returns `null`, and `completeSetup` marks the authenticated profile complete.

- [ ] **Step 2: Run red Convex test**

Run: `pnpm test:convex convex/profiles.test.ts`

Expected: FAIL because `profiles` functions/table do not exist.

- [ ] **Step 3: Implement Convex schema/functions**

Add optional profile fields safely, index by `tokenIdentifier`, use `ctx.auth.getUserIdentity()`, and never accept user IDs from the client.

- [ ] **Step 4: Run green Convex test**

Run: `pnpm test:convex convex/profiles.test.ts`

Expected: PASS.

### Task 4: Route Decisions and Protected Routes

**Files:**
- Create: `auth/routeDecision.ts`
- Create: `auth/routeDecision.test.ts`
- Create: `app/(auth)/_layout.tsx`
- Create: `app/(app)/_layout.tsx`
- Move: `app/index.tsx` to `app/(app)/index.tsx`
- Create: `app/(app)/profile-setup.tsx`

**Interfaces:**
- Produces `getAuthenticatedDestination(profile: { isComplete: boolean } | null | undefined): "/profile-setup" | "/"`
- Produces `shouldShowAppleSignIn(platform: string): boolean`.

- [ ] **Step 1: Write failing route-decision tests**

Test incomplete profiles route to `/profile-setup`, complete profiles route to `/`, unauthenticated routes redirect to `/sign-in`, and Apple is iOS-only.

- [ ] **Step 2: Run red tests**

Run: `pnpm test auth/routeDecision.test.ts --runInBand`

Expected: FAIL because route helpers do not exist.

- [ ] **Step 3: Implement route helpers and layouts**

Use Clerk auth state and Convex profile query to redirect signed-in users to the correct route and signed-out users to `/sign-in`.

- [ ] **Step 4: Run green tests**

Run: `pnpm test auth/routeDecision.test.ts --runInBand`

Expected: PASS.

### Task 5: Sign-in Screen and Error Handling

**Files:**
- Create: `auth/errorMessages.ts`
- Create: `auth/signInScreen.test.tsx`
- Create: `app/(auth)/sign-in.tsx`

**Interfaces:**
- Produces `getAuthErrorMessage(error: unknown): "Sign-in cancelled" | "Code is invalid or expired" | string`.
- Sign-in route renders email OTP, Google, and iOS-only Apple options.

- [ ] **Step 1: Write failing UI/error tests**

Mock Clerk hooks. Test email input and request-code button render, Google renders on iOS/Android, Apple renders only on iOS, invalid OTP shows `Code is invalid or expired`, cancellation shows `Sign-in cancelled`, offline failures show retry copy, and loading disables duplicate submissions.

- [ ] **Step 2: Run red UI tests**

Run: `pnpm test auth/signInScreen.test.tsx --runInBand`

Expected: FAIL because sign-in screen and error helper do not exist.

- [ ] **Step 3: Implement sign-in screen**

Use Tiny UI primitives and Clerk hooks. Map Clerk native provider success through `setActive({ session: createdSessionId })`. Keep loading state local and clear in `finally`.

- [ ] **Step 4: Run green UI tests**

Run: `pnpm test auth/signInScreen.test.tsx --runInBand`

Expected: PASS.

### Task 6: Full Verification, Commit, Push, PR

**Files:**
- Verify all feature files.

- [ ] **Step 1: Run verification**

Run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:convex
pnpm secret-scan
git diff --check
```

- [ ] **Step 2: Commit implementation**

Stage only feature files and commit with `Add passwordless Clerk authentication`.

- [ ] **Step 3: Push and raise PR**

Push `codex/passwordless-clerk-auth` and create a PR against `main`.

