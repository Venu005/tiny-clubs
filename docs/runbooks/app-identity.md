# App identity

Last updated: 2026-07-25

Use this runbook when preparing EAS builds, creating store records, or changing the app identity. The canonical app identity values are defined in `app.json`.

The iOS bundle identifier and Android package name must stay unique in the Apple and Google ecosystems.

## Recorded identifiers

| Platform | Config key | Recorded value |
| --- | --- | --- |
| iOS | `expo.ios.bundleIdentifier` | `com.venusai.tinyclubs` |
| Android | `expo.android.package` | `com.venusai.tinyclubs` |
| Shared launcher icon | `expo.icon` / `expo.ios.icon` | `./assets/icon.png` |
| Android adaptive icon foreground | `expo.android.adaptiveIcon.foregroundImage` | `./assets/adaptive-icon.png` |

Both launcher icon PNGs are 1024x1024 so EAS can generate the platform-specific icon sizes during native builds.

## If an identifier is already taken

App Store Connect and Google Play require globally unique identifiers. If `com.venusai.tinyclubs` is already taken in an account you do not control, do not reuse it.

Pick a new reverse-DNS identifier:

1. Start with a domain or namespace the release owner controls, such as `com.venusai`.
2. Add the app name in lowercase letters, numbers, or dots, such as `com.venusai.tinyclubs`.
3. For separate apps, add a stable suffix such as `com.venusai.tinyclubs.staging`. Do not change identifiers just to point at a different backend environment for the same app record.
4. Update both `expo.ios.bundleIdentifier` and `expo.android.package` in `app.json` when the app identity should change on both stores.
5. Update `docs/sprint/account-and-ownership-prerequisites.md` with the new recorded value and create matching store records / signing credentials.

After changing an identifier, rebuild credentials with EAS:

```sh
eas credentials --platform ios
eas credentials --platform android
```

## Icon checks

Before a release build:

- Confirm `assets/icon.png` renders clearly as a square iOS launcher icon.
- Confirm `assets/adaptive-icon.png` has transparent padding around the foreground mark for Android adaptive icon masking.
- Run `pnpm test` to verify the configured icon paths and dimensions.
