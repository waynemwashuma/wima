---
title: What to learn next
---

You now have the basic ECS loop: define data with components, store shared state in resources, spawn entities with commands, and update them through a query.

At this point, you have enough to build small, working examples without needing the deeper engine details first.

## What You Can Do Now

- Define entity-specific data with components.
- Keep shared values in resources.
- Spawn entities from systems using `EntityCommands`.
- Update matching entities with queries.

## Recommended Next Steps

The next sections go deeper into systems, command queues, resource aliases, plugin composition and other concepts. Those topics are easier to understand once the first entity loop is already familiar.

- If you want to understand why the tutorial pattern works, read the [Core concepts](../../02-core-concepts/index.md): learn how the ECS pieces fit together.
- If you want a broader view of the runtime and schedules, read the [Architecture overview](../../02-core-concepts/02-architecture/index.md): see how the runtime is organized.
- If you want concrete sample apps, browse the [Examples](https://github.com/wimaengine/wima/tree/dev/examples): explore complete runnable examples and smaller focused demos.
- If you are preparing to work on the repository itself, read the [Building the project](../../03-building/index.md): set up or verify the project build workflow.
