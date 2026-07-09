---
title: Getting started
---


This section is a tutorial path, not a reference section. Follow the chapters in order: each one explains one step, shows the smallest useful code, and leaves deeper engine internals for later sections.

## Folder Layout

```text
guide/01-getting-started/
  index.md
  01-what-you-need/
    index.md
  02-install-the-engine/
    index.md
  03-run-your-first-app/
    index.md
  04-add-your-first-system/
    index.md
  05-add-your-first-component/
    index.md
  06-spawn-an-entity-with-components/
    index.md
  07-use-a-query-to-update-entities/
    index.md
  08-store-shared-state-in-a-resource/
    index.md
  09-what-to-learn-next/
    index.md
```

## Tutorial Flow

1. [What you need](./01-what-you-need/index.md)
   - Confirm the runtime prerequisites and the minimum tools you need.
2. [Install the engine](./02-install-the-engine/index.md)
   - Add Wima to a project or work from a local checkout.
3. [Run your first app](./03-run-your-first-app/index.md)
   - Create an `App`, register the default runtime plugin, and start the engine.
4. [Add your first system](./04-add-your-first-system/index.md)
   - Learn how startup and update systems fit into the frame loop.
5. [Add your first component](./05-add-your-first-component/index.md)
   - Define the data your game logic will attach to entities.
6. [Spawn an entity with components](./06-spawn-an-entity-with-components/index.md)
   - Create live entities and attach component data to them.
7. [Use a query to update entities](./07-use-a-query-to-update-entities/index.md)
   - Find matching entities and update them in a system.
8. [Store shared state in a resource](./08-store-shared-state-in-a-resource/index.md)
   - Keep game-wide values in one place so any system can read them.
9. [What to learn next](./09-what-to-learn-next/index.md)
   - Move into core concepts once the basic flow feels familiar.

## What Comes Later

This guide deliberately avoids advanced ECS details, system ordering rules, command queues, resource aliases, and plugin composition. Those topics are covered in the later concept and building sections once the basic loop is clear.
