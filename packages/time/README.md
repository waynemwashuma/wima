---
title: Time
---

`@wimaengine/time` is the engine's timekeeping layer for shared clocks, virtual time, and ECS timers.

## Installation

```sh
npm i @wimaengine/time
```

## Capability Highlights

- Tracks elapsed time, frame delta, and derived frame rate through `Clock`.
- Uses `VirtualClock` as the shared resource that runtime systems advance and timer systems consume.
- Models one-shot and repeating timers with speed scaling, pause state, playback change detection, and cycle counters.
- Separates clock progression from timer progression so ECS code reads from a controlled delta source.
- Publishes both the package root and `./src` entry points for the same public modules.

## Core Concepts

### Clock

`Clock` is the base timekeeper. It stores elapsed time, the last tick timestamp, and the current frame delta, and it can serialize and deserialize that state for engine persistence or inspection. The class also derives a frame rate from the delta, which makes it easy for downstream systems to read current timing cadence without recomputing it.

### VirtualClock

`VirtualClock` extends `Clock` without changing the timing model. It exists as the resource instance consumed by the runtime loop and timer systems, which lets the app advance a shared, controllable clock instead of coupling timing to wall-clock access.

### Timer

`Timer` is the ECS-side time primitive. It stores the timer mode, duration, playback speed, paused state, playback change flags, accumulated elapsed time, and per-frame lifecycle counters. Updating a timer applies the incoming delta, handles one-shot or repeating completion, and records whether a cycle started or ended during that frame.

The timer also exposes playback controls through `play()`, `pause()`, `start()`, `stop()`, `reset()`, and `seek()`. Those methods update the playback flags so systems can detect when a timer changed state in the current frame.

### TimerMode

`TimerMode` defines the timer behavior model. `Once` completes after the first finished duration, while `Repeat` wraps elapsed time modulo the duration and keeps counting completed cycles.

### TimePlugin

`TimePlugin` is the runtime integration point. It registers the time types with the type registry, installs a fresh `VirtualClock` resource, and schedules two update systems: one advances the virtual clock and the other advances every `Timer` in the ECS world from that clock's delta. That keeps the package's update pipeline explicit and easy for higher-level engine code to compose.

## Exported Surface

- `components` exports `Timer` and `TimerMode`.
- `clock` exports `Clock`.
- `resource` exports `VirtualClock`.
- `plugin` exports `TimePlugin`.
- The package root re-exports `./src`, and the manifest also publishes `./src` as a subpath for source-level imports.
- Internal system helpers such as `registerTimeTypes` and `updateTimers` are used by the plugin but are not part of the main public entry points.

## Notes

- The startup type-registration path records `Timer`, `Clock`, `VirtualClock`, and `TimerMode` with the engine's reflection and type systems so these values can be serialized and introspected consistently.
- `updateTimers()` reads `VirtualClock.getDelta()` and applies that delta to every `Timer` component in the current world, so timer progression stays tied to the shared engine clock.
- The package is intentionally small: most consumers should depend on the plugin and the public modules rather than the internal `src/systems` wiring.
