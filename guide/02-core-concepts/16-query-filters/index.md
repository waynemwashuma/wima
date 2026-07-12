---
title: Query filters
---

Query filters narrow a query before it starts iterating rows. They are archetype checks, not per-entity predicates.

## `has` And `without`

The two built-in filters are simple:

- `has(Component)` keeps archetypes that contain the component
- `without(Component)` keeps archetypes that do not contain the component

```js
const query = new Query(world, [Position], [has(Velocity), without(Paused)])
```

This query only looks at archetypes that already have `Position` and `Velocity`, and that do not have `Paused`.

## Why The Filter Runs At The Archetype Level

The query first asks the archetype layer which tables can possibly match the requested component signature. After that, the filter list is applied to the archetype itself.

That matters because it keeps iteration cheap. The query does not test every row against `has` and `without`; it narrows the storage layout first, then walks only the rows in the surviving tables.

The practical rule is simple: use filters to remove whole storage groups, not to model row-by-row business rules. If a condition depends on the contents of one specific entity, check that entity inside the query callback instead.

If you want the storage shape behind the filter result, read [Archetypes](../17-archetypes/index.md) and [Tables](../18-tables/index.md) next.
