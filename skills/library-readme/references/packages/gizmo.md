# Gizmo Package Reference

## Role Summary
`@wimaengine/gizmo` provides debug gizmo primitives, settings, and render plugins.

## Capability Highlights
- Provides the core state and settings needed to drive debug gizmos.
- Uses Canvas2D systems to render gizmos through the engine's debug drawing path.
- Exposes separate 2D and 3D plugin entry points so gizmo support can be registered in the appropriate runtime context.
- Ships as an ESM package with both the package root and `./src` as public entry points.

## Core Concepts

### Gizmo Core State
The core layer is where the package's gizmo state lives. It is the place to describe what the debug layer tracks, how it is enabled, and which runtime data the gizmo pipeline depends on.

### Settings
Settings define the configurable surface for gizmo behavior. This is the right concept to document when explaining how the debug layer can be tuned without mixing those controls into rendering or plugin wiring.

### Canvas2D Systems
The systems layer handles drawing through the Canvas2D debug pipeline. Future README text should frame this as the package's rendering path, not as a generic utility module.

### Plugin Entry Points
The plugin modules provide the registration boundary for engine integration. The package separates 2D and 3D plugin entry points, so docs should treat them as distinct integration primitives rather than a single monolithic plugin API.

## Notes for Future README Drafting
- Keep the package positioned as tooling and debug visualization, not as gameplay logic.
- A future README should lead with the package's role in the engine's debug stack before describing modules.
- The installation line should use `npm i @wimaengine/gizmo`.
- The package manifest exposes both the package root and `./src`; a future README can mention that distinction if it needs to explain stable versus source-level entry points.
- If an exported surface section becomes necessary later, organize it by role, such as core state, systems, and plugin entry points, rather than by file path.
