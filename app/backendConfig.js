const PROFILE_NAMES = ["development", "staging", "production"];

function normalizeProfileName(value) {
  return PROFILE_NAMES.includes(value) ? value : "development";
}

function getProfileConvexUrl(env, profileName) {
  switch (profileName) {
    case "production":
      return env.EXPO_PUBLIC_CONVEX_URL_PRODUCTION;
    case "staging":
      return env.EXPO_PUBLIC_CONVEX_URL_STAGING;
    default:
      return (
        env.EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT ?? env.EXPO_PUBLIC_CONVEX_URL
      );
  }
}

function resolveBackendConfig(env) {
  const environmentName = normalizeProfileName(
    env.EXPO_PUBLIC_APP_ENVIRONMENT ?? env.APP_ENVIRONMENT_NAME
  );
  const convexUrl = getProfileConvexUrl(env, environmentName);

  if (!convexUrl) {
    return {
      environmentName,
      convexUrl: null,
    };
  }

  return {
    environmentName,
    convexUrl,
  };
}

module.exports = {
  PROFILE_NAMES,
  resolveBackendConfig,
};
