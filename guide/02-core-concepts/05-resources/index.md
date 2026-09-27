---
title: Resources
---

Resources are world-owned shared state in Wima. A resource is not attached to an entity; it lives on a `World` and is read or written through the world API. The engine stores resources by `TypeId`, while higher-level features use them for state that belongs to a whole world rather than to one entity.

Use resources for engine-wide state that many systems need to share, such as clocks, asset servers, input state, windows, audio routing, event buffers, or physics and simulation state. For example, the event feature installs an `Events<T>` buffer resource for each event type, and the time feature installs a `VirtualClock` resource that timer systems consume.

Resources are deliberately separate from components: components describe entity state and participate in queries, while resources are accessed directly from the world. A system that needs shared state can obtain it from the world without adding a synthetic entity just to hold that state.

## Resource Aliases

Resource aliases let one resource be read through another type. The world stores the resource under its concrete type id and stores an alias mapping from the alias type id to that concrete id. Looking up the alias returns the same object; it does not create a second resource.

This is useful when a package wants to hide an implementation type behind an intention-revealing API. Asset-oriented packages use this pattern: an `Assets<...>` resource can be registered once, then exposed through aliases such as `AudioAssets` or `ImageAssets` for systems that consume a particular asset kind.

```js
import { World, typeid } from 'wima'

class AssetStore {}
class SceneAssets {}

const world = new World()
const assets = new AssetStore()

world.setResource(assets)
world.setResourceAlias(typeid(AssetStore), SceneAssets)

world.getResource(AssetStore) === world.getResource(SceneAssets) // true
```

The first argument to `setResourceAlias()` is the `TypeId` of the stored resource. The second argument is the constructor used as the public alias. Both the concrete type and the alias can be used with `getResource()` and `hasResource()`.

Aliases belong to the world that receives them. `World.removeResource(type)` removes the resource entry when passed the concrete type, and removes an alias entry when passed the alias type; it does not automatically remove every alias that points to a resource. App-level alias setup is different: `App.setResourceAlias()` stages the mapping and applies it to every world during `run()`.

## Reading Resources

Resource access is direct once a resource is in the world.
Use `getResource()` when the resource must exist; it asserts if the resource or alias is missing.
Use `getOptionalResource()` when absence is allowed.
Use `hasResource()` when you only need a presence check.
Use `removeResource()` when the world should stop exposing that resource or alias.

```js
import { World } from 'wima'

class Clock {}

const world = new World()
world.setResource(new Clock())

if (world.hasResource(Clock)) {
  const clock = world.getResource(Clock)
}

const maybeClock = world.getOptionalResource(Clock)
```

The constructor form is the usual API. Resource values are mutable objects, so reading a resource gives systems access to the shared instance owned by the world.

## By Type Id

The `ByTypeId` methods are the lower-level path when code already has a `TypeId` rather than a constructor. This is useful for generic resource families and package internals that construct ids with `typeid()` or `typeidGeneric()`.

```js
import { World, typeid } from 'wima'

class Events {}
class AssetStore {}

const world = new World()

world.setResourceByTypeId(typeid(Events), new Events())
world.setResourceByTypeId(typeid(AssetStore), new AssetStore())

const assets = world.getResourceByTypeId(typeid(AssetStore))
const maybeEvents = world.getOptionalResourceByTypeId(typeid(Events))
const hasEvents = world.hasResourceByTypeId(typeid(Events))
```

`getResourceByTypeId()` has the same required-resource behavior as `getResource()`, while `getOptionalResourceByTypeId()` returns `undefined` when the id is not present. The caller is responsible for ensuring that the `TypeId` matches the value's actual type.

## App Flow

`App` stages resources and aliases before `run()`, then applies them during startup. Resource registration is guarded after initialization, so plugins and other bootstrap code should configure resources before the runner starts.

`App.setResource(resource)` targets the default world. Pass a world label as the second argument to `setResource()` or `setResourceByTypeId()` when the resource belongs to a particular world. A world label is a constructor whose `TypeId` identifies the world in the app's world registry.

```js
import { App, Plugin, typeid } from 'wima'

class GameplayWorld {}
class AssetStore {}
class SceneAssets {}

class AssetPlugin extends Plugin {
  register(app) {
    app
      .setResourceByTypeId(typeid(AssetStore), new AssetStore(), GameplayWorld)
      .setResourceAlias(typeid(AssetStore), SceneAssets)
  }
}

const app = new App()
app.setWorld(GameplayWorld).defaultWorld(GameplayWorld)
app.registerPlugin(new AssetPlugin())
```

The app-level alias is applied to every world when startup flushes its staged configuration. The resource itself is applied only to the selected world in this example. If code needs to configure one world directly, use `app.getWorld(GameplayWorld)` and call the `World` resource methods; `app.getWorld()` returns the app's default world.

Plugins are the normal package integration point. `TimePlugin` registers time types, installs a `VirtualClock`, and schedules clock and timer updates. `EventPlugin` registers an event payload type, installs its typed `Events<T>` resource, and can schedule automatic buffer clearing. These packages demonstrate the typical resource lifecycle: register the type, install the resource during setup, and let systems read or update it during schedules.

Related concepts:

- [World](../13-world/index.md) owns resources, aliases, entities, and other runtime state.
- [Components](../04-components/index.md) live on entities instead of the world.
- [Queries](../14-queries/index.md) read entity data, not world resources.
- [Commands](../15-commands/index.md) provide deferred world changes, including resource alias commands.
- [Plugins](../10-plugins/index.md) package resource installation and system setup.
- [Systems](../06-systems/index.md) are the usual place to read and update shared resources.
