---
title: Render Core
---

`@wimaengine/render-core` provides the shared rendering abstractions used by the canvas and WebGL backends.

## Installation

```sh
npm i @wimaengine/render-core
```

## Capability Highlights

- Camera, mesh, material, and render-list components.
- Shared render assets for meshes, images, shaders, and materials.
- Resource caches for programs, textures, images, and aliases.
- Render events, plugins, prefabs, and type exports for backend integration.

## Core Concepts

### Components

The components modules store camera, mesh, material, and render-list state.

### Assets

The assets modules define the renderable data types used by the backends.

### Resources

The resources modules manage caches and aliases for render assets and GPU state.

### Events

The events modules surface asset and render lifecycle changes to the runtime.

### Prefabs

The prefabs modules provide ready-made render setups such as cameras and basic meshes.

## Notes

- `@wimaengine/render-canvas2d` and `@wimaengine/render-webgl` build on this shared layer.
