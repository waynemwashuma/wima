---
title: Entity cells
---

An entity cell is a live view of one entity in the world registry. You get one from `world.getEntity(handle)` when you already know the entity you want to inspect.

Unlike a query, an entity cell is centered on one handle. It reads the entity's current location in the world's storage, so it is good for targeted inspection without scanning the whole registry.

## What It Exposes

An entity cell gives you direct access to the entity's current state:

- `exists()` tells you whether the handle still points to a live entity
- `get(Position)` reads a component from that entity by constructor
- `has([Position, Velocity])` checks whether the entity has specific components
- `components()` lists the component type ids currently attached to the entity
- `id()` returns the `EntityHandle` tied to the cell

```js
const player = world.spawn([new Position(0, 0), new Velocity(1, 0)])
const cell = world.getEntity(player)

if (cell.exists()) {
  const position = cell.get(Position)
  const velocity = cell.get(Velocity)

  position.x += velocity.x
  position.y += velocity.y
}
```

The cell is a read-friendly wrapper, not a replacement for the world. It is best used when you already have the handle and want to confirm state, inspect a few components, or branch on membership.

## How It Differs From A Query

A query is for many matching entities. An entity cell is for one specific entity.

- Use a query when you want to process a group of entities with the same components
- Use an entity cell when you already have one handle and want to inspect that entity

For write-heavy work, go back to [World](../13-world/index.md) or stage the change through [Commands](../15-commands/index.md) instead of trying to treat the cell like a mutation API.
