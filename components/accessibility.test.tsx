import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { TextInput } from "react-native";
import {
  AccessibleButton,
  getAccessibleButtonStyle,
} from "./AccessibleButton";
import {
  AccessibleTextField,
  getAccessibleTextFieldStyles,
} from "./AccessibleTextField";
import {
  OnboardingAccessForm,
  focusFirstInvalidField,
  validateOnboardingFields,
} from "./OnboardingAccessForm";
import { getContrastRatio } from "@/utils/contrast";
import { ThemeProvider, tokens } from "@/theme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("accessible controls", () => {
  it("keeps button labels scalable and tap targets at least 44x44", async () => {
    const { getByText } = await renderWithTheme(
      <AccessibleButton label="Continue with email" onPress={jest.fn()} />
    );
    const label = getByText("Continue with email");
    const style = getAccessibleButtonStyle(tokens);

    expect(label.props.allowFontScaling).toBe(true);
    expect(label.props.numberOfLines).toBeUndefined();
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(style.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("keeps text fields scalable with a 44-point minimum touch target", async () => {
    const { getByLabelText, getByText } = await renderWithTheme(
      <AccessibleTextField
        label="Email"
        value=""
        onChangeText={jest.fn()}
        error="Enter a valid email"
      />
    );
    const input = getByLabelText("Email");
    const error = getByText("Enter a valid email");
    const styles = getAccessibleTextFieldStyles(tokens);

    expect(input.props.allowFontScaling).toBe(true);
    expect(error.props.allowFontScaling).toBe(true);
    expect(styles.input.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("meets WCAG AA contrast for normal text on light and dark surfaces", () => {
    expect(
      getContrastRatio(tokens.color.neutral[950], tokens.color.surface.canvas)
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      getContrastRatio(tokens.color.surface.white, tokens.color.neutral[950])
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("validates inline and focuses the first invalid field on submit", async () => {
    const displayNameRef = { current: { focus: jest.fn() } };
    const emailRef = { current: { focus: jest.fn() } };
    const { getByLabelText, getByTestId } = await renderWithTheme(
      <OnboardingAccessForm
        fieldRefs={{
          displayName: displayNameRef,
          email: emailRef,
        }}
      />
    );

    fireEvent.press(getByLabelText("Continue"));

    await waitFor(() => {
      expect(getByTestId("displayName-error")).toHaveTextContent(
        "Enter your display name."
      );
    });
    expect(displayNameRef.current.focus).toHaveBeenCalledTimes(1);
    expect(emailRef.current.focus).not.toHaveBeenCalled();
  });

  it("focus helper targets the first invalid field", () => {
    const displayNameRef = { current: { focus: jest.fn() } };
    const emailRef = { current: { focus: jest.fn() } };

    focusFirstInvalidField(
      validateOnboardingFields({ displayName: "", email: "bad" }),
      { displayName: displayNameRef, email: emailRef }
    );

    expect(displayNameRef.current.focus).toHaveBeenCalledTimes(1);
    expect(emailRef.current.focus).not.toHaveBeenCalled();
  });

  it("accepts real TextInput refs for fields", async () => {
    const fieldRef = { current: null as TextInput | null };

    await renderWithTheme(
      <AccessibleTextField
        ref={fieldRef}
        label="Display name"
        value=""
        onChangeText={jest.fn()}
      />
    );

    expect(fieldRef.current).not.toBeNull();
  });
});
