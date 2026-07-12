---
title: App
---

`App` is the runtime container for Wima.
It gathers setup, schedules, plugins, worlds, and the runner into one place.
The point is to build the runtime first and start it once.

This chapter stays at the coordination level.
The sections below point to the related runtime chapters when each idea becomes relevant.

## What The App Is

The `App` is the place where composition begins.
It does not own gameplay rules.
It owns the setup that makes gameplay possible.
It collects the pieces that need to exist before the first frame.
It then hands control to the runtime loop.

That makes `App` the bridge between package wiring and execution.
The app is where you decide what gets installed.
The runner is where you decide how execution advances.
The world is where the runtime state actually lives, and [World](../13-world/index.md) covers that storage model.

## What The App Holds

`App` keeps a small set of runtime responsibilities together.

- A `Worlds` registry for ECS state.
- A `Scheduler` for schedule execution.
- A plugin registry for staged setup.
- A runner for the runtime loop.
- An initialization flag that closes late resource writes.
- A shared schedule builder path for systems and groups.

The shape is intentionally small.
That keeps the app easy to reason about.
It also keeps the core runtime flexible.

## Startup Flow

The startup story is simple.
Build the app.
Register what the runtime needs.
Choose a runner.
Call `run()`.

After that, the app stops being a setup container and becomes a running system.

1. Create an `App`.
2. Register baseline plugins.
3. Create any extra worlds, shared resources, resource aliases, and component hooks you need.
4. Add schedules, system groups, and systems.
5. Set the runner.
6. Call `run()`.
7. Plugins are replayed in registration order.
8. The staged schedules are pushed into the scheduler.
9. The runner receives the scheduler and the world registry.
10. Startup work runs once.
11. Update work repeats.

The app is designed around that order.
Anything that changes the runtime shape should happen before `run()`.

## Minimal App

The smallest useful app is usually a core app plus one or more plugins.

```js
import { App } from '@wimaengine/app'
import { CorePlugin } from '@wimaengine/core'

const app = new App()

app
  .registerPlugin(new CorePlugin())
  .run()
```

That example does three things.
It creates the app container.
It installs the standard runtime baseline.
It starts the runtime.

If you are coming from the tutorial path, this is the same idea as the first working app.
See [Run your first app](../../01-getting-started/03-run-your-first-app/index.md) for the onboarding version.
See [Architecture](../02-architecture/index.md) for the big-picture runtime model.

## How App Relates To Other Concepts

`App` sits above the runtime concepts and connects them.
It relies on [World](../13-world/index.md) for state, [Systems](../06-systems/index.md) for work, and [Schedules](../07-schedules/index.md) for timing.
[Plugins](../10-plugins/index.md) and [Plugin groups](../24-plugin-groups/index.md) package reusable setup, while [Runners](../11-runners/index.md) decide how the scheduler advances.
[Queries](../14-queries/index.md), [Commands](../15-commands/index.md), [Component hooks](../09-component-hooks/index.md), and [System groups](../07-system-groups/index.md) fill in the supporting pieces underneath.

That is the main mental model.
The app is the composition boundary.
The rest of the engine hangs off it.

## Plugins

A plugin is the normal way to package setup.
Use a plugin when a feature needs several registrations.
Use a plugin when you want that setup to be reusable.
Use a plugin when you do not want startup code spread across the entry point.

`Plugin` is the base class.
Override `register(app)` and install the feature there.
Keep the work focused on setup.
Put gameplay behavior in systems instead.

`Plugin.name()` uses the plugin class identity.
That keeps plugin identity tied to the constructor, not a string label.
It is a better fit for engine packages than ad hoc keys.

The app replays plugins during startup.
That means the order you register them matters.
It also means the same plugin class can be treated as the same unit of setup.

```js
import { Plugin } from '@wimaengine/app'

class ScorePlugin extends Plugin {
  register(app) {
    app.setResource(new ScoreState())
  }
}
```

That pattern is enough for most feature setup.
The plugin sets the shared state.
The systems then consume it.
The app only coordinates the install step.
If you want the reusable setup model, [Plugins](../10-plugins/index.md) covers it directly. [Plugin groups](../24-plugin-groups/index.md) covers the case where several plugins should travel together.

## Plugin Groups

`PluginGroup` bundles several plugins into one reusable unit.
Use it when a feature is too large for one plugin but still should be installed as a single package-level choice.

