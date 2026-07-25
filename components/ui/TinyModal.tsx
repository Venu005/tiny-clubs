import { ReactNode } from "react";
import { Modal, Pressable, View, ViewStyle } from "react-native";
import { useTheme } from "@/theme";

export type FocusableRef = {
  current: { focus: () => void } | null;
};

export function focusTrigger(triggerRef?: FocusableRef) {
  triggerRef?.current?.focus();
}

export function TinyModal({
  visible,
  children,
  onClose,
  triggerRef,
  placement,
  testID,
}: {
  visible: boolean;
  children: ReactNode;
  onClose: () => void;
  triggerRef?: FocusableRef;
  placement: "center" | "bottom";
  testID?: string;
}) {
  const theme = useTheme();
  const contentPlacement: ViewStyle =
    placement === "center"
      ? {
          justifyContent: "center",
          padding: theme.spacing("lg"),
        }
      : {
          justifyContent: "flex-end",
        };

  function close() {
    onClose();
    focusTrigger(triggerRef);
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={close}
      transparent
      visible={visible}
    >
      <View
        testID={testID ? `${testID}-overlay` : undefined}
        style={{
          ...contentPlacement,
          backgroundColor: "rgba(31, 37, 41, 0.44)",
          flex: 1,
        }}
      >
        <Pressable
          accessibilityLabel="Close modal backdrop"
          accessibilityRole="button"
          onPress={close}
          style={{
            bottom: 0,
            left: 0,
            position: "absolute",
            right: 0,
            top: 0,
          }}
        />
        {children}
      </View>
    </Modal>
  );
}

