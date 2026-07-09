---
title: Window
---

`@wimaengine/window` is the ECS-facing browser window layer for Wima. It models window state, queues deferred DOM operations, and routes keyboard, pointer, file, and window events through the engine.

## Installation

```sh
npm i @wimaengine/window
```

## Capability Highlights

- Deferred window mutation through `WindowCommand`, `WindowRequest`, and the queue-backed `WindowCommands` helper.
- Window state components for size and selector data, plus a marker component for the primary window entity.
- Typed event records for window resize and movement, keyboard input, pointer input, and file drag/drop interactions.
- A `Windows` resource that maps entity handles to active `HTMLCanvasElement` instances.
- `WindowPlugin` wiring that registers types, event plugins, the window resource, and optional primary-window bootstrap.

## Core Concepts

### WindowPlugin

`WindowPlugin` is the integration layer for the package. It registers the `Window` and `MainWindow` types, installs the `Windows` resource, wires the window, keyboard, pointer, and file event plugins, and runs a startup system that seeds type metadata for `WindowRequest`, `Window`, `MainWindow`, and `Windows`. When `initPrimaryWindow` is enabled, it also schedules a startup entity spawn using the provided `primaryWindowOptions`.

### Commands

`WindowCommand` is the low-level deferred mutation object. It captures an entity handle, a `WindowRequest` variant, and an arbitrary payload, then resolves the matching `Window` component and `Windows` resource at execution time. Resize requests sync the canvas dimensions back into the `Window` component and dispatch a DOM `resize` event; other request variants forward to the underlying canvas APIs for repositioning, pointer capture and release, fullscreen, and pointer lock.

`WindowCommands` is the queue-facing helper in `core`. It binds the target entity with `window(entity)` and enqueues resize, fullscreen, pointer lock, and pointer capture commands through the shared `CommandQueue`, so systems can request window changes without touching DOM state directly.

### Components

`Window` stores the runtime width, height, and optional selector for a canvas-backed window entity. It defaults to `720x360` when no size is provided and implements copy, clone, serialize, and deserialize hooks for the reflection/type registry.

`MainWindow` is the companion marker component for the primary window entity. It carries no data of its own, which keeps the main window handle easy to query and cheap to serialize.

### Events

Window events cover viewport movement and resize notifications through `WindowMove` and `WindowResize`.

Keyboard events expose `KeyDown` and `KeyUp` records that carry the key, code, location, and event target so downstream systems can process input through ECS rather than raw DOM callbacks.

Pointer events cover down, up, move, enter, leave, cancel, and wheel interactions. The records store pointer identity, pointer type, local position, movement delta where relevant, and wheel delta as math vectors for engine-friendly consumers.

File events cover drag and drop with `FileDrag` and `FileDrop`, which capture pointer coordinates during the drag and the dropped file list at release time.

### Resources

`Windows` is the resource that binds entity ids to the active `HTMLCanvasElement` for each window entity. Commands use it to locate the live canvas before mutating browser state, and the resource keeps ECS handles aligned with the browser-side surfaces they control.

### Prefabs

`createMainWindow()` returns the canonical `[Window, MainWindow]` pair used to bootstrap the primary window entity. It keeps the setup minimal while still providing the component combination that the plugin and systems expect.

## Exported Surface

- `commands` exports `WindowCommand` and `WindowRequest`.
- `components` exports `Window` and `MainWindow`.
- `core` exports `WindowCommands`.
- `events` exports `WindowMove`, `WindowResize`, `KeyDown`, `KeyUp`, `PointerDown`, `PointerUp`, `PointerMove`, `PointerEnter`, `PointerLeave`, `PointerCancel`, `PointerWheel`, `FileDrag`, and `FileDrop`.
- `resources` exports `Windows`.
- `prefabs` exports `createMainWindow`.
- `plugin` exports `WindowPlugin`.
- The package root re-exports the same surface as `./src`, and the manifest exposes both entry points.

## Notes

- `@wimaengine/window-dom` supplies the browser-backed implementation layer for this package.
- `WindowRequest` includes low-level variants for resize, reposition, fullscreen, pointer capture/release, and pointer lock, while `WindowCommands` currently wraps the queue-backed helper subset.
- The package relies on the reflection/type registry to describe `WindowRequest`, `Window`, `MainWindow`, and `Windows` for ECS consumers.
- `./src` is part of the public contract, so source-level imports should remain consistent with the root export surface.
