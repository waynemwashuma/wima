# Reflect Feature Notes

`@wimaengine/reflect` provides runtime type metadata and a registry for engine symbols.

## Preferred README Shape

- YAML frontmatter `title: Reflect`
- One-sentence summary that frames the package as shared reflection infrastructure
- `## Installation`
- `## Capability Highlights`
- `## Core Concepts`
- `## Notes`

## Capability Highlights

- Runtime type info objects for registered symbols.
- A registry resource that tracks reflected types and supports runtime lookup.
- Plugin wiring that registers reflection state with the world.
- A package layout with a root entrypoint and a `./src` subpath export, which matters if the future README documents import surfaces.
- Tight integration with `@wimaengine/app`, `@wimaengine/ecs`, and `@wimaengine/type`, which makes the package part of the engine runtime rather than a standalone utility.

## Core Concepts

### Info

The `info` layer is where reflected type metadata lives. It holds the identifiers and descriptive data attached to a type so the runtime can inspect a symbol without hard-coding its shape.

### Type Registry

The type registry is the shared lookup layer. It records registered types and gives downstream systems a stable place to resolve reflection metadata at runtime.

### Plugin Wiring

The plugin layer connects reflection state to the app and world lifecycle. That integration makes the registry available through normal engine initialization instead of forcing each consumer to assemble it manually.

## Notes

- Keep the future README feature-first and short; this package is infrastructure, not a usage-heavy API.
- The install command should be `npm i @wimaengine/reflect`.
- If the README documents exports, call out both the package root and `./src` subpath from `package.json`.
- The package is a dependency of `@wimaengine/core`, `@wimaengine/window`, and `@wimaengine/scene`, so README language should emphasize shared metadata plumbing.
- Avoid tutorial steps unless explicitly requested; the README should explain what the reflection layer does, not walk through example code.
