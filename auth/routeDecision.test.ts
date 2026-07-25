import {
  getAuthenticatedDestination,
  getSignedOutDestination,
  getSignedOutMessage,
  shouldShowAppleSignIn,
} from "./routeDecision";

describe("auth route decisions", () => {
  it("routes incomplete profiles to profile setup", () => {
    expect(getAuthenticatedDestination({ isComplete: false })).toBe(
      "/profile-setup"
    );
  });

  it("routes complete profiles to the main app", () => {
    expect(
      getAuthenticatedDestination({
        isComplete: true,
        username: "tinyfriend",
      })
    ).toBe("/");
  });

  it("keeps signed-out users on sign-in", () => {
    expect(getSignedOutDestination()).toBe("/sign-in");
  });

  it("can route expired sessions to sign-in with a recoverable message", () => {
    expect(getSignedOutDestination("session-expired")).toBe(
      "/sign-in?reason=session-expired"
    );
    expect(getSignedOutMessage("session-expired")).toBe(
      "Session expired, please sign in again"
    );
  });

  it("shows Apple sign-in on iOS only", () => {
    expect(shouldShowAppleSignIn("ios")).toBe(true);
    expect(shouldShowAppleSignIn("android")).toBe(false);
    expect(shouldShowAppleSignIn("web")).toBe(false);
  });
});
