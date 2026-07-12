---
title: World
---

The world is the ECS registry that holds entity identity, dense component storage, resources, archetypes, and the metadata needed to move data safely between them.

## What The World Owns

`World` is the shared storage boundary for ECS state. It owns:

- entity slots and generations
- tables for dense component rows
- archetypes for exact component layouts
- world resources and resource aliases
- the type store that tracks component metadata and hooks

That makes the world the place where "what exists?" and "where is it stored?" meet. If you already have one entity and only want to inspect it, see [Entity cells](../20-entity-cells/index.md). If you want to read many matching entities, use [Queries](../14-queries/index.md).

## How Data Moves

When you call `world.spawn(...)`, the world reserves an entity slot, creates an `EntityHandle`, resolves the matching archetype, and inserts the components into the right table row. The handle is stored with the entity so it remains part of the entity's own data.

When you add or remove components later, the world does not rewrite the entity in place. It resolves the new component set, moves the row to the table that matches that set, and updates the entity location. That is why the world can keep entity identity stable while storage changes underneath it.

```js
const player = world.spawn([new Position(0, 0), new Velocity(1, 0)])

world.insert(player, [new Name('Player')])
world.remove(player, [Velocity])
```

The first call creates a live entity with `Position` and `Velocity`. The second changes the component set, so the row moves to a different archetype and table. The handle stays the same.

## Resources And Metadata

The world also owns shared resources such as clocks, asset stores, or command queues. Those live outside entity storage and are read through `getResource()`, `hasResource()`, and `setResource()`. Resource aliases let one stored resource appear under another type id, which is useful when a package wants to hide an implementation type behind a public name.

Component metadata lives alongside that storage model. `setComponentHooks()` attaches add, remove, and insert callbacks to that type. The world then fires those hooks when entity membership changes.

That is the main boundary to remember: components and entities live in tables and archetypes, while resources and type metadata live on the world itself.

## Rule Of Thumb

Use `World` when you need to create, mutate, or remove ECS state. Use [Queries](../14-queries/index.md) when you need to iterate over matching rows, [Commands](../15-commands/index.md) when you want to stage writes for later, and [Reflection and type metadata](../22-reflection-and-type-metadata/index.md) when you need runtime type descriptions for the data you are storing.
