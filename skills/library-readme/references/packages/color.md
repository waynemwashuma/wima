# @wimaengine/color

`@wimaengine/color` provides a mutable RGBA color primitive plus the runtime type-registration hooks the engine uses to treat color as structured data.

## Package Role

This package sits in the engine support layer rather than in a standalone graphics API. The current package README frames it as a provider of color primitives and lightweight ECS integration, with downstream use in `@wimaengine/render-core` and other visual packages that need color state and utilities.

## Capability Highlights

- Core color value helpers and shared color data modeling.
- ECS-facing types for engine integration.
- Runtime plugin registration for wiring color support into the app.
- Dual entry points at the package root and `./src`.
- Generated type declarations exposed from `dist`.

## Core Concepts

### Core

The core surface is the package's main color model layer. It is where the canonical color representation and shared helper behavior should be described in a future README, because the existing documentation treats this as the package's primary data and utility center.

### Systems

The systems surface is the ECS integration layer. It exposes the type-facing part of the package for engine usage, so future docs should present it as the bridge between color state and the ECS/runtime environment rather than as a separate end-user feature set.

### Plugin Registration

The current README explicitly calls out plugin registration. That means the package should be documented as something that can be registered into the runtime, not only imported as a utility module.

## Notes for a Future README

- Keep the opening summary short and capability-led: shared color primitives, ECS integration, and plugin registration.
- Preserve `Core` and `Systems` as the main conceptual split unless the public surface grows enough to justify an export list.
- Mention the package as part of the broader visual stack, especially alongside `@wimaengine/render-core`, if a consumer context helps explain its role.
- Reflect the package manifest's dual entry setup: root import plus `./src` source entry.
- Note that the package is ESM-based and ships type declarations from `dist`, which matters for consumers and tooling.
