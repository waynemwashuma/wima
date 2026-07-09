---
title: Emitter
---

`@wimaengine/emitter` is Wima's ECS particle-emission layer, combining emitter state, prefab helpers, and runtime plugin wiring for 2D and 3D effects.

## Installation

```sh
npm i @wimaengine/emitter
```

## Capability Highlights

- Encapsulates emitter configuration in a serializable `Emitter` component with prefab, patch, burst-count, lifetime, and enabled state.
- Samples burst sizes and particle lifetimes from `Range` values at emission time, so each cycle can vary without hardcoding counts or durations.
- Spawns particles from optional prefab component bundles and can apply a post-spawn patch callback for per-entity adjustments.
- Ships `Emitter2DPlugin` and `Emitter3DPlugin` classes that register the emitter types and runtime systems into the app update schedule.
- Includes `createEmitter2D` and `createEmitter3D` helpers that assemble transform, timer, hierarchy, and emitter components into ready-to-use entity bundles.
- Uses a `Particle` marker plus timer-based cleanup to identify emitted entities and despawn them when their lifetime completes.

## Core Concepts

### Emitter

`Emitter` is the package's configuration component. It stores the prefab factory, optional patch callback, burst-count range, lifetime range, and enabled flag, and it provides copy, clone, serialize, deserialize, and validation helpers so emitter state can move through reflection or persistence flows cleanly.

### Particle

`Particle` is an intentionally empty marker component. It exists so emitted entities can be filtered and cleaned up as particles rather than as generic entities, which keeps the lifetime query separate from the rest of the world state.

### Prefabs

`createEmitter2D` and `createEmitter3D` package the component bundle for an emitter entity. Both helpers create the transform stack, attach `Emitter`, `Timer`, and `Children`, and leave the dimensional details to the 2D or 3D transform variant so the package can support planar and spatial effects with the same emitter model.

### Plugins

`Emitter2DPlugin` and `Emitter3DPlugin` are the integration layer. Each one registers `Particle` and `Emitter` with the app, then wires the matching emit and despawn systems into `AppSchedule.Update` so particle emission becomes part of the engine's normal runtime loop.

### Systems

The internal systems drive the actual particle lifecycle. They query emitters that have a global transform and timer, gate emission on `Timer.cycleStarted()`, spawn particles in world space by copying the emitter's decomposed transform, and add a fresh `Timer` plus the `Particle` marker to each spawned entity before cleanup later removes completed particles.

## Exported Surface

- `components` exports `Emitter` and `Particle`.
- `prefabs` exports `createEmitter2D` and `createEmitter3D`.
- `plugin` exports `Emitter2DPlugin` and `Emitter3DPlugin`.
- The package root re-exports `components`, `prefabs`, and `plugin`, and the manifest also exposes the `./src` subpath for source-oriented imports.

## Notes

- Emission currently uses world-space placement for spawned particles; the source comments call out local-space parenting as a future direction rather than a supported mode today.
- Particle cleanup depends on the `Particle` marker and `Timer.completed()`, so non-particle entities are not part of the despawn query.
- The public entry surface stays intentionally small, while the `systems` module remains an implementation detail behind the plugin classes.
- `burstCount` and `lifetime` rely on `@wimaengine/datastructures` `Range` instances, which makes both fields sampleable instead of fixed.
- The package is ESM-only and publishes typed entrypoints through the package manifest, so the README should describe the exported modules rather than suggesting a monolithic runtime API.
