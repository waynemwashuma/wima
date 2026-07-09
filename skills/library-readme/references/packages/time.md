---
title: Time
---

`@wimaengine/time` is the engine's timekeeping layer for shared clocks, virtual time, and ECS timers.

## Capability Highlights

- `Clock` tracks elapsed time, frame delta, and derived frame rate.
- `VirtualClock` extends `Clock` and serves as the resource consumed by timer updates.
- `Timer` stores mode, duration, speed, pause/playback state, and lifecycle counters.
- `TimerMode` defines the one-shot and repeating timer behavior model.
- `TimePlugin` registers types, installs `VirtualClock`, and schedules both clock and timer updates.
- The package root and `./src` expose the same public modules.

## Core Concepts

### Clock

`Clock` is the base timekeeper. It stores elapsed time, the last tick timestamp, and the current frame delta, and it can serialize and deserialize that state for engine persistence or inspection. The class also derives a frame rate from the delta.

### VirtualClock

`VirtualClock` extends `Clock` without changing the timing model. It exists as the resource instance consumed by the runtime loop and timer systems, which keeps timing under engine control instead of tying it directly to wall-clock access.

### Timer

`Timer` is the ECS-side time primitive. It stores the timer mode, duration, playback speed, paused state, playback change flags, accumulated elapsed time, and per-frame lifecycle counters. Updating a timer applies the incoming delta, handles one-shot or repeating completion, and records whether a cycle started or ended during that frame.

### TimerMode

`TimerMode` defines the timer behavior model. `Once` completes after the first finished duration, while `Repeat` wraps elapsed time modulo the duration and keeps counting completed cycles.

### TimePlugin

`TimePlugin` is the runtime integration point. It registers the time types with the type registry, installs a fresh `VirtualClock` resource, and schedules two update systems: one advances the virtual clock and the other advances every `Timer` in the ECS world from that clock's delta.

## Exported Surface

- `components` exports `Timer` and `TimerMode`.
- `clock` exports `Clock`.
- `resource` exports `VirtualClock`.
- `plugin` exports `TimePlugin`.
- The package root re-exports `./src`, and the manifest also publishes `./src` as a subpath for source-level imports.

## Notes

- `registerTimeTypes()` seeds the reflection and type registry for `Timer`, `Clock`, `VirtualClock`, and `TimerMode`.
- `updateTimers()` reads `VirtualClock.getDelta()` and updates every `Timer` component in the current world.
- `src/systems` is internal wiring used by `TimePlugin`, not a separate public API tier.
