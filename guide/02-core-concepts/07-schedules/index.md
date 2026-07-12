---
title: Schedules
---

Schedules decide when systems run. A schedule is not the system itself and it is not the frame loop either. It is the ordered lane that a runner executes at a particular time, with the app and scheduler filling that lane with systems first.

That separation is why schedules matter to both [Systems](../06-systems/index.md) and [Runners](../11-runners/index.md): systems describe behavior, runners decide timing, and schedules sit between them as the execution plan.

## Why Schedules Exist

Without schedules, every system would need its own timing policy. Startup work, per-frame updates, and one-off setup would all blur together. Schedules split those concerns so the engine can say, "this work happens once when the app starts" and "this work repeats every frame" without mixing the two.

`@wimaengine/core` uses that split directly with `AppSchedule.Startup` and `AppSchedule.Update`. Startup is the one-time lane for bootstrapping the world. Update is the repeating lane for the actual runtime loop.

```ts
app
  .createSchedule({
    label: AppSchedule.Startup,
    repeat: false,
    defaultSystemGroup: CoreSystems.Main
  })
  .createSchedule({
    label: AppSchedule.Update,
    repeat: true,
    defaultSystemGroup: CoreSystems.Main
  })
```

That pattern is common because it keeps engine setup predictable. Startup systems can register types, resources, and hooks before gameplay begins. Update systems then run against a world that already has its runtime shape.

## How Schedules Are Built

The app does not assemble schedules by hand. It stages schedule labels, system registrations, and system groups through `SchedulerBuilder`, then pushes that staged state into a `Scheduler` during `run()`. The builder resolves ordering, group nesting, and defaults before a schedule is made runnable.

This means the schedule definition phase and the execution phase are separate:

- The app records what should exist.
- The builder turns those registrations into ordered schedules.
- The runner decides when each schedule advances.

That separation makes the runtime easier to reason about. Plugins can contribute systems without having to know the final execution order of the whole application.

## Schedule Shape

A schedule label identifies the lane, while the schedule config also controls when and how often that lane executes. Core uses a one-shot startup schedule and a repeating update schedule, but the underlying schedule layer also supports delays and custom error handling, which makes it flexible enough for non-frame work.

The practical result is that a schedule is a named unit of work with a runtime policy attached to it. It is the thing you hand to a runner, not the thing the runner invents.

## Related Concepts

- [System groups](../07-system-groups/index.md) for ordering inside a schedule
- [Plugins](../10-plugins/index.md) for staging schedule and system setup
- [Runners](../11-runners/index.md) for advancing schedules at runtime
