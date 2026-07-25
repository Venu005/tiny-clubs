# Passwordless Clerk Authentication Design

## Goal

Add passwordless authentication for Tiny Clubs using Clerk email OTP, native Google sign-in, and native Apple sign-in on iOS. Clerk owns user sessions and provider flows. Convex consumes Clerk JWTs through `ConvexProviderWithClerk`, and authenticated Convex functions mirror the Clerk identity into a `profiles` table so the same user exists in the Convex database.

## Scope

- Add Clerk Expo provider wiring with secure token persistence.
- Replace the plain Convex provider with `ConvexProviderWithClerk`.
- Add a custom Tiny Clubs sign-in route with email OTP, Google, and Apple actions.
- Add profile setup and protected app route boundaries.
- Add Convex auth configuration and authenticated profile functions.
- Add environment documentation without committing secrets.
- Add tests for auth state transitions, platform visibility, route decisions, error copy, and duplicate-submission prevention.

## Dependencies

- `@clerk/expo` for Clerk Expo hooks and provider.
- `@clerk/expo-google-signin` for native Google sign-in.
- `expo-secure-store` for token cache persistence.
- `expo-apple-authentication` for native Apple sign-in.
- `expo-crypto` for native provider nonce/sign-in support.

These native flows require development, preview, or production native builds. They are not expected to work in Expo Go.

## Provider Architecture

`app/_layout.tsx` wraps the app in this order:

1. `ThemeProvider`
2. `ClerkProvider` with `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` and `tokenCache`
3. `BackendErrorBoundary`
4. `ConvexProviderWithClerk` using the existing `ConvexReactClient` and Clerk `useAuth`
5. Expo Router `Stack`

If the Convex URL is missing, the existing backend configuration error remains. If the Clerk publishable key is missing, the app renders a non-crashing configuration error with setup guidance. Convex reads the Clerk JWT issuer from server-side `CLERK_JWT_ISSUER_DOMAIN`; this value is not exposed through Expo public client config.

## Routes

- `app/(auth)/sign-in.tsx`: visible only to signed-out users. Shows email input, code request, OTP verification, Google sign-in on iOS/Android, and Apple sign-in on iOS.
- `app/(app)/_layout.tsx`: protected app group. Redirects unauthenticated users to sign-in.
- `app/(app)/profile-setup.tsx`: destination when Convex profile is incomplete.
- `app/(app)/index.tsx`: destination when Convex profile is complete.

The existing home screen content moves into the protected app index route.

## Email OTP Flow

The sign-in screen uses Clerk Core 3 `useSignIn()` flow methods. Requesting a code sends an email OTP and switches to the OTP verification step. Verifying the correct code finalizes the session. Incorrect or expired codes show exactly `Code is invalid or expired` and remain on the OTP screen.

Offline/network failures render an offline state with a retry action. Loading states disable duplicate submissions.

## Provider Sign-in Flows

Google uses `useSignInWithGoogle()` from `@clerk/expo/google` and is available on Android and iOS. Apple uses `useSignInWithApple()` from `@clerk/expo/apple` and is rendered only on iOS.

Successful provider flows call `setActive({ session: createdSessionId })`. Cancellation maps to exactly `Sign-in cancelled`. Callback/deep-link failures exit loading and show a recoverable retry state.

## Convex Profile Sync

Convex has a `profiles` table indexed by Clerk `tokenIdentifier`. The `profiles.current` query requires authentication, upserts the authenticated Clerk user into Convex if missing, and returns whether the profile is complete. The `profiles.completeSetup` mutation lets the profile setup route mark required profile fields complete.

Convex functions use `ctx.auth.getUserIdentity()` and never accept a client-supplied user ID.

## Route Decision

After Clerk and Convex authentication are both loaded, the app reads the current Convex profile:

- no authenticated session: `/sign-in`
- authenticated and profile incomplete: `/profile-setup`
- authenticated and profile complete: main application

## Error Handling

All auth attempts exit loading in `finally`. Failed, cancelled, offline, or callback-broken flows do not store partial app sessions. The user can retry without restarting.
