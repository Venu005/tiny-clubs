import { useAuth } from "@clerk/expo";
import { api } from "@/convex/_generated/api";
import { Redirect, Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { getAuthenticatedDestination, getSignedOutDestination } from "@/auth/routeDecision";
import { TinyLoadingIndicator } from "@/components/ui";

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
  const pathname = usePathname();
  const ensureProfile = useMutation(api.profiles.ensureCurrent);
  const profile = useQuery(api.profiles.current, isSignedIn ? {} : "skip");

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      void ensureProfile({});
    }
  }, [ensureProfile, isLoaded, isSignedIn]);

  if (!isLoaded) {
    return <TinyLoadingIndicator label="Checking session" />;
  }

  if (!isSignedIn) {
    return <Redirect href={getSignedOutDestination("session-expired")} />;
  }

  if (profile === undefined) {
    return <TinyLoadingIndicator label="Loading profile" />;
  }

  const destination = getAuthenticatedDestination(profile);

  if (destination === "/profile-setup" && pathname !== "/profile-setup") {
    return <Redirect href="/profile-setup" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
