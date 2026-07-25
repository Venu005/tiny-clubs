# Account and ownership prerequisites

Last updated: 2026-07-25

This sprint note records store-account, domain, and deep-link prerequisites so later sign-in and release work is not blocked by missing verification.

Project owner: **Venu005** (`Venu005/tiny-clubs`)

Related app identifiers in repo:

| Platform | Identifier | Source |
| --- | --- | --- |
| iOS bundle ID | `com.venusai.tinyclubs` | `app.json` |
| Expo slug | `tiny-clubs` | `app.json` |
| Custom URL scheme (dev placeholder) | `myapp` | `app.json` |
| EAS project ID | `6de9279f-486f-46d1-a4b5-af028ab7f43d` | `app.json` |

---

## Apple Developer account

| Field | Recorded value |
| --- | --- |
| Status | **Pending verification** — membership not yet confirmed in project records |
| Access holder | **Venu005** (project owner) |
| Apple Team ID | Not recorded yet |
| App Store Connect app | Not created yet |
| Certificates / profiles | Not provisioned in repo yet |

### Pending verification

| Blocker | Next action |
| --- | --- |
| Active Apple Developer Program enrollment is not documented | Log in at [Apple Developer](https://developer.apple.com/account/) as **Venu005**, confirm the program is active, and record the **Team ID** in this document |
| App Store Connect app record does not exist for `com.venusai.tinyclubs` | Create the App Store Connect app after enrollment is confirmed; grant any future collaborators Admin or App Manager access as needed |
| Sign in with Apple / push / associated domains are not configured yet | Defer capability setup until auth requirements are defined; capture required entitlements here before the first production iOS build |

---

## Google Play Console access

| Field | Recorded value |
| --- | --- |
| Status | **Pending verification** — Play Console access not yet confirmed in project records |
| Access holder | **Venu005** (project owner) |
| Google Play developer account | Not linked in repo yet |
| Android application ID | `com.venusai.tinyclubs` |
| Launcher icon | `assets/icon.png` |
| Android adaptive icon | `assets/adaptive-icon.png` |
| Play App Signing | Not configured yet |

### Pending verification

| Blocker | Next action |
| --- | --- |
| Play Console developer account status is unknown | Log in at [Google Play Console](https://play.google.com/console/) as **Venu005**, confirm the developer account is active, and record the account email here |
| Android signing credentials are not provisioned | Run `eas credentials --platform android` and generate or upload the Android keystore for `com.venusai.tinyclubs` |
| No internal testing track exists | After the app record is created, configure an internal testing release for staging builds |

---

## Domain ownership and deep-link configuration

Production auth, email links, and universal/app links require a domain the team controls. None is committed yet.

| Field | Recorded value |
| --- | --- |
| Status | **Not started** |
| Domain owner | **Venu005** (to confirm and purchase/manage DNS) |
| Production domain | Not selected yet |
| DNS provider access | Not recorded yet |

### Required DNS / verification steps

Record the chosen domain below once selected. These steps apply to Expo Router + future OAuth / magic-link flows.

| Step | Owner | Purpose |
| --- | --- | --- |
| Register or confirm ownership of production domain (for example `tinyclubs.app` or subdomain) | **Venu005** | Host verification files and auth redirect URLs |
| Publish `apple-app-site-association` at `https://<domain>/.well-known/apple-app-site-association` | **Venu005** | iOS Universal Links |
| Publish `assetlinks.json` at `https://<domain>/.well-known/assetlinks.json` | **Venu005** | Android App Links |
| Add `associatedDomains` to `app.json` (`applinks:<domain>`) | Engineering | Enable iOS universal links in the native app |
| Add Android intent filters / Expo linking config for HTTPS host | Engineering | Enable Android app links |
| Replace dev scheme `myapp` with production scheme (for example `tinyclubs`) | Engineering | Stable custom-scheme redirects during development |
| Configure auth provider redirect URLs (Convex / Clerk / OAuth) to `https://<domain>/...` | Engineering | Prevent sign-in redirect failures in production |
| Verify email-sending domain (SPF, DKIM, DMARC) if transactional email is used | **Venu005** | Avoid auth and notification delivery blocks |

### Pending verification

| Blocker | Next action |
| --- | --- |
| No production domain has been chosen | **Venu005** selects and registers the production domain, then records it in the table above |
| Universal Link / App Link files are not hosted | After DNS access is confirmed, publish AASA and `assetlinks.json` to the domain's `/.well-known/` paths |
| App still uses placeholder scheme `myapp` | Decide production scheme and update `app.json` before enabling OAuth or passwordless sign-in |

---

## Review checklist

Before starting store submission or production auth:

- [ ] Apple Developer Program active and Team ID recorded
- [ ] Google Play developer account active and access holder confirmed
- [ ] Production domain owned and DNS access documented
- [ ] Deep-link verification files hosted and tested on device
- [ ] App identity and icon configuration reviewed using [App identity](../runbooks/app-identity.md)
- [ ] All rows in **Pending verification** tables above are closed or explicitly deferred