The group keeps child plugins in insertion order.
It replays them into the app when the group itself is registered.
That makes the group behave like one plugin from the app's point of view.

`add()` appends a child plugin.
`remove()` drops a child plugin by identity.
`replace()` swaps one plugin for another.
Those three operations cover the common bundle changes without forcing the app to know about each child separately.

```js
import { Plugin, PluginGroup } from '@wimaengine/app'

class InputPlugin extends Plugin {
  register(app) {
    app.setResource(new InputState())
  }
}

class GameplayGroup extends PluginGroup {
  constructor() {
    super()
    this
      .add(new InputPlugin())
      .add(new MovementPlugin())
      .add(new CombatPlugin())
  }
}
```

That structure is useful when you want to swap features in and out together.
It keeps the composition boundary clean.
It also keeps plugin registration local to the bundle that owns it.

## Schedules And Systems

`App` does not execute systems directly.
It stages schedule definitions and system registrations.
The schedule package decides the ordering and execution rules.

Use `registerSystem()` for one system.
Use `registerSystemGroup()` when you need ordering around a set of systems.
Use `createSchedule()` when you need a new labeled schedule or a different runtime policy.

The common runtime path uses `AppSchedule.Startup` for one-time setup and `AppSchedule.Update` for repeated frame work.
Those labels come from `@wimaengine/core`. [Schedules](../07-schedules/index.md) explains the schedule layer itself. [System groups](../07-system-groups/index.md) covers ordered groups, and [Systems](../06-systems/index.md) covers the work units that actually run.
`CoreSystems.Main` is the default place for most systems, and `CoreSystems.End` is where queued commands are drained in the core runtime so mutation stays at the end of the schedule instead of in the middle of the frame.

```js
import { App } from '@wimaengine/app'
import { AppSchedule, CorePlugin } from '@wimaengine/core'

function setup() {
  console.log('startup')
}

function update() {
  console.log('frame')
}

const app = new App()

app
  .registerPlugin(new CorePlugin())
  .registerSystem({
    schedule: AppSchedule.Startup,
    system: setup
  })
  .registerSystem({
    schedule: AppSchedule.Update,
    system: update
  })
  .run()
```

This is the ordinary shape of engine work.
Setup runs once.
Update runs every frame.
The app just stages the pieces and starts the runtime.

## Worlds, Resources, And Hooks

`App` owns a `Worlds` registry and exposes it through `getWorld()`.
Call `getWorld()` with no argument for the default world.
Pass a label to read a specific world by constructor.

`setWorld(label)` creates an extra world before startup.
`defaultWorld(label)` changes which world `getWorld()` returns when you do not pass a label.
`CorePlugin` creates `MainWorld` and uses it as the default world label for the standard runtime.

Most app-level setup is staged against the app rather than a single world.
Use `setResource()` when you want a resource instance to land in the default world.
Pass a world label to `setResource()` or `setResourceByTypeId()` when the resource belongs somewhere else.
Use `setResourceAlias()` when you want a resource alias to be applied to every world during startup.
Use `setComponentHooks()` when you want component lifecycle callbacks to be applied during startup.

```js
import { App } from '@wimaengine/app'
import { ComponentHooks } from '@wimaengine/ecs'
import { typeid } from '@wimaengine/type'

class GameplayWorld {}
class AssetStore {}
class SceneAssets extends AssetStore {}
class Player {}

const onAdd = () => {}
const onRemove = () => {}
const onInsert = () => {}

const app = new App()

app
  .setWorld(GameplayWorld)
  .setResourceByTypeId(typeid(AssetStore), new AssetStore(), GameplayWorld)
  .setResourceAlias(typeid(AssetStore), SceneAssets)
  .setComponentHooks(Player, new ComponentHooks(onAdd, onRemove, onInsert))
```

That keeps world-specific setup in one place.
It also keeps the app layer focused on startup composition instead of on live ECS mutation.

If you need direct access to one world, use `getWorld(label)` and then work with the world API directly.
The storage model is covered in [World](../13-world/index.md). [Resources](../05-resources/index.md), [Components](../04-components/index.md), and [Component hooks](../09-component-hooks/index.md) sit on top of it.

## Runners

`setRunner()` chooses the loop driver.
`run()` requires a runner before startup can begin.
That is the boundary between setup and execution.

