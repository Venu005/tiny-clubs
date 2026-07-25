const assert = require("node:assert/strict");
const test = require("node:test");

const { resolveBackendConfig } = require("./backendConfig");

test("uses development Convex config for the development profile", () => {
  assert.deepEqual(
    resolveBackendConfig({
      EXPO_PUBLIC_APP_ENVIRONMENT: "development",
      EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT: "https://dev.example.convex.cloud",
    }),
    {
      environmentName: "development",
      convexUrl: "https://dev.example.convex.cloud",
    }
  );
});

test("uses staging Convex config for the staging profile", () => {
  assert.deepEqual(
    resolveBackendConfig({
      EXPO_PUBLIC_APP_ENVIRONMENT: "staging",
      EXPO_PUBLIC_CONVEX_URL_STAGING:
        "https://staging.example.convex.cloud",
    }),
    {
      environmentName: "staging",
      convexUrl: "https://staging.example.convex.cloud",
    }
  );
});

test("uses production Convex config for the production profile", () => {
  assert.deepEqual(
    resolveBackendConfig({
      EXPO_PUBLIC_APP_ENVIRONMENT: "production",
      EXPO_PUBLIC_CONVEX_URL_PRODUCTION:
        "https://prod.example.convex.cloud",
    }),
    {
      environmentName: "production",
      convexUrl: "https://prod.example.convex.cloud",
    }
  );
});

test("does not require production Convex config for a development build", () => {
  assert.deepEqual(
    resolveBackendConfig({
      EXPO_PUBLIC_APP_ENVIRONMENT: "development",
      EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT: "https://dev.example.convex.cloud",
      EXPO_PUBLIC_CONVEX_URL_PRODUCTION: "",
    }),
    {
      environmentName: "development",
      convexUrl: "https://dev.example.convex.cloud",
    }
  );
});
