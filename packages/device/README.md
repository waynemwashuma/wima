---
title: Device
---

`@wimaengine/device` packages runtime browser, platform, and capability metadata as a typed ECS resource, with plugin wiring that detects the host environment and seeds reflection metadata for downstream systems.

## Installation

```sh
npm i @wimaengine/device
```

## Capability Highlights

- Models browser identity and host OS identity with the enum-style `Browser` and `PlatformOS` identifiers.
- Combines browser state, platform state, and feature flags in a single `Device` resource.
- Tracks support for WebGPU, WebGL, 2D canvas, and WebAudio through `DeviceCapabilities`.
- Exposes `isMobile()` and `isPc()` helpers for coarse platform branching.
- Seeds the reflection/type registry during the `DevicePlugin` startup path.
- Publishes both the package root and `./src`, with the root entry point re-exporting the source surface.

## Core Concepts

### Browser

`Browser` is a numeric enum for runtime browser identity. The current values are `Unknown`, `Chrome`, `FireFox`, `Safari`, `internetExplorer`, `Opera`, and `Edge`, which keeps browser checks compact and serializable.

### PlatformOS

`PlatformOS` is the matching numeric enum for host platform identity. It distinguishes `Unknown`, `Android`, `Ios`, `Linux`, `Windows`, and `Mac`, letting the package separate mobile and desktop environments from browser identity.

### DeviceCapabilities

`DeviceCapabilities` records boolean support flags for `webgpu`, `webgl`, `canvas`, and `webAudio`. It serializes to plain data and back, and its `canvas` field initializes from `window.CanvasRenderingContext2D`, so the class assumes a browser-like runtime when instantiated.

### Device

`Device` aggregates `browser`, `platform`, and a nested `capabilities` object into the ECS-facing runtime snapshot. `isMobile()` returns true for Android and iOS, while `isPc()` returns true for Linux, macOS, and Windows. The class also defines `serialize()` and `deserialize()` so the device state can move through the engine's typed metadata path.

### DevicePlugin

`DevicePlugin` is the runtime bootstrap layer. When registered, it creates a `Device`, stores it as an app resource, and schedules `registerDeviceTypes` on `AppSchedule.Startup`. It then probes `window.CanvasRenderingContext2D`, `window.WebGLRenderingContext`, and `navigator.gpu`, and classifies browser and platform identity from `navigator.userAgent` with lightweight pattern checks.

### Type Registration

The internal `registerDeviceTypes` startup system seeds `TypeRegistry` with enum metadata for `Browser` and `PlatformOS`, then registers `DeviceCapabilities` and `Device` as structured types with their serialize and deserialize methods attached. That is what makes the device resource visible to reflection-aware and type-aware engine systems.

## Exported Surface

- `core` exports `Browser` and `PlatformOS`.
- `resources` exports `Device` and `DeviceCapabilities`.
- `plugin` exports `DevicePlugin`.
- The package root (`.`) and `./src` both re-export the same source tree.

## Notes

- The package is browser-oriented: `DevicePlugin` reads `navigator.userAgent`, `navigator.gpu`, and `window` globals, and `DeviceCapabilities` initializes `canvas` from `window.CanvasRenderingContext2D`.
- `DeviceCapabilities.webAudio` is part of the model even though the current plugin detection path only fills the rendering flags plus browser and platform identity.
- The package is a thin integration layer on top of `@wimaengine/app`, `@wimaengine/core`, `@wimaengine/ecs`, `@wimaengine/reflect`, and `@wimaengine/type`.
- The manifest publishes both `.` and `./src`, but both entry points lead back to the same re-exported modules.
