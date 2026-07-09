# @wimaengine/movable

`@wimaengine/movable` is the Wima engine motion layer: it packages 2D and 3D motion-state components, prefab helpers, and ECS plugins for movable entities.

## Capability Highlights

- Models motion state with velocity, acceleration, rotation, and torque components.
- Covers both 2D and 3D movement so projects can stay within a single dimensional model.
- Provides prefab helpers for common movable entity setups.
- Ships plugin and system hooks that keep movement data active inside ECS.
- Fits alongside transform, integrator, gravity, and damping layers as part of the motion stack.

## Core Concepts

### Motion Components

The core primitive is data-oriented motion state. These components describe how an entity moves, rather than how it is rendered or simulated, which makes them suitable inputs for integrators and physics-adjacent systems.

#### 2D Motion

The 2D surface is for planar movement and angular control in a flat world. It is the simplest mental model for top-down or side-view projects and should be presented as the default entry point when docs need a concrete example of movable state.

#### 3D Motion

The 3D surface mirrors the 2D component model for spatial movement. Future docs should emphasize parity with the 2D API so readers understand this package as a dimensionally consistent motion layer rather than a separate feature set.

### Prefab Helpers

Prefabs provide ready-made movable entity setups. They reduce boilerplate by establishing a known component bundle and make it easier to describe common mover archetypes in declarative terms.

### Plugins

The plugin layer is the runtime hook. It is responsible for registering the movement systems that keep movable state active inside ECS, and it is the clearest place to explain lifecycle or integration behavior in a future README.

## Notes

- The current README already frames the package around components, prefabs, and plugins; a future README should preserve that structure unless the source surface grows in a way that justifies more detail.
- Package metadata exposes a root entry point and a `./src` subpath export, so documentation should distinguish the published package surface from source imports when that matters.
- The package depends on `@wimaengine/app`, `@wimaengine/core`, `@wimaengine/ecs`, `@wimaengine/math`, `@wimaengine/reflect`, `@wimaengine/transform`, and `@wimaengine/type`, which suggests it is meant to be used as a connective layer rather than a standalone motion library.
- `transform`, `integrator`, `gravity`, and `damping` are the adjacent concepts the README already names; future docs should explain movable as one part of that stack.
- The package is published as an ES module package, so future README language should stay consistent with an ESM-first surface.
