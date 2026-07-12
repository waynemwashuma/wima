# Audio Package Notes

`@wimaengine/audio` is the engine's ECS-driven audio runtime package. It models playback state as components, coordinates routing through shared resources, and keeps audio behavior synchronized with world systems.

## Capability Highlights

- Models audio playback with player and oscillator components.
- Carries graph, importer, alias, and command resources for routing and runtime control.
- Exposes audio events and command helpers for playback changes at runtime.
- Provides asset and typedef support for playback identifiers and engine integration.
- Runs audio behavior through world systems so playback stays synchronized with ECS state.

## Core Concepts

### Assets

The asset modules define the audio asset types the engine recognizes. The current package README treats this as the package's bridge into the asset pipeline, so a future README should keep that framing rather than introducing a separate loader story.

### Playback Components

Player and oscillator components are the entity-level state holders. They are the pieces that describe when an entity should emit sound, how it should behave over time, and what playback-specific state belongs on the ECS side.

### Graph and Importer Resources

The resource modules manage importer state, graph structure, aliases, and commands. These are the coordination objects for sound routing and runtime control, and they are the likely place where the package connects asset metadata to actual playback wiring.

### Events and Command Helpers

Audio events and command helpers provide a structured way to request playback changes without mutating world state directly. The package description suggests these are the control surface for starting, stopping, or adjusting audio behavior at runtime.

### Systems

The system modules perform the runtime work inside the world. They are where the package turns stored state and pending commands into active audio behavior, which means the README should describe audio as ECS-driven rather than as a separate imperative API.

## Exported Surface

- The package root exports `@wimaengine/audio` through `index.js` with types from `dist/index.d.ts`.
- The `./src` subpath is also exported through `src/index.js` with types from `dist/src/index.d.ts`.
- The package is published as ESM (`"type": "module"`) and only ships `index.js` plus the `src` tree in `files`.

## Notes

- The current package README is intentionally short; a future README should expand the four main buckets already named there: assets, components, resources, and systems.
- Based on `package.json`, this package depends on `@wimaengine/app`, `@wimaengine/asset`, `@wimaengine/core`, `@wimaengine/datastructures`, `@wimaengine/ecs`, `@wimaengine/reflect`, `@wimaengine/time`, and `@wimaengine/type`, so the README should present audio as a runtime integration package rather than a standalone media utility.
- Keep the wording ECS-centric. The package stores audio state in components, coordinates runtime data with resources, and lets systems drive behavior.
- Avoid promising a full mixer, decoder, or asset pipeline unless source code confirms those behaviors. The current documentation only supports the narrower claim that the package provides audio assets, playback components, graph resources, and audio systems.
