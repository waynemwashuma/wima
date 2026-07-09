---
title: Core
---

`@wimaengine/core` is the engine's runtime integration layer, wiring app startup, frame scheduling, deferred entity commands, reflection metadata, and snapshot protocols into the default execution path.

## Installation

```sh
npm i @wimaengine/core
```

## Capability Highlights

- Boots the default app runtime with `CorePlugin`, which installs the scheduler builder resource, sets `defaultRunner`, creates the core schedules, and registers the shared phase graph.
- Stages entity lifecycle changes through `EntityCommands`, `SpawnCommand`, and `DespawnCommand` so systems can queue mutations instead of touching the world immediately.
- Defines the engine's schedule labels and phase labels with `AppSchedule` and `CoreSystems`.
- Drives scheduled work from `requestAnimationFrame()` through `defaultRunner`, giving the app a browser-oriented frame loop.
- Seeds the reflection and type registry with `registerCoreTypes` and `registerPrimitiveTypes`.
- Exposes abstract snapshot contracts through `ToSnapshot` and `FromSnapshot` for downstream serialization layers.

## Core Concepts

### CorePlugin

`CorePlugin` is the package's bootstrap layer. In `register(app)` it installs the shared `SchedulerBuilder` resource, sets `defaultRunner` as the app runner, creates the `Startup` and `Update` schedules, and registers the `CoreSystems` phase chain for both schedules. It also seeds the type registry during startup and flushes deferred commands at `CoreSystems.End`, making the core package the opinionated runtime baseline other packages extend.

### AppSchedule

`AppSchedule` defines the two schedule labels used by the engine app: `Startup` and `Update`. They are frozen constructor labels rather than plain strings, which keeps schedule identity stable across the app, scheduler, and plugin layers. `Startup` runs once when the app starts; `Update` repeats on every frame.

### CoreSystems

`CoreSystems` names the ordered phase labels that subdivide each schedule: `Start`, `PreMain`, `Main`, `PostMain`, and `End`. `Main` is the default landing zone for systems, while `End` is where queued commands are drained. Using constructor labels keeps the phase graph predictable without relying on stringly-typed ordering.

### EntityCommands, SpawnCommand, and DespawnCommand

`EntityCommands` is the deferred entity mutation helper built around the world's `CommandQueue`. `spawn()` reserves a new entity handle up front, `entity()` targets an existing handle, `insert()` and `insertPrefab()` stage components, `build()` queues the buffered spawn command and returns the handle, `spawnBatch()` repeats that flow for prefab component arrays, and `despawn()` queues a removal. The class guards its buffered state with assertions so insert and build calls only work after a spawn or entity selection.

`SpawnCommand` is the queued mutation that stores the entity handle plus any staged components, then inserts them into the ECS world when executed. `DespawnCommand` removes the target entity when the command queue drains. Together they keep entity creation and removal on the deferred command path instead of mutating the world directly.

### defaultRunner

`defaultRunner` is the built-in schedule driver. It snapshots the scheduler state into a map keyed by executable type id, initializes each executable's next run time from `performance.now()`, and advances the scheduler from `requestAnimationFrame()` ticks. Repeating executables are rescheduled using their configured delay, one-shot executables are marked inactive after their first run, and the animation frame loop continues to drive the world.

### Type Registration

`registerCoreTypes` registers `EntityHandle` as a structured type with `index` and `generation` fields, then binds its serialize and deserialize methods. `registerPrimitiveTypes` marks the built-in primitives, typed arrays, and `TypeRegistry` itself as opaque, registers `BigInt` and `TypeId`, and seeds the concrete container shapes used by reflection and serialization, including `Map<String, Number>`, `Array<TypeId>`, `Array<Field>`, `Map<TypeId, TypeEntry>`, and `Map<TypeId, MethodEntry>`. This is the metadata layer that lets the engine describe core values consistently across runtime systems.

### Snapshot Protocols

`ToSnapshot` and `FromSnapshot` are abstract interfaces for components and resources that can be converted to and from snapshot data. Their methods throw through `abstractMethod` until subclasses override them, which makes snapshot support explicit and world-aware. Downstream packages implement these contracts when they need stable serialization hooks around live ECS state.

## Exported Surface

- `CorePlugin` for runtime bootstrap.
- `AppSchedule` and `CoreSystems` for schedule and phase labels.
- `EntityCommands`, `SpawnCommand`, and `DespawnCommand` for deferred entity mutation.
- `defaultRunner` for the default frame loop.
- `executeCommands`, `registerCoreTypes`, and `registerPrimitiveTypes` for startup and command-flushing systems.
- `ToSnapshot` and `FromSnapshot` for snapshot-capable components and resources.

## Design Notes

- The package is an integration layer, not a standalone gameplay subsystem; its value comes from wiring the shared runtime contract other packages plug into.
- `defaultRunner` assumes `performance.now()` and `requestAnimationFrame()`, so it is browser-oriented rather than timer-driven.
- Deferred mutations are intentional: systems stage entity changes first, then `executeCommands` applies them at the end of each schedule.
- The package depends on `@wimaengine/app`, `@wimaengine/command`, `@wimaengine/ecs`, `@wimaengine/logger`, `@wimaengine/reflect`, `@wimaengine/schedule`, `@wimaengine/type`, and `@wimaengine/utils`.
- The manifest publishes both the package root and `./src`, but both route through the same top-level re-exports.
