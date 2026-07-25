import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { Component, ReactNode } from "react";
import { Text, View } from "react-native";
import { resolveBackendConfig } from "./backendConfig";
import { CONFIGURATION_ERROR_MESSAGE } from "./healthStatus";

const backendConfig = resolveBackendConfig({
  APP_ENVIRONMENT_NAME: process.env.APP_ENVIRONMENT_NAME,
  EXPO_PUBLIC_APP_ENVIRONMENT: process.env.EXPO_PUBLIC_APP_ENVIRONMENT,
  EXPO_PUBLIC_CONVEX_URL: process.env.EXPO_PUBLIC_CONVEX_URL,
  EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT:
    process.env.EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT,
  EXPO_PUBLIC_CONVEX_URL_STAGING: process.env.EXPO_PUBLIC_CONVEX_URL_STAGING,
  EXPO_PUBLIC_CONVEX_URL_PRODUCTION:
    process.env.EXPO_PUBLIC_CONVEX_URL_PRODUCTION,
});

function BackendConfigurationError() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: "#333",
          marginBottom: 8,
        }}
      >
        Backend unavailable
      </Text>
      <Text style={{ fontSize: 16, color: "#666" }}>
        {CONFIGURATION_ERROR_MESSAGE}
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

const convex =
  backendConfig.convexUrl === null
    ? null
    : new ConvexReactClient(backendConfig.convexUrl, {
        unsavedChangesWarning: false,
      });

export default function RootLayout() {
  if (convex === null) {
    return <BackendConfigurationError />;
  }

  return (
    <BackendErrorBoundary>
      <ConvexProvider client={convex}>
        <Stack screenOptions={{ headerShown: false }} />
      </ConvexProvider>
    </BackendErrorBoundary>
  );
}
