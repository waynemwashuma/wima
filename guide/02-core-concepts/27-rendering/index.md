---
title: Rendering
---

Rendering in Wima is split across two layers. `@wimaengine/render-core` defines the shared ECS-facing render model, and `@wimaengine/render-webgl` turns that model into a WebGL backend with GPU caches, shaders, and draw systems.

## The Shared Layer

The shared layer is where renderable state lives. `Camera`, `Mesh`, `Material`, `Meshed`, `BasicMaterialInstance`, and the render-list components all sit here, which means render behavior is driven from ECS rather than from a separate scene graph.

This is also where the render assets live. Meshes, images, shaders, and basic materials are registered through the asset system, then exposed through resource aliases so the rest of the engine can look them up by type instead of by backend-specific storage.

That is the key integration point with [Assets and handles](../26-assets-and-handles/index.md): rendering never owns the content identity itself. It reads handles, pulls assets through the asset layer, and then builds backend state from those assets.

## Backend Handoff

`RenderCorePlugin` wires the shared render types into the app, installs the render asset plugins, registers the image importer, and attaches component hooks so mesh handles are cleaned up when a render component is removed.

`WebglRendererPlugin` picks up from there. It seeds the GPU-facing caches, registers the WebGL-specific material pipeline, and installs update systems that create buffers, queue meshes, and dispose dropped GPU state. The backend also looks up the main canvas through [Windowing](../34-windowing/index.md), which is why render startup depends on a valid `MainWindow` entity and a `Windows` resource.

## How Data Moves

The render flow is more useful to think about than the individual classes:

1. A system or prefab creates renderable ECS state, often through a mesh or camera prefab from `@wimaengine/render-core`.
2. Asset handles point at mesh, shader, image, or material content.
3. Render lists collect the draw work for each camera.
4. The backend resolves the window canvas, creates or reuses GPU caches, and uploads uniforms and buffers.
5. The draw pass reads the asset data and emits WebGL commands.

That is why [Scenes](../31-scenes/index.md) can carry render state cleanly. A scene can restore cameras, meshes, and materials as ECS data, and the backend only has to rebuild GPU state from those components and asset handles.

## Math And Runtime State

Rendering leans on [Math](../30-math/index.md) for camera matrices, model transforms, and projection math. It also leans on ECS resources and systems so the render pass stays deterministic inside the app schedule.

In practice, that means render code is split the way it should be: assets provide content, ECS provides state, math provides transforms, windowing provides a canvas, and the WebGL package provides the backend that turns all of it into pixels.
