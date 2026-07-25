import { ReactNode } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/theme";
import { TinyButton } from "./TinyButton";
import { FocusableRef, TinyModal, focusTrigger } from "./TinyModal";

type DialogAction = {
  label: string;
  onPress: () => void | Promise<void>;
};

export function TinyDialog({
  visible,
  title,
  message,
  triggerRef,
  onClose,
  primaryAction,
  children,
  testID,
}: {
  visible: boolean;
  title: string;
  message?: string;
  triggerRef?: FocusableRef;
  onClose: () => void;
  primaryAction?: DialogAction;
  children?: ReactNode;
  testID?: string;
}) {
  const theme = useTheme();

  function close() {
    onClose();
    focusTrigger(triggerRef);
  }

  return (
    <TinyModal
      visible={visible}
      onClose={onClose}
      triggerRef={triggerRef}
      placement="center"
      testID={testID}
    >
      <View
        testID={testID}
        style={{
          backgroundColor: theme.color("surface.white"),
          borderColor: theme.color("brand.sun"),
          borderRadius: theme.radius("card"),
          borderWidth: 2,
          gap: theme.spacing("md"),
          padding: theme.spacing("lg"),
          ...theme.shadow("card"),
        }}
      >
        <Text
          allowFontScaling
          accessibilityRole="header"
          style={{
            ...theme.tokens.typography.h2,
            color: theme.color("neutral.950"),
          }}
        >
          {title}
        </Text>
        {message ? (
          <Text
            allowFontScaling
            style={{
              ...theme.tokens.typography.body,
              color: theme.color("neutral.600"),
            }}
          >
            {message}
          </Text>
        ) : null}
        {children}
        <View style={{ gap: theme.spacing("sm") }}>
          {primaryAction ? (
            <TinyButton label={primaryAction.label} onPress={primaryAction.onPress} />
          ) : null}
          <TinyButton label="Close" variant="secondary" onPress={close} />
        </View>
      </View>
    </TinyModal>
  );
}
