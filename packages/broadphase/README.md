---
title: Broadphase
---

`@wimaengine/broadphase` provides broad-phase collision candidate generation and pair tracking.

## Installation

```sh
npm i @wimaengine/broadphase
```

## Capability Highlights

- Hitbox components for broad-phase participation.
- Collision pair helpers and pair resources.
- Naive broad-phase implementations and systems.

## Core Concepts

### Components

The components modules describe the broad-phase hitbox data attached to entities.

### Core

The core modules hold collision-pair helpers and broad-phase algorithms.

### Resources

The resources modules store the currently detected broad-phase pair set.

### Systems

The systems modules run broad-phase collision detection inside ECS.

## Notes

- The package is designed to hand candidate pairs to the narrowphase layer.
