# Sprint demo script

Last updated: 2026-07-25

Use this script to close the sprint with live evidence: two preview builds, backend health visible, and CI blocking bad merges.

**Duration:** ~20 minutes  
**Audience:** Team, stakeholders  
**Evidence to capture:** Screenshots or screen recording of health banners and PR checks

---

## Before the demo

- [ ] Development and staging EAS builds exist (or build them in step 1)
- [ ] Convex development and staging deployments are running
- [ ] `EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT` and `EXPO_PUBLIC_CONVEX_URL_STAGING` are set in EAS for each profile
- [ ] A throwaway demo branch is ready for the CI portion (step 5)

---

## 1. Build preview apps (if needed)

Create internal preview builds for simulator/development validation and physical-device staging validation:

```sh
eas build --profile development --platform all
eas build --profile staging --platform all
eas build --profile preview --platform android
eas build --profile preview --platform ios
```

When builds finish, open the EAS dashboard and copy the install links / QR codes for each profile. Use the `preview` artifacts for physical Android and iOS hardware.

---

## 2. Install the development preview build

1. On a physical device or simulator, open the **development** install link from EAS.
2. Install the app (`com.venusai.tinyclubs`).
3. Launch **tiny-clubs**.

**Expected:** App opens without the “Backend unavailable” error screen when development Convex URL is configured.

---

## 3. Install the staging preview build

1. Open the **staging** install link from EAS (separate build artifact from development).
2. Install alongside or on a second device if your platform allows side-by-side internal builds.
3. Launch the staging build.

**Expected:** Staging build connects to the staging Convex deployment, not development.

---

## 4. Show the health response

On each installed preview build, point to the health banner at the top of the home screen.

| Build | Expected health banner |
| --- | --- |
| Development preview | `Environment: development` |
| Staging preview | `Environment: staging` |

The banner comes from `convex/health.status` via `getHealthDisplayState` in the app.

**Talking points:**

- Real-time Convex query drives the label
- Wrong or missing env vars show “Backend unavailable” instead
- See [Environments runbook](../runbooks/environments.md) for variable setup

**Capture evidence:** Screenshot both banners showing distinct environment names.

---

## 5. Demonstrate CI blocking a bad merge

This proves branch protection and required checks work.

### 5a. Introduce a lint failure

On a demo branch (not `main`):

1. Add a deliberate lint violation, for example an unused variable in any `.ts`/`.tsx` file:

   ```ts
   const demoLintFailure = "remove me";
   ```

2. Commit, push, and open a PR to `main`.

### 5b. Show CI failing and merge blocked

1. Open the PR checks on GitHub.
2. Confirm **`CI / verify`** fails on the **Lint** step (`pnpm lint`).
3. Confirm merge is blocked (required check not passing).

**Expected:** Red CI, merge button disabled until fixed.

### 5c. Restore lint to green

1. Remove the lint violation (or fix the reported issue).
2. Push to the same PR branch.
3. Wait for **`CI / verify`** to pass.
4. Confirm the PR becomes mergeable.

**Expected:** Green CI, merge allowed (subject to other branch rules).

**Capture evidence:** Screenshot failed check, then passed check on the same PR.

---

## Demo checklist

- [ ] Development preview build installed
- [ ] Staging preview build installed
- [ ] Health shows `Environment: development`
- [ ] Health shows `Environment: staging`
- [ ] PR with lint failure: CI red, merge blocked
- [ ] PR after lint fix: CI green, mergeable

---

## Related documents

- [Environments runbook](../runbooks/environments.md)
- [Physical device preview builds](../runbooks/preview-builds.md)
- [Retro checklist](./retro-checklist.md)
- `.github/workflows/ci.yml` — `CI / verify` job
