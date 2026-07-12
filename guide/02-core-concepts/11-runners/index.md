---
title: Runners
---

Runners are the handoff point between the app and the scheduler. The app stages setup, the scheduler holds ordered schedules, and the runner decides when those schedules actually advance.

That makes runners the timing layer of the runtime. They do not define behavior themselves; they decide when the behavior that lives in [Systems](../06-systems/index.md) and [Schedules](../07-schedules/index.md) gets a turn.

## Why A Runner Exists

The app is intentionally not a game loop. It prepares the world, registers plugins, pushes staged schedule state into the scheduler, and then hands control to a runner. That design keeps the runtime flexible enough to support browser frame loops, headless tests, or custom host integrations.

The default engine path uses `defaultRunner` from `@wimaengine/core`. That runner is browser-oriented and advances schedules from `requestAnimationFrame()`, which is a good fit for the standard frame loop.

## What The Runner Sees

A runner receives the `Scheduler` and the `World`. That is enough to execute any schedule the app has staged, while still letting the runner choose its own timing policy.

In the common path, the app starts like this:

```ts
app
  .setRunner(defaultRunner)
  .run()
```

At that point, the runner is responsible for the loop. `App.run()` does not keep calling into the scheduler itself.

## Default Runner Behavior

The default runner in `@wimaengine/core` keeps per-executable state, initializes each schedule's next run time, and then advances runnable schedules on each animation frame. Repeating schedules are rescheduled after they run. One-shot schedules are marked inactive after their first execution.

That behavior is what makes `AppSchedule.Startup` and `AppSchedule.Update` feel different even though both are just schedules. Startup runs once. Update keeps stepping with the frame loop.

## Custom Runners

Custom runners are useful when the host environment is not a browser or when the timing model needs to change. For example, a test runner might run a schedule once and exit, while a server runner might tick on a fixed interval.

The key point is that the runner is the only part that owns advancement policy. Everything else in the runtime can stay focused on declaring what should happen rather than how often it should be polled.

## Related Concepts

- [App](../12-app/index.md) for the startup handoff into the runner
- [Schedules](../07-schedules/index.md) for the ordered work the runner advances
- [System groups](../07-system-groups/index.md) for the phases inside each schedule
