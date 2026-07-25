/* eslint-disable import/first */
const mockUseMutation = jest.fn();
const mockReplace = jest.fn();
const mockRequestMediaLibraryPermissionsAsync = jest.fn();
const mockLaunchImageLibraryAsync = jest.fn();

jest.mock("convex/react", () => ({
  useMutation: () => mockUseMutation(),
}));

jest.mock("expo-router", () => ({
  router: {
    replace: (...args: unknown[]) => mockReplace(...args),
  },
}));

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: (...args: unknown[]) =>
    mockLaunchImageLibraryAsync(...args),
  requestMediaLibraryPermissionsAsync: (...args: unknown[]) =>
    mockRequestMediaLibraryPermissionsAsync(...args),
}), { virtual: true });

import { fireEvent, render, waitFor } from "@testing-library/react-native";
import ProfileSetupScreen from "./(app)/profile-setup";
import { ThemeProvider } from "@/theme";

function renderScreen() {
  return render(
    <ThemeProvider>
      <ProfileSetupScreen />
    </ThemeProvider>
  );
}

describe("profile setup screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMutation.mockReturnValue(jest.fn().mockResolvedValue({ isComplete: true }));
    mockRequestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: true });
    mockLaunchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file:///tiny-avatar.jpg" }],
    });
  });

  it("shows validation and does not save an empty required display name", async () => {
    const completeSetup = jest.fn().mockResolvedValue({ isComplete: true });
    mockUseMutation.mockReturnValue(completeSetup);
    const { findByText } = await renderScreen();

    fireEvent.press(await findByText("Save profile"));

    expect(await findByText("Display name is required")).toBeTruthy();
    expect(completeSetup).not.toHaveBeenCalled();
  });

  it("shows a specific server error with a retry action during profile setup", async () => {
    const completeSetup = jest
      .fn()
      .mockRejectedValueOnce(new Error("Display name is already taken"))
      .mockResolvedValueOnce({ isComplete: true });
    mockUseMutation.mockReturnValue(completeSetup);
    const { findByLabelText, findByText } = await renderScreen();

    fireEvent.changeText(await findByLabelText("Display name"), "Tiny Captain");
    fireEvent.press(await findByText("Save profile"));

    expect(await findByText("Display name is already taken")).toBeTruthy();
    fireEvent.press(await findByText("Retry"));

    await waitFor(() => {
      expect(completeSetup).toHaveBeenCalledTimes(2);
      expect(mockReplace).toHaveBeenCalledWith("/");
    });
  });

  it("explains denied photo permission and allows continuing without a photo", async () => {
    mockRequestMediaLibraryPermissionsAsync.mockResolvedValueOnce({
      granted: false,
    });
    const { findByText, queryByText } = await renderScreen();

    fireEvent.press(await findByText("Add profile photo"));

    expect(
      await findByText(
        "Photo access was denied. You can still finish setup without a photo."
      )
    ).toBeTruthy();
    expect(await findByText("Continue without photo")).toBeTruthy();

    fireEvent.press(await findByText("Continue without photo"));

    await waitFor(() => {
      expect(
        queryByText(
          "Photo access was denied. You can still finish setup without a photo."
        )
      ).toBeNull();
    });
  });
});
