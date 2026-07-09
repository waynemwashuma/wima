---
title: Keyboard
---

`@wimaengine/keyboard` is the Wima Engine package that turns keyboard input into engine-friendly state, key/location primitives, and ECS-ready runtime integration.

## Capability Highlights

- Tracks live keyboard state for downstream systems to query.
- Normalizes keys into a stable engine representation.
- Distinguishes physical key location from key identity.
- Provides systems and plugin registration so keyboard input can participate in ECS runtime flow.
- Ships a package root entry and a `./src` subpath for consumers that need the source entry point.

## Core Concepts

### Key

`Key` is the normalized, engine-facing representation of an input key. The README should present this as the stable abstraction used everywhere else in the package, rather than as a browser event detail.

### Location

`Location` describes where a key sits on the physical keyboard layout. This matters when the same label can appear in multiple places or when a binding needs to preserve hardware position.

### Keyboard Resource

The keyboard resource is the live state container. It is the object other systems read to determine current keyboard input, especially pressed-state information.

### ECS Integration

The package does not stop at data modeling. It also exposes the systems and plugin hooks needed to install keyboard tracking into the engine runtime so state is updated at the right point in the frame loop.

## Notes for a Future README

- Keep the framing runtime-first: this package is about state tracking and integration, not low-level DOM event handling.
- `@wimaengine/input-core` supplies the button model that underpins the higher-level keyboard state, so the README should mention that dependency relationship explicitly.
- The package depends on the broader app, core, ecs, event, reflect, type, and window packages, which suggests it participates in the engine's shared runtime and registration infrastructure.
- The package is ESM-only and exports both the package root and a `./src` subpath. A future README should be explicit about which entry point it recommends and whether the source subpath is meant for advanced consumers.
- Existing README structure is already close to the desired feature-first shape; a rewrite should expand the ECS integration section rather than replacing the current key/location/resource framing.
