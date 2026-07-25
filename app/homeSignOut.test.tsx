/* eslint-disable import/first */
const mockSignOut = jest.fn();
const mockReplace = jest.fn();
const mockUseQuery = jest.fn();
const mockUseMutation = jest.fn();

jest.mock("@clerk/expo", () => ({
  useAuth: () => ({ signOut: mockSignOut }),
}));

jest.mock("convex/react", () => ({
  useMutation: (...args: unknown[]) => mockUseMutation(...args),
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
}));

jest.mock("expo-router", () => ({
  router: {
    replace: (...args: unknown[]) => mockReplace(...args),
  },
}));

import { fireEvent, render, waitFor } from "@testing-library/react-native";
import HomeScreen from "./(app)/index";
import { ThemeProvider } from "@/theme";

function renderScreen() {
  return render(
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
}

describe("home sign-out", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignOut.mockResolvedValue(undefined);
    mockUseMutation.mockReturnValue(jest.fn());
    mockUseQuery.mockImplementation((_apiFunction: unknown) => {
      if (mockUseQuery.mock.calls.length === 1) {
        return { environmentName: "development" };
      }

      return [];
    });
  });

  it("clears the Clerk session and returns to sign-in after confirmation", async () => {
    const { findByText } = await renderScreen();

    fireEvent.press(await findByText("Sign out"));
    fireEvent.press(await findByText("Confirm sign-out"));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith("/sign-in");
    });
  });
});
