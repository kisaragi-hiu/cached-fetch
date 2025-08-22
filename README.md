# @kisaragi-hiu/cached-fetch

A cacheing function designed for cacheing fetch GET responses on disk in a command line program.

I keep rewriting this logic in multiple projects, so I'm making it a package.

## Usage

```typescript
import { cached } from "@kisaragi-hiu/cached-fetch";

const text = await cached(
  "myCacheKey",
  () => fetch("https://example.com")
)
```

This persists the text response in `os.tmpdir` and should stay around until the next reboot.

Arguments:

```typescript
/**
 * The key of the value.
 * Subsequent calls with the same key will return the cached value.
 */
key: string,
/**
 * A fetcher function, called when the value isn't cached.
 *
 * Should return a promise, which resolves to an object whose text key is a
 * Promise<string> --- usually a Response, but the ProcessPromise from the
 * zx library are also supported.
 */
fetcher: () => Promise<{ text: () => Promise<string> }>
```

## Bonus usage

This also works:

```typescript
import { $ } from "zx";
import { cached } from "@kisaragi-hiu/cached-fetch";

const text = await cached(
  "myCacheKey",
  () => $`sleep 1 && echo "demo for a slow process"`
)
```
