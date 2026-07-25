import { ReactNode, useRef, useState } from "react";
import { Pressable, Text, ViewStyle } from "react-native";
import { useTheme } from "@/theme";
import { TinyLoadingIndicator } from "./TinyLoadingIndicator";

type TinyButtonVariant = "primary" | "secondary" | "danger";

type TinyButtonProps = {
  label: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  testID?: string;
  variant?: TinyButtonVariant;
  icon?: ReactNode;
};

function getButtonColors(
  variant: TinyButtonVariant,
  disabled: boolean,
  theme: ReturnType<typeof useTheme>
) {
  if (disabled) {
    return {
      backgroundColor: theme.color("neutral.200"),
      borderColor: theme.color("neutral.200"),
      textColor: theme.color("neutral.600"),
    };
  }

  if (variant === "secondary") {
    return {
      backgroundColor: theme.color("surface.white"),
      borderColor: theme.color("brand.sky"),
      textColor: theme.color("neutral.950"),
    };
  }

  if (variant === "danger") {
    return {
      backgroundColor: theme.color("semantic.error"),
      borderColor: theme.color("semantic.error"),
      textColor: theme.color("surface.white"),
    };
  }

  return {
    backgroundColor: theme.color("brand.coral"),
    borderColor: theme.color("brand.coral"),
    textColor: theme.color("surface.white"),
  };
}

export function getTinyButtonBaseStyle(): ViewStyle {
  return {
    alignItems: "center",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  };
}

export function TinyButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  loadingLabel = "Loading",
  testID,
  variant = "primary",
  icon,
}: TinyButtonProps) {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const pendingRef = useRef(false);
  const isBusy = loading || isLoading;
  const isDisabled = disabled || isBusy;
  const colors = getButtonColors(variant, isDisabled, theme);
  const currentLabel = isBusy ? loadingLabel : label;

  async function handlePress() {
    if (disabled || pendingRef.current) {
      return;
    }

    pendingRef.current = true;
    setIsLoading(true);

    try {
      await onPress();
    } finally {
      pendingRef.current = false;
      setIsLoading(false);
    }
  }

  return (
    <Pressable
      accessibilityLabel={currentLabel}
      accessibilityRole="button"
      disabled={isDisabled}
      hitSlop={8}
      onPress={handlePress}
      testID={testID}
      style={{
        ...getTinyButtonBaseStyle(),
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
        borderRadius: theme.radius("pill"),
        gap: theme.spacing("sm"),
        paddingHorizontal: theme.spacing("lg"),
        paddingVertical: theme.spacing("sm"),
      }}
    >
      {isBusy ? (
        <TinyLoadingIndicator label={loadingLabel} />
      ) : (
        <>
          {icon}
          <Text
            allowFontScaling
            style={{
              ...theme.tokens.typography.body,
              color: colors.textColor,
              flexShrink: 1,
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
