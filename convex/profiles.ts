import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

type ClerkIdentity = {
  email?: string;
  name?: string;
  subject: string;
  tokenIdentifier: string;
};

const profileReturnValidator = v.union(
  v.null(),
  v.object({
    profileId: v.id("profiles"),
    tokenIdentifier: v.string(),
    clerkSubject: v.string(),
    email: v.union(v.string(), v.null()),
    displayName: v.union(v.string(), v.null()),
    isComplete: v.boolean(),
  })
);

function emailFromIdentity(identity: ClerkIdentity) {
  return identity.email ?? undefined;
}

function toProfileReturn(profile: Doc<"profiles">) {
  return {
    profileId: profile._id,
    tokenIdentifier: profile.tokenIdentifier,
    clerkSubject: profile.clerkSubject,
    email: profile.email ?? null,
    displayName: profile.displayName ?? null,
    isComplete: profile.isComplete,
  };
}

export const current = query({
  args: {},
  returns: profileReturnValidator,
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      return null;
    }

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    return existing === null ? null : toProfileReturn(existing);
  },
});

export const ensureCurrent = mutation({
  args: {},
  returns: profileReturnValidator,
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      return null;
    }

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (existing !== null) {
      await ctx.db.patch(existing._id, {
        clerkSubject: identity.subject,
        email: existing.email ?? emailFromIdentity(identity),
      });
      const updated = await ctx.db.get(existing._id);
      return updated === null ? null : toProfileReturn(updated);
    }

    const profileId = await ctx.db.insert("profiles", {
      clerkSubject: identity.subject,
      displayName: identity.name,
      email: emailFromIdentity(identity),
      isComplete: false,
      tokenIdentifier: identity.tokenIdentifier,
    });
    const profile = await ctx.db.get(profileId);

    return profile === null ? null : toProfileReturn(profile);
  },
});

export const completeSetup = mutation({
  args: { displayName: v.string() },
  returns: v.object({ isComplete: v.literal(true) }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (existing === null) {
      await ctx.db.insert("profiles", {
        clerkSubject: identity.subject,
        displayName: args.displayName.trim(),
        email: emailFromIdentity(identity),
        isComplete: true,
        tokenIdentifier: identity.tokenIdentifier,
      });
    } else {
      await ctx.db.patch(existing._id, {
        displayName: args.displayName.trim(),
        email: existing.email ?? emailFromIdentity(identity),
        isComplete: true,
      });
    }

    return { isComplete: true as const };
  },
});
