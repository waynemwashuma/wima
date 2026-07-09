---
title: Wima Engine
---

Wima is a modular, browser-focused game engine. If you already know ECS, render pipelines, and scheduling, think of it as a set of composable subsystems organized by domain.

## Features

- `runtime`: Application lifecycle and runtime composition. See more in [app](./packages/app/README.md) and [core](./packages/core/README.md).
- `ecs`: Entities, components, queries, and data-oriented storage. See more in [ecs](./packages/ecs/README.md).
- `scheduling`: System ordering and execution cadence. See more in [schedule](./packages/schedule/README.md).
- `commands`: Deferred world mutations via command queues. See more in [command](./packages/command/README.md).
- `events`: Event signaling and consumption primitives. See more in [event](./packages/event/README.md).
- `reflection`: Runtime type metadata and identifiers. See more in [reflect](./packages/reflect/README.md).
- `logging`: Logging, warnings, and assertion helpers. See more in [logger](./packages/logger/README.md).
- `profiling`: Timing and profiling utilities for system instrumentation. See more in [profiler](./packages/profiler/README.md).
- `diagnostics`: Runtime diagnostics and counters. See more in [diagnostic](./packages/diagnostic/README.md).
- `naming`: Entity naming for debugging and inspection. See more in [name](./packages/name/README.md).
- `bootstrap`: Bundled defaults to bootstrap common subsystems. See more in [misc](./packages/misc/README.md).

- `rendering`: Shared render abstractions, components, and resource management. See more in [render-core](./packages/render-core/README.md).
- `canvas2d`: 2D rendering backend utilities and integration. See more in [render-canvas2d](./packages/render-canvas2d/README.md).
- `webgl`: 3D rendering backend utilities and integration. See more in [render-webgl](./packages/render-webgl/README.md).
- `colors`: Color types and helpers. See more in [color](./packages/color/README.md).
- `geometry`: Bounding volumes and overlap tests. See more in [geometry](./packages/geometry/README.md).
- `gizmos`: Debug and tooling visualization helpers. See more in [gizmo](./packages/gizmo/README.md).
- `particles`: Particle emitter and particle components. See more in [emitter](./packages/emitter/README.md).

- `physics`: Rigid body simulation primitives and integration hooks. See more in [physics](./packages/physics/README.md).
- `broadphase`: Candidate pair generation for collision detection. See more in [broadphase](./packages/broadphase/README.md).
- `narrowphase`: Contact generation and resolution support. See more in [narrowphase](./packages/narrowphase/README.md).
- `integrator`: Motion integration utilities. See more in [integrator](./packages/integrator/README.md).
- `gravity`: Gravity-related resources and systems. See more in [gravity](./packages/gravity/README.md).
- `damping`: Damping-related resources and systems. See more in [damping](./packages/damping/README.md).
- `movable`: Kinematic motion helpers. See more in [movable](./packages/movable/README.md).
- `transform`: 2D/3D transform components and systems. See more in [transform](./packages/transform/README.md).
- `tweening`: Tweening components and easing utilities. See more in [tween](./packages/tween/README.md).
- `animation`: Animation playback primitives and resources. See more in [animation](./packages/animation/README.md).

- `input`: Input aggregation for keyboard, mouse, and touch. See more in [input](./packages/input/README.md).
- `input-core`: Shared low-level button state helpers. See more in [input-core](./packages/input-core/README.md).
- `keyboard`: Keyboard input helpers and events. See more in [keyboard](./packages/keyboard/README.md).
- `mouse`: Mouse input helpers and events. See more in [mouse](./packages/mouse/README.md).
- `touch`: Touch input helpers and events. See more in [touch](./packages/touch/README.md).
- `window`: Window lifecycle, events, and commands. See more in [window](./packages/window/README.md).
- `window-dom`: DOM-backed window integration. See more in [window-dom](./packages/window-dom/README.md).
- `device`: Device and platform detection utilities. See more in [device](./packages/device/README.md).

- `assets`: Asset loading, parsing, and lifecycle management. See more in [asset](./packages/asset/README.md).
- `audio`: Audio playback primitives and resources. See more in [audio](./packages/audio/README.md).
- `storage`: Local persistence helpers. See more in [storage](./packages/storage/README.md).

- `scene`: Scene assets, importers, exporters, and runtime composition. See more in [scene](./packages/scene/README.md).
- `hierarchy`: Parent and child relationship components and hooks. See more in [hierarchy](./packages/hierarchy/README.md).
- `relationship`: Entity graph queries and traversal helpers. See more in [relationship](./packages/relationship/README.md).

- `math`: Vector, matrix, quaternion, and affine math utilities. See more in [math](./packages/math/README.md).
- `datastructures`: Common data structures and allocators. See more in [datastructures](./packages/datastructures/README.md).
- `type`: Runtime type ids and shared typedefs. See more in [type](./packages/type/README.md).
- `utils`: General-purpose helpers and type definitions. See more in [utils](./packages/utils/README.md).
- `noise`: Noise generation utilities. See more in [noise](./packages/noise/README.md).

## Compatibility

| Environment | Compatibility | Notes |
| --- | --- | --- |
| Browser | Supported | Primary runtime target for rendering, input, audio, and DOM-backed windowing. |
| Node.js | Partial | Can work without plugins depending on browser APIs |
| Deno | Not supported | No dedicated runtime adapters are provided. |
| Bun | Not supported | No dedicated runtime adapters are provided. |

## Getting Started

See the [Getting started guide](./guide/01-getting-started/index.md) for setup instructions and a high-level introduction to the engine.

## Contributing

See the [Contribution guide](./guide/04-contributing/index.md) for the repository's contribution process, code of conduct, CLA and commit guidance.
