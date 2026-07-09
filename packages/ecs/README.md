---
title: ECS
---

`@wimaengine/ecs` is the entity-component layer behind Wima. It owns entity storage, component lookup, archetype resolution, and typed world resources that higher-level engine packages build on.

## Installation

```sh
npm i @wimaengine/ecs
```

## Features

- Generation-safe entity handles that keep stale references from colliding with newly spawned entities.
- Dense archetype storage that groups entities by exact component set and keeps iteration cache-friendly.
- In-place component movement that preserves entity identity while rows move between tables.
- Typed world resources with direct lookup, alias resolution, and removal for shared engine state.
- Component lifecycle hooks for add, remove, and insert transitions.
- Query resolution and iteration with `get`, `each`, `eachCombination`, `single`, and `count`.
- Component presence filters through `has` and `without`.
- Compact type registration and metadata tracking through `TypeStore` and `ComponentInfo`.
- Public archetype, table, entity, query, and typedef exports for downstream packages.

## Core Concepts

### World

`World` is the central registry. It owns tables, archetypes, entities, resources, resource aliases, and the type store. It performs entity spawning, insertion, removal, despawning, resource management, type registration, and component hook dispatch.

### Query

`Query` resolves the archetypes that match a component signature and optional filters, then iterates those matches without recomputing the layout each time. It can fetch one entity's components, walk every matching entity, enumerate component pairs with `eachCombination`, return the first matching component set with `single`, and report the total match count.

### EntityHandle

`EntityHandle` is the stable identity token for an entity. It stores the entity index and generation together, supports equality checks, and serializes into a packed id so stale handles can be invalidated after despawn and reuse.

### EntityCell

`EntityCell` exposes a registry-backed view of one entity's current state. It can confirm whether the entity still exists, list the component types currently attached to it, read component values by constructor, and return the entity handle tied to that cell.

### EntityLocation

`EntityLocation` records where an entity lives inside the registry. It tracks the table id, row index, archetype id, and generation used to validate whether a handle still points at live data.

### Tables

`Tables` manages the dense table store for the world. It resolves an existing table when the same component set already exists or creates a new table when a new archetype appears.

### Table

`Table` stores one exact component layout in column form. It inserts component rows, reads values by type and row, removes rows with swap removal so the table stays dense, and moves component data into another table when an entity changes archetype.

### Archetypes

`Archetypes` indexes every known archetype in the world and resolves the archetype that matches a component set exactly or by containment.

### Archetype

`Archetype` pairs a component type set with the table that stores entities matching that set. It answers whether a candidate type list is fully contained in the archetype or matches it exactly.

### ComponentHooks

`ComponentHooks` attaches add, remove, and insert callbacks to a component type. The world fires those callbacks when entity component membership changes.

### ComponentInfo

`ComponentInfo` stores the compact component id, the registered type name, and the hooks bound to that component. It is the metadata record that sits behind type registration.

### TypeStore

`TypeStore` maps constructors and type ids to compact component ids. It is the registry layer that turns component types into stable numeric identifiers and makes component metadata and hooks addressable.

## Design Notes

- Every spawned entity stores its `EntityHandle` alongside its components.
- Component moves preserve entity identity while archetype membership changes.
- The package is designed as infrastructure for higher-level engine systems such as scheduling, physics, rendering, input, and audio.
