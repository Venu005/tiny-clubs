/* eslint-disable import/first */
jest.mock("@clerk/expo", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAuth: jest.fn(),
}));

jest.mock("@clerk/expo/token-cache", () => ({
  tokenCache: {},
}));

jest.mock("convex/react-clerk", () => ({
  ConvexProviderWithClerk: jest.fn(
    ({ children }: { children: React.ReactNode }) => <>{children}</>
  ),
}));

jest.mock("expo-router", () => ({
  Stack: () => null,
}));

import { render } from "@testing-library/react-native";
import { RootProviders } from "./_layout";

describe("root auth provider wiring", () => {
  const configuredEnv = {
      APP_ENVIRONMENT_NAME: "development",
      EXPO_PUBLIC_APP_ENVIRONMENT: "development",
      EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_example",
      EXPO_PUBLIC_CONVEX_URL: "https://example.convex.cloud",
      EXPO_PUBLIC_CONVEX_URL_DEVELOPMENT: "https://example.convex.cloud",
    };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses the Clerk-aware Convex provider when auth is configured", async () => {
    const { ConvexProviderWithClerk } = jest.requireMock("convex/react-clerk");

    await render(<RootProviders env={configuredEnv} />);

    expect(ConvexProviderWithClerk).toHaveBeenCalled();
  });

  it("renders Clerk configuration guidance when the publishable key is missing", async () => {
    const { findByText } = await render(
      <RootProviders
        env={{ ...configuredEnv, EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: "" }}
      />
    );

    expect(await findByText("Authentication unavailable")).toBeTruthy();
    expect(
      await findByText(
        "Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your environment before starting the app."
      )
    ).toBeTruthy();
  });
});
