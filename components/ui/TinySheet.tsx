import { ReactNode } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/theme";
import { TinyButton } from "./TinyButton";
import { FocusableRef, TinyModal, focusTrigger } from "./TinyModal";

export function TinySheet({
  visible,
  title,
  triggerRef,
  onClose,
  children,
  testID,
}: {
  visible: boolean;
  title: string;
  triggerRef?: FocusableRef;
  onClose: () => void;
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
      placement="bottom"
      testID={testID}
    >
      <View
        testID={testID}
        style={{
          backgroundColor: theme.color("surface.white"),
          borderTopLeftRadius: theme.radius("card"),
          borderTopRightRadius: theme.radius("card"),
          gap: theme.spacing("md"),
          maxHeight: "86%",
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
        {children}
        <TinyButton label="Close" variant="secondary" onPress={close} />
      </View>
    </TinyModal>
  );
}
