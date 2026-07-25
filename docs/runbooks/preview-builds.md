# Physical device preview builds

Last updated: 2026-07-25

Use the EAS `preview` build profile when you need an installable build for real hardware before a production release. The profile uses the staging app environment and staging Convex URL variable, so preview testing does not touch production data.

## Build Android preview

Run:

```sh
pnpm build:preview:android
```

Equivalent EAS command:

```sh
eas build --platform android --profile preview
```

Expected artifact: an APK from the `preview` profile. Install it on a physical Android device from the EAS build page, QR code, or artifact link.

If the build fails because Android signing is missing, create or restore the Android keystore through EAS credentials:

```sh
eas credentials --platform android
```

Choose the Android application identifier from `app.json`, then let EAS generate a new Android keystore or upload the existing keystore owned by the team.

## Build iOS preview

Run:

```sh
pnpm build:preview:ios
```

Equivalent EAS command:

```sh
eas build --platform ios --profile preview
```

Expected artifact: an ad hoc IPA from the `preview` profile. Install it on a physical iOS device from the EAS build page after the device is registered on the provisioning profile.

If the build fails because the physical iOS device is not registered, register it first:

```sh
eas device:create
```

If the build fails because signing is missing, create or repair the distribution certificate and ad hoc provisioning profile:

```sh
eas credentials --platform ios
```

Use the bundle identifier from `app.json`, then let EAS generate the certificate and ad hoc provisioning profile or upload the existing credentials owned by the team.

## Launch smoke check

After installing either preview build, launch the app and confirm:

- The home screen renders without crashing.
- The health banner shows `Environment: staging`.
- The product list either renders products or an empty list.
- The app does not show `Backend unavailable`.

If the app shows `Backend unavailable`, check that `EXPO_PUBLIC_CONVEX_URL_STAGING` is configured in the EAS staging environment and points to the staging Convex deployment.

## Credential failure guide

| Symptom | Likely missing prerequisite | Resolution |
| --- | --- | --- |
| Android build cannot sign the APK | Android keystore | Run `eas credentials --platform android` and generate or upload the keystore |
| iOS build cannot create an installable IPA | Distribution certificate or ad hoc provisioning profile | Run `eas credentials --platform ios` and repair the signing setup |
| iOS build succeeds but device cannot install | Device UDID is not on the ad hoc provisioning profile | Run `eas device:create`, then rebuild with the `preview` profile |
| Preview launches to `Backend unavailable` | Missing staging Convex URL | Add `EXPO_PUBLIC_CONVEX_URL_STAGING` to the EAS staging environment |
