# App Package Notes

`@wimaengine/app` is the application orchestration layer for Wima. It binds a `World`, schedule builder state, plugin composition, and the runtime runner so higher-level packages can assemble startup and frame-loop behavior around a single app instance.

## Capability Highlights

- Owns the application `World` and exposes it through `getWorld()` for lower-level ECS work.
- Stages plugin registration before startup and replays registered plugins when `run()` begins.
- Delegates schedule, system, and system-group registration to `SchedulerBuilder.Instance`.
- Exposes direct app-level hooks for resource registration, type registration, and component hooks.
- Supports composable `PluginGroup` bundles and a `registerDebugger()` alias for debug plugins.
- Ships the `RegisterFunc` typedef for bootstrap-style callbacks.

## Core Concepts

### App

`App` is the runtime container. It creates its own `World`, `Scheduler`, and `PluginRegistry`, stores the configured runner, and acts as the main integration point for engine packages. `createSchedule()`, `registerSystem()`, and `registerSystemGroup()` are thin forwards into the singleton schedule builder, while `registerType()`, `setComponentHooks()`, and `setResource()` forward into the world. `run()` is the startup handoff: it registers queued plugins, pushes builder state into the scheduler, asserts that a runner exists, starts the runner, and then marks the app initialized.

### PluginRegistry

`PluginRegistry` is the app's startup book-keeping layer. It keeps plugins in insertion order and tracks their type ids so the app can replay registration deterministically at startup. The class is exported, but the public story is still centered on `App` and plugin classes rather than on registry queries.

### Plugin

`Plugin` is the base extension point. Subclasses override `register(app)` to install resources, systems, nested plugins, or type setup into the app. The default `name()` implementation uses `typeid(this.constructor)`, so plugin identity is class-based rather than instance-state-based.

### PluginGroup

`PluginGroup` is a compositional plugin that contains other plugins in a `Map<TypeId, Plugin>`. Because it also extends `Plugin`, a group can be registered anywhere a normal plugin can, and groups can be nested. `add()`, `remove()`, and `replace()` let packages bundle related plugins together, and `register()` replays the group into the app in map iteration order. `replace()` removes before re-adding, so a replacement lands at the end of the group's registration order.

### Typedefs

`RegisterFunc` is the package-local typedef. It describes a function that receives an `App` and returns nothing, which fits bootstrap-style setup helpers and package entrypoints that only need an app handle.

## Notes

- `@wimaengine/app` is intentionally thin. Scheduling semantics live in `@wimaengine/schedule`, data storage and component hooks live in `@wimaengine/ecs`, and type identity comes from `@wimaengine/type`.
- The package does not provide its own default runner. `run()` requires `setRunner()` first, and `@wimaengine/core` supplies the canonical `defaultRunner` plus the default startup/update schedules and core system groups.
- `run()` is the practical initialization boundary. The source explicitly blocks `setResource()` afterward, and the rest of the registration APIs are intended to be staged before startup.
- `registerDebugger()` is just a convenience alias for `registerPlugin()`. Example code uses it for FPS or profiling tools, so the README should mention it only as a naming convenience, not as a separate subsystem.
- Downstream packages use `getWorld()` when they need lower-level ECS behavior such as resource aliases or component hooks that are not modeled directly on `App`.
- The public surface is small: `App`, `Plugin`, `PluginGroup`, `PluginRegistry`, and `RegisterFunc`, with both the package root and `./src` export paths available.
- There are no dedicated tests under `packages/app`; the package contract is exercised indirectly through the packages that build on it.
