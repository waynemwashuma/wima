---
title: Setup environment
---

Use this page when you want to get a project ready for the guides in this cluster. The docs here assume ESM imports and the root `wima` package entrypoint.

## Install

For a new project, install the root package:

```bash
npm install wima
```

The root package re-exports the engine surface from the `@wimaengine/*` packages, so one dependency is enough for most apps. If you want a smaller dependency graph, install the individual packages you need instead.

## Import

The default entrypoint is `wima`:

```js
import { App, CorePlugin, World } from 'wima'
```

If you are working closer to package boundaries, the same symbols are available from their package homes:

```js
import { App } from '@wimaengine/app'
import { CorePlugin } from '@wimaengine/core'
import { World } from '@wimaengine/ecs'
```

That split is the pattern used throughout the guide. `App` owns orchestration, `CorePlugin` installs the default runtime, and `World` holds ECS state.

## Minimal Startup

The smallest useful setup is an app plus the core plugin:

```js
import { App, CorePlugin } from 'wima'

const app = new App()

app
  .registerPlugin(new CorePlugin())
  .run()
```

`CorePlugin` wires the default schedules, the frame runner, and the end-of-frame command drain, so `run()` can start the app without any extra setup.

## Read Next

If you want the runtime shape behind this setup, continue to [Architecture](../02-architecture/index.md). If you want the identity model that shows up in later ECS examples, jump to [Entities and entity handles](../03-entities-and-entity-handles/index.md).
