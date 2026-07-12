---
title: Render WebGL
---

`@wimaengine/render-webgl` provides the WebGL rendering backend, shader programs, and GPU-facing caches.

## Package Role

Treat this package as the implementation layer behind `@wimaengine/render-core`. When future docs need to explain where rendering becomes WebGL-specific, this is the package to reference.

## Capability Highlights

- Ships built-in shader sources and shader composition helpers for the backend.
- Contains render pipeline logic plus WebGL-specific constants and helpers.
- Manages GPU-facing caches for clear color, UBOs, meshes, programs, and attribute maps.
- Provides systems and plugin wiring so the backend can run inside the engine runtime.
- Sits at the integration boundary with `@wimaengine/app`, `@wimaengine/ecs`, `@wimaengine/window`, and the rest of the engine stack, so documentation should describe it as a backend rather than a general WebGL utility package.

## Core Concepts

### Shaders

The shader modules define the backend's built-in GPU programs and composition helpers. Future README copy should present them as foundational renderer assets, not as a user-facing shader authoring toolkit.

### Core

The core modules hold the WebGL render pipeline logic and constants/helpers that support it. This is where docs should explain how engine render state is translated into WebGL behavior.

### Resources

The resources layer owns GPU-facing cache state, including clear color, UBOs, meshes, programs, and attribute maps. This is the best place to mention reuse, state retention, and performance-oriented behavior.

### Systems

The systems layer runs the backend inside the engine runtime. Future docs should mention plugin or system wiring here, especially when describing how the package fits into app or ECS lifecycle management.

## Notes

- Keep the package positioned as the WebGL counterpart to `@wimaengine/render-core`.
- Emphasize GPU state, cache lifetime, and runtime integration over generic WebGL background material.
- Avoid usage walkthroughs unless the README request explicitly asks for them.
- The package exposes both `.` and `./src` entrypoints, so future docs can distinguish stable public access from source-oriented access if needed.
- The current README is intentionally terse; a future README will likely need slightly fuller language around backend responsibilities and the caches it owns.
