---
title: Mouse
---

## Package Role

`@wimaengine/mouse` is the Wima engine package for mouse input state, mouse button mapping, and ECS-oriented plugin integration. The package sits at the boundary between engine input, eventing, ECS, and runtime wiring.

## Capability Highlights

- Tracks cursor position, last position, and frame delta in a dedicated `Mouse` resource.
- Exposes `MouseButton` as the package's numeric mouse-button map.
- Extends the shared `Buttons<T>` model through `MouseButtons` for held and transition-aware state.
- Ships `MousePlugin` for resource installation, type registration, and pointer-event synchronization.
- Publishes both the package root and the `./src` subpath, which mirror the same public surface.

## Core Concepts

### `MouseButton`

The button mapping models mouse buttons as engine primitives rather than raw numeric constants.

### `Mouse`

The mouse resource stores live pointer position, previous position, and delta for ECS consumers.

### `MouseButtons`

The mouse button resource is a typed `Buttons<MouseButton>` container built on `@wimaengine/input-core`.

### `MousePlugin`

The plugin is the integration layer that installs mouse resources, registers mouse types, and updates motion and button state from `PointerMove`, `PointerDown`, and `PointerUp` events.

## Notes

- Keep the focus on engine primitives and integration points, not on general-purpose mouse APIs.
- The package root and `./src` entry point expose the same public surface.
- `Mouse` is registered with the `TypeRegistry` as a struct of three `Vector2` fields.
- `MouseButtons` is registered as an opaque type in the `TypeRegistry`.
- The plugin only responds to `pointerType: 'mouse'` button events and uses the last queued pointer-move event each frame.
- The package depends on `@wimaengine/app`, `@wimaengine/core`, `@wimaengine/ecs`, `@wimaengine/event`, `@wimaengine/input-core`, `@wimaengine/math`, `@wimaengine/reflect`, `@wimaengine/type`, and `@wimaengine/window`.
