export const CLERK_CONFIGURATION_ERROR_MESSAGE =
  "Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your environment before starting the app.";

export type AuthConfig = {
  clerkPublishableKey: string | null;
  isConfigured: boolean;
  message: string | null;
};

function readEnvValue(value: string | undefined) {
  return value && value.trim().length > 0 ? value.trim() : null;
}

export function resolveAuthConfig(
  env: Record<string, string | undefined>
): AuthConfig {
  const clerkPublishableKey = readEnvValue(
    env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
  );

  if (clerkPublishableKey === null) {
    return {
      clerkPublishableKey: null,
      isConfigured: false,
      message: CLERK_CONFIGURATION_ERROR_MESSAGE,
    };
  }

  return {
    clerkPublishableKey,
    isConfigured: true,
    message: null,
  };
}
