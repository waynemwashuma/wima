# Render Core Feature Notes

`@wimaengine/render-core` provides the shared rendering abstractions used by the canvas and WebGL backends.

## Preferred README Shape

- YAML frontmatter `title: Render Core`
- One-sentence summary of the package's role in the engine
- `## Installation`
- `## Capability Highlights`
- `## Core Concepts`
- `## Notes`

## Capability Highlights

- Shared camera, mesh, material, render-list, and material-instance components.
- Render asset types for meshes, shaders, images, and basic materials.
- Resource aliases and caches for image, mesh, material, program, and texture management.
- Event types for added, modified, and dropped asset lifecycle changes.
- Prefabs for standard cameras and basic mesh setup.
- Plugin wiring that registers render asset plugins, importers, type metadata, and component hooks.
- Backend-agnostic integration surface for canvas and WebGL packages.

## Core Concepts

### RenderCorePlugin

`RenderCorePlugin` is the package's integration layer. It registers the shared render component types, installs the render asset plugins, wires the image importer, registers the render-core startup system, and binds resource aliases for asset collections. It also attaches the `Meshed` component hook so mesh-handle cleanup stays consistent when render components are removed.

### Components

The component modules store the state that other packages need to render entities. `Camera`, `Mesh`, `BasicMaterialInstance`, `Meshed`, `Material`, and the render-list components live here, which makes the render core the place where entity data becomes renderable scene state.

### Assets

The asset modules define the render asset types that flow through the backend-specific loaders and caches. Meshes, images, shaders, and basic materials all have dedicated asset types and supporting material definitions, including the basic material preset used by the default render path.

### Resources

The resource modules manage aliases and caches for render data. The package keeps separate caches for programs and textures, plus image and asset collection resources that allow backend code to look up render data by type instead of by ad hoc storage.

### Events

The event modules surface asset lifecycle changes to the runtime. Image, mesh, shader, and basic-material events track added, modified, and dropped states so backends and tooling can react to asset changes consistently.

### Prefabs

The prefab modules provide ready-made render setups such as 2D and 3D cameras plus basic mesh scaffolding. These are the pieces that make it easy for higher-level packages to create a plausible render scene without assembling every component manually.

### Systems and Types

The systems modules register render-core type metadata and startup behavior. The types module collects the shared type exports used by render entities and render assets, which keeps the public surface coherent across the backend packages.

## Notes

- `@wimaengine/render-canvas2d` and `@wimaengine/render-webgl` build on this shared layer.
- The package depends on `@wimaengine/app`, `@wimaengine/asset`, `@wimaengine/color`, `@wimaengine/core`, `@wimaengine/ecs`, `@wimaengine/math`, `@wimaengine/reflect`, `@wimaengine/transform`, and `@wimaengine/type`.
- The package exports both its package root and `./src`, so README prose should mention the shared layer and the lower-level source entry point when that distinction matters.
