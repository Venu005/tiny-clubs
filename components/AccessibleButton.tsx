import { Pressable, Text, ViewStyle } from "react-native";
import { ThemeTokens, useTheme } from "@/theme";

export function getAccessibleButtonStyle(tokens: ThemeTokens): ViewStyle {
  return {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.pill,
  };
}

export function AccessibleButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      style={{
        ...getAccessibleButtonStyle(theme.tokens),
        backgroundColor: disabled
          ? theme.color("neutral.400")
          : theme.color("brand.coral"),
      }}
    >
      <Text
        allowFontScaling
        style={{
          ...theme.tokens.typography.body,
          color: theme.color("surface.white"),
          flexShrink: 1,
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
