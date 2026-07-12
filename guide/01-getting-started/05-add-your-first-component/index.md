---
title: Add your first component
---

Components hold data. They describe what an entity is, while systems decide what happens to that data.

In this chapter, you are only defining the data shape. You will attach the components to an entity in the next step.

## What A Component Is

A component should hold one kind of information. Keeping each piece of data separate makes it easier for systems to combine, filter, or ignore that state later.

```js
class Position {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
}

class Velocity {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
}
```

`Position` stores where something is. `Velocity` stores how quickly it moves. Those are two different concerns, so they stay in different components.

## What To Keep In Components

Use components for state data that belongs to one entity. If the value describes only that entity and can change over time, it is a good fit for a component, such as location and motion data like the components above, or state data like `health`, `ammo`, or `active`.

## What To Leave Out

Leave out behavior and side effects that do not describe the entity itself.

- Rendering code, such as `drawSprite()`, `ctx.fillRect(...)`, or `mesh.render()`
- Input handling, such as `window.addEventListener('keydown', ...)` or button click handlers
- Game rules and decisions, such as scoring, damage calculation, or spawn logic
- Global state, such as shared settings, app-wide timers, or the current scene, because that belongs in resources
- Anything that needs to run every frame, such as animation updates, movement loops, or cleanup work

Those responsibilities belong in systems or resources, not components. Use resources for shared global state and components for entity-specific values like position, speed, health, or name. In the next chapter, you will attach those components to a real entity.
