# @kisaragi-hiu/cached-fetch

A caching function designed for caching fetch GET responses on disk in a command line program.

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

Signature: `cached(key, fetcher)`

Arguments:

- `key`: the key of the value. Subsequent calls with the same key will return the cached value.
- `fetcher`: a function doing work that should be cached. This should return any of these:
  - `Promise<{text: () => string | Promise<string>}`, a promise of an object whose “text” property is a function returning a string or a promise of a string.
    
    This covers both a `Promise<Response>` from `fetch`, and also `ProcessPromise` from `zx`. So this works:
    
    ```typescript
    const value = await cached("key1", () => fetch("https://example.com"))

    import {$} from "zx"
    const output = await cached("key2", () => $`sleep 1 && echo "slow process demo"`)
    ```

  - a `Promise<string>`

  - a string. In this case the whole call is sync.
  
    ```typescript
    const output = cached("key4", () =>
      spawnSync("ls", { stdio: "pipe", encoding: "utf-8" }).stdout,
    );
    ```
