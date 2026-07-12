---
title: Systems
---

Systems are the update work units in Wima's ECS runtime. A system is the code that runs against the `World`, usually through a schedule, to read current state and make the next state happen.

Use systems for runtime behavior such as movement, gravity, tweening, animation playback, transform propagation, rendering coordination, input handling, audio updates, and scene/runtime glue.

The important part is not the function itself. It is where that function lands: a system becomes part of the runtime only after the app stages it onto a schedule and the scheduler decides when to run it. That is why systems sit at the center of [Schedules](../07-schedules/index.md), [System groups](../07-system-groups/index.md), and [Plugins](../10-plugins/index.md).

## What Systems Do

- Read entity state through [queries](../14-queries/index.md).
- Read and write shared state through [resources](../05-resources/index.md).
- Update [components](../04-components/index.md) on matching entities.
- Defer world changes through [commands](../15-commands/index.md) when mutation should happen at the end of a schedule.

## Systems In The Runtime Loop

Systems do not run by themselves. `@wimaengine/app` stages them onto schedules, `@wimaengine/schedule` orders and executes them, and `@wimaengine/core` defines the standard `AppSchedule.Startup` and `AppSchedule.Update` flow that most engine packages plug into.

In practice, package plugins register systems and resources together so the runtime can install the whole behavior block in one place. That is how packages such as time, event, gravity, tween, animation, transform, input, audio, and scene tie their ECS logic into the app loop.

For example, a plugin can place a system into the update flow and a specific phase of that flow:

```ts
app.registerSystem({
  schedule: AppSchedule.Update,
  systemGroup: CoreSystems.Main,
  system: updateMovement
})
```

That registration says more than "run this later". It says "run this with the rest of the frame's gameplay systems, after startup has prepared the world and before end-of-frame cleanup runs." The schedule and group give the system its timing, and the system itself stays focused on behavior.

## Working Pattern

Systems are strongest when they stay narrow. A movement system should move entities, not also wire input, create assets, or build the app. Those other concerns usually belong in a plugin that registers the system plus the supporting resources and hooks.

When a system does need to stage changes, it should do so intentionally through deferred commands so the rest of the schedule can finish against a stable world state. That pattern is what keeps behavior predictable when many systems run in sequence.

## Related Concepts

- [World](../13-world/index.md)
- [Queries](../14-queries/index.md)
- [Commands](../15-commands/index.md)
- [Resources](../05-resources/index.md)
- [Schedules](../07-schedules/index.md)
- [Plugins](../10-plugins/index.md)
- [App](../12-app/index.md)
