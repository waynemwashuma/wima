---
title: Resources
---

Resources are world-owned shared state in Wima's ECS. A resource is not attached to an entity; it lives on the `World` and is read or written through the world API. The ECS package treats resources as typed state with direct lookup, alias resolution, and removal.

Use resources for engine-wide state that many systems need to share, such as clocks, asset servers, input state, windows, audio routing, event buffers, or physics and simulation state.

In practice, resources are how packages keep cross-cutting state available without turning it into components on a specific entity. For example, `@wimaengine/event` stores `Events<T>` as a resource, `@wimaengine/window` stores `Windows`, and `@wimaengine/time` stores `VirtualClock`.

## Resource Aliases

Resource aliases let one resource stand in for another type at lookup time. The `World` stores the actual resource under its concrete type id, then maps alias type ids to that resource when you ask for the alias. That gives packages a way to publish a stable, intention-revealing name without duplicating the state itself.

This is useful when the stored type is more specific than the API you want to expose. A package can keep the real resource internal, then register a public alias that downstream code reads through `getResource()`. The alias resolves through the world, so consumers can use either the concrete resource or the alias depending on how much implementation detail they need.

```js
import { typeid } from '@wimaengine/type'
import { App } from '@wimaengine/app'

class AssetStore {}
class SceneAssets extends AssetStore {}

const app = new App()
const world = app.getWorld()

world.setResource(new AssetStore())
world.setResourceAlias(typeid(AssetStore), SceneAssets)

const assets = world.getResource(SceneAssets)
```

In the example above, `SceneAssets` behaves like a readable handle for the underlying `AssetStore`. The world still owns the actual resource; the alias only changes how other code reaches it.

Aliases are part of the world storage model, not a separate registry. You install them on the `World`, and the app exposes that world through `getWorld()` when bootstrap code needs to wire them in. That makes aliases a startup concern, usually inside a plugin or other setup path rather than inside systems.

Removing a resource clears the resource entry and its alias entry together, so aliases do not outlive the state they point to.

## Reading Resources

Resource access is simple once a resource is in the world.
Use `getResource()` when you know the type.
Use `hasResource()` when you only need to check presence.
Use `removeResource()` when the shared state should disappear.

```js
import { App } from '@wimaengine/app'

class Clock {}

const world = new App().getWorld()

world.setResource(new Clock())

if (world.hasResource(Clock)) {
  const clock = world.getResource(Clock)
}
```

The world accepts both direct types and aliases in its lookup path. That means resource code can stay small and still present a clean API to the rest of the engine.

## By Type Id

`setResourceByTypeId()` is the lower-level path when you already have a `TypeId` instead of a constructor.
That is useful for generic resource pools, package internals, and startup code that already resolved the type id before the resource exists.

```js
import { App } from '@wimaengine/app'
import { typeid } from '@wimaengine/type'

class Events {}
class AssetStore {}
class GameplayWorld {}

const app = new App()

app
  .setResourceByTypeId(typeid(Events), new Events())
  .setResourceByTypeId(typeid(AssetStore), new AssetStore(), GameplayWorld)
```

The optional world label lets you direct the resource to a specific world instead of the default one.

## App Flow

`App` can stage resource values and aliases before `run()`, then apply them to the worlds it owns.
It still exposes `getWorld()` when you want to configure one specific world directly.

That usually looks like plugin setup:

```js
import { Plugin } from '@wimaengine/app'
import { typeid } from '@wimaengine/type'

class AssetStore {}
class SceneAssets extends AssetStore {}

class AssetPlugin extends Plugin {
  register(app) {
    app
      .setResource(new AssetStore())
      .setResourceAlias(typeid(AssetStore), SceneAssets)
  }
}
```

That keeps alias registration close to the resource that owns the state.
It also keeps the app layer focused on composition instead of on every ECS operation.

If you want to target one world directly, use `app.getWorld(label)` and work with the world API instead. If you want the alias to apply across every world, stage it on the app and let `run()` apply it during startup.

Related concepts:

- [World](../13-world/index.md) owns resources and other runtime state.
- [Components](../04-components/index.md) live on entities instead of the world.
- [Queries](../14-queries/index.md) read entity data, not world resources.
- [Commands](../15-commands/index.md) are the deferred path for world changes.
- [Systems](../06-systems/index.md) are the usual place to read and update shared resources.
