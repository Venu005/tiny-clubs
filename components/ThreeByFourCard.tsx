import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { ThemeTokens, useTheme } from "@/theme";

export function getThreeByFourCardStyle(themeTokens: ThemeTokens): ViewStyle {
  return {
    aspectRatio: 3 / 4,
    backgroundColor: themeTokens.color.surface.white,
    borderColor: themeTokens.color.neutral[200],
    borderWidth: 1,
    borderRadius: themeTokens.radius.card,
    padding: themeTokens.spacing.lg,
    shadowColor: themeTokens.shadow.card.shadowColor,
    shadowOffset: themeTokens.shadow.card.shadowOffset,
    shadowOpacity: themeTokens.shadow.card.shadowOpacity,
    shadowRadius: themeTokens.shadow.card.shadowRadius,
    elevation: themeTokens.shadow.card.elevation,
    overflow: "hidden",
  };
}

export function ThreeByFourCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();

  return (
    <View style={[getThreeByFourCardStyle(theme.tokens), style]}>
      {children}
    </View>
  );
}
