import { describe, test, expect } from "bun:test";
import { cached } from "./index.ts";

describe("caching a fetch", async () => {
  const key = "test1";
  let before: number | undefined = undefined;
  before = performance.now();
  const test1v1 = await cached(key, () => fetch("https://kisaragi-hiu.com"));
  const elapsed1 = performance.now() - before;
  test("result is a string", () => {
    expect(typeof test1v1).toBe("string");
  });

  before = performance.now();
  const test1v2 = await cached(key, () => fetch("https://kisaragi-hiu.com"));
  const elapsed2 = performance.now() - before;
  test("result is a string when using the cache", () => {
    expect(typeof test1v2).toBe("string");
  });
  test("caching is faster", () => {
    expect(elapsed2).toBeLessThan(elapsed1);
  });
});
