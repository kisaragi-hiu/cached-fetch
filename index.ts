#!/usr/bin/env -S deno run
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

/**
 * A cache designed to cache some text.
 */
export async function cached(
  /**
   * The key of the value.
   * Subsequent calls with the same key will return the cached value.
   */
  key: string,
  /**
   * A fetcher function, called when the value isn't cached.
   *
   * Should return a Promise<{ text: () => Promise<string> }>. This is usually a
   * Response, but the ProcessPromise from the zx library also fits this signature.
   */
  fetcher: () => Promise<{ text: () => Promise<string> }>
) {
  const cacheFile = join(tmpdir(), key);
  const cacheHit = existsSync(cacheFile);
  const text = cacheHit
    ? readFileSync(cacheFile, { encoding: "utf-8" })
    : await (await fetcher()).text();
  if (!cacheHit) {
    mkdirSync(dirname(cacheFile), { recursive: true });
    writeFileSync(cacheFile, text, { encoding: "utf-8" });
  }
}
