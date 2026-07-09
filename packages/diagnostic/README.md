---
title: Diagnostic
---

`@wimaengine/diagnostic` provides runtime diagnostics such as FPS reporting and entity counts.

## Installation

```sh
npm i @wimaengine/diagnostic
```

## Capability Highlights

- FPS debugging utilities for live runtime inspection.
- Entity count tracking for ECS health checks.
- Timing resources that support diagnostic sampling.

## Core Concepts

### FPS Debugger

The FPS debugger module measures frame cadence and exposes a simple performance signal.

### Entity Count

The entity count helper tracks how many entities are currently registered in the world.

### Resources

The resource layer holds timing state used by the diagnostic systems.

## Notes

- Use `@wimaengine/diagnostic` when you need lightweight runtime visibility without a full profiler workflow.
