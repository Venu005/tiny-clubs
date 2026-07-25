import { useSignIn } from "@clerk/expo";
import { useSignInWithApple } from "@clerk/expo/apple";
import { useSignInWithGoogle } from "@clerk/expo/google";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView, Text, TextInput, View } from "react-native";
import {
  getAuthErrorMessage,
  OFFLINE_AUTH_MESSAGE,
} from "@/auth/errorMessages";
import { shouldShowAppleSignIn } from "@/auth/routeDecision";
import { TinyButton, TinyToast } from "@/components/ui";
import { useTheme } from "@/theme";

type Step = "email" | "otp";

export default function SignInScreen() {
  const theme = useTheme();
  const { signIn } = useSignIn();
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();
  const { startAppleAuthenticationFlow } = useSignInWithApple();
  const [emailAddress, setEmailAddress] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("email");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function requestCode() {
    if (isSubmitting) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await signIn.create({ identifier: emailAddress });
      await signIn.emailCode.sendCode();
      setStep("otp");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyCode() {
    if (isSubmitting) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const { error: verifyError } = await signIn.emailCode.verifyCode({ code });

      if (verifyError) {
        throw verifyError;
      }

      await signIn.finalize();
      router.replace("/");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function signInWithProvider(
    startFlow: () => Promise<{
      createdSessionId: string | null;
      setActive?: (params: { session: string }) => Promise<void>;
    }>
  ) {
    if (isSubmitting) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const { createdSessionId, setActive } = await startFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
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
      <View style={{ gap: theme.spacing("md") }}>
        <Text
          allowFontScaling
          style={{
            ...theme.tokens.typography.h1,
            color: theme.color("neutral.950"),
          }}
        >
          Welcome to Tiny Clubs
        </Text>
        <Text
          allowFontScaling
          style={{
            ...theme.tokens.typography.body,
            color: theme.color("neutral.600"),
          }}
        >
          Sign in without a password.
        </Text>

        {step === "email" ? (
          <>
            <TextInput
              accessibilityLabel="Email address"
              allowFontScaling
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmailAddress}
              placeholder="you@example.com"
              placeholderTextColor={theme.color("neutral.600")}
              style={{
                ...theme.tokens.typography.body,
                backgroundColor: theme.color("surface.white"),
                borderColor: theme.color("neutral.200"),
                borderRadius: theme.radius("md"),
                borderWidth: 1,
                color: theme.color("neutral.950"),
                minHeight: 44,
                paddingHorizontal: theme.spacing("md"),
              }}
              value={emailAddress}
            />
            <TinyButton
              disabled={emailAddress.trim().length === 0}
              label="Request code"
              loading={isSubmitting}
              loadingLabel="Sending code"
              onPress={requestCode}
            />
          </>
        ) : (
          <>
            <TextInput
              accessibilityLabel="One-time code"
              allowFontScaling
              keyboardType="number-pad"
              onChangeText={setCode}
              placeholder="123456"
              placeholderTextColor={theme.color("neutral.600")}
              style={{
                ...theme.tokens.typography.body,
                backgroundColor: theme.color("surface.white"),
                borderColor: theme.color("neutral.200"),
                borderRadius: theme.radius("md"),
                borderWidth: 1,
                color: theme.color("neutral.950"),
                minHeight: 44,
                paddingHorizontal: theme.spacing("md"),
              }}
              value={code}
            />
            <TinyButton
              disabled={code.trim().length === 0}
              label="Verify code"
              loading={isSubmitting}
              loadingLabel="Verifying code"
              onPress={verifyCode}
            />
          </>
        )}

        <TinyButton
          label="Continue with Google"
          loading={isSubmitting}
          loadingLabel="Opening Google"
          onPress={() => signInWithProvider(startGoogleAuthenticationFlow)}
          variant="secondary"
        />

        {shouldShowAppleSignIn(Platform.OS) ? (
          <TinyButton
            label="Continue with Apple"
            loading={isSubmitting}
            loadingLabel="Opening Apple"
            onPress={() => signInWithProvider(startAppleAuthenticationFlow)}
            variant="secondary"
          />
        ) : null}

        {error ? (
          <TinyToast
            actionLabel={error === OFFLINE_AUTH_MESSAGE ? "Retry" : undefined}
            message={error}
            onAction={error === OFFLINE_AUTH_MESSAGE ? requestCode : undefined}
          />
        ) : null}
      </View>
    </ScrollView>
  );
}
