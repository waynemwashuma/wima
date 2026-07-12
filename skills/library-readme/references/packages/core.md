# Core Feature Notes

`@wimaengine/core` is the engine's runtime integration layer, wiring app startup, frame scheduling, deferred entity commands, reflection metadata, and snapshot protocols into the default execution path.

## Preferred README Shape

- YAML frontmatter `title: Core`
- One-sentence summary of the package's role in the engine
- `## Installation`
- `## Capability Highlights`
- `## Core Concepts`
- `## Exported Surface`
- `## Design Notes`

## Capability Highlights

- Bootstraps the default app runtime by wiring schedules, system groups, a runner, a scheduler builder resource, and command flushing.
- Provides deferred entity mutation through `EntityCommands`, `SpawnCommand`, and `DespawnCommand` so systems can stage changes instead of mutating the world immediately.
- Defines the engine's core schedule labels (`AppSchedule.Startup` and `AppSchedule.Update`) and the ordered phase labels inside each schedule (`CoreSystems.Start` through `CoreSystems.End`).
- Ships the `defaultRunner`, a frame-loop runner that drives scheduled work from `requestAnimationFrame()` and respects repeat versus one-shot schedules.
- Seeds the reflection/type registry with `EntityHandle`, primitive constructors, typed arrays, `TypeId`, and common container specializations used by snapshotting and serialization.
- Exposes snapshot base classes that downstream packages extend when they need stable world-aware serialization hooks.

## Core Concepts

### CorePlugin

`CorePlugin` is the package's default wiring layer. In `register(app)` it installs the shared scheduler resource, sets `defaultRunner` as the app runner, creates the `Startup` and `Update` schedules, registers the full `CoreSystems` phase chain on both schedules, seeds the type registry during startup, and flushes deferred commands at `CoreSystems.End`. The plugin also makes `CoreSystems.Main` the default system group for both schedules so ungrouped systems land in the central phase.

### AppSchedule

`AppSchedule` is the small schedule-label set used by the engine app. `Startup` runs once when the app starts, while `Update` repeats every frame. They are frozen constructor labels rather than string constants, which keeps schedule identity stable across the runtime and the plugin layer.

### CoreSystems

`CoreSystems` names the ordered system groups that subdivide each schedule into predictable phases: `Start`, `PreMain`, `Main`, `PostMain`, and `End`. The `Main` group is the default landing zone for systems, while `End` is where command queue flushing happens. That structure gives downstream plugins a consistent place to insert their own systems without having to coordinate private ordering rules.

### EntityCommands

`EntityCommands` is the user-facing command builder around entity creation and destruction. `spawn()` reserves a new entity handle up front, `entity()` targets an existing handle, `insert()` and `insertPrefab()` stage components, and `build()` queues the buffered spawn command into the world's `CommandQueue`. `spawnBatch()` repeats that flow for arrays of component arrays. The class enforces staging with assertions, so `insert()` and `build()` are only valid after a buffered spawn or entity selection.

### SpawnCommand and DespawnCommand

`SpawnCommand` and `DespawnCommand` are the deferred mutations that `EntityCommands` places on the queue. `SpawnCommand` stores the entity handle plus any collected components or prefab components, then inserts them into the ECS world when executed. `DespawnCommand` removes the target entity when the command queue flushes. The pair keeps entity creation and removal on the deferred command path instead of letting systems mutate the world directly.

### Command Execution

`executeCommands` is the system-level drain for the command queue. It pulls queued commands from `CommandQueue` and executes them in order against the world. `CorePlugin` registers it in `CoreSystems.End` for both `Startup` and `Update`, which means queued mutations are applied after the rest of the frame's systems have run.

### defaultRunner

`defaultRunner` is the package's built-in schedule driver. It captures a per-executable state map, initializes each schedule's next run time from `performance.now()`, and uses `requestAnimationFrame()` to advance the scheduler every frame. Repeating schedules are rescheduled with their delay; non-repeating schedules are deactivated after a single run. The implementation is browser-oriented and deliberately tied to frame timing rather than Node-style timers.

### Type Registration

`registerCoreTypes` and `registerPrimitiveTypes` seed the `TypeRegistry` resource with the metadata needed by reflection and serialization features. `registerCoreTypes` registers `EntityHandle` as a struct with `index` and `generation` fields and binds its serialize/deserialize methods. `registerPrimitiveTypes` marks primitive constructors and typed arrays as opaque, registers `BigInt` and `TypeId`, and adds common generic container shapes such as `Map<String, Number>`, `Array<TypeId>`, `Array<Field>`, `Map<TypeId, TypeEntry>`, and `Map<TypeId, MethodEntry>`. This is the bridge that lets other packages describe engine data in a type-aware way.

### Snapshot Interfaces

`ToSnapshot` and `FromSnapshot` are abstract base classes that define the snapshot contract for components and resources. Their methods throw via `abstractMethod`, so downstream types are expected to override them with world-aware conversion logic. The `World` parameter keeps snapshot creation and restoration aligned with live handles and registry state, which is why scene and asset-related packages build on this layer.

## Exported Surface

- `CorePlugin` for runtime bootstrap.
- `AppSchedule` and `CoreSystems` for schedule and phase labels.
- `EntityCommands`, `SpawnCommand`, and `DespawnCommand` for deferred entity mutation.
- `defaultRunner` for the default frame loop.
- `executeCommands`, `registerCoreTypes`, and `registerPrimitiveTypes` for startup and command-queue systems.
- `ToSnapshot` and `FromSnapshot` for snapshot-capable components and resources.

## Design Notes

- The package is an integration layer, not a feature domain on its own; most of its value comes from being the shared runtime contract other packages plug into.
- The main dependency surface is `@wimaengine/app`, `@wimaengine/command`, `@wimaengine/ecs`, `@wimaengine/reflect`, `@wimaengine/schedule`, `@wimaengine/type`, and `@wimaengine/utils`.
- `defaultRunner` assumes a browser-like environment with `performance.now()` and `requestAnimationFrame()`.
- Deferred mutations are intentional: systems stage entity changes first and let the end-of-schedule queue drain apply them in a predictable order.
- Snapshot support is a protocol, not a concrete serializer; downstream packages provide the actual snapshot classes and restoration behavior.
