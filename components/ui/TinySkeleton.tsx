import { View } from "react-native";
import { useTheme } from "@/theme";

export function TinySkeleton({
  width = "100%",
  height = 20,
  radius,
  testID,
}: {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  testID?: string;
}) {
  const theme = useTheme();

  return (
    <View
      testID={testID}
      accessibilityLabel="Loading content"
      style={{
        backgroundColor: theme.color("neutral.200"),
        borderRadius: radius ?? theme.radius("pill"),
        height,
        opacity: 0.76,
        overflow: "hidden",
        width,
      }}
    />
  );
}

