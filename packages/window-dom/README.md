---
title: Window DOM
---

`@wimaengine/window-dom` is the browser-only bridge that turns DOM canvas, keyboard, pointer, resize, and file activity into the engine window layer.

## Installation

```sh
npm i @wimaengine/window-dom
```

## Capability Highlights

- Binds the `Window` component lifecycle to a browser canvas through ECS component hooks.
- Attaches to an existing `<canvas>` when a selector is provided, or creates and appends one on demand.
- Keeps active canvases tracked in the `Windows` resource so browser state and engine state stay aligned.
- Converts browser keyboard, pointer, resize, and file interactions into typed ECS event resources.
- Focuses the canvas after registration so keyboard input can flow into the engine window layer.
- Exposes a small plugin surface for installing DOM-backed window behavior into an app.

## Core Concepts

### DOMWindowPlugin

`DOMWindowPlugin` is the application integration point. It registers `Window` component hooks on the `App` with `ComponentHooks(openWindow, closeWindow)`, so the browser-backed window lifecycle is driven by the ECS component system rather than ad hoc DOM setup.

### Window Lifecycle Hooks

`openWindow` resolves the `Window` component for an entity, looks for a `window.selector` canvas target when one is configured, and falls back to creating a new `<canvas>` and appending it to `document.body`. It sizes the canvas from the window component, stores the element in the `Windows` resource, sets `tabIndex = -1`, and focuses the canvas before wiring event bridges.

`closeWindow` is the teardown path. It removes the canvas from the DOM and deletes the entity entry from `Windows`, keeping the browser surface and the engine registry in sync.

### DOM Event Bridges

The core helpers translate browser events into typed engine events by resolving the matching `Events<T>` resource through `typeidGeneric` and writing the DOM event object into that stream.

`setUpKeyboardEvents` forwards `keydown` and `keyup` into `KeyDown` and `KeyUp`.

`setupPointerEvents` forwards `pointerdown`, `pointerup`, `pointermove`, `pointercancel`, `pointerenter`, `pointerleave`, and `wheel` into the corresponding pointer event types.

`setUpWindowEvents` forwards `resize` into `WindowResize`.

`setUpFileEvents` forwards `dragover` and `drop` into `FileDrag` and `FileDrop`, and prevents the default browser behavior so drag-and-drop remains active.

## Exported Surface

- `DOMWindowPlugin`: plugin class that installs browser window component hooks.
- `openWindow(entity, world)`: component hook that creates or attaches the canvas, registers it, and wires browser listeners.
- `closeWindow(entity, world)`: component hook that removes the canvas and clears the entity from `Windows`.
- `./src`: package export for direct source imports; it forwards the `hooks` and `plugin` source modules.

## Notes

- This package is browser-only infrastructure and sits underneath `@wimaengine/window`.
- The event bridges depend on ECS `Events<T>` resources being present for the relevant window event types.
- If `window.selector` is set but does not resolve to a canvas element, `openWindow` warns and falls back to creating a new canvas.
- The package root re-exports the same source entry that is exposed through `./src`.
