---
title: Asset
---

`@wimaengine/asset` is the engine's asset orchestration layer. It gives assets stable identity, connects import and export pipelines to the runtime, and surfaces lifecycle changes through events.

## Installation

```sh
npm i @wimaengine/asset
```

## Capability Highlights

- Stable asset identity through handles, snapshots, and channel-based reference tracking.
- Importer and exporter abstractions for registering format-specific asset pipelines.
- Asset pools and asset server state for runtime coordination of loaded, saved, and cached content.
- Lifecycle events for asset additions, modifications, drops, load results, and save results.
- Package entry at `@wimaengine/asset` with a `./src` subpath for source-level consumers.

## Core Concepts

### Asset Handles

Handles are the durable identity layer for assets. They let the rest of the engine refer to asset-backed data without binding to a specific storage location or underlying representation.

### Channels

Channels separate handle lifecycle traffic from the asset pool itself. They provide a controlled path for reference changes so the runtime can reconcile asset ownership in a predictable way.

### Importers

Importers define how external asset data enters the system. They are the registration point for turning file-format-specific content into engine-managed assets.

### Exporters

Exporters define how managed assets leave the system. They mirror importers and provide the format-specific boundary for serialization and persistence.

### Asset Server

The asset server coordinates registered asset pools, importers, exporters, and path-backed asset state. It is the runtime layer that ties asset data to broader engine systems.

### Events

Asset events report what changed and whether an operation succeeded or failed. They provide the observation layer for tooling, diagnostics, and other systems that respond to asset churn.

## Exported Surface

- `core`: `Handle`, `HandleSnapshot`, `AssetChannel`, `AssetChannelMessage`, `AssetChannelMessageType`, `Importer`, `Exporter`.
- `resources`: `Assets`, `AssetsSnapshot`, `AssetServer`, `Importers`, `Exporters`, `LoadState`.
- `events`: `AssetEvent`, `AssetAdded`, `AssetModified`, `AssetDropped`, `AssetLoadSuccess`, `AssetSaveSuccess`, `AssetLoadFail`, `AssetLoadOperation`.
- `plugins`: `AssetPlugin`, `AssetServerPlugin`, `AssetImporterPlugin`, `AssetExporterPlugin`.
- `systems`: `updateAssetChannel`, `updateAssetEvents`, `registerAssetOnAssetServer`, `registerAssetImporterOnAssetServer`, `registerAssetExporterOnAssetServer`, `registerAssetTypes`, `registerAssetServerTypes`, `unloadDroppedAssets`, `updateAssets`, `logFailedLoads`.

## Notes

- This package is runtime infrastructure for asset-backed engine data, not a standalone asset browser or editor.
- It is used by `@wimaengine/scene`, `@wimaengine/audio`, and `@wimaengine/render-core`.
- `@wimaengine/asset` is the supported package entry, while `@wimaengine/asset/src` is available for source-level imports.
- The package is designed to plug into the broader engine stack, including app, core, ECS, event, logger, reflect, type, and utils modules.
