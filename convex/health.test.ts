import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import { modules } from "./test.setup";

test("status returns an environment name", async () => {
  const t = convexTest(schema, modules);

  const status = await t.query(api.health.status, {});

  expect(status.environmentName).toEqual(expect.any(String));
});
