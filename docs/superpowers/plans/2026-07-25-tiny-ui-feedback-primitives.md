# Tiny UI Feedback Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build reusable Tiny Clubs UI primitives for async loading, skeletons, error toasts, sheets, and dialogs without wiring demo UI into screens.

**Architecture:** Components live under `components/ui` and consume the existing `useTheme()` token API. Tests exercise primitive behavior through `@testing-library/react-native`; no new UI library dependency is introduced.

**Tech Stack:** Expo SDK 57, React 19.2, React Native 0.86, TypeScript, Jest, `@testing-library/react-native`.

## Global Constraints

- Add primitives under `components/ui`.
- Use React Native and existing Tiny Clubs theme tokens only.
- Keep the public API playful, lightweight, and app-owned.
- Test behavior at the primitive level.
- Do not wire demos into the home screen.

---

## File Structure

- Create `components/ui/TinyButton.tsx`: async-safe token button with loading and disabled states.
- Create `components/ui/TinyLoadingIndicator.tsx`: token loading row.
- Create `components/ui/TinySkeleton.tsx`: token skeleton block.
- Create `components/ui/TinyToast.tsx`: exact-message feedback with optional retry button.
- Create `components/ui/TinyModal.tsx`: shared modal shell used by dialogs and sheets.
- Create `components/ui/TinyDialog.tsx`: centered modal dialog.
- Create `components/ui/TinySheet.tsx`: bottom sheet modal.
- Create `components/ui/index.ts`: export all primitives.
- Create `components/ui/tiny-ui.test.tsx`: behavior tests for acceptance criteria.

### Task 1: Async Button, Loading Indicator, Skeleton, Toast

**Files:**
- Create: `components/ui/TinyButton.tsx`
- Create: `components/ui/TinyLoadingIndicator.tsx`
- Create: `components/ui/TinySkeleton.tsx`
- Create: `components/ui/TinyToast.tsx`
- Create: `components/ui/index.ts`
- Test: `components/ui/tiny-ui.test.tsx`

**Interfaces:**
- Consumes: `useTheme()` from `@/theme`.
- Produces:
  - `TinyButton({ label, onPress, disabled, loadingLabel, variant, testID })`
  - `TinyLoadingIndicator({ label, testID })`
  - `TinySkeleton({ width, height, radius, testID })`
  - `TinyToast({ message, actionLabel, onAction, testID })`

- [ ] **Step 1: Write failing tests**

Add tests that render a pending `TinyButton`, press it twice, and assert the handler runs once while `loadingLabel` is visible. Add tests that render `TinySkeleton` while loading is true. Add tests that render `TinyToast` with exact error text and verify retry action fires.

- [ ] **Step 2: Run focused test to verify red**

Run: `pnpm test components/ui/tiny-ui.test.tsx --runInBand`

Expected: FAIL because `components/ui` exports do not exist.

- [ ] **Step 3: Implement minimal primitives**

Implement the four components using React Native primitives, token colors, 44-point minimum touch targets for pressable controls, scalable text, and `ActivityIndicator` for loading.

- [ ] **Step 4: Run focused test to verify green**

Run: `pnpm test components/ui/tiny-ui.test.tsx --runInBand`

Expected: PASS.

### Task 2: Shared Modal Shell, Dialog, and Sheet

**Files:**
- Create: `components/ui/TinyModal.tsx`
- Create: `components/ui/TinyDialog.tsx`
- Create: `components/ui/TinySheet.tsx`
- Modify: `components/ui/index.ts`
- Test: `components/ui/tiny-ui.test.tsx`

**Interfaces:**
- Consumes: `TinyButton` from `components/ui/TinyButton`.
- Produces:
  - `TinyDialog({ visible, title, message, triggerRef, onClose, primaryAction, children, testID })`
  - `TinySheet({ visible, title, triggerRef, onClose, children, testID })`
  - `focusTrigger(triggerRef)` helper inside `TinyModal.tsx`

- [ ] **Step 1: Write failing tests**

Add tests that render a visible dialog and sheet, assert their modal content appears, press close, and assert `onClose` fires and the trigger ref receives `focus()`.

- [ ] **Step 2: Run focused test to verify red**

Run: `pnpm test components/ui/tiny-ui.test.tsx --runInBand`

Expected: FAIL because modal primitives do not exist.

- [ ] **Step 3: Implement modal primitives**

Implement a shared transparent `Modal` overlay with `onRequestClose`, backdrop, content surface, close button, and trigger focus restoration after close. Use centered layout for dialog and bottom-aligned layout for sheet.

- [ ] **Step 4: Run focused test to verify green**

Run: `pnpm test components/ui/tiny-ui.test.tsx --runInBand`

Expected: PASS.

### Task 3: Full Verification and PR

**Files:**
- Verify all staged feature files.

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

Stage only feature files under `components/ui` and `docs/superpowers`.

Commit message: `Add tiny UI feedback primitives`

- [ ] **Step 3: Push and raise PR**

Push `codex/tiny-ui-feedback-primitives` and create a PR against `main` with summary and verification commands.

