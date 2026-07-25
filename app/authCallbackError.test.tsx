/* eslint-disable import/first */
const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    replace: (...args: unknown[]) => mockReplace(...args),
  },
}));

import { fireEvent, render } from "@testing-library/react-native";
import AuthCallbackErrorScreen from "./(auth)/auth-callback-error";
import { ThemeProvider } from "@/theme";

function renderScreen() {
  return render(
    <ThemeProvider>
      <AuthCallbackErrorScreen />
    </ThemeProvider>
  );
}

describe("auth callback error screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows a retry action and a link back to sign-in", async () => {
    const { findByText } = await renderScreen();

    expect(await findByText("Sign-in callback failed")).toBeTruthy();
    fireEvent.press(await findByText("Retry sign-in"));
    fireEvent.press(await findByText("Back to sign-in"));

    expect(mockReplace).toHaveBeenCalledWith("/sign-in");
    expect(mockReplace).toHaveBeenCalledTimes(2);
  });
});
