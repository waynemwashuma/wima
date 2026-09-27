---
title: Setup environment
---

Use this page when you want to get a project ready for the guides in this cluster. The docs here assume ESM imports and the root `wima` package entrypoint.

## Install

For a new project, install the root package:

```bash
npm install wima
```

The root package exposes the engine through one interface, so one dependency is enough for most apps.

## Import

The default entrypoint is `wima`:

```js
import { App, CorePlugin, World } from 'wima'
```

`App` owns orchestration, `CorePlugin` installs the default runtime, and `World` holds ECS state.

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
