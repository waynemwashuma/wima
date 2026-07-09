# @wimaengine/name Reference Note

`@wimaengine/name` is the Wima engine package for assigning human-readable names to entities and keeping that naming data available through ECS-oriented systems and plugin registration.

## Package Role

This package is an engine support module, not a standalone feature library. Its documentation should foreground entity identity, debug visibility, and scene inspection: the package exists so other parts of the engine can label and recognize entities consistently.

## Installation

```sh
npm i @wimaengine/name
```

## Capability Highlights

- Adds an entity naming component for attaching a stable human-readable label.
- Keeps naming data available through supporting ECS systems instead of treating it as isolated metadata.
- Integrates through a plugin layer so registration can happen as part of broader engine setup.
- Exposes both the package root and a `src` subpath, which suggests a public entry point plus source-oriented access for consumers that need it.
- Depends on `@wimaengine/app`, `@wimaengine/core`, `@wimaengine/ecs`, `@wimaengine/reflect`, and `@wimaengine/type`, so the package clearly sits in the engine’s runtime and metadata plumbing rather than outside it.

## Core Concepts

### Name Component

The naming component is the package’s primary primitive. It represents the label attached to an entity and is the most direct reason to depend on the package. A future README should treat this as the central concept and connect it to inspection, debugging, and scene readability.

### Supporting Systems

The systems layer keeps naming information flowing through the ECS runtime. The future README should describe these systems as infrastructure that preserves and exposes entity identity for other engine features, rather than as a user-facing feature set on its own.

### Plugin Integration

The plugin hook is the package’s composition layer. It implies that naming support is meant to be enabled alongside other engine modules, so README wording should emphasize registration and integration instead of manual wiring.

### Package Entry Points

The package publishes the root entry point and a `src` subpath. That is useful to document when describing the package surface, but the README should still lead with the package-level story rather than the module layout.

## Notes

- Lead with debug and inspection value; that is the clearest use case available from the package README.
- Keep the future README short and feature-first. The current documentation evidence points to a focused package with a narrow role.
- Avoid promising gameplay behavior. The available signals point to entity identity and engine integration, not a standalone gameplay system.
- If the README lists exports later, group them by component, systems, and plugin integration rather than by file structure.
- The dependency set suggests the package participates in engine-wide registration and metadata/type plumbing, so the future README should assume Wima engine context.
