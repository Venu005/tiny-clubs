import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

test("getProducts returns an empty list when no products exist", async () => {
  const t = convexTest(schema, modules);

  const products = await t.query(api.products.getProducts, {});

  expect(products).toEqual([]);
});

test("purchase decrements product quantity", async () => {
  const t = convexTest(schema, modules);

  const productId = await t.run(async (ctx) => {
    return await ctx.db.insert("products", {
      product: "Coffee",
      price: 5,
      quantity: 2,
      emoji: "☕",
      category: "drinks",
    });
  });

  await t.mutation(api.products.purchase, { id: productId });

  const products = await t.query(api.products.getProducts, {});
  expect(products).toHaveLength(1);
  expect(products[0]?.quantity).toBe(1);
});

test("purchase is a no-op when quantity is zero", async () => {
  const t = convexTest(schema, modules);

  const productId = await t.run(async (ctx) => {
    return await ctx.db.insert("products", {
      product: "Tea",
      price: 3,
      quantity: 0,
      emoji: "🍵",
      category: "drinks",
    });
  });

  await t.mutation(api.products.purchase, { id: productId });

  const products = await t.query(api.products.getProducts, {});
  expect(products[0]?.quantity).toBe(0);
});
