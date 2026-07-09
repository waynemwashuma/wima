---
title: Scene
---

`@wimaengine/scene` orchestrates serialized scene assets, runtime instance state, and ECS scene composition so authored world data can move cleanly between storage and live entities.

## Installation

```sh
npm i @wimaengine/scene
```

## Capability Highlights

- Scene assets capture serializable world state that can be exported, stored, and loaded back into runtime form.
- JSON importers and exporters translate scene data between serialized payloads and runtime entities.
- Scene spawning centralizes entity creation so composed scenes stay consistent as they enter the world.
- Instance components, hooks, and lifecycle events keep per-entity scene state synchronized during load and drop operations.
- Asset-map resources help resolve referenced scene assets while the runtime is assembling a scene.
- The package sits on top of ECS, hierarchy, asset, app, logger, reflect, and type subsystems, so it behaves as an engine integration layer rather than a stand-alone model library.

## Core Concepts

### Scene Assets

Scene assets are the portable representation of a world. They hold the serialized entity and resource data that can be moved between authored content and runtime state without rewriting the scene structure by hand.

### Import and Export Flow

Importers and exporters provide the translation boundary between serialized scene data and ECS structures. JSON support is part of that boundary, which makes scene content usable in storage-oriented workflows as well as at runtime.

### Scene Instances

Scene instances track how a loaded scene relates to the entities that spawned it. The instance layer and its hooks keep scene-specific state aligned with lifecycle changes so a scene can be initialized, synchronized, and dropped consistently.

### Scene Spawner

The scene spawner centralizes the process of turning scene assets into live entities. That keeps composition logic in one place and makes repeated scene loads behave the same way across the app.

### Asset Map Resources

Asset-map resources connect scene content to the asset system while a scene is being assembled. That support layer is what lets scene references resolve cleanly without leaking composition details into every caller.

## Exported Surface

The package root is the stable public entry point. `./src` is also published for source-level access when lower-level imports are acceptable.

## Notes

- The package is ESM-only and publishes `index.js` at the package root plus `src/index.js` through `./src`.
- Scene integration depends on the wider engine stack, especially ECS, hierarchy, asset, app, logger, reflect, and type packages.
- The package is intentionally orchestration-oriented: its value is in coordinating scene assets, runtime entities, lifecycle hooks, and resource resolution rather than only defining scene data.
