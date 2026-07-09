---
title: Touch
---

`@wimaengine/touch` models touch contact state for Wima, translating touch pointer events into ECS-accessible slots with stable IDs, current position, and previous-position history.

## Installation

```sh
npm i @wimaengine/touch
```

## Capability Highlights

- Keeps active touches in a compact `Touches` resource backed by indexed slots and a browser pointer ID map.
- Tracks both current and previous touch positions through `TouchPointer` for frame-to-frame motion and gesture logic.
- Installs touch state into the app through `TouchPlugin`, which registers the runtime update and startup systems.
- Filters `@wimaengine/window` pointer events down to touch-only input by checking `pointerType === 'touch'`.
- Registers `Touches` with the reflection/type registry so ECS consumers can work with the resource by type.
- Exports both the package root and a `./src` subpath, with the same public surface on each path.

## Core Concepts

### TouchPlugin

`TouchPlugin` is the integration point for the package. Its `register` method installs the touch resource, schedules the runtime updater during `AppSchedule.Update`, and registers the touch type metadata during startup. That keeps touch state available whenever the app frame loop runs.

### Touches

`Touches` is the runtime resource that stores live touch contacts. It uses a fixed 10-slot list and a `Map<number, TouchId>` to translate browser pointer IDs into compact engine IDs. The resource exposes helpers for looking up a touch by pointer ID, reading the first or last active contact, collecting all active touches, inserting or updating a touch, deleting a touch, and reading a contact by touch slot.

### TouchPointer

`TouchPointer` is the per-contact data object. Each pointer carries a stable `id` plus `position` and `lastposition` vectors from `@wimaengine/math`. That shape makes it useful for touch deltas, swipe logic, and any system that needs the current and previous frame positions.

### TouchId

`TouchId` is the numeric typedef used for the engine-side slot assigned to an active touch contact. It separates the compact internal touch index from the browser pointer ID that arrives on the window event.

## Exported Surface

- `TouchPlugin` from `src/plugin.js`.
- `Touches` from `src/resources/touches.js`.
- `TouchPointer` from `src/core/pointer.js`.
- `TouchId` from `src/typedef/id.js`.
- The package root `@wimaengine/touch` and `@wimaengine/touch/src` both resolve to the same re-exported surface.

## Notes

- The package consumes `PointerDown`, `PointerMove`, `PointerUp`, and `PointerCancel` events from `@wimaengine/window` and ignores non-touch pointers.
- `updateTouch` creates a `TouchPointer` on pointer down, copies positions on pointer move, and deletes the slot on pointer up or cancel.
- `registerTouchTypes` registers `Touches` with `TypeRegistry` using `OpaqueInfo`, so the resource is visible to reflection-aware code without exposing internal structure.
- The source tree is intentionally small: `core`, `resources`, `plugin`, and `typedef` are public, while `systems` is an internal helper module used by the plugin.
