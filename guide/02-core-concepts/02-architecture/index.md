---
title: Architecture
---

Wima is built from a small set of runtime pieces that work together when you build a game or simulation. The important part is not the implementation detail of each class, but how the app, plugins, world registry, and schedules hand work to one another.

```js
import { App, CorePlugin, AppSchedule, CoreSystems } from 'wima'

const app = new App()

app
  .registerPlugin(new CorePlugin())
  .registerSystem({
    schedule: AppSchedule.Startup,
    systemGroup: CoreSystems.Main,
    system: setup
  })
  .registerSystem({
    schedule: AppSchedule.Update,
    systemGroup: CoreSystems.Main,
    system: update
  })
  .run()
```

That is the basic shape of a Wima app:

- create an `App`
- install features through plugins
- register systems for the moments they should run
- let the core plugin supply the default runtime wiring
- start the app

## Runtime Layers

### App

`App` is the orchestration layer. It owns the world registry, keeps track of registered plugins, forwards schedule and system registration into the scheduler builder, and starts execution when you call `run()`. In practice, it is the object that collects startup work before handing off to the runner.

See [App](../12-app/index.md) for the full concept page.

### CorePlugin

`CorePlugin` is the default wiring layer from `@wimaengine/core`. It installs the scheduler builder resource, creates `MainWorld` and makes it the default world, sets the frame runner, creates the `Startup` and `Update` schedules, registers the `CoreSystems` phases on both schedules, seeds the type registry, and flushes deferred commands at `CoreSystems.End`. If you want the standard runtime shape, this is the plugin that supplies it.

### World

`World` holds the simulation state. It stores tables, archetypes, entities, resources, resource aliases, and the type store. Systems read from it and write to it, but the world is also where entities are spawned, moved, and despawned. When the app needs more than one world, each one is still just a `World` entry in the app's registry.

See [World](../13-world/index.md) for the full concept page.

### EntityHandle

An `EntityHandle` is the identity token for one thing in the world. It is stable across component changes, but it is not immortal: the generation changes when a slot is reused, which keeps stale handles from colliding with newly spawned entities.

See [Entities and entity handles](../03-entities-and-entity-handles/index.md) for the full concept page.

### Components, Resources, Systems

The data flow is simple:

- components describe per-entity state
- resources store shared world state
- systems read and update both
- commands stage deferred changes for the end of the schedule

This is the pattern the rest of the guide builds on. A movement system updates position components, a score resource tracks global progression, and a command queue lets gameplay code stage entity changes without mutating the world immediately.

See [Components](../04-components/index.md), [Resources](../05-resources/index.md), [Systems](../06-systems/index.md), [Commands](../15-commands/index.md), and [Schedules](../07-schedules/index.md).

### Schedules and Groups

The core runtime runs through two schedules: `AppSchedule.Startup` runs once, and `AppSchedule.Update` runs every frame. Both schedules are split into the same ordered phases through `CoreSystems`, with `Main` as the default landing zone and `End` as the place where queued commands are flushed. Each schedule also carries the world label it should run against, with `MainWorld` as the default target in the core runtime. That structure gives downstream packages a predictable place to hook into startup and frame updates.

See [Schedules](../07-schedules/index.md), [System groups](../07-system-groups/index.md), [Plugins](../10-plugins/index.md), [Plugin groups](../24-plugin-groups/index.md), and [Runners](../11-runners/index.md).

## How It Fits Together

A simple way to think about Wima is:

- `App` assembles the game and its world registry.
- `CorePlugin` supplies the default runtime and the default world.
- `World` stores state for one labeled world.
- `EntityHandle` identifies a thing in the world.
- `Component`s describe that thing.
- `Resource`s hold shared state.
- `System`s act on the world during a schedule.
- `Commands` apply deferred changes at a predictable point.

Most of the time, you write systems that look for the data they need and then update it.

```js
function update(world) {
  // Read resources, inspect matching entities, and apply game rules.
}
```

Startup systems are useful for one-time setup. Update systems are useful for repeated gameplay logic. Keeping those phases separate makes projects easier to understand and extend.

## Quick Rule Of Thumb

If you are unsure where something belongs:

- per-object data -> component
- shared game state -> resource
- behavior or rules -> system
- reusable setup -> plugin
- object identity -> entity
