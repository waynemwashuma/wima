---
title: Gravity
---

`@wimaengine/gravity` provides gravity resources and systems for motion simulation.

## Capability Highlights

- Centralizes gravity settings in a reusable resource so simulation state stays decoupled from the update logic.
- Applies gravity during runtime updates through dedicated systems rather than scattering gravity math across callers.
- Hooks into the ECS layer, so gravity can be registered as part of the engine's broader runtime composition.
- Sits inside the motion and physics stack, with dependencies on `@wimaengine/app`, `@wimaengine/core`, `@wimaengine/ecs`, `@wimaengine/math`, `@wimaengine/movable`, `@wimaengine/physics`, `@wimaengine/reflect`, and `@wimaengine/type`.
- Publishes both the package entry point and a `./src` subpath, which suggests a documented public surface plus a source-oriented import path.

## Core Concepts

### Gravity Resource

The gravity resource is the package's state anchor. The current README frames it as the place where gravity settings live, which makes it the object future docs should treat as the authoritative simulation configuration consumed by systems.

### Gravity Systems

The systems are the execution layer. They read the gravity resource and apply its effect during runtime updates, so they are the mechanism that turns configuration into motion behavior.

### ECS Registration

The README explicitly calls out plugin wiring for ECS registration. Future README drafts should keep that integration path visible because it is part of how the package enters the engine runtime, not just an internal implementation detail.

## Notes

- The existing README is intentionally sparse, so future documentation should stay feature-first and avoid tutorial-style usage steps unless requested.
- The package reads like a narrow integration module rather than a standalone simulation library; describe its value in relation to the motion and physics pipeline.
- The README says this package is usually consumed alongside `@wimaengine/integrator` and `@wimaengine/physics`; that adjacency is worth preserving in any future summary or architecture note.
- The manifest exposes `.` and `./src` and marks the package as ESM-only (`"type": "module"`), so docs should be careful about which entry point they refer to.
- If later source review reveals more exported symbols than the resource, systems, and registration hooks implied by the README, add an exported-surface section before expanding the rest of the narrative.
