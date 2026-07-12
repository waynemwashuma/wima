---
title: Math
---

`@wimaengine/math` is Wima's shared numeric foundation, bundling mutable vectors, matrices, rotations, transforms, coordinate frames, and numeric helpers used across the engine.

## Capability Highlights

- Float and boolean vectors for 2D, 3D, and 4D math.
- Matrix and quaternion helpers for linear algebra and spatial orientation.
- Affine and basis primitives for transforms and coordinate-frame work.
- Utility helpers for easing, interpolation, clamp, noise, and related math operations.
- Published as an ESM package with both a root entrypoint and a `./src` subpath.

## Core Concepts

### Vectors

The vector family is the package's main data model. It spans float and boolean variants across the common dimensions, which makes it suitable for geometric quantities and per-component predicates.

### Matrices

Matrix primitives provide the linear-algebra backbone used for transforms and other spatial operations. Future README copy should frame them as foundational types rather than isolated utilities.

### Angles and Quaternions

Angle-oriented helpers cover rotation and orientation math, with quaternion support called out in the current README. This is the right place to explain rotation composition and how the package handles spatial orientation.

### Affines

Affine primitives represent translation and transformation math in 2D and 3D. They are one of the package's main bridge points between raw vector math and engine-level transform systems.

### Bases

Basis primitives should be treated as coordinate-frame helpers. The current README names them as a first-class concept, so future copy should explain them alongside affines instead of burying them in a generic utilities bucket.

### Function Helpers

The helper modules collect easing, interpolation, clamp, noise, mathematical helpers, and index-map utilities. These are the most reusable non-geometry pieces and can be described as the package's general-purpose toolbox.

## Exported Surface

- Root import: `.` resolves to `./index.js` with types in `./dist/index.d.ts`.
- Source subpath: `./src` resolves to `./src/index.js` with types in `./dist/src/index.d.ts`.
- The package ships `index.js` and `src` in `files`, so future README copy should not imply a broader published surface than those entrypoints.

## Notes

- Keep the package framed as engine infrastructure, not a standalone math library.
- The package description and current README are intentionally broad; future README copy should stay feature-first and avoid API walkthroughs.
- Downstream consumers include other engine packages, so terminology should match the Wima ecosystem.
- The dependency list in `package.json` suggests the math layer is integrated with the wider core/app/ecs/reflect/type stack.
- If a future README needs symbol-level documentation, inspect the actual exports rather than inferring more than the manifest and current README state.
