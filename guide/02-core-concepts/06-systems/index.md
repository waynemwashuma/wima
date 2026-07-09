---
title: Systems
---

Systems are the update work units in Wima's ECS runtime. A system is the code that runs against the `World`, usually through a schedule, to read current state and make the next state happen.

Use systems for runtime behavior such as movement, gravity, tweening, animation playback, transform propagation, rendering coordination, input handling, audio updates, and scene/runtime glue.

## What Systems Do

- Read entity state through [queries](../14-queries/index.md).
- Read and write shared state through [resources](../05-resources/index.md).
- Update [components](../04-components/index.md) on matching entities.
- Defer world changes through [commands](../15-commands/index.md) when mutation should happen at the end of a schedule.

## Systems And Schedules

Systems do not run by themselves. `@wimaengine/app` stages them onto schedules, `@wimaengine/schedule` orders and executes them, and `@wimaengine/core` defines the standard `AppSchedule.Startup` and `AppSchedule.Update` flow that most engine packages plug into.

In practice, package plugins register systems and resources together so the runtime can install the whole behavior block in one place. That is how packages such as time, event, gravity, tween, animation, transform, input, audio, and scene tie their ECS logic into the app loop.

## Related Concepts

- [World](../13-world/index.md)
- [Queries](../14-queries/index.md)
- [Commands](../15-commands/index.md)
- [Resources](../05-resources/index.md)
- [Schedules](../07-schedules/index.md)
- [Plugins](../10-plugins/index.md)
- [App](../12-app/index.md)
