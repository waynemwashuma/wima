---
title: Plugins
---

Plugins bundle reusable engine setup. They are how a package turns "here are the systems, resources, hooks, and types I need" into one reusable registration step.

That makes plugins the practical boundary between a feature package and the app startup sequence. A plugin does not run the feature directly. It prepares the world and the scheduler so the feature can run later through [Schedules](../07-schedules/index.md) and [Systems](../06-systems/index.md).

## Why Plugins Exist

Without plugins, every feature package would force callers to remember a long setup sequence: register types, add systems, install hooks, create schedules, and seed resources in the correct order. Plugins collect those steps into one `register(app)` method.

That is why engine packages tend to ship as plugins. The plugin is the installable surface, and the package internals stay private to the feature.

## What A Plugin Can Install

A plugin can contribute almost anything that shapes runtime behavior:

- resources and aliases
- component hooks
- system registrations
- system groups and schedules
- nested plugins
- type registration

The `App` keeps those registrations staged until `run()`. That means a plugin is setup code, not an immediate execution path.

## Plugin Startup

Plugins are usually registered before the app starts, then replayed in order when the app runs. That design keeps startup deterministic and lets one plugin depend on another without forcing the caller to manually interleave setup.

```ts
app
  .registerPlugin(new CorePlugin())
  .registerPlugin(new ScenePlugin())
  .registerPlugin(new AudioPlugin())
```

The order matters. Core establishes the base runtime contract, and feature plugins then layer on top of that contract with their own systems and hooks.

## Plugins And Hooks

Plugins are where component hooks usually get installed. That is not an accident: hooks are part of the feature's startup contract, so they belong with the plugin that owns the component, not in a one-off helper somewhere else.

This is especially visible in packages that need lifecycle coordination, such as hierarchy, animation, audio, and scene. Those packages use plugin registration to bind component behavior to the world before the scheduler starts running systems.

## Related Concepts

- [App](../12-app/index.md) for the container that stages plugin registration
- [System groups](../07-system-groups/index.md) for the phases a plugin can target
- [Component hooks](../09-component-hooks/index.md) for lifecycle behavior installed by plugins