The runner contract is simple.
It receives the scheduler and the world registry.
It decides how to advance the scheduler.
It owns the timing policy.

`@wimaengine/schedule` defines the `Runner` type.
`@wimaengine/core` provides the default browser-oriented runner.
If you need a fixed step, a server loop, or a custom host, provide your own runner.

```js
import { App } from '@wimaengine/app'

const app = new App()

app
  .setRunner((scheduler, worlds) => {
    // Drive the scheduler with your own loop policy.
    // The app only needs the Runner shape.
  })
  .run()
```

The important point is separation.
The app owns composition.
The runner owns execution.
The systems own gameplay behavior.
The driver model lives in [Runners](../11-runners/index.md). The schedule execution details live in [Schedules](../07-schedules/index.md).

## Core Integration

`@wimaengine/core` is the normal baseline above `App`.
It wires the standard schedules, the default runner, the core phase graph, and the default `MainWorld` label.
It also seeds type metadata and flushes deferred commands.

If you want the standard engine path, register `CorePlugin`.
If you want a custom runtime, skip the core baseline and wire your own runner and schedules.
Both paths still use `App` as the composition point.

The core package is where the common frame flow lives.
`Startup` runs once.
`Update` repeats.
`Main` is the default system landing zone.
`End` is where command flushing happens.

```js
import { App } from '@wimaengine/app'
import { CoreSystems, MainWorld } from '@wimaengine/core'

class GameplaySchedule {}

const app = new App()

app.createSchedule({
  label: GameplaySchedule,
  world: MainWorld,
  repeat: true,
  defaultSystemGroup: CoreSystems.Main
})
```

That snippet shows the shape of app-level schedule creation.
The app stages the definition.
The scheduler package executes it later.

For the standard runtime baseline, pair the app with `@wimaengine/core`. If you want the broader startup-and-update model around it, see [Architecture](../02-architecture/index.md).

## Common App Shapes

There are a few common ways to use `App`.

- Standard engine app: `App` plus `CorePlugin`.
- Feature bundle: a `PluginGroup` that collects related plugins.
- Custom loop: `App` plus your own `setRunner()` function.
- Startup-only setup: `registerSystem(...Startup...)`.
- Frame work: `registerSystem(...Update...)`.
- Shared state: `setResource()` or `setResourceByTypeId()` before `run()`.
- World setup: `setWorld()` before runtime starts.
- Component lifecycle: `setComponentHooks()` during startup.
- Resource aliases: `setResourceAlias()` during startup.
- Order-sensitive work: `registerSystemGroup()` inside a schedule.
- Direct ECS access: `getWorld(label)` when the app helpers are not enough.

These are the shapes to reach for first.
They cover the normal runtime cases without forcing you into internals.

If you are unsure where something belongs, use this rule.
Put reusable setup in a plugin.
Put repeated behavior in a system.
Put runtime order in a schedule or system group.
Put shared state in a resource.
Put entity data in a component.
Put loop policy in a runner.

## What Not To Put In App

Do not put gameplay rules in the main entry point.
Do not store entity state in ad hoc variables.
Do not use app-level code for per-frame behavior when a system fits better.
Do not spread startup work across unrelated files when a plugin can own it.
Do not call `setResource()` after startup.
Do not make the app responsible for timing policy unless you are writing a custom runner.
Do not reach for `getWorld()` when a direct app helper already exists.

That keeps the runtime easier to read.
It also keeps the public shape of the engine clean.

## Quick Checklist

Before you call `run()`, check the following.

1. The app has the plugins it needs.
2. The worlds you need are created.
3. The startup systems are staged.
4. The update systems are staged.
5. The shared resources are registered.
6. The resource aliases are in place.
7. The component hooks are in place.
8. The runner is set.
9. The schedule labels are ready.
10. Anything that should not change later is already configured.

That checklist is usually enough for a clean start.
If one of those items is missing, the error usually shows up at startup time.

## Summary

`App` is the build-and-start boundary.
Use it to collect setup, choose a runner, and hand control to the runtime.
For reusable features, put the work in plugins and plugin groups.
For repeated behavior, put the work in systems and schedules.
For the standard engine path, pair it with `@wimaengine/core`. If you want the broader runtime model alongside it, see [Architecture](../02-architecture/index.md).
