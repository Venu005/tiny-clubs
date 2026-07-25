import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { TinyButton } from "@/components/ui";
import { useTheme } from "@/theme";

export default function AuthCallbackErrorScreen() {
  const theme = useTheme();

  function returnToSignIn() {
    router.replace("/sign-in");
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.color("surface.canvas") }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: theme.spacing("lg"),
      }}
    >
      <View
        style={{
          backgroundColor: theme.color("surface.white"),
          borderColor: theme.color("semantic.error"),
          borderRadius: theme.radius("card"),
          borderWidth: 1,
          gap: theme.spacing("md"),
          padding: theme.spacing("lg"),
        }}
      >
        <Text
          allowFontScaling
          style={{
            ...theme.tokens.typography.h1,
            color: theme.color("neutral.950"),
          }}
        >
          Sign-in callback failed
        </Text>
        <Text
          allowFontScaling
          style={{
            ...theme.tokens.typography.body,
            color: theme.color("neutral.600"),
          }}
        >
          We could not finish the provider callback. Try signing in again, and
          check the redirect configuration if this keeps happening.
        </Text>
        <TinyButton label="Retry sign-in" onPress={returnToSignIn} />
        <TinyButton
          label="Back to sign-in"
          onPress={returnToSignIn}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}
