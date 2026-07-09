---
title: Schedule
---

`@wimaengine/schedule` is the engine's ordered system execution layer, turning labeled schedules, grouped systems, and runtime policy into deterministic work pipelines.

## Installation

```sh
npm i @wimaengine/schedule
```

## Capability Highlights

- Orders and runs system functions through `Schedule`, keeping execution predictable while routing failures through schedule-level error handling.
- Binds each labeled schedule to runtime policy through `Executable`, including repeat cadence, start delay, default system group selection, and a custom error handler.
- Stores executables by constructor label in `Scheduler`, so runtime code resolves schedules by type identity instead of string keys.
- Composes schedule graphs in `SchedulerBuilder`, expanding system groups, inherited group nesting, and before/after constraints into a sorted execution list.
- Rejects ambiguous or invalid build input early: duplicate labels, missing references, cyclic group nesting, cyclic ordering, and self-referential edges all fail before runtime.
- Exposes `Runner` as the minimal execution contract used by higher-level runtime loops.

## Core Concepts

### Schedule

`Schedule` is the ordered execution container. It stores system functions in registration order, tracks active slots with a bitset, and runs each enabled system against a `World`. Each system call is wrapped in per-system error handling, and non-`Error` throw values are normalized before being passed to the handler. That keeps schedule execution deterministic without forcing callers to own their own try/catch loop around every system.

### Executable

`Executable` binds a constructor label to the schedule instance that will actually run and stores the options that shape runtime behavior: `repeat`, `delay`, `defaultSystemGroup`, and `errorHandler`. The `typeId` getter derives a stable identifier from the label constructor, which is how the scheduler maps labels to executables without depending on raw strings.

### Scheduler

`Scheduler` is the label registry for executables. It stores `Executable` instances in a `Map` keyed by label type id, returns the underlying `Schedule` for a given label, and exposes the stored executables for iteration. This keeps the runtime lookup model small and stable while letting higher-level packages decide how to drive the schedules.

### SchedulerBuilder

`SchedulerBuilder` is the composition layer that turns `SystemConfig` and `SystemGroupConfig` records into runnable schedules. It gathers schedule definitions, system registrations, and group registrations separately, then builds a per-schedule `ScheduleContext` that resolves parent groups, assigns systems to their configured groups, expands inherited group membership, and topologically sorts the resulting graph.

The builder treats ordering constraints as graph edges. `before` and `after` references can point to system functions, constructor labels, or string labels, and the resulting graph is expanded so populated groups behave like shared ordering ranges while empty groups remain explicit barriers. The build fails early when a schedule label is missing from the target `Scheduler`, when a group or parent reference cannot be resolved, or when cycles appear in group nesting or ordering.

### Runner

`Runner` is the execution contract for runtime drivers. It is just a function type that accepts a `Scheduler` and a `World`, which keeps this package focused on schedule definition and leaves frame timing or loop policy to higher-level runtime code.

## Exported Surface

- `Schedule` for ordered system execution and per-system error handling.
- `Executable` for labeled schedules and runtime options.
- `Scheduler` for constructor-based executable lookup.
- `SchedulerBuilder` for collecting schedules, systems, and groups into runnable plans.
- `ScheduleContext` as the per-schedule build state used by the builder.
- `SchedulerBuilder.Instance` as the shared singleton used by the common runtime path.
- `Runner` as the scheduler execution contract.
- `SystemConfig` and `SystemGroupConfig` as the builder input shapes.
- The package root and `./src` publish the same core surface.

## Notes

- `Executable` labels are constructor-based and are resolved through `typeid(...)`, so label identity should stay stable across the app.
- Group ordering is explicit, not implicit: populated groups expand to their member systems, while empty groups act as standalone ordering nodes.
- Parent groups must already be registered before they can be referenced, and cyclic group nesting is rejected during build.
- The package is ESM-only and the manifest publishes both `.` and `./src`, but both paths re-export the same core modules.
