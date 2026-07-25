import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const productValidator = v.object({
  _id: v.id("products"),
  _creationTime: v.number(),
  product: v.string(),
  price: v.number(),
  quantity: v.number(),
  emoji: v.string(),
  category: v.string(),
});

export const getProducts = query({
  args: {},
  returns: v.array(productValidator),
  handler: async (ctx) => {
    return await ctx.db.query("products").order("asc").take(100);
  },
});

export const purchase = mutation({
  args: { id: v.id("products") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);

    if (product === null || product.quantity <= 0) {
      return null;
    }

    await ctx.db.patch(args.id, {
      quantity: product.quantity - 1,
    });

    return null;
  },
});
