# @wimaengine/window-dom

`@wimaengine/window-dom` is the browser-only bridge that turns DOM canvas, keyboard, pointer, resize, and file activity into the engine window layer.

## Capability Highlights

- Adapts browser window and input APIs for engine consumption.
- Covers keyboard, pointer, and file interaction alongside the base window surface.
- Provides hooks that keep browser events aligned with engine state.
- Exposes a plugin entry point for wiring browser-backed window state into the app.
- Intended for browser targets rather than headless or non-DOM environments.

## Core Concepts

### Window API

The window adapter is the base integration point. It connects browser window behavior to the engine window layer so the rest of the engine can treat browser state as a supported runtime surface.

### Keyboard API

The keyboard adapter translates DOM keyboard interaction into the same engine-facing window context. Future docs should present it as part of the browser input layer, not as a standalone keyboard package.

### Pointer API

The pointer adapter covers pointing-device input in the browser. It belongs in the same family as keyboard support because it feeds user interaction into the engine window layer.

### File API

The file adapter brings browser file-related APIs into the same window-oriented integration path. It is part of the DOM bridge, not a separate file system abstraction.

### Hooks

The hooks layer keeps the browser event model synchronized with the engine's ECS-oriented runtime. In README language, this is the layer that explains how DOM events stay in step with engine state.

### Plugin

The plugin entry point is the integration surface for apps. It is the hook for installing the browser-backed window behavior into an application runtime.

## Notes for a Future README

- Lead with the package role: browser-specific bridge from DOM APIs to the engine window layer.
- Keep the README feature-first and integration-focused; avoid walking through usage unless the user explicitly asks for it.
- Mention both package entry points from `package.json`: the default `.` export and the `./src` export.
- Call out the dependency stack in terms of integration, especially `@wimaengine/window`, `@wimaengine/app`, and `@wimaengine/ecs`.
- Preserve the distinction between core adapters, hooks, and plugin wiring so the README reads as a map of responsibilities.
- The current README already signals browser scope; future drafting should keep that constraint obvious.
