---
title: Movable
---

`@wimaengine/movable` provides 2D and 3D motion components, prefabs, and plugins.

## Installation

```sh
npm i @wimaengine/movable
```

## Capability Highlights

- Velocity, acceleration, rotation, and torque components for motion state.
- 2D and 3D prefab helpers for common movable entities.
- Systems and plugins that keep movement data active in ECS.

## Core Concepts

### Components

The components modules describe motion state in both 2D and 3D forms.

### Prefabs

The prefabs modules provide ready-made movable entity setups.

### Plugins

The plugin modules register the movement runtime for the selected dimensionality.

## Notes

- This package is designed to pair with transform, integrator, gravity, and damping layers.
