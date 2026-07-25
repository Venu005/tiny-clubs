import { ActivityIndicator, Text, View } from "react-native";
import { useTheme } from "@/theme";

export function TinyLoadingIndicator({
  label = "Loading",
  testID,
}: {
  label?: string;
  testID?: string;
}) {
  const theme = useTheme();

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      style={{
        alignItems: "center",
        flexDirection: "row",
        gap: theme.spacing("sm"),
      }}
    >
      <ActivityIndicator color={theme.color("brand.coral")} />
      <Text
        allowFontScaling
        style={{
          ...theme.tokens.typography.bodySmall,
          color: theme.color("neutral.600"),
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

