---
title: Audio
---

`@wimaengine/audio` is the engine's ECS-driven audio runtime package. It models playback state as components, coordinates routing through shared resources, and keeps audio behavior synchronized with world systems.

## Installation

```sh
npm i @wimaengine/audio
```

## Capability Highlights

- Models playback with player and oscillator components.
- Carries graph, importer, alias, and command resources for routing and runtime control.
- Exposes audio events and command helpers for playback changes at runtime.
- Provides asset and typedef support for playback identifiers and engine integration.
- Runs audio behavior through world systems so playback stays aligned with ECS state.

## Core Concepts

### Assets

Audio assets are the package's bridge into the broader asset pipeline. They represent the decoded sound data the runtime consumes rather than a separate loader or media subsystem.

### Playback Components

Player and oscillator components hold entity-level playback state. They describe what kind of sound an entity should produce, how it should be attached, and which runtime details belong with that entity in ECS.

### Graph and Importer Resources

The graph, importer, alias, and command resources coordinate routing and runtime control. Together they connect asset-backed audio data to live playback state and keep the package organized around shared world resources.

### Events and Command Helpers

Audio events and command helpers provide structured playback control. They are the package's coordination layer for reacting to audio changes without treating playback as a standalone imperative API.

### Systems

Audio systems turn stored ECS state into active audio behavior during world updates. That design keeps playback synchronized with the world instead of managed in a separate loop.

## Notes

- The package is intentionally ECS-centric rather than a standalone imperative audio API.
- It focuses on playback state, routing, runtime commands, and audio systems instead of a full mixer or decoder stack.
- The main package buckets are assets, components, resources, and systems.
