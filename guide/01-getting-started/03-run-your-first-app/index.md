---
title: Run your first app
---

Now that `wima` is installed, create the smallest possible runtime loop that can boot a browser app.

## Minimal Loop

```js
import {
  App,
  DefaultPlugin,
  DOMWindowPlugin,
  Canvas2DRendererPlugin
} from 'wima'

const app = new App()

app
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .run()
```

This example has three parts:

- `new App()` creates the app container that will own the runtime.
- `.registerPlugin(...)` adds the pieces the engine needs to run in a browser and render to a canvas.
- `.run()` starts the loop so the app begins processing updates.

`DefaultPlugin` gives you the working engine baseline so the first example does not ask you to assemble the runtime by hand. `DOMWindowPlugin` connects the app to the browser window, and `Canvas2DRendererPlugin` provides a basic 2D rendering path.

## What To Expect

After the app starts, you should have a live runtime loop and a browser canvas, even if nothing visible is on screen yet. That is enough to confirm the engine is wired up correctly and ready for the next chapter, where you will add actual behavior.

## If It Does Not Run

If the app fails to start, check the following first:

- The package imports match the names exported by `wima`.
- The install step completed in the same project you are running.
- Your browser console shows the actual error instead of a silent failure.

The next page adds behavior with systems, then the later sections introduce entities, queries, scenes, and visible content.
