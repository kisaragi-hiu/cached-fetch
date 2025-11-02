// -*- lsp-disabled-clients: (ts-ls); -*-
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

export function cached(key: string, fetcher: () => string): string;
export function cached(
  key: string,
  fetcher: () =>
    | Promise<string>
    | Promise<{ text: () => string | Promise<string> }>,
): Promise<string>;
/**
 * A cache designed to cache some text.
 */
export function cached(
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
): string | Promise<string> {
  const cacheFile = join(tmpdir(), key);

  function saveCache(text: string) {
    mkdirSync(dirname(cacheFile), { recursive: true });
    writeFileSync(cacheFile, text, { encoding: "utf-8" });
    return text;
  }

  try {
    return readFileSync(cacheFile, { encoding: "utf-8" });
  } catch (e: unknown) {
    if ((e as { code?: string }).code !== "ENOENT") {
      throw e;
    }
    const result = fetcher();
    if (typeof result === "string") {
      return saveCache(result);
    } else {
      return result.then(async (v) => {
        return saveCache(typeof v === "string" ? v : await v.text());
      });
    }
  }
}
