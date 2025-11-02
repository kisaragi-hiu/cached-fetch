// -*- lsp-disabled-clients: (ts-ls); -*-
import { assertEquals, assertLess } from "jsr:@std/assert";
import { spawnSync } from "node:child_process";
import { $ } from "npm:zx";
import { cached } from "./index.ts";

Deno.test("fetch", async (t) => {
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

Deno.test("zx", async (t) => {
  const key = "test2";
  let before: number | undefined = undefined;

  before = performance.now();
  await t.step("result is the expected value", async () => {
    assertEquals(await cached(key, () => $`echo hello`), "hello\n");
  });
  const elapsed1 = performance.now() - before;

  before = performance.now();
  await t.step("caching is faster", async () => {
    await cached(key, () => $`echo hello`);
    const elapsed2 = performance.now() - before;
    assertLess(elapsed2, elapsed1);
  });
});

Deno.test("sync", async (t) => {
  const key = "test3";
  let before: number | undefined = undefined;

  function zxAtHome(command: string, args: string[]) {
    return spawnSync(command, args, {
      stdio: "pipe",
      encoding: "utf-8",
    });
  }

  before = performance.now();
  await t.step("result is the expected value", () => {
    assertEquals(
      cached(key, () => zxAtHome("echo", ["hello"]).stdout),
      "hello\n",
    );
  });
  const elapsed1 = performance.now() - before;

  before = performance.now();
  cached(key, () => zxAtHome("echo", ["hello"]).stdout);
  const elapsed2 = performance.now() - before;
  await t.step("caching is faster", () => {
    assertLess(elapsed2, elapsed1);
  });
});
