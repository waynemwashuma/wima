---
title: Relationship
---

`@wimaengine/relationship` provides relationship queries and traversal helpers over entity graphs.

## Installation

```sh
npm i @wimaengine/relationship
```

## Capability Highlights

- Query helpers for relationship-aware ECS lookups.
- Entity traversal utilities for graph-like structures.
- Core helpers for relationship logic.

## Core Concepts

### Query

The query module filters entities by relationship state and related component data.

### Traverse Entities

The traversal helper walks entity graphs without forcing each caller to reimplement graph logic.

## Notes

- Use this package when entity connections matter as much as the components on the entities themselves.
