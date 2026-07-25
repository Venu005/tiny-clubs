import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack } from "expo-router";
import { Component, ReactNode } from "react";
import { Text, View } from "react-native";
import {
  CLERK_CONFIGURATION_ERROR_MESSAGE,
  resolveAuthConfig,
} from "./authConfig";
import { resolveBackendConfig } from "./backendConfig";
import { CONFIGURATION_ERROR_MESSAGE } from "./healthStatus";
import { ThemeProvider, tokens } from "@/theme";

let convexClient: ConvexReactClient | null = null;
let convexClientUrl: string | null = null;

function getConvexClient(convexUrl: string) {
  if (convexClient === null || convexClientUrl !== convexUrl) {
    convexClient = new ConvexReactClient(convexUrl, {
      unsavedChangesWarning: false,
    });
    convexClientUrl = convexUrl;
  }

  return convexClient;
}

function BackendConfigurationError() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: tokens.color.surface.canvas,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: tokens.color.neutral[950],
          marginBottom: 8,
        }}
      >
        Backend unavailable
      </Text>
      <Text style={{ fontSize: 16, color: tokens.color.neutral[600] }}>
        {CONFIGURATION_ERROR_MESSAGE}
      </Text>
    </View>
  );
}

function AuthenticationConfigurationError() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: tokens.color.surface.canvas,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: tokens.color.neutral[950],
          marginBottom: 8,
        }}
      >
        Authentication unavailable
      </Text>
      <Text style={{ fontSize: 16, color: tokens.color.neutral[600] }}>
        {CLERK_CONFIGURATION_ERROR_MESSAGE}
      </Text>
    </View>
  );
}

class BackendErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <BackendConfigurationError />;
    }

    return this.props.children;
  }
}

export function RootProviders({
  env = process.env,
}: {
  env?: Record<string, string | undefined>;
}) {
  const backendConfig = resolveBackendConfig({
    APP_ENVIRONMENT_NAME: env.APP_ENVIRONMENT_NAME,
    EXPO_PUBLIC_APP_ENVIRONMENT: env.EXPO_PUBLIC_APP_ENVIRONMENT,
    EXPO_PUBLIC_CONVEX_URL: env.EXPO_PUBLIC_CONVEX_URL,
    EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT: env.EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT,
    EXPO_PUBLIC_CONVEX_URL_STAGING: env.EXPO_PUBLIC_CONVEX_URL_STAGING,
    EXPO_PUBLIC_CONVEX_URL_PRODUCTION: env.EXPO_PUBLIC_CONVEX_URL_PRODUCTION,
  });
  const authConfig = resolveAuthConfig({
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  });

  if (backendConfig.convexUrl === null) {
    return (
      <ThemeProvider>
        <BackendConfigurationError />
      </ThemeProvider>
    );
  }

  if (!authConfig.isConfigured || authConfig.clerkPublishableKey === null) {
    return (
      <ThemeProvider>
        <AuthenticationConfigurationError />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ClerkProvider
        publishableKey={authConfig.clerkPublishableKey}
        tokenCache={tokenCache}
      >
        <BackendErrorBoundary>
          <ConvexProviderWithClerk
            client={getConvexClient(backendConfig.convexUrl)}
            useAuth={useAuth}
          >
            <Stack screenOptions={{ headerShown: false }} />
          </ConvexProviderWithClerk>
        </BackendErrorBoundary>
      </ClerkProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return <RootProviders />;
}
