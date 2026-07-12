---
title: Scenes
---

`@wimaengine/scene` is the bridge between authored world data and live ECS state. It serializes entities and resources into scene assets, then restores them back into a running world with handle remapping, component hooks, and spawn coordination.

## Scene Assets

The `Scene` asset is the portable representation of a world fragment. It stores entity snapshots and resource snapshots, which means a scene can carry both component state and the runtime data needed to make that state usable again.

That is why scenes naturally connect to [Assets and handles](../26-assets-and-handles/index.md). Scene content is not copied around as live objects. It is stored as asset data, loaded through the asset pipeline, and restored through handles and snapshots when the world needs it.

## Runtime Composition

`ScenePlugin` registers the scene importer and exporter, installs the asset plugin, and sets up the scene instance component and spawn resource. The component hooks keep scene membership consistent, while the update system resolves loaded scene assets and spawns their entities into the world.

The important part is the runtime flow:

1. A scene instance component points at a scene asset handle.
2. The scene spawner records which entities are waiting on that asset.
3. Once the scene asset is available, the spawn system restores the entities and resource snapshots into the world.
4. The instance keeps a map between world entities and scene entities so later updates stay consistent.

## Import, Export, And Remapping

The package supports JSON import and export, so scene data can move in and out of storage without changing the runtime model. During restore, the `TypeRegistry` is used to find snapshot methods, and the `AssetSceneMap` keeps nested asset handles stable when a scene references other assets.

That is the piece that makes scenes useful across the engine. A scene can include render state, audio state, or animation state and still come back with the right handles and type-aware snapshots. [Rendering](../27-rendering/index.md), [Audio](../32-audio/index.md), and [Animation](../33-animation/index.md) all benefit from that because their runtime state is already stored in ECS-friendly forms.

## Scene Shape

Scenes are also hierarchical. If a restored entity does not already have a parent, the loader attaches it to the scene instance entity so the runtime structure stays anchored. That keeps authored content and live runtime content aligned without requiring a separate scene graph.
