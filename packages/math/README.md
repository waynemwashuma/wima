---
title: Math
---

`@wimaengine/math` is Wima's shared numeric foundation, bundling mutable vectors, matrices, rotations, transforms, coordinate frames, and numeric helpers used across the engine.

## Installation

```sh
npm i @wimaengine/math
```

## Capability Highlights

- Float and boolean vector families for 2D, 3D, and 4D math.
- Matrix primitives for 2x2, 3x3, and 4x4 linear algebra.
- Angle, rotary, and quaternion types for 2D and 3D orientation math.
- Affine and basis primitives for transform composition and coordinate frames.
- Helper modules for clamp and snap, easing, interpolation, numeric utilities, index mapping, and random noise.
- Reflection registration through `MathPlugin` and `registerMathTypes` so math types are available to the type system at startup.
- Root and source entrypoints that expose the package's `core`, `systems`, `plugin`, and `./src` surface.

## Core Concepts

### Vectors

`Vector2`, `Vector3`, and `Vector4` carry float coordinates and expose mutable arithmetic, magnitude, distance, normalization, dot and cross products, and serialization helpers. The `BVector2`, `BVector3`, and `BVector4` counterparts use the same dimensional layout for boolean masks and predicate results.

### Matrices

`Matrix2`, `Matrix3`, and `Matrix4` form the package's matrix layer. They use column-major storage and provide the operations expected of spatial math primitives: construction, copy and clone, transpose, determinant, trace, arithmetic, inversion, and equality checks.

### Angles, Rotaries, and Quaternions

`Angle` is a small radian wrapper for cases where the engine needs an object reference instead of a bare number. `Rotary` stores 2D orientation as a cosine and sine pair, and `Quaternion` captures 3D orientation and rotation composition. Together they cover the package's rotation model without forcing a single representation.

### Affines

`Affine2` and `Affine3` combine translation, rotation, scale, and skew into transform-ready structures. They sit between raw matrix math and higher-level transform systems by providing composition, decomposition, inverse, multiply and divide, and vector transformation helpers.

### Bases

`Basis2` and `Basis3` represent coordinate frames as axis vectors. They are useful when a consumer needs basis data directly, and their serialized forms stay close to the underlying vector primitives.

### Function Helpers

The `functions` module groups reusable scalar helpers: `clamp`, `snap`, `snapDown`, `snapUp`, easing curves, interpolation, index mapping, mathematical utilities, and `rand`. The `Interpolation` helper object exposes linear, Catmull-Rom, and cosine interpolation variants.

### Constants

`core/constants` centralizes shared numeric values and conversion factors, including `TAU`, `PI`, `HALF_PI`, `QUARTER_PI`, `DEG2RAD`, `RAD2DEG`, `SQRT2`, `INV_SQRT2`, `PHI`, and the package tolerance export used by fuzzy comparisons.

## Exported Surface

- `core` re-exports `affines`, `angles`, `basis`, `functions`, `matrices`, `vectors`, and `constants`.
- `systems` re-exports `registerMathTypes`, which seeds `TypeRegistry` with reflection metadata for every core math primitive.
- `plugin` re-exports `MathPlugin`, which registers that system on `AppSchedule.Startup`.
- The package root and `./src` subpath both expose the same top-level math surface, so consumers can import the package through either entrypoint.

## Notes

- The package is engine infrastructure, not a standalone math toolkit.
- Most classes follow a mutable-instance plus static-helper pattern, which keeps composition efficient and serialization predictable.
- `registerMathTypes` covers `Angle`, `Rotary`, `Quaternion`, `Affine2`, `Affine3`, `Basis2`, `Basis3`, the float and boolean vector families, and the matrix families.
- The helper modules are intentionally small and composable so downstream packages can import only the numeric operations they need.
