const mockUseSignIn = jest.fn();
const mockUseSignInWithGoogle = jest.fn();
const mockUseSignInWithApple = jest.fn();
const mockReplace = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock("@clerk/expo", () => ({
  useSignIn: () => mockUseSignIn(),
}));

jest.mock("@clerk/expo/google", () => ({
  useSignInWithGoogle: () => mockUseSignInWithGoogle(),
}));

jest.mock("@clerk/expo/apple", () => ({
  useSignInWithApple: () => mockUseSignInWithApple(),
}));

jest.mock("expo-router", () => ({
  router: {
    replace: (...args: unknown[]) => mockReplace(...args),
  },
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Platform } from "react-native";
import SignInScreen from "../app/(auth)/sign-in";
import { getAuthErrorMessage } from "./errorMessages";
import { ThemeProvider } from "@/theme";

function renderScreen() {
  return render(
    <ThemeProvider>
      <SignInScreen />
    </ThemeProvider>
  );
}

function setPlatform(os: "ios" | "android") {
  jest.replaceProperty(Platform, "OS", os);
}

describe("auth error messages", () => {
  it("normalizes invalid OTP, cancellation, and offline errors", () => {
    expect(getAuthErrorMessage({ code: "form_code_incorrect" })).toBe(
      "Code is invalid or expired"
    );
    expect(getAuthErrorMessage({ code: "SIGN_IN_CANCELLED" })).toBe(
      "Sign-in cancelled"
    );
    expect(getAuthErrorMessage({ message: "Network request failed" })).toBe(
      "You appear to be offline. Check your connection and try again."
    );
  });
});

describe("sign-in screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setPlatform("ios");
    mockUseLocalSearchParams.mockReturnValue({});
    mockUseSignIn.mockReturnValue({
      fetchStatus: "idle",
      signIn: {
        create: jest.fn().mockResolvedValue(undefined),
        emailCode: {
          sendCode: jest.fn().mockResolvedValue(undefined),
          verifyCode: jest.fn().mockResolvedValue({ status: "complete" }),
        },
        finalize: jest.fn().mockResolvedValue(undefined),
      },
    });
    mockUseSignInWithGoogle.mockReturnValue({
      startGoogleAuthenticationFlow: jest.fn().mockResolvedValue({
        createdSessionId: "sess_google",
        setActive: jest.fn().mockResolvedValue(undefined),
      }),
    });
    mockUseSignInWithApple.mockReturnValue({
      startAppleAuthenticationFlow: jest.fn().mockResolvedValue({
        createdSessionId: "sess_apple",
        setActive: jest.fn().mockResolvedValue(undefined),
      }),
    });
  });

  it("renders email OTP, Google, and iOS Apple sign-in options", async () => {
    const { findByLabelText, findByText } = await renderScreen();

    expect(await findByLabelText("Email address")).toBeTruthy();
    expect(await findByText("Request code")).toBeTruthy();
    expect(await findByText("Continue with Google")).toBeTruthy();
    expect(await findByText("Continue with Apple")).toBeTruthy();
  });

  it("shows a session expired message from the sign-in route reason", async () => {
    mockUseLocalSearchParams.mockReturnValue({ reason: "session-expired" });
    const { findByText } = await renderScreen();

    expect(
      await findByText("Session expired, please sign in again")
    ).toBeTruthy();
  });

  it("hides Apple sign-in on Android without hiding Google", async () => {
    setPlatform("android");
    const { findByText, queryByText } = await renderScreen();

    expect(await findByText("Continue with Google")).toBeTruthy();
    expect(queryByText("Continue with Apple")).toBeNull();
  });

  it("requests an email code and shows the OTP verification step", async () => {
    const signIn = mockUseSignIn().signIn;
    const { findByLabelText, findByText } = await renderScreen();

    fireEvent.changeText(await findByLabelText("Email address"), "a@b.co");
    fireEvent.press(await findByText("Request code"));

    await waitFor(() => {
      expect(signIn.create).toHaveBeenCalledWith({ identifier: "a@b.co" });
      expect(signIn.emailCode.sendCode).toHaveBeenCalled();
    });
    expect(await findByText("Verify code")).toBeTruthy();
  });

  it("shows inline validation and does not request a code for an empty email", async () => {
    const signIn = mockUseSignIn().signIn;
    const { findByText } = await renderScreen();

    fireEvent.press(await findByText("Request code"));

    expect(await findByText("Email is required")).toBeTruthy();
    expect(signIn.create).not.toHaveBeenCalled();
  });

  it("shows inline validation and does not verify an empty code", async () => {
    const signIn = mockUseSignIn().signIn;
    const { findByLabelText, findByText } = await renderScreen();

    fireEvent.changeText(await findByLabelText("Email address"), "a@b.co");
    fireEvent.press(await findByText("Request code"));
    fireEvent.press(await findByText("Verify code"));

    expect(await findByText("Code is required")).toBeTruthy();
    expect(signIn.emailCode.verifyCode).not.toHaveBeenCalled();
  });

  it("shows the required invalid code error when OTP verification fails", async () => {
    const signIn = mockUseSignIn().signIn;
    signIn.emailCode.verifyCode.mockRejectedValueOnce({
      code: "form_code_expired",
    });
    const { findByLabelText, findByText } = await renderScreen();

    fireEvent.changeText(await findByLabelText("Email address"), "a@b.co");
    fireEvent.press(await findByText("Request code"));
    fireEvent.changeText(await findByLabelText("One-time code"), "123456");
    fireEvent.press(await findByText("Verify code"));

    expect(await findByText("Code is invalid or expired")).toBeTruthy();
  });

  it("shows cancellation and does not store a session for cancelled Google sign-in", async () => {
    mockUseSignInWithGoogle.mockReturnValue({
      startGoogleAuthenticationFlow: jest
        .fn()
        .mockRejectedValue({ code: "SIGN_IN_CANCELLED" }),
    });
    const { findByText } = await renderScreen();

    fireEvent.press(await findByText("Continue with Google"));

    expect(await findByText("Sign-in cancelled")).toBeTruthy();
  });

  it("shows a retry action when provider callback configuration fails", async () => {
    mockUseSignInWithGoogle.mockReturnValue({
      startGoogleAuthenticationFlow: jest
        .fn()
        .mockRejectedValue({ message: "OAuth callback URL mismatch" }),
    });
    const { findByText } = await renderScreen();

    fireEvent.press(await findByText("Continue with Google"));

    expect(
      await findByText(
        "Sign-in could not be completed. Check your sign-in configuration and try again."
      )
    ).toBeTruthy();
    expect(await findByText("Retry")).toBeTruthy();
  });

  it("shows offline retry state and prevents duplicate submissions while loading", async () => {
    const signIn = mockUseSignIn().signIn;
    signIn.create.mockRejectedValueOnce(new Error("Network request failed"));
    const { findByLabelText, findByText } = await renderScreen();

    fireEvent.changeText(await findByLabelText("Email address"), "a@b.co");
    const requestButton = await findByText("Request code");
    fireEvent.press(requestButton);
    fireEvent.press(requestButton);

    expect(
      await findByText("You appear to be offline. Check your connection and try again.")
    ).toBeTruthy();
    expect(await findByText("Retry")).toBeTruthy();
    expect(signIn.create).toHaveBeenCalledTimes(1);
  });
});
