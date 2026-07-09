# Event Package Notes

`@wimaengine/event` is the ECS-facing event layer for Wima. The package surface centers on `Signal`, `CEvent`, `Events`, `EventPlugin`, the `EventReader` typedef, and the `registerEventTypes` / `makeEventClear` systems.

## Capability Highlights

- `Signal` is a listener-based mutable value primitive, so docs should describe it as a simple fan-out mechanism for value changes.
- `CEvent` is the event payload wrapper. Keep wording focused on the `data` field and the stable shape it gives readers.
- `Events<T>` buffers writes and reads separately. `write()` queues payloads, `clear()` rotates the batch into the readable side, and `each()`, `readFirst()`, `readLast()`, and `count()` all inspect the last cleared batch.
- `EventPlugin<T>` wires event payload types into the ECS runtime, installs per-event `Events<T>` resources, and optionally clears them every update.
- `registerEventTypes()` seeds the reflection/type registry with both the payload constructor and the opaque `Events<T>` type-id entry.
- The package root re-exports `src`, and the manifest also exposes `./src`, so README wording should stay compatible with both entry points.

## Core Concepts

### Signal

`Signal` should be documented as a mutable value with direct listener management, not as a general-purpose pub/sub system.

### CEvent

`CEvent` is a light wrapper around event payloads. Documentation should describe the payload shape without introducing extra transport abstractions.

### Events

`Events` is the package's batch buffer. It is useful to explain the write/read split explicitly, because `clear()` promotes the write buffer into the read buffer rather than deleting the last published batch in place.

### EventPlugin and Systems

`EventPlugin` is the runtime integration point. Future README text should mention the type registry step, the per-event resource install, and the optional auto-clear behavior so the package reads as ECS infrastructure rather than a standalone bus.

## Notes

- Keep the README feature-first and avoid usage walkthroughs unless the user explicitly asks for them.
- Use YAML frontmatter `title` instead of a top-level heading.
- Include an installation section with `npm i @wimaengine/event`.
- When expanding the exported surface, use the actual module groups: `core`, `typedef`, `systems`, and `plugin`.
