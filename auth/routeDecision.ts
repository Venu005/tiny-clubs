export type ProfileStatus = {
  isComplete: boolean;
};

export function getSignedOutDestination() {
  return "/sign-in" as const;
}

export function getAuthenticatedDestination(
  profile: ProfileStatus | null | undefined
) {
  return profile?.isComplete ? ("/" as const) : ("/profile-setup" as const);
}

export function shouldShowAppleSignIn(platform: string) {
  return platform === "ios";
}

