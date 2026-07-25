# Tiny UI Feedback Primitives Design

## Goal

Add reusable Tiny Clubs UI primitives for async feedback, network loading placeholders, error messaging, sheets, and dialogs. This branch does not wire demos into the home screen; it provides tested building blocks for future screens.

## Scope

- Add primitives under `components/ui`.
- Use React Native and existing Tiny Clubs theme tokens only.
- Keep the public API playful, lightweight, and app-owned.
- Test behavior at the primitive level.

## Components

- `TinyButton`: token-styled pressable button with a minimum 44-point target, loading state, disabled state, and repeated-tap prevention while an async press handler is running.
- `TinyLoadingIndicator`: compact loading row using `ActivityIndicator` plus scalable text.
- `TinySkeleton`: token-styled placeholder block for first-render network loading states.
- `TinyToast`: inline/toast-style feedback message that renders the exact error text and an optional retry action.
- `TinyDialog`: modal dialog that blocks background controls, supports close and optional action buttons, and returns focus to the triggering control after dismissal.
- `TinySheet`: bottom sheet style modal with the same background-blocking and focus-return behavior as `TinyDialog`.
- `components/ui/index.ts`: central export surface.

## Behavior

Async button presses set local loading state before awaiting the handler, ignore repeated taps while pending, then clear loading after success or failure. Errors are not swallowed; callers can catch and render them through `TinyToast` or inline UI.

Skeletons are display-only placeholders for data that has not arrived yet. They expose stable dimensions through style props and token defaults so layouts do not jump unnecessarily.

Dialogs and sheets use React Native `Modal` with `transparent` presentation. While visible, background controls are not tappable because the modal overlay owns interaction. On close, the primitive calls `focus()` on the provided trigger ref when present.

## Error Handling

`TinyToast` renders the exact message passed to it. When a retry handler is supplied, the retry action is visible and pressable. The toast does not invent or normalize errors; calling flows decide what message to show.

## Testing

Tests cover:

- Loading button shows a loading state and prevents repeated taps while pending.
- Skeleton placeholders render while a loading flag is true.
- Toast renders exact error text and invokes retry when supplied.
- Dialog and sheet render in modals, block background interaction by construction, close cleanly, and focus the triggering control.

