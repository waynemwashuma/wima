---
title: Architecture
---


Wima is built from a small set of ideas that work together when you build a game or simulation. If you are new to the engine, the important thing is not the implementation details but how you use the pieces together.

```js
import { App, DefaultPlugin, AppSchedule } from 'wima'

const app = new App()

app
  .registerPlugin(new DefaultPlugin())
  .registerSystem({ schedule: AppSchedule.Startup, system: setup })
  .registerSystem({ schedule: AppSchedule.Update, system: update })
  .run()
```

This is the basic shape of a Wima app:

- Create an `App`.
- Add features through plugins.
- Register systems for the moments they should run.
- Start the app.

## The main building blocks

### App

The `App` is the runtime entry point. It collects plugins, registers systems, stores the world, and starts execution when you call `run()`.

See [App](../12-app/index.md) for the full concept page.

### World

The `World` holds your game state. Systems read from it and write to it while the app is running, and resources also live here.

See [World](../13-world/index.md) for the full concept page.

### Entity

An `Entity` is an identity for something in the world. It is useful when you want to refer to one game object, but it does not carry behavior by itself.

See [Entities and entity handles](../03-entities-and-entity-handles/index.md) for the full concept page.

### Component

A `Component` is data attached to an entity. Use components for things like position, velocity, health, or name.

See [Components](../04-components/index.md) for the full concept page.

### Resource

A `Resource` is shared state for the whole world. Use it for data that should be available everywhere, such as score, time, or configuration.

See [Resources](../05-resources/index.md) for the full concept page.

### System

A `System` is game logic. It is where you update components, react to world state, and make the simulation advance.

See [Systems](../06-systems/index.md) and [Schedules](../07-schedules/index.md) for the full concept pages.

### Plugin

A `Plugin` bundles related setup. Use plugins when a feature needs several systems, resources, or other registrations.

See [Plugins](../10-plugins/index.md) for the full concept page.

## How They Work Together

A simple way to think about Wima is:

- `App` assembles the game.
- `Plugin`s add reusable features.
- `World` stores state.
- `Entity` identifies a thing in the world.
- `Component`s describe that thing.
- `Resource`s hold shared state.
- `System`s act on the world during a schedule.

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
