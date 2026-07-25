const assert = require("node:assert/strict");
const test = require("node:test");

const easConfig = require("./eas.json");

test("EAS build profiles select isolated service environments", () => {
  assert.equal(easConfig.build.development.environment, "development");
  assert.equal(
    easConfig.build.development.env.EXPO_PUBLIC_APP_ENVIRONMENT,
    "development"
  );

  assert.equal(easConfig.build.staging.environment, "staging");
  assert.equal(easConfig.build.staging.env.EXPO_PUBLIC_APP_ENVIRONMENT, "staging");

  assert.equal(easConfig.build.production.environment, "production");
  assert.equal(
    easConfig.build.production.env.EXPO_PUBLIC_APP_ENVIRONMENT,
    "production"
  );
});
