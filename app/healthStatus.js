const CONFIGURATION_ERROR_MESSAGE =
  "Unable to reach backend. Check Convex configuration.";

function getHealthDisplayState(health, hasBackendConfig) {
  if (!hasBackendConfig) {
    return {
      kind: "error",
      title: "Backend unavailable",
      message: CONFIGURATION_ERROR_MESSAGE,
    };
  }

  if (health === undefined) {
    return {
      kind: "loading",
      label: "Checking backend...",
    };
  }

  return {
    kind: "ready",
    label: `Environment: ${health.environmentName}`,
  };
}

module.exports = {
  CONFIGURATION_ERROR_MESSAGE,
  getHealthDisplayState,
};
