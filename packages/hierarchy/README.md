---
title: Hierarchy
---

`@wimaengine/hierarchy` provides parent and children components plus the hooks that keep entity trees consistent.

## Installation

```sh
npm i @wimaengine/hierarchy
```

## Capability Highlights

- Parent and children components for entity-tree relationships.
- Hooks that keep hierarchy data synchronized.
- ECS systems and plugin wiring for tree maintenance.

## Core Concepts

### Parent

The parent component stores the upward link in the hierarchy.

### Children

The children component tracks descendant entity ids and updates when the tree changes.

### Hooks

The hooks module keeps parent/children relationships consistent as entities move or are removed.

## Notes

- Other scene and transform packages rely on `@wimaengine/hierarchy` for structural relationships.
