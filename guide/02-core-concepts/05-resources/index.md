---
title: Resources
---

Resources are world-owned shared state in Wima's ECS. A resource is not attached to an entity; it lives on the `World` and is read or written through the world API. The ECS package treats resources as typed state with direct lookup, alias resolution, and removal.

Use resources for engine-wide state that many systems need to share, such as clocks, asset servers, input state, windows, audio routing, event buffers, or physics and simulation state.

In practice, resources are how packages keep cross-cutting state available without turning it into components on a specific entity. For example, `@wimaengine/event` stores `Events<T>` as a resource, `@wimaengine/window` stores `Windows`, and `@wimaengine/time` stores `VirtualClock`.

Related concepts:

- [World](../13-world/index.md) owns resources and other runtime state.
- [Components](../04-components/index.md) live on entities instead of the world.
- [Queries](../14-queries/index.md) read entity data, not world resources.
- [Commands](../15-commands/index.md) are the deferred path for world changes.
- [Systems](../06-systems/index.md) are the usual place to read and update shared resources.
