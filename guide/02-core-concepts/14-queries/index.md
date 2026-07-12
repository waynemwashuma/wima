---
title: Queries
---

A query is the read path over ECS storage. It turns a component signature into the tables that match it, then iterates those tables without scanning unrelated entities.

## How A Query Narrows Work

`Query` starts from the component constructors you pass in. It converts them to type ids, looks at the world's archetypes, and keeps only the tables whose archetype contains that component set.

That is the key boundary: a query does not decide matches row by row first. It asks the archetype layer which storage layouts can possibly match, then iterates the rows in those tables.

```js
const movers = new Query(world, [Position, Velocity], [has(Player), without(Paused)])
```

This query only touches entities that have both `Position` and `Velocity`, are in an archetype that includes `Player`, and are not in an archetype that includes `Paused`.

## Iteration Shapes

Once a query has its table list, it can read that storage in a few different ways:

- `get(entity)` reads the matching components for one known entity
- `each(callback)` walks every matching entity
- `eachCombination(callback)` visits pairs of matching entities from the selected tables
- `single()` returns the first match
- `count()` reports how many entities are currently matched

```js
movers.each(([position, velocity]) => {
  position.x += velocity.x
  position.y += velocity.y
})
```

The callback receives the components in the same order as the constructor list you passed to the query.

## Keep Queries Fresh

Queries cache the matching table ids when they are created. If the world's shape changes and you want the query to see newly created archetypes, call `update()` again.

That matters most when a query is long-lived. Short-lived queries can be created, used, and discarded in the same system. Long-lived queries should be refreshed when the world gains a new matching table layout.

If you only need to inspect one entity, use [Entity cells](../20-entity-cells/index.md) instead. If you are trying to decide which entities should be written later, pair the query with [Commands](../15-commands/index.md) so the actual mutation still happens on the deferred path.
