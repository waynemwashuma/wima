---
title: Add your first system
---

A system is a function the engine runs at the right time. This page builds on the app from the previous step and adds two systems: one for startup and one for the frame loop. We will use `registerSystem(...)` to connect each function to the schedule where it should run. Lets start with one function for setup and one for per-frame work.

## `setup` in `Startup`

```js
function setup() {
  console.log('startup runs once')
}

app.registerSystem({ schedule: AppSchedule.Startup, system: setup })
```

`setup` is a startup system, so the app calls it once before the first frame. Use this schedule for one-time work such as creating resources, registering initial state, or spawning content.

## `update` in `Update`

```js
function update() {
  console.log('startup runs every frame')
}

app.registerSystem({ schedule: AppSchedule.Update, system: update })
```

`update` is an update system, so the app calls it every frame after startup has finished. Use this schedule for logic that should repeat, such as movement, input, animation, or cleanup.

If a system needs access to ECS data, it can accept a `world` argument. This minimal example only logs to the console so the scheduling is easy to see, but later chapters use `world` to read resources, query entities, and issue commands.

That distinction is enough for the first tutorial path; later concept pages explain schedule ordering, system groups, and deferred commands.
