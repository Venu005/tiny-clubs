import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/theme";

export function TinyToast({
  message,
  actionLabel,
  onAction,
  testID,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
}) {
  const theme = useTheme();

  return (
    <View
      testID={testID}
      accessibilityRole="alert"
      style={{
        alignItems: "center",
        backgroundColor: theme.color("surface.tint"),
        borderColor: theme.color("semantic.error"),
        borderRadius: theme.radius("card"),
        borderWidth: 1,
        flexDirection: "row",
        gap: theme.spacing("md"),
        padding: theme.spacing("md"),
      }}
    >
      <Text
        allowFontScaling
        style={{
          ...theme.tokens.typography.bodySmall,
          color: theme.color("neutral.950"),
          flex: 1,
          fontWeight: "700",
        }}
      >
        {message}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityLabel={actionLabel}
          accessibilityRole="button"
          hitSlop={8}
          onPress={onAction}
          style={{
            alignItems: "center",
            justifyContent: "center",
            minHeight: 44,
            minWidth: 44,
            paddingHorizontal: theme.spacing("sm"),
          }}
        >
          <Text
            allowFontScaling
            style={{
              ...theme.tokens.typography.bodySmall,
              color: theme.color("semantic.error"),
              fontWeight: "800",
            }}
          >
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

