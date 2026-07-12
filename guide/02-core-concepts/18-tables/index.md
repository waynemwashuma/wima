---
title: Tables
---

Tables hold the actual component rows for one exact archetype. If archetypes describe shape, tables store the dense columns for that shape.

## Dense Column Storage

Each table owns one column per component type id. Every row in the table belongs to the same component layout, so the world can read a component by column and row instead of searching for it entity by entity.

That is why tables are the cache-friendly part of ECS storage. A query can walk a table row-by-row, and the row already lines up with the queried component order.

```js
const table = new Table([typeid(Position), typeid(Velocity)])

table.insert([typeid(Position), typeid(Velocity)], [
  new Position(0, 0),
  new Velocity(1, 0)
])
```

## Keeping Storage Tight

Tables use swap removal when a row is removed. That keeps the data dense without leaving gaps behind. If a row moves because of removal, the world updates the swapped entity's recorded location so the handle still points at the right row.

When an entity changes component shape, the world uses `moveTo()` to copy the row into the new table, then removes it from the old one. That is the storage side of archetype changes.

## Table Manager

`Tables` is the dense table store for the world. It reuses an existing table when the same component set already exists, or creates a new table when the world sees a new exact layout.

That manager is what keeps [Archetypes](../17-archetypes/index.md) and storage aligned. Archetypes decide whether a shape exists; tables decide where the rows live.
