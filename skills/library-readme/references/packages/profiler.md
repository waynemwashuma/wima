---
title: Profiler
---

`@wimaengine/profiler` provides profiling and timer resources for engine performance instrumentation.

## Package Role Summary

This package supplies the engine-side state and systems used to measure performance while the app is running. The current package README frames it around profiling and timer resources, so future README copy should describe it as runtime instrumentation infrastructure that other engine modules read and update, not as a standalone profiling dashboard.

## Capability Highlights

- Profiling state for capturing runtime measurements inside the engine.
- Timer resources for elapsed-time tracking and duration-based instrumentation.
- Systems that keep profiling data synchronized as the engine runs.
- Tight integration with the app, core, ECS, time, logging, reflection, and type packages.
- A small, infrastructure-oriented public surface with both root and `./src` entry points.

## Core Concepts

### Profiler Resource

The profiler resource is the central state holder for measurements. Future README text should position it as the runtime record of profiling data rather than as a tool on its own.

### Timer Resource

The timer resource tracks elapsed time and duration information that the profiler logic can build on. It is the simplest primitive in the package and likely the one most closely tied to frame-by-frame instrumentation.

### Profiling Systems

The package includes systems that keep profiler data current while the engine executes. These are the operational layer of the package and the reason the resources stay useful without manual bookkeeping.

### Package Entry Points

The manifest exposes both a package root entry point and a `./src` subpath. Future docs should make that split explicit if they talk about imports, but the reference note should keep the emphasis on the package's runtime role rather than module wiring.

## Notes for a Future README

- Keep the README feature-first and centered on runtime instrumentation, not on installation or usage walkthroughs.
- Reuse the words `profiling`, `timer`, and `systems` consistently; the current package README already uses those terms and they should remain the package vocabulary.
- The dependency list suggests this package is part of the engine runtime stack, especially around app lifecycle, ECS state, time measurement, and type/reflection support.
- The package is ESM-only and publishes types from `dist`, so a future README can mention import shape without turning into a packaging guide.
- Avoid broad performance claims. The verified surface here is measurement state plus supporting systems, not a full analysis or visualization suite.
- If future docs need examples, keep them small and show how the profiler resources fit into the engine rather than building a standalone workflow around them.
