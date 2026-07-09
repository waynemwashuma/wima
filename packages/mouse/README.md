---
title: Mouse
---

`@wimaengine/mouse` packages Wima's pointer state model, button mapping, and plugin wiring for mouse-driven input.

## Installation

```sh
npm i @wimaengine/mouse
```

## Capability Highlights

- Tracks cursor position, previous position, and per-frame delta in a dedicated `Mouse` resource.
- Exposes an enum-style `MouseButton` mapping for standard mouse button codes plus an `Unidentified` fallback.
- Extends the shared `Buttons<T>` model through `MouseButtons` for frame-aware press and release state.
- Ships a `MousePlugin` that installs mouse resources, registers reflected types, and synchronizes state from `@wimaengine/window` pointer events.
- Publishes both the package root and the `./src` subpath entry point.

## Core Concepts

### `MouseButton`

`MouseButton` is the numeric button map used throughout the package. It names the standard pointer button codes for left, wheel, right, back, forward, and DPI buttons, with an `Unidentified` value for unexpected input.

### `Mouse`

`Mouse` stores live pointer state for ECS consumers. It keeps the current `position`, the previous frame's `lastPosition`, and the current-frame `delta`, and its `moved()` helper reports whether the cursor moved since the last update. The plugin resets `delta` each frame and repopulates it from the latest pointer-move event when one is available.

### `MouseButtons`

`MouseButtons` extends `Buttons<MouseButton>` from `@wimaengine/input-core`. That gives mouse input the same held, just-pressed, and just-released semantics as the rest of the engine's input stack while keeping the button tokens specific to mouse input.

### `MousePlugin`

`MousePlugin` is the runtime integration point. On startup it installs `Mouse` and `MouseButtons` as world resources and registers their reflected types; on update it reads the latest `PointerMove`, `PointerDown`, and `PointerUp` events from `@wimaengine/window`, updates pointer motion from the last move event, and applies button transitions only for `pointerType: 'mouse'`.

## Exported Surface

- `core` re-exports `MouseButton`.
- `resources` re-exports `Mouse` and `MouseButtons`.
- `plugin` re-exports `MousePlugin`.
- The package root re-exports `core`, `resources`, and `plugin`.
- The `./src` subpath is also published and mirrors the same public surface.

## Notes

- `Mouse` is registered with the `TypeRegistry` as a struct of three `Vector2` fields, which keeps it visible to reflection-aware engine systems.
- `MouseButtons` is registered as an opaque type in the `TypeRegistry`, which matches its role as a wrapped `Buttons<MouseButton>` container.
- The plugin consumes only the last queued `PointerMove` event each frame instead of accumulating all motion events.
- Mouse button updates are cleared each update through `clearJustPressed()` and `clearJustReleased()`, which keeps edge-triggered queries frame-local.
- The package builds on `@wimaengine/app`, `@wimaengine/core`, `@wimaengine/ecs`, `@wimaengine/event`, `@wimaengine/input-core`, `@wimaengine/math`, `@wimaengine/reflect`, `@wimaengine/type`, and `@wimaengine/window`.
