---
title: Math
---

`@wimaengine/math` is the engine's shared numeric foundation. It supplies the mutable vectors, matrices, angles, affines, bases, and helper functions that other packages use for transforms, interpolation, projections, and general spatial work.

## Shared Types

The important idea is not the individual class names, it is the common type layer they create. `Vector2`, `Vector3`, `Vector4`, `Matrix2`, `Matrix3`, `Matrix4`, `Quaternion`, `Affine2`, `Affine3`, and the basis types all give the rest of the engine a shared language for spatial data.

That language shows up everywhere:

- [Rendering](../27-rendering/index.md) uses matrices, projections, and affines for cameras and mesh transforms.
- [Windowing](../34-windowing/index.md) uses vectors for size and resize requests.
- [Animation](../33-animation/index.md) uses interpolation helpers when it blends track data.
- [Scenes](../31-scenes/index.md) rely on the same numeric types when snapshotting and restoring runtime state.

## Helpers And Behaviour

The helper modules are as important as the geometry types. Easing, interpolation, clamp, noise, index-map logic, and the other utility functions are what make the package useful as engine infrastructure rather than as a bare math library.

In other words, the math package is not just where values are stored. It is also where the engine gets the operations that make time-based systems feel coherent. Animation playback, camera motion, and UI size changes all depend on those helpers being consistent across packages.

## Runtime Registration

`MathPlugin` only registers math types at startup, but that is still important. It lets the app and reflection layer treat the math primitives as first-class runtime types instead of anonymous objects. That makes serialization, snapshots, and type-driven systems easier to keep aligned across the engine.

The result is a small package with a broad effect: once math types are registered, almost every other engine package can move the same values through ECS, assets, snapshots, and runtime systems without converting between incompatible representations.
