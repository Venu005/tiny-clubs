import { useSignIn } from "@clerk/expo";
import { useSignInWithApple } from "@clerk/expo/apple";
import { useSignInWithGoogle } from "@clerk/expo/google";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Platform, ScrollView, Text, TextInput, View } from "react-native";
import {
  CALLBACK_AUTH_MESSAGE,
  getAuthErrorMessage,
  OFFLINE_AUTH_MESSAGE,
} from "@/auth/errorMessages";
import { shouldShowAppleSignIn } from "@/auth/routeDecision";
import { AccessibleTextField } from "@/components/AccessibleTextField";
import { TinyButton, TinyToast } from "@/components/ui";
import { useTheme } from "@/theme";

type Step = "email" | "otp";
type RetryAction = "requestCode" | "verifyCode" | "google" | "apple" | null;

export default function SignInScreen() {
  const theme = useTheme();
  const { signIn } = useSignIn();
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();
  const { startAppleAuthenticationFlow } = useSignInWithApple();
  const emailInputRef = useRef<TextInput>(null);
  const codeInputRef = useRef<TextInput>(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("email");
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [codeError, setCodeError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryAction, setRetryAction] = useState<RetryAction>(null);

  async function requestCode() {
    if (isSubmitting) {
      return;
    }

    if (emailAddress.trim().length === 0) {
      setEmailError("Email is required");
      emailInputRef.current?.focus();
      return;
    }

    setError(null);
    setRetryAction(null);
    setEmailError(undefined);
    setIsSubmitting(true);

    try {
      await signIn.create({ identifier: emailAddress.trim() });
      await signIn.emailCode.sendCode();
      setStep("otp");
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      setRetryAction(message === OFFLINE_AUTH_MESSAGE ? "requestCode" : null);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyCode() {
    if (isSubmitting) {
      return;
    }

    if (code.trim().length === 0) {
      setCodeError("Code is required");
      codeInputRef.current?.focus();
      return;
    }

    setError(null);
    setRetryAction(null);
    setCodeError(undefined);
    setIsSubmitting(true);

    try {
      const { error: verifyError } = await signIn.emailCode.verifyCode({
        code: code.trim(),
      });

      if (verifyError) {
        throw verifyError;
      }

      await signIn.finalize();
      router.replace("/");
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      setRetryAction(
        message === OFFLINE_AUTH_MESSAGE || message === CALLBACK_AUTH_MESSAGE
          ? "verifyCode"
          : null
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function signInWithProvider(
    provider: "google" | "apple",
    startFlow: () => Promise<{
      createdSessionId: string | null;
      setActive?: (params: { session: string }) => Promise<void>;
    }>
  ) {
    if (isSubmitting) {
      return;
    }

    setError(null);
    setRetryAction(null);
    setIsSubmitting(true);

    try {
      const { createdSessionId, setActive } = await startFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      setRetryAction(message === CALLBACK_AUTH_MESSAGE ? provider : null);
    } finally {
      setIsSubmitting(false);
    }
  }

  function retryFailedAction() {
    if (retryAction === "requestCode") {
      void requestCode();
    } else if (retryAction === "verifyCode") {
      void verifyCode();
    } else if (retryAction === "google") {
      void signInWithProvider("google", startGoogleAuthenticationFlow);
    } else if (retryAction === "apple") {
      void signInWithProvider("apple", startAppleAuthenticationFlow);
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
          Ready when your crew is.
        </Text>
        <Text
          allowFontScaling
          style={{
            ...theme.tokens.typography.body,
            color: theme.color("neutral.600"),
          }}
        >
          Start with email, Google, or Apple. No passwords, no drama.
        </Text>
        <View
          style={{
            backgroundColor: theme.color("brand.sun"),
            borderRadius: theme.radius("card"),
            padding: theme.spacing("md"),
          }}
        >
          <Text
            allowFontScaling
            style={{
              ...theme.tokens.typography.bodySmall,
              color: theme.color("neutral.950"),
              fontWeight: "800",
            }}
          >
            {step === "email"
              ? "No clubs yet? We’ll help you make or join one after sign-in."
              : "Check your inbox, then pop the code in here."}
          </Text>
        </View>

        {step === "email" ? (
          <>
            <AccessibleTextField
              ref={emailInputRef}
              autoCapitalize="none"
              error={emailError}
              keyboardType="email-address"
              label="Email address"
              onChangeText={(value) => {
                setEmailAddress(value);
                setEmailError(undefined);
              }}
              placeholder="you@example.com"
              testID="email-address"
              value={emailAddress}
            />
            <TinyButton
              label="Request code"
              loading={isSubmitting}
              loadingLabel="Sending code"
              onPress={requestCode}
            />
          </>
        ) : (
          <>
            <AccessibleTextField
              ref={codeInputRef}
              error={codeError}
              keyboardType="number-pad"
              label="One-time code"
              onChangeText={(value) => {
                setCode(value);
                setCodeError(undefined);
              }}
              placeholder="123456"
              testID="one-time-code"
              value={code}
            />
            <TinyButton
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
          onPress={() =>
            signInWithProvider("google", startGoogleAuthenticationFlow)
          }
          variant="secondary"
        />

        {shouldShowAppleSignIn(Platform.OS) ? (
          <TinyButton
            label="Continue with Apple"
            loading={isSubmitting}
            loadingLabel="Opening Apple"
            onPress={() =>
              signInWithProvider("apple", startAppleAuthenticationFlow)
            }
            variant="secondary"
          />
        ) : null}

        {error ? (
          <TinyToast
            actionLabel={retryAction ? "Retry" : undefined}
            message={error}
            onAction={retryAction ? retryFailedAction : undefined}
          />
        ) : null}
      </View>
    </ScrollView>
  );
}
