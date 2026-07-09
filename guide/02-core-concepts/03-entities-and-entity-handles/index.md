---
title: Entities and entity handles
---

An entity is the identity of something in the world. It does not hold behavior or data by itself. Components and resources hold the data, and systems operate on that data.

In the ECS package, that identity is represented by an `EntityHandle`.

## Entity

An entity is a stable reference to one thing in the world. The world uses it to group components together as that entity moves through tables and archetypes.

You can think of an entity as the answer to the question, "which thing am I talking about?"

## EntityHandle

`world.spawn(...)` returns an `EntityHandle`. The handle stores two pieces of information:

- `index`, which points to the entity slot
- `generation`, which changes when the slot is reused

That generation check is what keeps old handles from colliding with new entities that reuse the same slot. If an entity is despawned and the slot is reused later, the old handle no longer matches the new entity.

```js
const first = world.spawn([new Position(0, 0)])
const cell = world.getEntity(first)

world.despawn(first)

const second = world.spawn([new Position(4, 2)])

console.log(cell.exists()) // false: the original handle no longer points to a live entity
console.log(first.equals(second)) // false: generation keeps the handles distinct
```

If the allocator reuses the same slot, the index can match while the generation changes. That is why the old handle stays invalid after despawn even if a new entity later uses the same index.

The handle also supports serialization through its packed id helpers: `id()` packs the index and generation into a single value, and `EntityHandle.from(id)` restores the handle later.

## How They Work Together

An entity is the identity, and the handle is the value you keep in code. The handle is also stored with the entity itself, so queries can include `EntityHandle` when a system needs to know which entity it is processing.

If you want to inspect one entity's current state, use an `EntityCell`. That concept has its own page, [Entity cells](../20-entity-cells/index.md).

## When To Use Each One

- Use an `EntityHandle` when you need to refer to an entity later.
- Use a `Query` when you want to process many matching entities at once.
- Use an `EntityCell` when you want to inspect one entity's current state.
