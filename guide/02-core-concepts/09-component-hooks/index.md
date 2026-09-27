---
title: Component Hooks
---

Component hooks let the world react when component membership changes. They are the lifecycle bridge between low-level component storage and higher-level runtime behavior. Each callback receives the affected `EntityHandle` and the `World` that owns it.

This is one of the main reasons plugins can stay expressive without becoming magical. A plugin can attach hooks to a component, and then let systems or deferred commands trigger the lifecycle behavior naturally during runtime.

## What Hooks Are For

Hooks are for component-specific side effects that should happen when the world changes, not when a system merely looks at data. That includes keeping relationships consistent, syncing runtime resources, attaching external handles, and cleaning up side effects when a component disappears.

The package-level `World` handles the dispatch. Once a component type has hooks, the world fires them when entities spawn, gain new components, lose components, or are despawned. Hook registration also registers the component type in the world's type store, so a separate component-registration call is not required.

## Add, Remove, Insert

The three hook slots cover the component lifecycle from different angles:

- `add` runs for components introduced by `spawn()` or `insert()`.
- `remove` runs for components passed to `remove()`, and for every component on an entity passed to `despawn()`.
- `insert` runs for components that were already present when an entity's composition changes. In particular, inserting new components calls `insert` for the existing components, and removing components calls it for the components that remain.

That last one matters more than it looks. `insert` is what lets already-present components respond to a change in the entity's composition instead of only responding to first-time attachment. The callback does not mean that the component value was replaced; it signals that the entity moved through an archetype or component-membership transition.

For example, the hierarchy plugin uses add/remove hooks on `Parent` and `Children` to keep [relationships](../08-relationships/index.md) and entity trees consistent. The scene plugin uses add/remove hooks on `SceneInstance` to initialize and drop per-entity scene state. Audio, rendering, and animation use remove hooks to tear down runtime sinks, mesh handles, or animation state when their components leave the world.

## Startup Pattern

Hooks are usually installed during [plugin](../10-plugins/index.md) registration or app startup:

```ts
import { ComponentHooks, World } from 'wima'

class SceneInstance {}
const addSceneInstance = (entity, world) => {}
const removeSceneInstance = (entity, world) => {}
const insertSceneInstance = (entity, world) => {}

const world = new World()

world.setComponentHooks(
  SceneInstance,
  new ComponentHooks(
    addSceneInstance,
    removeSceneInstance,
    insertSceneInstance
  )
)
```

That pattern keeps lifecycle wiring close to the component definition and makes the startup path explicit. Arguments can be `null` when a component only needs part of the lifecycle; engine plugins commonly install remove-only hooks for resources that need cleanup. The world records the component type when the hooks are attached, so there is no separate registration step. By the time [Runners](../11-runners/index.md) start advancing schedules, the world already knows which components need lifecycle behavior.

Hooks run as part of the world mutation that causes the transition. They are useful for synchronizing external state, but they are not a replacement for [systems](../06-systems/index.md): animation and audio systems still process the component state during scheduled updates, while their hooks handle teardown at removal time. A hook should therefore use the supplied entity handle and world to perform focused lifecycle work rather than assume it is receiving a component value.
