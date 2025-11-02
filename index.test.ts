// -*- lsp-disabled-clients: (ts-ls); -*-
import { assertEquals, assertLess } from "jsr:@std/assert";
import { cached } from "./index.ts";

Deno.test("caching a fetch", async (t) => {
  const key = "test1";
  let before: number | undefined = undefined;
  before = performance.now();
  const test1v1 = await cached(key, () => fetch("https://kisaragi-hiu.com"));
  const elapsed1 = performance.now() - before;
  await t.step("result is a string", () => {
    assertEquals(typeof test1v1, "string");
  });

  before = performance.now();
  const test1v2 = await cached(key, () => fetch("https://kisaragi-hiu.com"));
  const elapsed2 = performance.now() - before;
  await t.step("result is a string when using the cache", () => {
    assertEquals(typeof test1v2, "string");
  });
  await t.step("caching is faster", () => {
    assertLess(elapsed2, elapsed1);
  });
});
