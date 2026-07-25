const { resolveBackendConfig } = require("./backendConfig");

describe("backendConfig", () => {
  it("uses development Convex config for the development profile", () => {
    expect(
      resolveBackendConfig({
        EXPO_PUBLIC_APP_ENVIRONMENT: "development",
        EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT: "https://dev.example.convex.cloud",
      })
    ).toEqual({
      environmentName: "development",
      convexUrl: "https://dev.example.convex.cloud",
    });
  });

  it("uses staging Convex config for the staging profile", () => {
    expect(
      resolveBackendConfig({
        EXPO_PUBLIC_APP_ENVIRONMENT: "staging",
        EXPO_PUBLIC_CONVEX_URL_STAGING: "https://staging.example.convex.cloud",
      })
    ).toEqual({
      environmentName: "staging",
      convexUrl: "https://staging.example.convex.cloud",
    });
  });

  it("uses production Convex config for the production profile", () => {
    expect(
      resolveBackendConfig({
        EXPO_PUBLIC_APP_ENVIRONMENT: "production",
        EXPO_PUBLIC_CONVEX_URL_PRODUCTION: "https://prod.example.convex.cloud",
      })
    ).toEqual({
      environmentName: "production",
      convexUrl: "https://prod.example.convex.cloud",
    });
  });

  it("does not require production Convex config for a development build", () => {
    expect(
      resolveBackendConfig({
        EXPO_PUBLIC_APP_ENVIRONMENT: "development",
        EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT: "https://dev.example.convex.cloud",
        EXPO_PUBLIC_CONVEX_URL_PRODUCTION: "",
      })
    ).toEqual({
      environmentName: "development",
      convexUrl: "https://dev.example.convex.cloud",
    });
  });
});
