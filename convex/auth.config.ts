import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: process.env.EXPO_PUBLIC_CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
