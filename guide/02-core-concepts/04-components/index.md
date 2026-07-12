---
title: Components
---

Components are the data attached to entities in Wima's ECS. The ECS package stores them on entities, groups them into archetypes and tables, and uses their types to decide how queries and component hooks behave.

## What A Component Is

A component is entity-attached state. It answers questions like "what does this entity know?" or "how should this entity be described?" without carrying the entity's identity itself.

Common examples in Wima packages are transform state, motion state, names, window state, and render or physics data.

## Keep Components Data-Only

Components should stay data-only. Put rules, update logic, and behavior in systems; keep components focused on fields that describe the entity.

That is why many package components are simple serializable classes or records with no runtime side effects. If a component needs lifecycle behavior, that behavior belongs in component hooks or systems, not in the component itself.

When a package needs setup around a component, it usually installs hooks during app startup and lets the world record the component type as part of that setup. The hook callbacks live on the world, but they are part of the component setup story, not a separate runtime theory. That is the shape used by packages like `@wimaengine/hierarchy`, `@wimaengine/window-dom`, and the rendering and physics packages.

```js
import { App } from '@wimaengine/app'
import { ComponentHooks } from '@wimaengine/ecs'

class Player {}

const onAdd = () => {}
const onRemove = () => {}
const onInsert = () => {}

const app = new App()

app
  .setComponentHooks(Player, new ComponentHooks(onAdd, onRemove, onInsert))
```

In practice, that means the component class stays pure while the app wires in the lifecycle behavior before runtime starts. There is no separate `registerType()` step in that flow.

## Registration And Metadata

The ECS world registers component types through its type store. That registration gives each component a compact id and records metadata in `ComponentInfo`, including the type name and any hooks bound to that component.

This type metadata is what lets the ECS look up components by constructor, move them safely between tables, and fire add, remove, and insert hooks when entity membership changes.

The hook path matters because it ties component behavior to the world lifecycle. The world uses the stored metadata to decide which callbacks to fire as entities gain or lose that component, and it can record the type as soon as hooks are attached or the component first appears. That keeps the component class itself simple while still letting the engine react to membership changes.

## How Components Are Used

You usually add components when spawning an entity or when a system mutates world state. Queries then select entities by component signature, and `EntityCell` lets you inspect the components on one specific entity when you already have its handle.

Component hooks are what make component-centric setup practical. A scene loader can add a component and let the hook initialize related state, a window plugin can respond when a `Window` component appears, and a physics package can attach collision bookkeeping as soon as the entity gains the relevant component. The component is still just data; the hook is the lifecycle bridge.

If you want the hook to apply across every world in the app, stage it through `App.setComponentHooks()`. If you only need one world, call `world.setComponentHooks()` directly.

That is why the component page and the component-hooks page should be read together. This page explains what components are for, and [Component hooks](../09-component-hooks/index.md) covers the callback shapes that run when component membership changes.

## See Also

- [Entities and entity handles](../03-entities-and-entity-handles/index.md)
- [Resources](../05-resources/index.md)
- [Systems](../06-systems/index.md)
- [Queries](../14-queries/index.md)
- [Entity cells](../20-entity-cells/index.md)
- [Component hooks](../09-component-hooks/index.md)
- [Reflection and type metadata](../22-reflection-and-type-metadata/index.md)
