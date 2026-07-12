---
title: Store shared state in a resource
---

A resource is shared state that lives on the world instead of on an entity. Use it for configuration, timers, scores, or any value many systems need to read.

This chapter builds on the previous query example. `Position` and `Velocity` are still entity data, while `MovementSettings` is shared state that applies to all movers.

The setup code below reuses the `Position` and `Velocity` components from the earlier chapters instead of redefining them.

## What A Resource Is

A resource belongs to the world, not to a single entity. That makes it a good place for values that should be available everywhere in the app.

- Shared configuration, such as movement speed or difficulty
- Counters and timers, such as score, elapsed time, or cooldown tracking
- Shared lookups or maps, such as input mappings or entity registries

## Example

```js
import { App, Query } from 'wima'

class MovementSettings {
  constructor(speed = 1) {
    this.speed = speed
  }
}

const app = new App()
app.setResource(new MovementSettings(2))

function update(world) {
  // Read the shared movement settings once, then apply them to every match.
  const settings = world.getResource(MovementSettings)
  const movers = new Query(world, [Position, Velocity])

  movers.each(([position, velocity]) => {
    position.x += velocity.x * settings.speed
    position.y += velocity.y * settings.speed
  })
}
```

## How It Works

- `app.setResource(new MovementSettings(2))` stores the shared value on the world before the app starts.
- `world.getResource(MovementSettings)` reads that same shared value inside a system.
- `settings.speed` affects every entity the query returns, so one change updates the whole group.

## Why Use A Resource

Use a resource when the value is not tied to one entity. If you copied `speed` into every entity, changing the speed would require updating all of them. Keeping it in a resource lets one system or one setup step control the shared value.

If the value belongs to only one entity, keep it in a component instead. That keeps the line between entity-specific state and shared state clear.
