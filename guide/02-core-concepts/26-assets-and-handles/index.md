---
title: Assets and handles
---

`@wimaengine/asset` is the engine's identity and loading layer for content. It turns files and runtime data into stable handles, then keeps those handles moving through ECS resources, importers, exporters, and asset-server state.

## Identity First

The core idea is simple: systems should hold a handle, not a raw asset blob. `Handle<T>` gives that handle a durable identity, and `HandleSnapshot` gives the same identity a serializable form that can survive scene export, reload, or round-tripping through the asset server.

That matters anywhere the engine needs to refer to content indirectly. A render component can point at a mesh or shader, an audio component can point at a sound buffer, and a scene instance can carry a scene handle without owning the scene data itself. The handle is the reference, while the asset is the payload.

## Pipeline, Not Just Storage

The package is the pipeline that sits between authored data and runtime state:

- `Importer<T>` turns external data into engine assets.
- `Exporter<T>` pushes managed assets back out through a supported format.
- `Assets<T>` owns the live pool for a concrete asset type.
- `AssetServer` registers those pools, imports, exports, and load/save requests.

That is why this package shows up underneath [Scenes](../31-scenes/index.md), [Rendering](../27-rendering/index.md), [Audio](../32-audio/index.md), and [Animation](../33-animation/index.md). Those systems do not manage files directly. They register asset types and then read the resulting handles from ECS state.

## Runtime Flow

The runtime path is:

1. A package registers an asset type, such as a mesh, scene, sound, or animation clip.
2. The asset server tracks the matching `Assets<T>` pool and the importer or exporter for that type.
3. A loader or save request moves through the server.
4. The `Assets<T>` pool emits lifecycle events such as added, modified, or dropped.
5. ECS systems react to those events and update render lists, playback state, scene instances, or other runtime state.

That separation keeps the rest of the engine focused on behavior instead of file plumbing. For example, [Rendering](../27-rendering/index.md) can request mesh and material assets while `@wimaengine/render-core` and `@wimaengine/render-webgl` handle the backend-specific caches. [Audio](../32-audio/index.md) can decode sound assets and keep playback components pointed at a stable sound handle. [Scenes](../31-scenes/index.md) can snapshot handles, then restore them later through `HandleSnapshot` and the scene asset map.

## Why Channels And Events Matter

Handles are only half of the story. Channels keep asset flows separated, and events tell the world what changed. That means tooling and runtime systems can observe the same asset pool without reaching into it directly.

This is what makes asset-backed content predictable in ECS. A scene can be reloaded, a render asset can be replaced, or an audio clip can be swapped out, and the rest of the world still sees stable references and explicit lifecycle changes instead of ad hoc mutation.
