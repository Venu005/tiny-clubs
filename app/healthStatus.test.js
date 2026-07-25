const assert = require("node:assert/strict");
const test = require("node:test");

const {
  getHealthDisplayState,
} = require("./healthStatus");

test("renders the environment name from a returned health response", () => {
  assert.deepEqual(
    getHealthDisplayState({ environmentName: "preview" }, true),
    {
      kind: "ready",
      label: "Environment: preview",
    }
  );
});

test("shows a configuration error when backend configuration is missing", () => {
  assert.deepEqual(getHealthDisplayState(undefined, false), {
    kind: "error",
    title: "Backend unavailable",
    message: "Unable to reach backend. Check Convex configuration.",
  });
});
