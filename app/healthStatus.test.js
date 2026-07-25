const { getHealthDisplayState } = require("./healthStatus");

describe("healthStatus", () => {
  it("renders the environment name from a returned health response", () => {
    expect(getHealthDisplayState({ environmentName: "preview" }, true)).toEqual({
      kind: "ready",
      label: "Environment: preview",
    });
  });

  it("shows a configuration error when backend configuration is missing", () => {
    expect(getHealthDisplayState(undefined, false)).toEqual({
      kind: "error",
      title: "Backend unavailable",
      message: "Unable to reach backend. Check Convex configuration.",
    });
  });
});
