---
title: Narrowphase
---

`@wimaengine/narrowphase` provides contact generation and collision-resolution support.

## Installation

```sh
npm i @wimaengine/narrowphase
```

## Capability Highlights

- Collider and soft-body components for contact generation.
- Physics property hooks that react to component changes.
- Contacts and 2D narrowphase resources for runtime collision state.
- Settings and systems for narrow-phase simulation.

## Core Concepts

### Components

The components modules hold collider, soft-body, and physics-property data.

### Hooks

The hooks modules keep collision-related component state synchronized with the world.

### Resources

The resources modules store contact data and narrowphase runtime state.

### Settings

The settings module captures narrowphase configuration values.

## Notes

- `@wimaengine/broadphase` supplies candidate pairs before this package resolves actual contact behavior.
