---
title: Prefabs
---

Prefabs are the engine's reusable entity bundles. They are not a separate runtime system; they are the place where the most common ECS setups are packaged so app code and scene code do not have to assemble the same component combinations over and over.

## Why Prefabs Exist

A prefab is useful when a setup has a stable shape:

- a camera needs the same projection and render-state scaffolding every time,
- a basic mesh needs the same component pairing between a mesh handle and material state,
- a primary window needs the same `Window` and `MainWindow` combination before rendering can start.

That makes prefabs a bridge between ECS and higher-level engine flow. They reduce setup noise without hiding the component model.

## Engine Prefabs In Practice

`@wimaengine/render-core` ships the render-oriented prefabs: `createCamera2D`, `createCamera3D`, and `createBasicMesh`. Those are the standard starting points for a visible world, especially when paired with [Rendering](../27-rendering/index.md) and asset-backed meshes from [Assets and handles](../26-assets-and-handles/index.md).

`@wimaengine/window` ships `createMainWindow`, which is the equivalent bootstrap for the browser surface. It creates the primary window entity so the rest of the runtime has a canvas to render into and a window state to read from.

## Prefabs And Scenes

Prefabs matter even when a scene is the top-level handoff. [Scenes](../31-scenes/index.md) can restore authored content into live entities, but the scene still needs a consistent shape for common runtime pieces like cameras, render setup, or the primary window. Prefabs are the reusable building blocks for that shape.

The practical rule is: use a prefab when the bundle is structural, and use a scene when the bundle is authored content. Both end up as ECS entities, but they solve different parts of the setup problem.
