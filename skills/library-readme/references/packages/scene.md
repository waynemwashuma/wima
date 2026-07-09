# @wimaengine/scene reference note

`@wimaengine/scene` is the scene orchestration package for Wima: it defines serializable scene assets and the runtime machinery that imports, exports, and spawns them into ECS entities.

## Package Role

`@wimaengine/scene` sits between authored scene data and live runtime state. It is not just a data model package; it coordinates asset-backed scene content, entity instance tracking, and scene lifecycle hooks so a scene can be loaded, composed, and kept in sync with runtime changes.

## Capability Highlights

- Scene assets represent serialized world state that can move between storage and runtime.
- Import and export modules translate scene data, including JSON, into runtime entities and back again.
- A scene spawner centralizes entity creation so scene composition stays consistent.
- Instance components and hooks maintain per-entity scene state during lifecycle changes.
- Asset-map resources help resolve referenced scene assets when building live scenes.
- The package integrates with ECS, hierarchy, asset, app, logger, reflect, and type packages, so it behaves as an engine integration layer rather than a standalone model library.

## Core Concepts

### Scene Assets

Scene assets are the serialized form of scene content. They define the portable boundary that the rest of the package loads, exports, and composes at runtime. Future README copy should present this as the primary handoff point between authored data and runtime entities.

### Instance

The instance layer tracks per-entity scene membership or scene-specific runtime state. The current README points to instance components plus hook logic, so future documentation should emphasize synchronization and lifecycle consistency rather than treating instances as plain metadata.

### Importers and Exporters

Importers and exporters convert scene data between serialized formats and runtime ECS structures. JSON support is explicit in the current README, so the package note should keep import and export as a first-class capability instead of burying it inside generic serialization language.

### Scene Spawner

The scene spawner resource is the runtime entry point for turning scene content into live entities. It centralizes the spawn process, which is important to call out in README prose because it explains where scene composition logic lives.

### Asset Map Resources

Asset-map resources support runtime scene composition by resolving asset references during spawn and import operations. This is likely a support primitive rather than a headline API, but it matters for explaining how scenes stay connected to the asset system.

## Notes

- The package exports both the package root and a `./src` subpath, so future documentation should distinguish stable public entry points from source-level access.
- `package.json` shows ESM-only packaging with `index.js` at the root and `src/index.js` for the source subpath.
- Dependencies point to ECS, hierarchy, asset, app, logger, reflect, and type packages, so the README should frame `@wimaengine/scene` as an integration layer across engine subsystems.
- The current README is already short and feature-focused; future revisions should keep the same tone and expand only the concepts that help readers understand scene lifecycle, composition, and import and export flow.
- If a future README needs an exported-surface section, document the stable package-root API first and mention `./src` as a lower-level path.
