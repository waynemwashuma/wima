---
title: Noise
---

`@wimaengine/noise` provides reusable noise-generation helpers.

## Role Summary

`@wimaengine/noise` is a small procedural-noise helper rather than a broad noise toolkit. Its job is to provide repeatable numeric variation for engine code that needs seeded samples without managing state, lookup tables, or a larger generator API.

## Capability Highlights

- Deterministic 1D and 2D sampling from numeric coordinates plus a seed.
- Static, stateless API centered on `Noise`, so consumers do not instantiate or configure a generator object.
- 2D noise built from surrounding lattice samples and cosine interpolation.
- Thin integration with `@wimaengine/math` through `Interpolation.cosine`.
- ESM package with both a root entrypoint and a `./src` subpath.

## Core Concepts

### Noise

`Noise` is the package's only public primitive and the concept a future README should lead with. It bundles the sampling helpers into static methods, which keeps the package easy to describe as "call a coordinate plus seed, get a deterministic value back."

### 1D Sampling

`Noise.get1D(value, seed)` is the lowest-level sampling primitive. It turns a single numeric coordinate and seed into a repeatable pseudo-random value, which makes it suitable as the base building block for procedural variation and hash-like noise lookups.

### 2D Sampling

`Noise.get2D(x, y, seed)` extends the same seeded approach to a 2D coordinate pair. It samples the surrounding integer lattice, blends the corner values, and returns a smoothed result, so future README copy should frame it as interpolated grid noise rather than raw randomness.

### Seeded Repeatability

The same coordinate and seed always produce the same result. That deterministic contract is the main behavioral promise in this package and should stay prominent in any future README.

## Exported Surface

- Root import: `.` maps to `./index.js`.
- Source subpath: `./src` maps to `./src/index.js`.
- The public API is centered on the `Noise` class exported from `src/core/noise.js`.
- The published payload is intentionally narrow: `index.js` and `src` only.

## Notes

- The implementation depends on `Interpolation.cosine` from `@wimaengine/math`, so the package is best described as a consumer of shared math utilities rather than a standalone noise math library.
- The current README is intentionally sparse. A future README should preserve the one-class mental model and call out only `Noise.get1D` and `Noise.get2D` unless the surface grows.
- The algorithm uses integer lattice sampling, `BigInt`, and cosine interpolation. Future docs should mention determinism and smoothing, but avoid overexplaining internals unless symbol-level documentation is needed.
- Because the package is small, a future README probably does not need a long export table unless more functions are added.
