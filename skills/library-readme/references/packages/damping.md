---
title: Damping
---

`@wimaengine/damping` provides linear and angular damping resources and systems.

## Package Role Summary

This package sits in the movement and simulation layer. It defines how motion slows over time and provides the systems that apply that behavior during world updates. The package is small, focused, and meant to be composed with the rest of the engine rather than used as a standalone math utility.

## Capability Highlights

- Models linear damping for translational motion.
- Models angular damping for rotational motion.
- Applies damping through ECS systems so the effect is enforced during simulation.
- Integrates with the broader Wima stack through `@wimaengine/app`, `@wimaengine/core`, `@wimaengine/ecs`, `@wimaengine/math`, `@wimaengine/movable`, `@wimaengine/reflect`, and `@wimaengine/type`.
- Ships as an ESM package with both a root entry and a `./src` entry.

## Core Concepts

### Linear Damping

Linear damping controls how quickly translation slows down. In the package README, it is framed as the resource that governs translational motion decay over time. Future docs should describe it as the linear counterpart to rotational damping rather than as a generic property bag.

### Angular Damping

Angular damping is the rotational equivalent. It governs how quickly spinning motion settles, and it should be explained in parallel with linear damping so readers can see the two as related primitives with different motion domains.

### Systems

The systems layer is the active part of the package. It reads damping state and mutates the world during simulation so the damping effect is applied consistently rather than left as passive data. If a future README expands the execution model, this is the section that should explain where the package plugs into the engine update loop.

## Packaging And Exports

- Package name: `@wimaengine/damping`
- Version: `0.3.0`
- Module format: ESM only (`"type": "module"`)
- Primary entry: `./index.js`
- Additional source entry: `./src`
- Published files are limited to `index.js` and `src`, which keeps the surface intentionally compact
- Type declarations resolve from `dist/index.d.ts` and `dist/src/index.d.ts`

## Drafting Notes

- Open any future README with motion-decay framing, not with installation or usage details.
- Keep the distinction between linear and angular damping explicit throughout the document.
- Mention the package as part of the simulation pipeline, because the current README already positions it alongside `@wimaengine/physics`, `@wimaengine/integrator`, and `@wimaengine/movable`.
- If a future README documents imports, separate the root entry from the `./src` entry so readers understand the public versus source-level access pattern.
- The current README is intentionally brief, so a rewrite should expand the role of damping in the engine before adding API walkthroughs.
