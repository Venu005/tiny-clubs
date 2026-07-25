import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { TinyButton, TinyToast } from "@/components/ui";
import { useTheme } from "@/theme";

export default function ProfileSetupScreen() {
  const theme = useTheme();
  const completeSetup = useMutation(api.profiles.completeSetup);
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    setError(null);
    setIsSubmitting(true);

    try {
      await completeSetup({ displayName });
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save profile");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View
      style={{
        backgroundColor: theme.color("surface.canvas"),
        flex: 1,
        justifyContent: "center",
        padding: theme.spacing("lg"),
      }}
    >
      <Text
        allowFontScaling
        style={{
          ...theme.tokens.typography.h1,
          color: theme.color("neutral.950"),
          marginBottom: theme.spacing("sm"),
        }}
      >
        Set up your profile
      </Text>
      <Text
        allowFontScaling
        style={{
          ...theme.tokens.typography.body,
          color: theme.color("neutral.600"),
          marginBottom: theme.spacing("md"),
        }}
      >
        Pick a display name before joining clubs.
      </Text>
      <TextInput
        accessibilityLabel="Display name"
        allowFontScaling
        onChangeText={setDisplayName}
        placeholder="Display name"
        placeholderTextColor={theme.color("neutral.600")}
        style={{
          ...theme.tokens.typography.body,
          backgroundColor: theme.color("surface.white"),
          borderColor: theme.color("neutral.200"),
          borderRadius: theme.radius("md"),
          borderWidth: 1,
          color: theme.color("neutral.950"),
          marginBottom: theme.spacing("md"),
          minHeight: 44,
          paddingHorizontal: theme.spacing("md"),
        }}
        value={displayName}
      />
      {error ? <TinyToast message={error} /> : null}
      <TinyButton
        disabled={displayName.trim().length === 0}
        label="Save profile"
        loading={isSubmitting}
        loadingLabel="Saving profile"
        onPress={submit}
      />
    </View>
  );
}

