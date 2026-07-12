---
title: Entities and entity handles
---

An entity is the identity of something in the world. It does not hold behavior or data by itself. Components and resources hold state, and systems operate on that state. In the ECS layer, that identity is represented by an `EntityHandle`.

## What The Handle Carries

`EntityHandle` stores two numbers:

- `index`, which points to the entity slot
- `generation`, which changes when the slot is reused

That pair is what makes stale handles safe. If an entity is despawned and the slot is reused later, the old handle still has the old generation, so it no longer matches the new entity.

```js
const first = world.spawn([new Position(0, 0)])
const cell = world.getEntity(first)

world.despawn(first)

const second = world.spawn([new Position(4, 2)])

console.log(cell.exists()) // false: the original handle no longer points to a live entity
console.log(first.equals(second)) // false: generation keeps the handles distinct
```

If the allocator reuses the same slot, the index can match while the generation changes. That is why the old handle stays invalid after despawn even if a new entity later uses the same index.

## How The World Uses It

`world.spawn(...)` returns an `EntityHandle`, and the world stores that handle with the entity's components. That is why a query can include the handle when a system needs to know which entity it is processing, and why the handle remains the stable value you keep in your own code.

The handle is also a compact value. `id()` packs the index and generation into a single number, and `EntityHandle.from(id)` restores the handle later. That makes it useful for serialization, snapshots, or any place where you want to persist an entity reference without carrying the object itself.

```js
const entity = world.spawn([new Position(0, 0)])
const packed = entity.id()
const restored = EntityHandle.from(packed)

console.log(entity.equals(restored)) // true
```

## When To Reach For Something Else

If you want to inspect one entity's current state, use an `EntityCell`. That concept has its own page, [Entity cells](../20-entity-cells/index.md).

If you want to process many matching entities, use a [Query](../14-queries/index.md) instead of carrying handles around manually.

If you want to understand how the handle moves through the runtime, read [World](../13-world/index.md) and [Architecture](../02-architecture/index.md) next.
