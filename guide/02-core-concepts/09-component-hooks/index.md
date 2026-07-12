---
title: Component Hooks
---

Component hooks let the world react when component membership changes. They are the lifecycle bridge between low-level ECS storage and higher-level runtime behavior.

This is one of the main reasons plugins can stay expressive without becoming magical. A plugin can attach hooks to a component, and then let systems or deferred commands trigger the lifecycle behavior naturally during runtime.

## What Hooks Are For

Hooks are for component-specific side effects that should happen when the world changes, not when a system merely looks at data. That includes keeping relationships consistent, syncing runtime resources, attaching external handles, and cleaning up side effects when a component disappears.

The package-level `World` handles the dispatch. Once a component type has hooks, the world fires them when entities spawn, gain new components, lose components, or are despawned.

## Add, Remove, Insert

The three hook slots cover the component lifecycle from different angles:

- `add` runs when a component is introduced to an entity.
- `remove` runs when a component is taken away or when an entity is despawned.
- `insert` runs when an entity already has components and new components are inserted alongside them.

That last one matters more than it looks. `insert` is what lets already-present components respond to a change in the entity's composition instead of only responding to first-time attachment.

For example, a hierarchy plugin can use hooks to keep parent and child links synchronized, while a scene plugin can use them to initialize or tear down scene-instance state as entities enter or leave a scene.

## Startup Pattern

Hooks are usually installed during plugin registration or app startup:

```ts
import { ComponentHooks, World } from '@wimaengine/ecs'

class SceneInstance {}
const addSceneInstance = () => {}
const removeSceneInstance = () => {}
const insertSceneInstance = () => {}

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

That pattern keeps lifecycle wiring close to the component definition and makes the startup path explicit. The world records the component type when the hooks are attached, so there is no separate registration step. By the time [Runners](../11-runners/index.md) start advancing schedules, the world already knows which components need lifecycle behavior.

## Related Concepts

- [Plugins](../10-plugins/index.md) for packaging hook setup with the rest of a feature
- [Systems](../06-systems/index.md) for the runtime work that often triggers hooks through world mutation
- [Relationships](../08-relationships/index.md) for graph-like component behavior built on lifecycle callbacks
