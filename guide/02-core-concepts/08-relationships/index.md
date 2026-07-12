---
title: Relationships
---

Relationships let the ECS model entity graphs instead of isolated entities. That matters whenever one entity needs to point at another and downstream work needs to walk that connection in a predictable way.

This is the bridge between plain component data and structure-aware runtime behavior. Packages such as hierarchy, transform, and scene use it when entity links are part of the actual model, not just incidental metadata.

## Why Relationships Matter

Most ECS code starts with "which entities have these components?" Relationships add the next question: "which entities are connected to those entities?" Once that becomes a first-class concern, you can traverse trees, walk graphs, and process connected entities without reimplementing graph logic in each caller.

That is useful for parent/child hierarchies, scene instance graphs, ownership chains, and other runtime structures where connection order matters as much as component presence.

## Querying Connected Entities

`@wimaengine/relationship` exposes a relationship-aware query shape rather than a separate graph library. `RelationshipQuery` ties a relationship component to a target component set, then walks through the connected entities while still giving you the component data you need on each side of the connection.

The important distinction is that the query is not only filtering for components. It is using a relationship component as the traversal edge. That keeps the model inside the ECS world instead of splitting it into a separate data structure.

## Tree And Graph Traversal

Traversal is the main runtime behavior. When your data is a tree, you can walk ancestors and descendants in a straight hierarchy. When your data is a general graph, you need visited tracking so cycles and cross-links do not cause repeated work.

The package supports both shapes, which makes it useful across different engine subsystems:

- tree traversal for strict parent/child structures
- graph traversal for more general connected entity sets

That distinction is why the package is helpful for both content structure and simulation structure. A scene graph and a constraint graph do not need the same traversal rules, even if they both live in ECS.

## Shared Traversal Contract

The package also exposes a small traversal interface so relationship-like types can provide `visit()` and `map()` behavior in a common shape. That keeps the traversal code generic and makes relationship components easier to compose with the rest of the engine's graph-oriented systems.

## Related Concepts

- [Systems](../06-systems/index.md) for runtime work that often consumes relationship traversal
- [System groups](../07-system-groups/index.md) for placing relationship work in the right phase
- [Plugins](../10-plugins/index.md) for registering the component hooks and systems that maintain relationship links
