---
title: Transform
---

`@wimaengine/transform` owns the engine's 2D and 3D spatial state, composes local values into global transforms through hierarchy-aware systems, and keeps remote transform mirrors aligned with their source entities.

## Package Role

- Owns entity position, orientation, scale, and resolved transform state.
- Bridges ECS data with hierarchy-aware propagation instead of acting as a standalone math utility.
- Serves as a shared foundation for hierarchy and scene-level systems that depend on structural transforms.

## Capability Highlights

- Parallel 2D and 3D transform families with mirrored structure.
- Local transform components for authored state.
- Global transform components for resolved world-space state.
- Remote transform variants for propagated or mirrored state.
- Prefabs for common transform setups.
- Plugins and systems that register and maintain transform updates.

## Core Concepts

### 2D Components

The 2D component modules cover planar position, orientation, scale, and global transform state. Future README copy should present this as the lightweight path for flat-world or screen-space entities.

### 3D Components

The 3D component modules mirror the 2D structure for volumetric scenes. The README should emphasize that the same transform model applies, just across three axes.

### Global Transform State

Global transform components represent the propagated result of local transform data after hierarchy relationships have been resolved. This is the package's main runtime value: what downstream systems consume when they need world-space coordinates.

### Remote Transform Variants

Remote transform variants exist for state that is propagated or mirrored outside the local authoring flow. They belong to the transform infrastructure, not a separate feature family.

### Prefabs

The prefab modules package common transform setups into reusable entity definitions. They are useful for showing how the package standardizes transform wiring without repeating component setup.

### Plugins and Systems

Plugins register the transform runtime, and the associated systems keep transform hierarchies updated as entities move. The README should treat these as part of the package's value, not as incidental implementation detail.

## Notes for Future README

- Start with the package role and make the hierarchy-aware transform story explicit.
- Keep 2D and 3D sections parallel so readers can map one family to the other quickly.
- Mention `npm i @wimaengine/transform` near the top if this becomes a README.
- Avoid framing the package as a generic math library; its purpose is spatial state management inside the engine.
- The manifest points to `@wimaengine/app`, `@wimaengine/ecs`, `@wimaengine/hierarchy`, `@wimaengine/math`, `@wimaengine/reflect`, `@wimaengine/relationship`, and `@wimaengine/type`, so the docs should assume those integration points.
- The package exposes both the root entry and `./src`, so future docs can mention direct source imports if that distinction matters to readers.
- `packages/transform/README.md` can stay short; a future draft should prioritize capabilities and concepts over walkthroughs.
