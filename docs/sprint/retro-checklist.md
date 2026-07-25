# Sprint retrospective checklist

Last updated: 2026-07-25

Complete this at sprint end. Keep answers specific enough that Sprint 2 can act on them.

**Sprint:** 1  
**Facilitator:** _fill in_  
**Date:** _fill in_

---

## What went well

Record concrete wins, not generic praise.

- [ ] CI pipeline runs lint, typecheck, unit tests, Convex tests, and Expo Doctor on every PR
- [ ] Branch protection requires `CI / verify` before merging to `main`
- [ ] Environment separation documented (development / staging / production Convex URLs)
- [ ] _Add team-specific items below_

| Item | Evidence / notes |
| --- | --- |
| | |
| | |
| | |

---

## What didn't go well

Record blockers, surprises, or process gaps.

- [ ] _Example: first PR blocked because required check name did not match GitHub Actions job name_
- [ ] _Add team-specific items below_

| Item | Impact | Owner to follow up |
| --- | --- | --- |
| | | |
| | | |

---

## Concrete improvements for Sprint 2

List **at least one** actionable improvement. Each row must be specific, owned, and verifiable.

| # | Improvement | Owner | Done when |
| --- | --- | --- | --- |
| 1 | **Configure EAS environment secrets** for `EXPO_PUBLIC_CONVEX_URL_STAGING` and `EXPO_PUBLIC_CONVEX_URL_PRODUCTION` so preview builds never ship without backend URLs | _owner_ | Staging and production EAS builds show correct health banner without manual local env |
| 2 | | | |
| 3 | | | |

---

## Sprint 1 closure checklist

- [ ] Demo script completed ([demo-script.md](./demo-script.md))
- [ ] Both preview builds demonstrated with health response
- [ ] CI block / unblock demo recorded on a PR
- [ ] Retro filled in and shared with the team
- [ ] Sprint 2 improvements copied into backlog or issues

---

## Related documents

- [Demo script](./demo-script.md)
- [Account and ownership prerequisites](./account-and-ownership-prerequisites.md)
- [Environments runbook](../runbooks/environments.md)
