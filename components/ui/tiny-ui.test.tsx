import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import { ThemeProvider } from "@/theme";
import {
  TinyButton,
  TinyDialog,
  TinySheet,
  TinySkeleton,
  TinyToast,
} from ".";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("Tiny UI feedback primitives", () => {
  it("shows loading and prevents repeated button taps while work is in progress", async () => {
    const onPress = jest.fn();
    const { getByTestId, getByText } = await renderWithTheme(
      <TinyButton
        label="Save club"
        loading
        loadingLabel="Saving club"
        onPress={onPress}
        testID="save-club-button"
      />
    );

    const button = getByTestId("save-club-button");

    fireEvent.press(button);
    fireEvent.press(button);

    expect(onPress).not.toHaveBeenCalled();
    expect(getByText("Saving club")).toBeTruthy();
  });

  it("renders skeleton placeholders while content is loading", async () => {
    const { getByTestId, queryByText } = await renderWithTheme(
      <>
        <TinySkeleton width={180} height={24} testID="club-title-loading" />
        {false ? <Text>Loaded club</Text> : null}
      </>
    );

    expect(getByTestId("club-title-loading")).toBeTruthy();
    expect(queryByText("Loaded club")).toBeNull();
  });

  it("shows exact error text and invokes retry actions", async () => {
    const onRetry = jest.fn();
    const { getByText } = await renderWithTheme(
      <TinyToast
        message="Network request failed: missing Convex URL"
        actionLabel="Retry"
        onAction={onRetry}
      />
    );

    expect(getByText("Network request failed: missing Convex URL")).toBeTruthy();

    fireEvent.press(getByText("Retry"));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("closes dialogs and returns focus to the triggering control", async () => {
    const triggerRef = { current: { focus: jest.fn() } };
    const onClose = jest.fn();
    const { getByText, getByTestId } = await renderWithTheme(
      <TinyDialog
        visible
        title="Delete club?"
        message="This cannot be undone."
        triggerRef={triggerRef}
        onClose={onClose}
        testID="delete-dialog"
      />
    );

    expect(getByTestId("delete-dialog-overlay")).toBeTruthy();
    expect(getByText("Delete club?")).toBeTruthy();
    expect(getByText("This cannot be undone.")).toBeTruthy();

    fireEvent.press(getByText("Close"));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(triggerRef.current.focus).toHaveBeenCalledTimes(1);
  });

  it("closes sheets and returns focus to the triggering control", async () => {
    const triggerRef = { current: { focus: jest.fn() } };
    const onClose = jest.fn();
    const { getByText, getByTestId } = await renderWithTheme(
      <TinySheet
        visible
        title="Invite friends"
        triggerRef={triggerRef}
        onClose={onClose}
        testID="invite-sheet"
      >
        <Text>Share the tiny club link.</Text>
      </TinySheet>
    );

    expect(getByTestId("invite-sheet-overlay")).toBeTruthy();
    expect(getByText("Invite friends")).toBeTruthy();
    expect(getByText("Share the tiny club link.")).toBeTruthy();

    fireEvent.press(getByText("Close"));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(triggerRef.current.focus).toHaveBeenCalledTimes(1);
  });
});
