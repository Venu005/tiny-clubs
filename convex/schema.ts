import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    clerkSubject: v.string(),
    displayName: v.optional(v.string()),
    email: v.optional(v.string()),
    isComplete: v.boolean(),
    tokenIdentifier: v.string(),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
  products: defineTable({
    product: v.string(),
    price: v.number(),
    quantity: v.number(),
    emoji: v.string(),
    category: v.string(),
  }),
});
