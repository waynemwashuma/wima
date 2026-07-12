---
title: Archetypes
---

An archetype is the exact component shape of a group of entities. It is the boundary between "what components does this entity have?" and "which table stores that shape?"

## Archetype Versus Table

An archetype describes the set of component type ids. A table stores the actual rows for that exact set.

That split is important:

- the archetype answers shape questions
- the table holds the dense column data

When an entity gains or loses a component, the world resolves a new archetype for the new component set, then moves the row to the table owned by that archetype.

## Matching Shapes

Archetypes support two kinds of checks:

- `has(types)` means the archetype contains every type in the list
- `hasOnly(types)` means the archetype matches the list exactly

That is the same boundary [Queries](../14-queries/index.md) rely on. A query first checks the requested components against the archetype, and only then does it iterate the table rows.

## How The World Uses Archetypes

`World.resolve()` deduplicates the type ids it sees, looks for an existing exact archetype, and reuses that table if it already exists. If the world has not seen that exact shape before, it creates a new table and registers a new archetype for it.

So archetypes are not just labels. They are the index that lets the world turn "Position plus Velocity" into one precise storage location.

If you want the storage details behind that location, read [Tables](../18-tables/index.md) next.
