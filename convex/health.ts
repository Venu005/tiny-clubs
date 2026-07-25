import { v } from "convex/values";
import { query } from "./_generated/server";

export const status = query({
  args: {},
  returns: v.object({
    environmentName: v.string(),
  }),
  handler: async () => {
    return {
      environmentName:
        process.env.APP_ENVIRONMENT_NAME ??
        process.env.CONVEX_DEPLOYMENT ??
        "unknown",
    };
  },
});
