---
title: Commands
---

Commands are the deferred write path for ECS state. They let systems request entity changes now and let the runtime apply those changes at a controlled flush point later.

## Why The Engine Defers Writes

Direct world mutation is fast, but it creates ordering problems when several systems want to change the same entity in one frame. The command path avoids that by staging the mutation first and applying it after the main systems have run.

In the core runtime, `executeCommands()` drains the shared `CommandQueue` at the end of each schedule. That means systems can keep reading a stable world during the frame, then let the queued changes land together.

## EntityCommands

`EntityCommands` is the user-facing builder around that queue. It is the shape you use when a system wants to create or destroy entities without mutating storage immediately.

```js
const commands = new EntityCommands(world)

commands
  .spawn()
  .insert(new Position(0, 0))
  .insert(new Velocity(1, 0))
  .build()
```

`spawn()` reserves a live entity shell and starts buffering components. `insert()` and `insertPrefab()` add staged data to that buffer. `build()` turns the buffer into a queued `SpawnCommand`. `despawn(entity)` queues a `DespawnCommand` instead of removing the entity immediately.

`spawnBatch()` is just the same flow repeated for a list of component arrays.

## How It Fits The World

The command queue is not a separate storage model. It is a write buffer that eventually calls back into [World](../13-world/index.md). A spawn command inserts the staged components, and a despawn command removes the target entity from the world.

That is why commands belong with [Queries](../14-queries/index.md) and [World](../13-world/index.md): queries decide what should change, commands stage the change, and the world applies it in the dense storage layer.
