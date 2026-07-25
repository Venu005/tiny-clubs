import { forwardRef } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { ThemeTokens, useTheme } from "@/theme";

export function getAccessibleTextFieldStyles(tokens: ThemeTokens): {
  container: ViewStyle;
  label: TextStyle;
  input: TextStyle;
  error: TextStyle;
} {
  return {
    container: {
      gap: tokens.spacing.xs,
      marginBottom: tokens.spacing.md,
    },
    label: {
      ...tokens.typography.bodySmall,
      color: tokens.color.neutral[950],
      fontWeight: "700",
    },
    input: {
      ...tokens.typography.body,
      borderColor: tokens.color.neutral[400],
      borderRadius: tokens.radius.md,
      borderWidth: 1,
      color: tokens.color.neutral[950],
      minHeight: 44,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
    },
    error: {
      ...tokens.typography.bodySmall,
      color: tokens.color.semantic.error,
      fontWeight: "600",
    },
  };
}

export const AccessibleTextField = forwardRef<
  TextInput,
  TextInputProps & {
    label: string;
    error?: string;
  }
>(function AccessibleTextField({ label, error, ...inputProps }, ref) {
  const theme = useTheme();
  const styles = getAccessibleTextFieldStyles(theme.tokens);

  return (
    <View style={styles.container}>
      <Text allowFontScaling style={styles.label}>
        {label}
      </Text>
      <TextInput
        ref={ref}
        accessibilityHint={error}
        accessibilityLabel={label}
        allowFontScaling
        placeholderTextColor={theme.color("neutral.600")}
        style={[
          styles.input,
          error
            ? {
                borderColor: theme.color("semantic.error"),
              }
            : null,
        ]}
        {...inputProps}
      />
      {error ? (
        <Text
          allowFontScaling
          testID={`${inputProps.testID}-error`}
          style={styles.error}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
});
