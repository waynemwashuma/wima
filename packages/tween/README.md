---
title: Tween
---

`@wimaengine/tween` provides tween components and easing helpers for animated motion, scale, and orientation.

## Installation

```sh
npm i @wimaengine/tween
```

## Capability Highlights

- Tween components for 2D and 3D position, orientation, and scale.
- Marker components for sequencing and control.
- Easing and lerp typedefs for reusable interpolation logic.
- Systems and plugin wiring for ECS-driven tween updates.

## Core Concepts

### Components

The components modules store the animated property state for each tween target.

### Core

The core module exposes easing helpers and interpolation logic.

### Typedefs

The typedef module defines easing and lerp signatures used by the package.

## Notes

- Use this package when you want time-based interpolation as an ECS system instead of a one-off utility.
