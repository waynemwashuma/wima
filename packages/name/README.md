---
title: Name
---

`@wimaengine/name` provides an entity naming component and supporting systems.

## Installation

```sh
npm i @wimaengine/name
```

## Capability Highlights

- A name component for identifying entities in debug views.
- ECS systems that keep entity names available to other packages.
- Plugin integration for easy registration.

## Core Concepts

### Name Component

The name component stores the human-readable label associated with an entity.

### Systems

The systems module keeps naming data integrated with the ECS runtime.

## Notes

- This package is mainly used by tooling, diagnostics, and scene inspection flows.
