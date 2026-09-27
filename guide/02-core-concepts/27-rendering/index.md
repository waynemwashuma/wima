---
title: Rendering
---

Rendering in Wima is split between shared component/resource state and backend-specific frame execution. The render features define the render state and asset types, then turn that state into pixels through different runtime paths. Canvas2D currently handles the 2D material path; WebGL provides the GPU-oriented 3D path with shaders, pipelines, and caches.

## The Shared Layer

The shared layer is where renderable state lives. `Camera`, `Mesh`, `Material`, `Meshed`, `BasicMaterialInstance`, and the render-list components all sit here, which means render behavior is driven from components and resources rather than from a separate scene graph. The shared render layer supports parallel 2D and 3D state, and the backend selects the matching transform, camera, and render-list data.

This is also where the render assets live. Meshes, images, shaders, and basic materials are registered through the asset system, then exposed through resource aliases so the rest of the engine can look them up by type instead of by backend-specific storage. An asset handle identifies the content; it does not contain a GPU buffer, Canvas2D object, or other backend resource.

That is the key integration point with [Assets and handles](../26-assets-and-handles/index.md): rendering never owns the content identity itself. It reads handles, pulls assets through the asset layer, and then builds backend state from those assets. The render-core plugin registers image, mesh, shader, and basic-material asset collections, lifecycle events, and an image importer. The current image importer accepts PNG and JPEG extensions, stores the loaded bytes and dimensions as an engine `Image`, and leaves backend-specific conversion to the renderer.

## Backend Handoff

`RenderCorePlugin` wires the shared render types into the app, installs the render asset plugins, registers the image importer, and attaches component hooks so mesh handles are cleaned up when a render component is removed.

`Canvas2DRendererPlugin` and `WebglRendererPlugin` pick up from there. Canvas2D clears the canvas, resolves 2D cameras and render lists, and runs material-specific Canvas2D systems; its current basic-material path fills 2D mesh geometry with the material color. WebGL seeds GPU-facing caches, registers the WebGL-specific material pipeline, and installs systems that create or update buffers, build shader programs, queue meshes, and dispose dropped GPU state. Both backends look up the main canvas through [Windowing](../34-windowing/index.md), so rendering depends on a valid `MainWindow` entity and a `Windows` resource. WebGL additionally requires a WebGL 2 context.

## How Data Moves

The render flow is more useful to think about than the individual classes:

1. A system or prefab creates renderable component and resource state, often through a mesh or camera prefab.
2. Transform systems resolve local state into `GlobalTransform2D` or `GlobalTransform3D`; render-core uses those world-space results when it bins entities.
3. Asset handles point at mesh, shader, image, or material content, and render lists collect the draw work for each camera and material type.
4. The selected backend resolves the window canvas and turns the shared assets into backend state: Canvas2D applies drawing operations, while WebGL creates or reuses GPU buffers and programs and uploads uniforms.
5. The backend draws each camera's render list. Asset lifecycle events and dropped-asset handling let it refresh or release derived state as content changes.

That is why [Scenes](../31-scenes/index.md) can carry render state cleanly. A scene can restore cameras, meshes, and materials as component data, and the backend only has to rebuild GPU state from those components and asset handles.

## Math And Runtime State

Rendering leans on [Math](../30-math/index.md) for camera matrices, model transforms, and projection math, and on the transform feature for hierarchy-aware world-space state. It also leans on resources and systems so asset updates, render-list construction, backend preparation, and drawing stay deterministic inside the app schedule.

In practice, that means render code is split by responsibility: assets provide content and stable identity, components and resources provide render state, transforms provide world-space placement, math provides projections, windowing provides a canvas, and the selected backend turns the shared description into pixels. The concept is the same across backends, but the derived runtime state is not interchangeable: Canvas2D uses a 2D drawing context, while WebGL owns shaders, buffers, uniform data, and GPU cache lifetime.
