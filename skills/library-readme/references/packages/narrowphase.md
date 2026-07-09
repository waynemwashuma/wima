---
title: Narrowphase
---

`@wimaengine/narrowphase` is the contact-generation layer of Wima's physics stack, turning broadphase candidate pairs into collision data, runtime state, and systems that support narrow-phase simulation.

## Package Role

This package sits between broadphase candidate detection and the rest of the physics runtime. The current README frames it around collider state, physics-property updates, contacts, and simulation support, so future README copy should describe it as the place where collision behavior is resolved and tracked rather than as a general geometry library.

## Capability Highlights

- Provides collider and soft-body components used as inputs to contact generation.
- Includes physics-property hooks that react to component changes and keep collision-related state synchronized.
- Exposes contacts and 2D narrowphase resources for runtime collision data.
- Ships settings and systems for narrow-phase simulation behavior.
- Integrates with `@wimaengine/broadphase`, `@wimaengine/ecs`, `@wimaengine/math`, `@wimaengine/movable`, `@wimaengine/transform`, `@wimaengine/app`, `@wimaengine/reflect`, and `@wimaengine/type`, which places it squarely in the ECS-driven physics pipeline.
- Exports a root entry point and a `./src` subpath, so future docs can refer to the public bundle or source-level entry when needed.

## Core Concepts

### Components

The component layer centers on collider and soft-body data. These are the pieces narrowphase needs to decide which entities can generate contacts and how that contact data should be shaped for the rest of the physics stack.

### Hooks

Physics-property hooks are the synchronization layer. They react when component state changes, keeping the world and the narrowphase data in step as colliders or related physics metadata evolve.

### Contacts

Contacts are the direct output of narrowphase work. The README suggests this package is responsible for generating and maintaining contact data that downstream systems can consume during simulation.

### Resources

The contacts and 2D narrowphase resources hold runtime collision state. They are the package's persistence layer for data that must survive across updates, which makes them important for debugging, stepping, and any later solver or resolver integration.

### Settings

Settings gather narrowphase configuration in one place. This keeps simulation behavior tunable without forcing future docs to describe hard-coded constants or implementation details.

### Systems

The systems layer is where the package's narrow-phase work actually runs. Future README copy should treat these systems as the operational bridge between ECS state, generated contacts, and the runtime collision pipeline.

## Notes

- Keep the package framed as a collision/contact layer, not as a standalone solver API.
- `@wimaengine/broadphase` is the upstream source of candidate pairs; this package handles the actual narrow-phase contact behavior after that filtering step.
- The manifest exposes only `.` and `./src`, so any future exported-surface section should stay high level unless the public symbols are being documented directly from source.
- The current README is already feature-first; a future README should preserve that structure and avoid tutorial-style usage sections unless specifically requested.
- If a future README needs an implementation-traits section, the most relevant traits to call out are ECS integration, runtime state storage, and change-driven hooks.
