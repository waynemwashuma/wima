---
title: Tween
---

`@wimaengine/tween` packages ECS tweening for transform animation, pairing animated component state with easing helpers, interpolation contracts, and runtime system/plugin integration.

## Capability Highlights

- Covers 2D and 3D position, orientation, and scale tweening.
- Provides marker components for sequencing and control.
- Bundles easing helpers and lerp typedefs for interpolation behavior.
- Integrates tween evaluation through ECS systems and a plugin entrypoint.
- Exposes both the package root and `./src` from `package.json`, which is useful to mention if future docs distinguish stable versus source-level imports.

## Core Concepts

### Tween Components

Tween components carry animated state for the target entity. The package is centered on transform motion, so docs should explain these components as the data model for timed changes.

### Transform Primitives

The component set spans position, orientation, and scale in both 2D and 3D. A future README should group these by motion family so readers can see the full transform surface quickly.

### Marker Components

Markers are the coordination layer for tween flows. They support sequencing and control concerns that sit alongside the animated transform data.

### Easing Helpers

The core easing module provides the shaping logic that drives interpolation over time. Future docs should treat easing as the package’s behavior layer rather than as a generic math utility.

### Systems and Plugin

The systems module and plugin wire tweening into the ECS runtime. This is the integration story worth highlighting in a README because it shows tweening as part of the engine loop, not a standalone helper.

### Typedefs

The typedefs define easing-function and lerp signatures. They matter because the package’s API surface is partly contract-based, which future docs can call out when describing extensibility.

## Future README Notes

- Lead with transform tweening in an ECS context, not with implementation details.
- Keep the package framed as motion orchestration for entities, especially when describing position, orientation, and scale together.
- Mention markers when explaining sequencing or control, but avoid turning the README into a timeline tutorial.
- Call out the plugin and systems as the runtime integration points.
- If imports are documented later, distinguish the root export from the `./src` subpath from `package.json`.
- Keep the README feature-first and short; the current package README is minimal, so a future version should expand capability coverage rather than add usage walkthroughs.
