# Window Feature Notes

`@wimaengine/window` is the ECS-facing browser window layer for Wima. It models window state, queues deferred DOM operations, and routes keyboard, pointer, file, and window events through the engine.

## Preferred README Shape

- YAML frontmatter `title: Window`
- One-sentence summary of the package's role in the engine
- `## Installation`
- `## Capability Highlights`
- `## Core Concepts`
- `## Exported Surface`
- `## Notes`

## Capability Highlights

- Deferred window command handling through `WindowCommand`, `WindowRequest`, and the queue-backed `WindowCommands` helper.
- Keyboard, pointer, file, and window event families routed through ECS.
- Serializable window components for window state and primary window tagging.
- A `Windows` resource that maps entity handles to DOM canvas surfaces.
- A default startup path that can spawn the primary window entity automatically.
- ECS startup wiring and prefab helpers that keep window state registered consistently.

## Core Concepts

### WindowPlugin

`WindowPlugin` is the package's integration layer. It registers the `Window` and `MainWindow` component types, installs the startup system that seeds window type metadata, wires every event family into the event plugin, and stores the `Windows` resource on the world. When `initPrimaryWindow` is enabled, it also schedules a startup system that spawns the primary window entity with the configured window settings.

### Commands

The command surface centers on `WindowCommand`, `WindowRequest`, and `WindowCommands`. `WindowCommand` resolves the target window resource and component state, then applies resize, reposition, pointer capture, pointer release, fullscreen, or pointer lock operations to the underlying canvas element. `WindowCommands` queues the common window requests through the command queue so systems can request window changes without touching DOM state directly.

### Components

The component modules store the runtime window model. `Window` keeps width, height, and selector data and supports copy, clone, serialize, and deserialize helpers. `MainWindow` marks the primary window entity and is intentionally minimal so it can act as the canonical handle for the active surface.

### Events

The event modules group the runtime-facing input and window event types. Window move and resize events, keyboard down and up events, pointer down/up/move/enter/leave/cancel/wheel events, and file drag/drop events all live here so browser behavior can be routed through ECS in a consistent shape.

### Resources

The `Windows` resource tracks the actual window surfaces that belong to the world. It lets commands and systems resolve the DOM canvas or window handle from an entity handle, which keeps the runtime state and ECS entity state aligned.

### Prefabs

The prefab modules provide the ready-made primary window setup. The main prefab combines the `Window` and `MainWindow` components so the package can bootstrap a default window entity without requiring the caller to assemble the entity manually.

## Exported Surface

- `commands` exports `WindowCommand` and `WindowRequest`.
- `components` exports `Window` and `MainWindow`.
- `core` exports `WindowCommands`.
- `events` exports the window, keyboard, pointer, and file event record classes.
- `resources` exports `Windows`.
- `prefabs` exports `createMainWindow`.
- `plugin` exports `WindowPlugin`.
- The package root re-exports its `src` surface, and the manifest also exposes `./src` for source-level imports.

## Notes

- `@wimaengine/window-dom` supplies the browser-backed implementation layer for this package.
- The package depends on `@wimaengine/app`, `@wimaengine/command`, `@wimaengine/core`, `@wimaengine/ecs`, `@wimaengine/event`, `@wimaengine/logger`, `@wimaengine/math`, `@wimaengine/reflect`, and `@wimaengine/type`.
- The package exports both its package root and `./src`, so the README should mention the runtime layer and the source entry point when that distinction matters.
