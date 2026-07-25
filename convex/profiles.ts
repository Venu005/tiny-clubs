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
    onboardingCompletedAt: v.union(v.number(), v.null()),
    username: v.union(v.string(), v.null()),
    usernameNormalized: v.union(v.string(), v.null()),
  })
);

const USERNAME_FORMAT_MESSAGE =
  "Username can use lowercase letters, numbers, underscores, and periods only.";
const USERNAME_PATTERN = /^[a-z0-9_.]{3,24}$/;

function emailFromIdentity(identity: ClerkIdentity) {
  return identity.email ?? undefined;
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function toProfileReturn(profile: Doc<"profiles">) {
  return {
    profileId: profile._id,
    tokenIdentifier: profile.tokenIdentifier,
    clerkSubject: profile.clerkSubject,
    email: profile.email ?? null,
    displayName: profile.displayName ?? null,
    isComplete: profile.isComplete,
    onboardingCompletedAt: profile.onboardingCompletedAt ?? null,
    username: profile.username ?? null,
    usernameNormalized: profile.usernameNormalized ?? null,
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
  args: { displayName: v.string(), username: v.string() },
  returns: v.object({ isComplete: v.literal(true) }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const displayName = args.displayName.trim();
    const usernameNormalized = normalizeUsername(args.username);

    if (!USERNAME_PATTERN.test(usernameNormalized)) {
      throw new Error(USERNAME_FORMAT_MESSAGE);
    }

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    const claimedUsername = await ctx.db
      .query("profiles")
      .withIndex("by_username_normalized", (q) =>
        q.eq("usernameNormalized", usernameNormalized)
      )
      .unique();

    if (
      claimedUsername !== null &&
      (existing === null || claimedUsername._id !== existing._id)
    ) {
      throw new Error("Username is already taken");
    }

    const profilePatch = {
      displayName,
      email: emailFromIdentity(identity),
      isComplete: true,
      onboardingCompletedAt: Date.now(),
      username: usernameNormalized,
      usernameNormalized,
    };

    if (existing === null) {
      await ctx.db.insert("profiles", {
        clerkSubject: identity.subject,
        ...profilePatch,
        tokenIdentifier: identity.tokenIdentifier,
      });
    } else {
      await ctx.db.patch(existing._id, {
        ...profilePatch,
        email: existing.email ?? profilePatch.email,
      });
    }

    return { isComplete: true as const };
  },
});
