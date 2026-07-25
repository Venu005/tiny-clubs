import {
  getAuthenticatedDestination,
  getSignedOutDestination,
  shouldShowAppleSignIn,
} from "./routeDecision";

describe("auth route decisions", () => {
  it("routes incomplete profiles to profile setup", () => {
    expect(getAuthenticatedDestination({ isComplete: false })).toBe(
      "/profile-setup"
    );
  });

  it("routes complete profiles to the main app", () => {
    expect(getAuthenticatedDestination({ isComplete: true })).toBe("/");
  });

  it("keeps signed-out users on sign-in", () => {
    expect(getSignedOutDestination()).toBe("/sign-in");
  });

  it("shows Apple sign-in on iOS only", () => {
    expect(shouldShowAppleSignIn("ios")).toBe(true);
    expect(shouldShowAppleSignIn("android")).toBe(false);
    expect(shouldShowAppleSignIn("web")).toBe(false);
  });
});

