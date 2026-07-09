# Diagnostic package reference

`@wimaengine/diagnostic` is the lightweight runtime-diagnostics slice of Wima, focused on frame-rate visibility, ECS entity counts, and shared timing state rather than a full profiler workflow.

## Package Role Summary

The package exists to surface small, fast runtime signals that help developers check engine health while the app is running. The current package README frames it around FPS reporting, entity-count tracking, and timing resources, which makes it a good fit for live debugging and sanity checks during development.

## Installation

```sh
npm i @wimaengine/diagnostic
```

## Capability Highlights

- Live FPS reporting for observing frame cadence at runtime.
- ECS entity-count tracking for checking world population and overall system health.
- Timing resources that provide the shared state used by diagnostic sampling.
- Lightweight visibility tooling that fits alongside the engine runtime instead of replacing it with a separate profiler.
- Dual package entry points for the main package surface and the `./src` source surface.

## Core Concepts

### FPS Debugger

The FPS debugger is the most visible diagnostic primitive in the package. It is responsible for measuring frame cadence and exposing a simple performance signal that can be read during runtime.

### Entity Count

The entity-count helper tracks how many entities are currently registered in the ECS world. This gives a quick check for world growth, unexpected churn, or missing simulation activity.

### Timing Resources

The timing resources provide the shared timing state that diagnostic systems use for sampling and reporting. They are the connective tissue behind the package’s runtime measurements.

## Notes for a Future README

- Keep the README feature-first and centered on diagnostics, not on setup or walkthrough steps.
- Preserve the current three-part structure around FPS, entity counts, and timing state.
- The manifest exposes a root entry point and a `./src` entry point, so module-shape notes may be useful if the README later covers exports.
- The package is ESM-only and publishes types from `dist`, which is worth noting if future docs discuss import behavior.
- The dependency set points to engine integration rather than standalone utility code: `@wimaengine/app`, `@wimaengine/core`, `@wimaengine/ecs`, `@wimaengine/reflect`, `@wimaengine/time`, and `@wimaengine/type`.
- If the README expands, keep the language aligned with the current package README: lightweight runtime visibility without a heavy profiling narrative.
