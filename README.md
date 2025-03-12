# Wima
Wima is a modular, browser-focused game engine. If you already know ECS, render pipelines, and scheduling, think of it as a set of composable subsystems you can assemble into your runtime.

## Features

### Core + ECS
- `app`: Application lifecycle, system registration, and resource orchestration.
- `schedule`: System ordering and execution cadence.
- `ecs`: Entities, components, queries, and data-oriented storage.
- `command`: Deferred world mutations via command queues.
- `event`: Event signaling and consumption primitives.
- `reflect`: Runtime type metadata and identifiers.
- `logger`: Logging and assertion utilities.
- `profiler`: Timing and profiling utilities for system instrumentation.
- `diagnostic`: Runtime diagnostics and counters.
- `name`: Entity naming for debugging and inspection.
- `misc`: Bundled defaults to bootstrap common subsystems.

### Rendering + Visuals
- `render-core`: Shared render abstractions, components, and resource management.
- `render-canvas2d`: 2D rendering backend utilities and integration.
- `render-webgl`: 3D rendering backend utilities and integration.
- `color`: Color types and helpers.
- `geometry`: Bounding volumes and overlap tests.

### Physics + Motion
- `physics`: Rigid body simulation primitives and integration hooks.
- `broadphase`: Candidate pair generation for collision detection.
- `narrowphase`: Contact generation and resolution support.
- `integrator`: Motion integration utilities.
- `gravity`: Gravity-related resources and systems.
- `damping`: Damping-related resources and systems.
- `movable`: Kinematic motion helpers.
- `transform`: 2D/3D transform components and systems.
- `tween`: Tweening components and easing utilities.
- `animation`: Animation playback primitives and resources.

### Input + Windowing
- `input`: Input aggregation for keyboard/mouse/touch.
- `keyboard`: Keyboard input helpers and events.
- `mouse`: Mouse input helpers and events.
- `touch`: Touch input helpers and events.
- `window`: Window lifecycle, events, and commands.
- `window-dom`: DOM-backed window integration.
- `device`: Device and platform detection utilities.

### Assets + Audio + Storage
- `asset`: Asset loading, parsing, and lifecycle management.
- `audio`: Audio playback primitives and resources.
- `storage`: Local persistence helpers.

### Math + Data + Utils
- `math`: Vector, matrix, quaternion, and affine math utilities.
- `datastructures`: Common data structures and allocators.
- `algorithms`: Generic algorithm utilities.
- `noise`: Noise generation utilities.
- `utils`: General-purpose helpers and type definitions.
- `gizmo`: Debug and tooling visualization helpers.
- `demo`: Demo scaffolding utilities.

## Getting Started
TODO

## Contributing
Will be available when a contribution guide is written.