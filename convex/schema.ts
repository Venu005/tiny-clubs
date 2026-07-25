import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    product: v.string(),
    price: v.number(),
    quantity: v.number(),
    emoji: v.string(),
    category: v.string(),
  }),
});
