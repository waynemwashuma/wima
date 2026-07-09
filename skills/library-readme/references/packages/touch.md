# Touch Package Notes

`@wimaengine/touch` is the Wima engine's touch-input state layer. It turns touch pointer events into ECS-friendly contact state, stores active contacts in a compact resource, and registers that resource with the reflection system.

## Capability Highlights

- `TouchPlugin` installs the `Touches` resource and wires runtime update and startup systems.
- `Touches` maps browser pointer IDs to compact touch slots and exposes helpers for active-contact queries.
- `TouchPointer` keeps current and previous `Vector2` positions for per-frame motion tracking.
- `TouchId` is the numeric slot typedef used across the package.
- The package root and `./src` subpath re-export the same public surface.

## Core Concepts

### TouchPlugin

`TouchPlugin` is the app-facing integration layer. It adds the touch updater during `AppSchedule.Update`, creates the `Touches` resource, and registers touch type metadata during startup so the resource is available to ECS consumers.

### Touches

`Touches` is the central runtime resource. It stores active contacts in a 10-slot list, keeps a `Map<number, TouchId>` for browser pointer ID lookups, and exposes helpers for `getId`, `getFirst`, `getLast`, `getActive`, `set`, `delete`, and `get`.

### TouchPointer

`TouchPointer` is the per-contact data model. It pairs a stable numeric `id` with `position` and `lastposition` vectors, which makes it the package's motion-tracking primitive.

### TouchId

`TouchId` is a numeric typedef for the engine-side slot assigned to a live touch pointer. It separates the compact internal index from the browser's pointer ID.

## Notes

- Touch state comes from `PointerDown`, `PointerMove`, `PointerUp`, and `PointerCancel` window events filtered to `pointerType === 'touch'`.
- `updateTouch` mutates the resource during the app update phase, while `registerTouchTypes` runs at startup to register `Touches` with `TypeRegistry` via `OpaqueInfo`.
- The source tree is intentionally small: public exports live in `core`, `resources`, `plugin`, and `typedef`, and `systems` stays internal.
- The package depends on `@wimaengine/app`, `@wimaengine/core`, `@wimaengine/ecs`, `@wimaengine/event`, `@wimaengine/math`, `@wimaengine/reflect`, `@wimaengine/type`, and `@wimaengine/window`.
