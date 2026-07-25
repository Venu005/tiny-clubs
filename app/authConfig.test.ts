import { resolveAuthConfig } from "./authConfig";

describe("auth config", () => {
  it("returns setup guidance when the Clerk publishable key is missing", () => {
    expect(resolveAuthConfig({})).toEqual({
      clerkPublishableKey: null,
      isConfigured: false,
      message:
        "Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your environment before starting the app.",
    });
  });

  it("returns configured Clerk public values when present", () => {
    expect(
      resolveAuthConfig({
        EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_example",
        CLERK_JWT_ISSUER_DOMAIN: "https://tiny-clubs.clerk.accounts.dev",
      })
    ).toEqual({
      clerkPublishableKey: "pk_test_example",
      isConfigured: true,
      message: null,
    });
  });
});
