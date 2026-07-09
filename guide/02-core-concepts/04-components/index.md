---
title: Components
---

Components are the data attached to entities in Wima's ECS. The ECS package stores them on entities, groups them into archetypes and tables, and uses their types to decide how queries and component hooks behave.

## What A Component Is

A component is entity-attached state. It answers questions like "what does this entity know?" or "how should this entity be described?" without carrying the entity's identity itself.

Common examples in Wima packages are transform state, motion state, names, window state, and render or physics data.

## Keep Components Data-Only

Components should stay data-only. Put rules, update logic, and behavior in systems; keep components focused on fields that describe the entity.

That is why many package components are simple serializable classes or records with no runtime side effects. If a component needs lifecycle behavior, that behavior belongs in component hooks or systems, not in the component itself.

## Registration And Metadata

The ECS world registers component types through its type store. That registration gives each component a compact id and records metadata in `ComponentInfo`, including the registered type name and any hooks bound to that component.

This type metadata is what lets the ECS look up components by constructor, move them safely between tables, and fire add, remove, and insert hooks when entity membership changes.

## How Components Are Used

You usually add components when spawning an entity or when a system mutates world state. Queries then select entities by component signature, and `EntityCell` lets you inspect the components on one specific entity when you already have its handle.

## See Also

- [Entities and entity handles](../03-entities-and-entity-handles/index.md)
- [Resources](../05-resources/index.md)
- [Systems](../06-systems/index.md)
- [Queries](../14-queries/index.md)
- [Entity cells](../20-entity-cells/index.md)
- [Component hooks](../09-component-hooks/index.md)
- [Reflection and type metadata](../22-reflection-and-type-metadata/index.md)
