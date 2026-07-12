---
title: Emitter
---

`@wimaengine/emitter` is Wima's ECS particle-emission layer, combining emitter state, prefab helpers, and runtime plugin wiring for 2D and 3D effects.

## Package Role

- ECS extension for particle emission and lifetime management, not a standalone renderer or simulation engine.
- Built around `Emitter` and `Particle` components, with 2D and 3D prefab helpers plus plugin classes for runtime registration.
- Uses `Range`-based burst counts and lifetimes so emission can vary per cycle and per particle instead of relying on fixed numbers.
- Emits particles from global transforms in world space, then tags them with `Particle` and `Timer` components for cleanup.
- The public package surface is grouped into `components`, `prefabs`, and `plugin`; `systems` supports the plugins but is not re-exported from the package root.
- The manifest publishes `.` and `./src`, so README language should distinguish package imports from source-level imports.

## README Guidance

- Keep the summary feature-first and avoid tutorial steps.
- Call out `Emitter` serialization and validation helpers, the marker-only `Particle` component, prefab builders, and plugin registration.
- Mention the world-space spawn behavior and timer-based cleanup as concrete implementation traits.
- Treat `systems` as an implementation detail behind the plugins unless the source surface changes.
