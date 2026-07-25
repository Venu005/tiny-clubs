import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { TinyLoadingIndicator } from "@/components/ui";

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <TinyLoadingIndicator label="Checking session" />;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

