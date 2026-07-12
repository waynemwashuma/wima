---
title: Plugin Groups
---

Plugin groups bundle multiple plugins into one reusable unit. They are the packaging layer above [Plugins](../10-plugins/index.md): instead of asking callers to register a long list of feature plugins by hand, a group registers that list for them in a controlled order.

This is the pattern behind broad engine presets. The `@wimaengine/misc` package, for example, ships a `DefaultPlugin` group that assembles the common engine stack into one install point.

## Why Plugin Groups Exist

A single plugin is good for one feature boundary. A plugin group is good for a preset, a profile, or a curated stack of features that belong together. That makes groups useful when the runtime contract should be "install this bundle" rather than "remember these twenty plugins in this order."

Plugin groups also keep startup readable. The caller sees one registration step, while the group itself preserves the internal order that the engine expects.

## How Groups Behave

`PluginGroup` is itself a plugin, so it can be registered anywhere a normal plugin can. Inside the group, nested plugins are stored in a `Map`, then replayed into the app in insertion order during registration.

That means order is part of the API. If a group installs core runtime support first and feature plugins later, the group is declaring that dependency for the caller.

Groups can also be nested. That lets packages build layered bundles instead of forcing every preset to be flat.

## Managing Membership

Groups support adding, removing, and replacing nested plugins. `replace()` is especially useful when a preset wants to swap one implementation for another without changing the surrounding bundle.

That is the practical advantage of the group abstraction: callers get one install step, but package authors still control the internal composition.

## Startup Pattern

Plugin groups usually appear at the top of app setup:

```ts
app.registerPlugin(new DefaultPlugin())
```

The app still replays the group's contents during `run()`, so the group does not change the startup model. It only changes how the startup model is packaged.

## Related Concepts

- [App](../12-app/index.md) for the container that replays plugin groups
- [Plugins](../10-plugins/index.md) for the individual units that groups compose
- [Runners](../11-runners/index.md) for the execution phase that starts after the group has registered everything
