#!/usr/bin/env -S deno run
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

export async function cachedFetch(
  key: string,
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
