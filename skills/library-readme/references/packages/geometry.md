---
title: Geometry
---

`@wimaengine/geometry` provides AABB bounding volumes, overlap helpers, and geometry runtime support.

## Capability Highlights

- Axis-aligned bounding boxes and bounding circles cover the package's core spatial shapes.
- Overlap helpers compare those shapes for collision, visibility, and other coarse spatial tests.
- Bound type helpers keep engine code agnostic to the exact bound shape in use.
- Systems and plugin wiring expose geometry behavior to the ECS runtime layer.
- The published package exposes both the root entry and a `./src` entry point.

## Core Concepts

### AABB

AABB is the package's primary spatial primitive. The existing package README frames the geometry package around axis-aligned bounds, so future documentation should treat AABB as the default shape rather than as a niche implementation detail.

### Bounding Circles

Bounding circles sit alongside AABB in the public description. They give the package a simpler coarse bound for spatial checks and should be documented as part of the same bounding-volume family.

### Overlap Helpers

Overlap logic is the package's practical output: it turns the shape primitives into predicates that other engine systems can use. Future README copy should connect these helpers to broadphase collision, visibility culling, and other spatial comparisons.

### Bound Types

Bound type helpers are the dispatch layer between generic engine code and concrete shapes. If the future README mentions them, it should explain that they exist to choose or normalize a geometric bound without hardcoding the shape.

### Systems and Plugin Wiring

The ECS-facing surface integrates geometry into runtime setup. This is implementation support rather than the headline feature, but it still belongs in the package narrative because it makes the primitives available to engine systems instead of leaving them as standalone math utilities.

## Notes for a Future README

- Lead with spatial bounds and overlap checks, not internals or dependency lists.
- Keep the package positioned as a support layer for broadphase, narrowphase, and rendering consumers.
- If an exported-surface section is added later, anchor it in the root entry and `./src` export from `package.json`.
- Mention the published package name `@wimaengine/geometry` and keep examples centered on collision and culling use cases.
- If a standard installation line is needed, use `npm i @wimaengine/geometry`.
- Preserve the current feature-first tone of the package README instead of expanding into a usage guide.
