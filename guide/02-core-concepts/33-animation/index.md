---
title: Animation
---

`@wimaengine/animation` is the runtime animation package for Wima. It stores clip handles and playback state on entities, then advances and applies animation as part of the normal ECS update loop.

## Playback Model

The package splits animation into a few clear pieces:

- `AnimationClip` is the asset that stores track data and duration.
- `AnimationPlayer` is the ECS component that stores per-clip playback state.
- `AnimationTarget` identifies the entity or target slot that a player should drive.
- `Playback`, `AnimationTrack`, `PlaybackRepeat`, and the effector types describe how time moves through a clip.

That separation is deliberate. The asset carries reusable data, while the component carries runtime state. That means clips can be shared across entities without duplicating playback progress.

## Track And Repeat Behaviour

Tracks are the unit of motion. They hold times and keyframes, and the effector tells the runtime how to interpret the values. Repeat behavior is tracked separately so looping, clamping, and playback timing stay explicit instead of being folded into a generic update step.

This is the same pattern used across the engine: [Math](../30-math/index.md) provides interpolation and vector data, while the animation package decides how to apply those numbers over time.

## Assets, Resources, And Systems

`AnimationPlugin` registers animation types, installs the clip asset, wires the alias resource, and adds the systems that advance players and apply animation output. The alias resource is what keeps shared clip data easy to resolve from the rest of the engine without copying it into every entity.

That makes animation a good fit for [Scenes](../31-scenes/index.md). Scene snapshots can preserve the player and target setup, then restore it later with the same clip handles and playback state intact. The result is authored animation content that still behaves like runtime ECS data.

## Where It Fits

Animation is not an authoring tool and not a standalone tweening API. It is the runtime layer that keeps clip assets, playback state, and target application moving together inside the app loop.
