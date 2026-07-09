---
title: Damping
---

`@wimaengine/damping` provides linear and angular damping resources and systems.

## Installation

```sh
npm i @wimaengine/damping
```

## Capability Highlights

- Linear damping resources for translational motion.
- Angular damping resources for rotational motion.
- ECS systems for applying damping during simulation.

## Core Concepts

### Linear Damping

The linear dampen resource controls how quickly translation slows over time.

### Angular Damping

The angular dampen resource controls how quickly rotation slows over time.

### Systems

The systems module applies both forms of damping to the world state.

## Notes

- `@wimaengine/physics`, `@wimaengine/integrator`, and `@wimaengine/movable` commonly use this package.
