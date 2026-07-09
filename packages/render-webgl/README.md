---
title: Render WebGL
---

`@wimaengine/render-webgl` provides the WebGL rendering backend, shader programs, and GPU-facing caches.

## Installation

```sh
npm i @wimaengine/render-webgl
```

## Capability Highlights

- WebGL shader sources and shader composition helpers.
- Render pipeline logic and WebGL constants.
- Resource caches for clear color, UBOs, meshes, programs, and attribute maps.
- Systems and plugin wiring for backend integration.

## Core Concepts

### Shaders

The shaders modules define the built-in shader programs used by the backend.

### Core

The core modules hold render pipeline logic and WebGL-specific constants and helpers.

### Resources

The resources modules manage GPU-facing cache state and clear color configuration.

### Systems

The systems modules run the WebGL backend inside the engine runtime.

## Notes

- This package is the GPU backend counterpart to `@wimaengine/render-core`.
