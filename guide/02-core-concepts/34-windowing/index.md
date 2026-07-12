---
title: Windowing
---

`@wimaengine/window` is the browser window layer for Wima. It turns the canvas surface and browser window state into ECS components, commands, events, and resources so runtime code can control the active window without talking to the DOM directly.

## Window State

The core ECS types are `Window` and `MainWindow`. `Window` stores the size and selector data for a surface, while `MainWindow` marks the primary runtime surface. The `Windows` resource maps entity handles to the actual `HTMLCanvasElement` instances.

That structure matters because rendering and input both need to resolve the same browser surface. [Rendering](../27-rendering/index.md) uses the main window to find the canvas and create a WebGL context, while other systems can read or update window state through ECS instead of mutating the DOM ad hoc.

## Commands And Events

Window changes do not happen by directly poking at the canvas. `WindowCommand` and `WindowCommands` queue deferred requests through the command system, which keeps resize, fullscreen, pointer lock, pointer capture, and repositioning as runtime actions instead of immediate DOM side effects.

The event layer covers the browser interactions the rest of the engine cares about: window move and resize, keyboard input, pointer input, and file drag-and-drop. That keeps browser behavior in the same runtime shape as the rest of the ECS world.

## Plugin And Prefab Setup

`WindowPlugin` is the integration point. It registers the window components, installs the event plugins, stores the `Windows` resource, and can spawn the primary window entity at startup. The `createMainWindow` prefab is the reusable version of that bootstrap path.

This is where the package connects back to [Input](../29-input/index.md) and [Rendering](../27-rendering/index.md). Input needs the browser event surface, and rendering needs a live canvas plus the primary window entity before the backend can build its GPU state.

## Runtime Rule

Treat windowing as ECS-backed runtime setup, not as a convenience wrapper around the DOM. Once the window entity exists, the rest of the engine can coordinate around it through components, commands, and resources.
