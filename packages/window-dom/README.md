---
title: Window DOM
description: "@wimaengine/window-dom is the browser-only bridge that turns DOM canvas, keyboard, pointer, resize, and file activity into the engine window layer."
ogImage: /branding/logo/wima-logo-dark.png
---

`@wimaengine/window-dom` is the browser-only bridge that turns DOM canvas, keyboard, pointer, resize, and file activity into the engine window layer.

## Installation

```sh
npm i @wimaengine/window-dom
```

## Capability Highlights

- Synchronizes `Window` entities with browser canvases through an update system.
- Attaches to an existing `<canvas>` when a selector is provided, or creates and appends one on demand.
- Keeps active canvases tracked in the `Windows` resource so browser state and engine state stay aligned.
- Converts browser keyboard, pointer, resize, and file interactions into typed ECS event resources.
- Focuses the canvas after registration so keyboard input can flow into the engine window layer.
- Exposes a small plugin surface for installing DOM-backed window behavior into an app.

## Core Concepts

### DOMWindowPlugin

`DOMWindowPlugin` connects each `Window` entity to a browser canvas. Selector-backed windows use matching canvases; windows without selectors receive newly created canvases appended to the document body. Registered canvases receive input event bridges and are removed when their window component is removed.

### Window Update System

`updateWindow` runs in `Update/CoreSystems.Start`. A window with a selector uses the matching canvas when it is available. If the selector does not resolve yet, the window remains unregistered and is retried on the next update. A window without a selector creates and appends a new `<canvas>`.

The system registers each canvas in the `Windows` resource, focuses it, and wires keyboard, pointer, and file event bridges. Canvas dimensions are synchronized by `resizeWindow`.

### DOM Event Bridges

The core helpers translate browser events into typed engine events by resolving the matching `Events<T>` resource through `typeidGeneric` and writing the DOM event object into that stream.

`setUpKeyboardEvents` forwards `keydown` and `keyup` into `KeyDown` and `KeyUp`.

`setupPointerEvents` forwards `pointerdown`, `pointerup`, `pointermove`, `pointercancel`, `pointerenter`, `pointerleave`, and `wheel` into the corresponding pointer event types.

`setUpWindowEvents` forwards `resize` into `WindowResize`.

`setUpFileEvents` forwards `dragover` and `drop` into `FileDrag` and `FileDrop`, and prevents the default browser behavior so drag-and-drop remains active.

## Exported Surface

- `DOMWindowPlugin`: plugin class that connects ECS windows to browser canvases.
- `closeWindow(entity, world)`: component hook that removes the registered canvas and resource entry.
- `updateWindow(world)`: update system that creates or resolves canvases and registers them.
- `resizeWindow(world)`: update system that synchronizes displayed canvas dimensions.
- `./src`: package export for direct source imports; it forwards the hooks, systems, and plugin source modules.

## Notes

- This package is browser-only infrastructure and sits underneath `@wimaengine/window`.
- The event bridges depend on ECS `Events<T>` resources being present for the relevant window event types.
- If `window.selector` is set but does not resolve to a canvas element, `updateWindow` warns and retries on the next update instead of creating a replacement canvas.
- The package root re-exports the same source entry that is exposed through `./src`.
