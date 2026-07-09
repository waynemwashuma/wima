---
title: Physics
---

`@wimaengine/physics` composes the broadphase, narrowphase, integrator, movable, and transform packages into a physics runtime.

## Installation

```sh
npm i @wimaengine/physics
```

## Capability Highlights

- Physics systems for simulation and debugging.
- Rigid body prefab helpers for common physics setups.
- Debugger plugin wiring for runtime inspection.

## Core Concepts

### Plugins

The plugins modules assemble the physics runtime and optional debugger support.

### Prefabs

The prefabs modules provide reusable rigid body entity setups.

### Systems

The systems modules run the main physics loop and the debugger integration.

## Notes

- This package is the top-level composition layer over the lower-level physics packages.
