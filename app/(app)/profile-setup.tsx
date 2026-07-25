import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, ScrollView, Text, TextInput, View } from "react-native";
import { AccessibleTextField } from "@/components/AccessibleTextField";
import { TinyButton, TinyToast } from "@/components/ui";
import { useTheme } from "@/theme";

const PHOTO_PERMISSION_MESSAGE =
  "Photo access was denied. You can still finish setup without a photo.";

export default function ProfileSetupScreen() {
  const theme = useTheme();
  const completeSetup = useMutation(api.profiles.completeSetup);
  const displayNameRef = useRef<TextInput>(null);
  const [displayName, setDisplayName] = useState("");
  const [displayNameError, setDisplayNameError] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [photoMessage, setPhotoMessage] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPickingPhoto, setIsPickingPhoto] = useState(false);

  async function submit() {
    if (isSubmitting) {
      return;
    }

    if (displayName.trim().length === 0) {
      setDisplayNameError("Display name is required");
      displayNameRef.current?.focus();
      return;
    }

    setError(null);
    setDisplayNameError(undefined);
    setIsSubmitting(true);

    try {
      await completeSetup({ displayName: displayName.trim() });
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save profile");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function addProfilePhoto() {
    if (isPickingPhoto) {
      return;
    }

    setPhotoMessage(null);
    setIsPickingPhoto(true);

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        setPhotoMessage(PHOTO_PERMISSION_MESSAGE);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        mediaTypes: ["images"],
        quality: 0.85,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0]?.uri ?? null);
      }
    } catch (err) {
      setPhotoMessage(
        err instanceof Error ? err.message : "Unable to open your photos."
      );
    } finally {
      setIsPickingPhoto(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.color("surface.canvas") }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: theme.spacing("lg"),
      }}
    >
      <View
        style={{
          backgroundColor: theme.color("surface.white"),
          borderColor: theme.color("neutral.200"),
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
          Set up your profile
        </Text>
        <Text
          allowFontScaling
          style={{
            ...theme.tokens.typography.body,
            color: theme.color("neutral.600"),
          }}
        >
          Pick a display name and add a photo if you want. You can change both
          later.
        </Text>

        <View
          style={{
            alignItems: "center",
            backgroundColor: theme.color("surface.tint"),
            borderRadius: theme.radius("card"),
            gap: theme.spacing("sm"),
            padding: theme.spacing("md"),
          }}
        >
          {photoUri ? (
            <Image
              accessibilityLabel="Selected profile photo"
              source={{ uri: photoUri }}
              style={{
                borderRadius: 48,
                height: 96,
                width: 96,
              }}
            />
          ) : (
            <View
              accessibilityLabel="Empty profile photo"
              style={{
                alignItems: "center",
                backgroundColor: theme.color("brand.mint"),
                borderRadius: 48,
                height: 96,
                justifyContent: "center",
                width: 96,
              }}
            >
              <Text
                allowFontScaling
                style={{
                  ...theme.tokens.typography.h2,
                  color: theme.color("neutral.950"),
                }}
              >
                TC
              </Text>
            </View>
          )}
          <TinyButton
            label={photoUri ? "Change profile photo" : "Add profile photo"}
            loading={isPickingPhoto}
            loadingLabel="Opening photos"
            onPress={addProfilePhoto}
            variant="secondary"
          />
        </View>

        {photoMessage ? (
          <TinyToast
            actionLabel="Continue without photo"
            message={photoMessage}
            onAction={() => setPhotoMessage(null)}
          />
        ) : null}

        <AccessibleTextField
          ref={displayNameRef}
          error={displayNameError}
          label="Display name"
          onChangeText={(value) => {
            setDisplayName(value);
            setDisplayNameError(undefined);
          }}
          placeholder="Tiny Captain"
          testID="display-name"
          value={displayName}
        />

        {error ? (
          <TinyToast actionLabel="Retry" message={error} onAction={submit} />
        ) : null}
        <TinyButton
          label="Save profile"
          loading={isSubmitting}
          loadingLabel="Saving profile"
          onPress={submit}
        />
      </View>
    </ScrollView>
  );
}
