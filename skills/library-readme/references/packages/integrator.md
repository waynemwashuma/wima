---
title: Integrator
---

`@wimaengine/integrator` provides Euler and Verlet motion integration systems.

## Installation

```sh
npm i @wimaengine/integrator
```

## Capability Highlights

- Provides two motion-update modes: Euler for straightforward first-order integration and Verlet for position-based integration.
- Packages the integration logic as runtime systems, so motion advancement plugs into the engine loop instead of living as a standalone math utility.
- Exposes plugin entry points that let downstream code choose an integration style without wiring the systems by hand.
- Sits in the movement stack alongside `app`, `core`, `ecs`, `math`, `movable`, and `transform`, which makes it an integration boundary rather than a full physics domain.
- Keeps the package focused on motion propagation only; the current docs do not imply collision, constraint solving, or rigid-body simulation.

## Core Concepts

### Euler Systems

Euler is the simple integration path. It advances motion with a first-order update, which makes it the most direct option when the package consumer wants a conventional velocity-driven step and does not need the extra characteristics of a position-based solver.

### Verlet Systems

Verlet is the alternate integration path. It advances state through a Verlet-style update, which shifts the emphasis toward positions and gives the package its other documented simulation style.

### Plugin Entry Points

The package is documented as having plugin entry points for choosing the integration mode. That is the main configuration boundary to preserve in a future README: users select Euler or Verlet at the plugin level instead of composing the systems manually.

### Motion Integration Systems

The core primitive is the system layer itself. The package value comes from registering integration behavior as engine systems, which means it belongs in the runtime graph and participates in the same scheduling and component-update flow as the rest of the engine.

## Notes

- The package README is intentionally terse, so a future README should lead with the Euler-versus-Verlet distinction before going into any implementation detail.
- The package.json surface is small: a root entry point plus a `./src` export. Do not assume a broad public API without checking source exports first.
- The current docs frame this as a focused runtime layer, not a general-purpose physics stack. Keep that boundary explicit in future documentation.
- The surrounding dependency set suggests the package works with engine state and transforms, so README copy should emphasize integration with movement and world updates rather than raw numeric formulas.
