---
title: Use a query to update entities
---

A query finds every entity that has the components you ask for.

The `Position` and `Velocity` components in this example are the ones you defined in the previous chapter. This page shows how a system can update all matching entities in one pass.

```js
import { Query } from 'wima'

function update(world) {
  const movers = new Query(world, [Position, Velocity])

  movers.each(([position, velocity]) => {
    // Apply velocity directly to the entity's position.
    position.x += velocity.x
    position.y += velocity.y
  })
}
```

## What The Query Matches

`new Query(world, [Position, Velocity])` selects only entities that have both `Position` and `Velocity`. If an entity is missing either one, the query ignores it.

That gives you a clean way to target a specific kind of entity without checking every other entity in the world.

## How `each()` Works

`each()` visits every match and passes the matched components as a tuple.

- `position` is the current position component for one entity.
- `velocity` is the movement component for that same entity.
- Updating `position` changes that entity in place.

This is a good fit for per-entity work that should happen every frame, such as movement, animation, or gradual state changes.

## Why Use A Query

Queries keep systems narrow. Instead of looping through unrelated entities and checking their data one by one, the system asks for the exact components it needs and only runs on those matches.

That makes the logic easier to read and keeps the update work focused on one responsibility.
