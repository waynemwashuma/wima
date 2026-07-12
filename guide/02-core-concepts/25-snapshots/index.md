---
title: Snapshots
---

Snapshots are the serialization boundary for live ECS state. They turn components and resources into transportable data, then rebuild that data back into world-aware objects later.

## What A Snapshot Is

A snapshot is not the world itself. It is a representation of world state that can be saved, moved, or restored without keeping direct pointers into live ECS storage.

That distinction matters. The live world owns entity locations, tables, and archetypes. A snapshot captures the shape and values of some of that state so it can cross a serialization boundary.

## The Core Contract

`@wimaengine/core` defines two abstract base classes:

- `ToSnapshot` for values that can produce snapshot data from a live `World`
- `FromSnapshot` for values that can rebuild themselves from snapshot data with world context

```js
class PositionSnapshot extends ToSnapshot {
  toSnapshot(world) {
    return { x: this.x, y: this.y }
  }
}
```

The `World` parameter is the important part. Snapshot conversion often needs live context, not just the value itself. A component may need to resolve another resource, preserve an entity handle, or translate world-specific references into serializable ids.

## How Reflection Connects To Snapshots

Snapshots rely on [Reflection and type metadata](../22-reflection-and-type-metadata/index.md) to know how to treat a value. The type registry can expose `toSnapshot`, `fromSnapshot`, `clone`, or `patch` methods for a registered type, which gives higher-level loaders a consistent way to serialize and restore data.

That is the shape used by scene loading: read the live world, ask the type registry how each value should be handled, and emit a snapshot that can later rebuild into runtime state.

## Rule Of Thumb

Use snapshots for data that needs to survive outside the current world instance. Use [World](../13-world/index.md) and [Queries](../14-queries/index.md) for live runtime work, and use reflection metadata when the serializer needs to understand what kind of value it is handling.
