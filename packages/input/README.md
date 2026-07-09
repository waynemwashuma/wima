---
title: Input
---

`@wimaengine/input` is the app-facing composition layer that installs keyboard, mouse, and touch input through a single Wima plugin.

## Installation

```sh
npm i @wimaengine/input
```

## Capability Highlights

- Aggregates `KeyboardPlugin`, `MousePlugin`, and `TouchPlugin` into one app-level entry point.
- Centralizes runtime input wiring so applications do not have to assemble the device packages separately.
- Stores a target `HTMLElement` on the plugin instance, defaulting to `document.body`.
- Keeps the published surface narrow: the package root and `./src` re-export the same plugin surface.
- Fits into the broader app runtime as a plugin, not as a standalone input primitive package.

## Core Concepts

### InputPlugin

`InputPlugin` is the package's only concrete class export. It extends `Plugin` from `@wimaengine/app` and acts as the composition point for the full input stack. Its `register(app)` method installs touch, mouse, and keyboard plugins onto the app in one place.

### Target Element

The constructor accepts an `HTMLElement` target and falls back to `document.body` when no element is provided. The instance keeps that value on `this.target`, which makes the plugin easy to anchor to a specific DOM surface even though the current registration flow only composes child plugins.

### Device Plugin Composition

The package does not implement its own keyboard, mouse, or touch primitives. Instead, it delegates those responsibilities to the dedicated device packages and exposes a single app-facing integration layer.

## Exported Surface

- `InputPlugin` from `src/plugin.js`.
- The package root `@wimaengine/input` re-exports the same surface through `index.js`.
- `@wimaengine/input/src` also re-exports that same surface for source-level imports.

## Notes

- The dependency set is intentionally small: `@wimaengine/app`, `@wimaengine/keyboard`, `@wimaengine/mouse`, and `@wimaengine/touch`.
- The default target is `document.body`, so non-browser or pre-DOM environments should provide an explicit element.
- Because the package is composition-only, app code that needs direct device state should use the dedicated keyboard, mouse, or touch packages instead.
