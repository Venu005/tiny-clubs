import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

const clerkIdentity = {
  subject: "user_123",
  tokenIdentifier: "https://tiny-clubs.clerk.accounts.dev|user_123",
  email: "friend@tinyclubs.test",
  name: "Tiny Friend",
};

test("current returns null when unauthenticated", async () => {
  const t = convexTest(schema, modules);

  const profile = await t.query(api.profiles.current, {});

  expect(profile).toBeNull();
});

test("ensureCurrent creates a Convex profile for the authenticated Clerk identity", async () => {
  const t = convexTest(schema, modules).withIdentity(clerkIdentity);

  const ensuredProfile = await t.mutation(api.profiles.ensureCurrent, {});
  const profile = await t.query(api.profiles.current, {});

  expect(ensuredProfile).toMatchObject({
    clerkSubject: "user_123",
    displayName: "Tiny Friend",
    email: "friend@tinyclubs.test",
    isComplete: false,
    tokenIdentifier: "https://tiny-clubs.clerk.accounts.dev|user_123",
  });
  expect(profile).toMatchObject({
    clerkSubject: "user_123",
    displayName: "Tiny Friend",
    email: "friend@tinyclubs.test",
    isComplete: false,
    tokenIdentifier: "https://tiny-clubs.clerk.accounts.dev|user_123",
  });
});

test("completeSetup marks the authenticated profile complete", async () => {
  const t = convexTest(schema, modules).withIdentity(clerkIdentity);

  await t.mutation(api.profiles.ensureCurrent, {});
  const result = await t.mutation(api.profiles.completeSetup, {
    displayName: "Captain Tiny",
    username: "captain_tiny",
  });
  const profile = await t.query(api.profiles.current, {});

  expect(result).toEqual({ isComplete: true });
  expect(profile?.displayName).toBe("Captain Tiny");
  expect(profile?.username).toBe("captain_tiny");
  expect(profile?.usernameNormalized).toBe("captain_tiny");
  expect(profile?.isComplete).toBe(true);
});

test("completeSetup rejects invalid usernames", async () => {
  const t = convexTest(schema, modules).withIdentity(clerkIdentity);

  await t.mutation(api.profiles.ensureCurrent, {});

  await expect(
    t.mutation(api.profiles.completeSetup, {
      displayName: "Captain Tiny",
      username: "tiny captain!",
    })
  ).rejects.toThrow(
    "Username can use lowercase letters, numbers, underscores, and periods only."
  );
});

test("completeSetup rejects usernames already used by another profile", async () => {
  const t = convexTest(schema, modules).withIdentity(clerkIdentity);

  await t.run(async (ctx) => {
    await ctx.db.insert("profiles", {
      clerkSubject: "user_existing",
      displayName: "Existing Friend",
      email: "existing@tinyclubs.test",
      isComplete: true,
      tokenIdentifier: "https://tiny-clubs.clerk.accounts.dev|user_existing",
      username: "captain_tiny",
      usernameNormalized: "captain_tiny",
      onboardingCompletedAt: 1,
    });
  });

  await expect(
    t.mutation(api.profiles.completeSetup, {
      displayName: "Captain Tiny",
      username: "Captain_Tiny",
    })
  ).rejects.toThrow("Username is already taken");
});
