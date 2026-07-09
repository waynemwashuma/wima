---
title: Render Canvas2D
---

`@wimaengine/render-canvas2d` is Wima's Canvas2D backend layer, meant to register a 2D canvas renderer into the engine and expose the backend-specific systems, helpers, and types that support it.

## Package Role

- Canvas2D rendering backend for Wima rather than a standalone renderer.
- Sits alongside `@wimaengine/render-core` and integrates with the broader engine stack through `@wimaengine/app`, `@wimaengine/ecs`, `@wimaengine/transform`, `@wimaengine/window`, `@wimaengine/asset`, `@wimaengine/logger`, `@wimaengine/reflect`, and the shared type/core packages.
- Ships as an ESM package with typed entrypoints and a split public surface: the package root and the `./src` subpath are both exported.

## Capability Highlights

- Canvas clearing support through dedicated systems.
- Backend-specific core material helpers and types.
- Plugin modules for engine registration.
- Systems for runtime 2D rendering work.
- Utility helpers for Canvas2D-specific tasks.
- Published type definitions and source-level subpath exports for consumers that need them.

## Core Concepts

### Core

The core modules define the Canvas2D-specific material types and helper functions. This is where the backend's renderer-facing primitives belong, so a future README should name the concrete symbols here once the source is inspected.

### Systems

The systems layer drives canvas clearing and the rest of the Canvas2D render work inside Wima's update flow. This is the runtime-oriented part of the package and the best place to explain behavior that happens every frame.

### Plugins

Plugins register the Canvas2D backend with the engine. In a future README, this is the section that should explain how the backend becomes available to an app composition without turning the document into a usage tutorial.

### Utils

Utils holds small Canvas2D-specific helpers. Keep this section narrow in the README so it only covers support functions that do not fit cleanly into core or systems.

### Entry Points

The package root resolves to `index.js`, while `./src` is also exported. Any future README should keep import-path language aligned with that distribution layout and avoid implying additional published entrypoints.

## Notes

- The existing package README is intentionally high level and uses generic categories instead of concrete symbol names.
- A future README should stay feature-first and avoid step-by-step usage guidance unless the user explicitly asks for it.
- The package metadata points to a modular backend surface rather than a monolithic renderer, so the README should stay organized around the same core buckets: core, systems, plugins, and utils.
- The `files` field only publishes `index.js` and `src`, so the README should not imply that unrelated build outputs are part of the public package surface.
- If a later README needs an exported-surface section, fill it from source inspection instead of guessing from package metadata.
