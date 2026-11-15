---
title: Gravity
description: "@wimaengine/gravity provides gravity resources and systems for motion simulation."
ogImage: /branding/logo/wima-logo-dark.png
---

`@wimaengine/gravity` provides gravity resources and systems for motion simulation.

## Installation

```sh
npm i @wimaengine/gravity
```

## Capability Highlights

- Gravity resource state for simulation settings.
- Systems that apply gravity during runtime updates.
- Plugin wiring for ECS registration.

## Core Concepts

### Resources

The gravity resource stores the acceleration or force state consumed by systems.

### Systems

The systems module applies gravity to eligible entities.

## Notes

- This package is usually consumed alongside `@wimaengine/integrator` and `@wimaengine/physics`.
