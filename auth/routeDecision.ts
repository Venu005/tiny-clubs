export type ProfileStatus = {
  isComplete: boolean;
  username?: string | null;
};

export type SignedOutReason = "session-expired";

export function getSignedOutDestination(reason?: SignedOutReason) {
  return reason === "session-expired"
    ? ("/sign-in?reason=session-expired" as const)
    : ("/sign-in" as const);
}

export function getSignedOutMessage(reason?: string | string[] | null) {
  const normalizedReason = Array.isArray(reason) ? reason[0] : reason;

  return normalizedReason === "session-expired"
    ? "Session expired, please sign in again"
    : null;
}

export function getAuthenticatedDestination(
  profile: ProfileStatus | null | undefined
) {
  return profile?.isComplete && profile.username
    ? ("/" as const)
    : ("/profile-setup" as const);
}

export function shouldShowAppleSignIn(platform: string) {
  return platform === "ios";
}
