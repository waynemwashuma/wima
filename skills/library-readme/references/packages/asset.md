---
title: Asset
---

`@wimaengine/asset` is the engine's asset orchestration layer. It gives assets stable identity, connects import and export pipelines to the runtime, and surfaces lifecycle changes through events.

## Package Role

This package sits between engine systems and asset-backed content. It is not just a storage wrapper; it coordinates how assets are identified, loaded, saved, exported, and observed by the rest of the world.

## Capability Highlights

- Managed asset identity through handles and channels.
- Importer and exporter primitives for pipeline registration.
- Asset server state, resources, and systems for runtime asset management.
- Lifecycle events for save, success, and failure reporting.
- ESM package with a root entry point and a `./src` subpath for direct source-level imports.

## Core Concepts

### Asset Handles

Handles are the stable identity layer for assets. They let the rest of the engine refer to an asset without coupling to the asset's underlying data or storage location.

### Channels

Channels provide a way to separate or route asset flows. They are part of the identity and pipeline layer, so future docs should treat them as coordination primitives rather than content containers.

### Importers

Importers define how external asset data enters the package's pipeline. They are the registration point for turning raw inputs into engine-managed asset forms.

### Exporters

Exporters define how managed assets leave the package's pipeline. They mirror importers and are the natural place to describe serialization, persistence, or downstream handoff behavior.

### Asset Server

The asset server is the runtime center of the package. It owns asset-related state and coordinates the collections and systems that keep assets available to the engine.

### Resources

Resources hold asset collections and server state. In future docs, treat them as the mutable runtime data behind the asset server rather than as a public data model by themselves.

### Plugins

Plugins register importer, exporter, and asset-server behavior with the world. They are the integration boundary for consumers that want the asset package wired into engine lifecycle management.

### Events

Asset events communicate lifecycle outcomes such as save, success, and failure. They are the observation layer for tooling, diagnostics, and downstream systems that react to asset changes.

## Notes for README Drafting

- Keep the package framed as runtime infrastructure for asset-backed engine data, not as a user-facing asset editor or standalone file manager.
- The strongest top-level message is the flow from identity to pipeline to server state to lifecycle events.
- Mention the package's downstream consumers, especially `@wimaengine/scene`, `@wimaengine/audio`, and `@wimaengine/render-core`, because that clarifies why the package exists.
- The package ships a root entry and a `./src` subpath, so a future README can mention both the stable package surface and source-level access.
- The package depends on the engine's app, core, data structure, ECS, event, logger, reflect, type, and utils packages, so docs should present it as runtime infrastructure that plugs into the broader engine stack.
- Because the manifest exposes both `.` and `./src`, a future README should be explicit about which path is the supported public surface and which one is intended for source-level consumers.
- The repo README should stay feature-first; avoid installation or step-by-step usage unless a future request asks for it explicitly.
- If an exported-surface section is needed later, prefer grouping by primitive rather than listing every symbol first.
