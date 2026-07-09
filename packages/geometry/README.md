---
title: Geometry
---

`@wimaengine/geometry` provides AABB bounding volumes, overlap helpers, and geometry runtime support.

## Installation

```sh
npm i @wimaengine/geometry
```

## Capability Highlights

- Bounding boxes and bounding circles for collision and visibility checks.
- Bound type helpers for selecting the correct geometric shape.
- Overlap logic for comparing bounding volumes.
- Systems and plugin wiring for ECS integration.

## Core Concepts

### AABB

The AABB modules cover axis-aligned bounding boxes, circles, and overlap checks.

### Systems

The systems modules expose the ECS-facing type surface for geometry work.

## Notes

- `@wimaengine/broadphase`, `@wimaengine/narrowphase`, and rendering packages can use this package for spatial tests.
