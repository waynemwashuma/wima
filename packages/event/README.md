---
title: Event
---

`@wimaengine/event` provides listener-driven state, buffered event batches, and ECS wiring for typed event payloads.

## Installation

```sh
npm i @wimaengine/event
```

## Capability Highlights

- `Signal` gives the package a small listener-based mutable value primitive for fan-out on state change.
- `CEvent` wraps each payload in a stable event record so consumers read `.data` instead of raw values.
- `Events<T>` separates writes from reads, letting systems queue payloads during a write pass and inspect the last cleared batch during a read pass.
- `EventPlugin` registers event payload types, installs per-event `Events<T>` resources, and can auto-clear them at the end of each update cycle.
- `registerEventTypes()` seeds both the payload constructor and the `Events<T>` type-id into the reflection/type registry.

## Core Concepts

### Signal

`Signal` stores a value and notifies every registered listener whenever `setValue()` changes that value. `addListener()` and `removeListener()` manage subscriptions directly, which keeps it lightweight and predictable for engine-internal state propagation.

### CEvent

`CEvent<T>` is the package's event record. It wraps payloads in a `data` field, keeping the event shape stable across the rest of the package and any ECS systems that consume it.

### Events

`Events<T>` is the buffered event store. `write()` appends new `CEvent` instances to a write buffer, while `clear()` rotates that buffer into the readable batch and resets the writer side. `each()`, `readFirst()`, `readLast()`, and `count()` all work against the current read buffer, so consumers observe a stable batch until the next clear.

### EventPlugin and Systems

`EventPlugin<T>` is the ECS integration layer. During registration it declares the payload constructor with the app, schedules `registerEventTypes(event)` at startup inside `CoreSystems.Start`, installs a typed `Events<T>` resource in the world, and, when `autoClearEvent` is enabled, schedules `makeEventClear(typeId)` for `AppSchedule.Update` in `CoreSystems.End`. The helper systems keep the reflection registry and the per-event buffer in sync with the runtime lifecycle.

## Exported Surface

- `core` exports `Signal`, `CEvent`, and `Events`.
- `typedef` exports the `EventReader<T>` callback type used by read-side consumers.
- `systems` exports `registerEventTypes()` and `makeEventClear()`.
- `plugin` exports `EventPlugin`.
- The package root re-exports the `src` surface, and the manifest also exposes `./src` for source-level imports.

## Notes

- The package is ECS-oriented rather than a standalone message bus.
- `Events.clear()` is a batch-rotation step, not a destructive wipe of already-published reads.
- `registerEventTypes()` uses empty structural metadata for payload constructors and treats the `Events<T>` resource as opaque in the reflection registry.
- The `./src` subpath is part of the public package contract, so README language should stay compatible with both root and source imports.
