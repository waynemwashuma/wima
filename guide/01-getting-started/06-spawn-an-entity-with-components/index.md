---
title: Spawn an entity with components
---

Now let's put those components on an entity.

Use `EntityCommands` inside a system when you want to stage entity creation. The command queue records the change first and lets the engine apply it at a safe point after the system finishes.

The `Position` and `Velocity` classes in the example are the components from the previous chapter.

```js
import { EntityCommands } from 'wima'

function setup(world) {
  const commands = new EntityCommands(world)

  const player = commands
    .spawn()
    .insertPrefab([new Position(0, 0), new Velocity(1, 0)])
    .build()

  console.log('spawned entity', player)
}
```

This sample does three things:

- Creates an `EntityCommands` instance for the current world.
- Queues two entity spawns with component data attached.
- Builds the queued commands so the engine can apply them together after the system completes.

> [!Note]
> `world.spawn()` does exist, but the tutorial uses `EntityCommands` here because direct world mutation can interfere with engine work that is already in progress. Deferring the spawn through commands keeps the change safe and predictable inside a system.

The returned entity handle lets you keep track of that entity later. In the next chapter, you will use a query to read and update entities based on the components you just added.
