---
title: Queries
---

A query is the read path over component storage. It turns a component signature into the tables that match it, then iterates those tables without scanning unrelated entities.

## How A Query Narrows Work

`Query` starts from the component constructors you pass in. It converts them to type ids, looks at the world's archetypes, and keeps only the tables whose archetype contains that component set. The component list is therefore the required part of the match unless a component is marked with `optional`.

That is the key boundary: a query does not decide matches row by row first. It asks the archetype layer which storage layouts can possibly match, then iterates the rows in those tables.

```js
const movers = new Query(world, [Position, Velocity], [has(Player), without(Paused)])
```

This query only touches entities that have both `Position` and `Velocity`, are in an archetype that includes `Player`, and are not in an archetype that includes `Paused`.

An optional component does not narrow the archetypes. It is returned in its normal position when present and as `undefined` when absent:

```js
const movers = new Query(world, [Position, Velocity], [optional(Velocity)])

movers.each(([position, velocity]) => {
  if (velocity) position.x += velocity.x
})
```

Use `has(Component)` and `without(Component)` when component presence should decide which archetypes participate. Use `optional(Component)` when the query should include both shapes and the callback can handle the missing value. These filters operate on archetype membership; they are not value predicates for individual rows. For row-level conditions, check the component values in the callback.

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

`eachCombination` produces each unordered pair of distinct matching entities once. It is useful for pairwise systems such as broadphase checks, but it does not traverse relationships or discover connected entities; both values come from the query's matching tables.

## Keep Queries Fresh

Queries cache the matching table ids when they are created. If the world's shape changes and you want the query to see newly created archetypes, call `update()` again.

That matters most when a query is long-lived. Short-lived queries can be created, used, and discarded in the same system. Long-lived queries should be refreshed when the world gains a new matching table layout.

## Queries And Relationship Traversal

A regular `Query` answers a component-membership question: which entities have this component shape? It does not follow parent/child links, relationship components, or arbitrary graph edges. Relationship traversal is provided by `RelationshipQuery`, which uses queries to find the relationship and target data and then walks connections with tree or graph breadth-first/depth-first traversal.

That separation gives each operation a clear boundary: use `Query` for storage-oriented iteration and `RelationshipQuery` when the next entity depends on a relationship edge. Relationship traversal can apply the same query filters to the entities at either side, but it still requires the relationship component's `visit()` behavior to expose the connected handles.

If you only need to inspect one entity, use [Entity cells](../20-entity-cells/index.md) instead. If you are trying to decide which entities should be written later, pair the query with [Commands](../15-commands/index.md) so the actual mutation still happens on the deferred path.
