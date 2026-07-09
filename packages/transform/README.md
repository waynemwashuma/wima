---
title: Transform
---

`@wimaengine/transform` owns the engine's 2D and 3D spatial state, composes local values into global transforms through hierarchy-aware systems, and keeps remote transform mirrors aligned with their source entities.

## Installation

```sh
npm i @wimaengine/transform
```

## Capability Highlights

- Parallel 2D and 3D spatial component families cover position, orientation, scale, and resolved global transform state.
- Hierarchy-aware propagation turns local transforms into world-space transforms for entities with parent and child relationships.
- Remote transform components mirror or offset another entity's spatial state on a per-channel basis.
- Prefab helpers bundle common transform component sets into reusable arrays for 2D and 3D entities.
- Plugins register runtime types and schedule the sync, propagation, and remote-alignment systems that keep transforms coherent.

## Core Concepts

### 2D Spatial Components

`Position2D`, `Orientation2D`, `Scale2D`, and `GlobalTransform2D` define the planar transform model. `Position2D` and `Scale2D` are vector-based components, `Orientation2D` stores rotation in rotary form, and `GlobalTransform2D` stores the composed affine result that downstream systems consume.

### 3D Spatial Components

`Position3D`, `Orientation3D`, `Scale3D`, and `GlobalTransform3D` mirror the 2D model for volumetric scenes. The classes follow the same copyable and serializable pattern, but use 3D vector, quaternion, and affine math so the package can represent full world-space orientation and scale.

### Remote Transforms

`RemoteTransform2D` and `RemoteTransform3D` point at another entity by `EntityHandle` and apply an optional offset transform while copying translation, orientation, and scale. Their boolean flags let the runtime mirror only selected channels, which makes them useful for followers, attachments, and other linked entities without reparenting.

### Prefabs

`createTransform2D` and `createTransform3D` build the standard transform component bundle for a new entity. The 2D helper creates local position, orientation, scale, and global transform components from scalar inputs, and the 3D helper does the same while deriving orientation from Euler angles with `Quaternion.fromEuler`.

### Plugins and Runtime Systems

`Transform2DPlugin`, `Transform3DPlugin`, `RemoteTransform2DPlugin`, and `RemoteTransform3DPlugin` register the component types and wire the package's update flow into the app scheduler. The sync systems compose local transform values into global transforms, the propagation systems walk hierarchy relationships and multiply parent and child transforms, and the remote systems keep mirrored entities aligned with their source state.

## Exported Surface

- `components` exports the 2D and 3D component families: `Position2D`, `Orientation2D`, `Scale2D`, `GlobalTransform2D`, `RemoteTransform2D`, and the corresponding 3D classes.
- `prefabs` exports `createTransform2D` and `createTransform3D`.
- `plugins` exports `Transform2DPlugin`, `Transform3DPlugin`, `RemoteTransform2DPlugin`, `RemoteTransform3DPlugin`, and the shared `TransformSystems` group.
- The package root and the `./src` subpath both expose the public API; `./src` is published for direct source-level imports.

## Notes

- The component classes implement copy, clone, serialize, and deserialize methods so they can participate in the engine's type registry.
- Runtime registration depends on `@wimaengine/app`, `@wimaengine/ecs`, `@wimaengine/hierarchy`, `@wimaengine/math`, `@wimaengine/reflect`, `@wimaengine/relationship`, and `@wimaengine/type`.
- `synctransform2D`, `synctransform3D`, `propagateTransform2D`, `propagateTransform3D`, `transformRemote2D`, and `transformRemote3D` are the package's runtime systems; they are orchestrated by the plugins rather than exposed as the primary entry point.
- The package is ESM-only and publishes both `index.js` and `./src` through its manifest.
