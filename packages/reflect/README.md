---
title: Reflect
---

`@wimaengine/reflect` provides runtime type metadata and a registry for engine symbols.

## Installation

```sh
npm i @wimaengine/reflect
```

## Capability Highlights

- Runtime type info objects for registered symbols.
- A type registry resource for lookup and coordination.
- Plugin wiring for registering reflection state with the world.

## Core Concepts

### Info

The info module stores metadata about reflected types and the names or ids associated with them.

### Type Registry

The type registry resource tracks registered types so other packages can resolve metadata at runtime.

## Notes

- `@wimaengine/core`, `@wimaengine/window`, and `@wimaengine/scene` rely on this package for type metadata.
