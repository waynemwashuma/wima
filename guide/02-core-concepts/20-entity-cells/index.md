---
title: Entity cells
---

An entity cell is a live view of one entity in the world registry. You get one from `world.getEntity(handle)` when you need to inspect a single entity directly.

Unlike a query, an entity cell is centered on one handle. It follows the entity's current location in the registry, so it stays aligned with the entity while the world moves component data around. If the handle no longer points to a live entity, `exists()` returns `false`.

## What It Exposes

An entity cell gives you direct access to the entity's current state:

- `exists()` tells you whether the handle still points to a live entity.
- `get(Position)` reads a component from that entity by constructor.
- `has([Position, Velocity])` checks whether the entity has specific components.
- `components()` lists the component types currently attached to the entity.
- `id()` returns the `EntityHandle` tied to the cell.

## Example

```js
const player = world.spawn([new Position(0, 0), new Velocity(1, 0)])
const cell = world.getEntity(player)

if (cell.exists()) {
  const position = cell.get(Position)
  const velocity = cell.get(Velocity)

  position.x += velocity.x
  position.y += velocity.y

  console.log(cell.components())
}
```

This is useful when you already know which entity you care about and want to inspect or verify its current state without scanning the whole world.

## How It Differs From A Query

A query is for many matching entities. An entity cell is for one specific entity.

- Use a query when you want to process a group of entities with the same components.
- Use an entity cell when you already have one handle and want to inspect that entity.

## When To Use It

- Inspect one entity after you already have its handle.
- Check whether that handle still points to a live entity.
- Read the components attached to that entity.
- Avoid using it as a replacement for a query when you need to process many entities.

See also [Entities and entity handles](../03-entities-and-entity-handles/index.md) and [World](../13-world/index.md).
