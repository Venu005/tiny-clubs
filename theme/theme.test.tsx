import { render } from "@testing-library/react-native";
import { Text } from "react-native";
import { getThreeByFourCardStyle } from "@/components/ThreeByFourCard";
import { ThemeProvider, getToken, tokens, useTheme } from "./index";

function ThemeProbe() {
  const theme = useTheme();

  return (
    <Text testID="theme-probe">
      {[
        theme.color("brand.coral"),
        theme.typography("body.fontSize"),
        theme.spacing("md"),
        theme.radius("card"),
        theme.shadow("card").elevation,
        theme.motion("quick").duration,
      ].join("|")}
    </Text>
  );
}

describe("theme layer", () => {
  it("provides color, typography, spacing, radius, shadow, and motion through one theme API", async () => {
    const { getByTestId } = await render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(getByTestId("theme-probe")).toHaveTextContent(
      "#FF6B5E|16|16|20|3|160"
    );
  });

  it("preserves a 3:4 card aspect ratio and applies token values", () => {
    const style = getThreeByFourCardStyle(tokens);

    expect(style).toMatchObject({
      aspectRatio: 3 / 4,
      padding: tokens.spacing.lg,
      borderRadius: tokens.radius.card,
      shadowColor: tokens.shadow.card.shadowColor,
      shadowOpacity: tokens.shadow.card.shadowOpacity,
      elevation: tokens.shadow.card.elevation,
    });
  });

  it("updates consuming card styles when token values change", () => {
    const changedTokens = {
      ...tokens,
      spacing: {
        ...tokens.spacing,
        lg: 28,
      },
      radius: {
        ...tokens.radius,
        card: 24,
      },
    };

    expect(getThreeByFourCardStyle(changedTokens)).toMatchObject({
      padding: 28,
      borderRadius: 24,
    });
  });

  it("throws a clear development error for missing token keys", () => {
    expect(() => getToken(tokens, "color.brand.missing")).toThrow(
      'Missing theme token "color.brand.missing"'
    );
  });
});
