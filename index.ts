// -*- lsp-disabled-clients: (ts-ls); -*-
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
   * This can return a string or a Promise<string>.
   *
   * This can also return a Promise<{ text: () => string | Promise<string> }>.
   * This means a Response or zx's ProcessOutput can be used directly.
   */
  fetcher: () =>
    | string
    | Promise<string>
    | Promise<{ text: () => string | Promise<string> }>,
): Promise<string> {
  const cacheFile = join(tmpdir(), key);
  const cacheHit = existsSync(cacheFile);
  let text: string;
  if (cacheHit) {
    text = readFileSync(cacheFile, { encoding: "utf-8" });
  } else {
    const result = await fetcher();
    text = typeof result === "string" ? result : await result.text();
  }
  if (!cacheHit) {
    mkdirSync(dirname(cacheFile), { recursive: true });
    writeFileSync(cacheFile, text, { encoding: "utf-8" });
  }
  return text;
}
