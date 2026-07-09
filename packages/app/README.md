---
title: App
---

`@wimaengine/app` is Wima's application orchestration layer. It owns the runtime `World`, stages plugins and system configuration, and hands control to a scheduler runner when the app starts.

## Installation

```sh
npm i @wimaengine/app
```

## Capability Highlights

- Owns the engine `World` and exposes it for lower-level ECS access.
- Stages plugins, systems, and system groups before startup, then replays them during `run()`.
- Bridges app-level setup into `@wimaengine/schedule` through `SchedulerBuilder` and `Scheduler`.
- Provides direct hooks for resource registration, component hooks, and type registration.
- Supports composable `PluginGroup` bundles and a `registerDebugger()` alias for debug-oriented plugins.
- Exports `RegisterFunc` for bootstrap-style callbacks that only need an `App` handle.

## Core Concepts

### App

`App` is the runtime container. It creates the `World`, `Scheduler`, and `PluginRegistry`, stores the configured runner, and acts as the main integration point for engine packages. Methods such as `createSchedule()`, `registerSystem()`, and `registerSystemGroup()` forward into the singleton schedule builder, while `registerType()`, `setComponentHooks()`, and `setResource()` forward into the world.

`run()` is the startup boundary. It replays queued plugins, pushes staged schedules into the scheduler, asserts that a runner exists, starts the runner with the scheduler and world, and then marks the app initialized so resource registration is no longer allowed.

### PluginRegistry

`PluginRegistry` keeps plugin instances in insertion order and tracks their type ids so startup replay stays deterministic. It is the bookkeeping layer behind `App.registerPlugin()`, but the public API stays centered on `App` and plugin classes.

### Plugin

`Plugin` is the base extension point. Subclasses override `register(app)` to install resources, systems, nested plugins, or type setup. The default `name()` implementation uses `typeid(this.constructor)`, so plugin identity is class-based.

### PluginGroup

`PluginGroup` composes multiple plugins into a single registrable unit. It stores nested plugins in a `Map<TypeId, Plugin>`, supports `add()`, `remove()`, and `replace()`, and replays the group into the app in map iteration order.

### Typedefs

`RegisterFunc` is a bootstrap callback type that receives an `App` and returns nothing. It fits setup helpers and package entrypoints that only need access to the app container.

## Exported Surface

- `app` exports `App`, `Plugin`, `PluginGroup`, and `PluginRegistry`.
- `typedef` exports `RegisterFunc`.
- The package root re-exports `app` and `typedef`, and the manifest also publishes `./src` for source-level imports.

## Notes

- `@wimaengine/app` stays intentionally thin. Scheduling semantics live in `@wimaengine/schedule`, data storage and component hooks live in `@wimaengine/ecs`, and type identity comes from `@wimaengine/type`.
- The package does not provide a default runner. `run()` requires `setRunner()` first, and `@wimaengine/core` supplies the canonical runner plus the default startup and update wiring.
- `setResource()` is guarded after initialization, so app setup is expected to happen before `run()`.
- `registerDebugger()` is a convenience alias for `registerPlugin()`, not a separate subsystem.
