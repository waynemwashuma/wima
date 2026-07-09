# Misc Package Notes

`@wimaengine/misc` is the umbrella composition package for Wima's default engine stack. It gives downstream projects one install point for the common baseline instead of asking them to wire each subsystem package individually.

## Role Summary

`@wimaengine/misc` is intentionally thin. The package does not introduce a new runtime domain; it packages the shared engine defaults and exposes a compact entry surface for convenience composition.

## Capability Highlights

- Single package entry point for the broad default engine bundle.
- Pulls together runtime, asset, audio, rendering, input, physics, geometry, scene, transform, motion, and supporting utility packages.
- Publishes both the package root and a `./src` export path.
- Keeps the publish surface compact by shipping `index.js` and `src` only.
- Acts as a convenience layer for projects that want the standard engine baseline without assembling dependencies manually.

## Core Concepts

### Composition Entry Point

The main value of `@wimaengine/misc` is its role as a composition entry point. The package is meant to be imported when a project wants the engine's common defaults in one place, not when it needs a new subsystem or algorithm of its own.

### Default Engine Bundle

The package groups a wide cross-section of engine packages behind one dependency set: `app`, `asset`, `audio`, `color`, `command`, `core`, `damping`, `device`, `geometry`, `gravity`, `hierarchy`, `input`, `integrator`, `math`, `movable`, `name`, `physics`, `profiler`, `reflect`, `render-core`, `scene`, `storage`, `time`, `transform`, `tween`, and `window`. That makes the package useful as a bootstrap target for application code that wants a standard baseline spanning runtime orchestration, data and reflection, motion and physics, scene structure, and device/input integration.

### Package Exports

The manifest documents two import surfaces: the package root and `@wimaengine/misc/src`. The root points at `./index.js`, while `./src` points at `./src/index.js`. The type declarations mirror that split in `dist/index.d.ts` and `dist/src/index.d.ts`, so a future README can describe both the published entry point and the source-facing entry point without inventing additional API shape.

### Published Payload

The package publishes only `index.js` and `src`, which keeps the distribution intentionally narrow. That is a useful detail for a README because it signals that `@wimaengine/misc` is a small integration package, not a deep library with a large standalone surface.

## Notes for a Future README

- Lead with the package's convenience role and its default-engine bundling behavior.
- Keep the capability section focused on breadth and integration, not on individual subsystem behavior.
- If you mention dependencies, group them by domain instead of listing them as a flat catalog in the README body.
- Avoid a usage walkthrough unless the README request explicitly calls for one; this package reads more clearly as a feature summary than as a tutorial.
- If a future README needs named exports, inspect the package source to confirm the exact symbol names before documenting them.
