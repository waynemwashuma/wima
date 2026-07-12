---
title: Input
---

`@wimaengine/input` is the top-level bundle for keyboard, mouse, and touch input. It does not define a new input model; it wires the device-specific plugins into the app so the rest of the engine can consume input through one registration point.

## What The Bundle Does

`InputPlugin` is intentionally thin. Its job is to register the touch, mouse, and keyboard plugins together so app setup stays centralized. That keeps input wiring consistent and makes it easy to include the full device set in one step instead of registering each input package manually.

That shape matters because input is rarely the end of the story. Game systems, UI systems, camera controllers, and interaction logic all want a stable input layer, not a one-off event hookup.

## Where Input Ends Up

The practical flow is:

1. The app registers the input bundle.
2. The underlying device packages expose input state through the engine runtime.
3. Higher-level systems read that state and convert it into gameplay, UI, or camera behavior.

This is why input is best understood together with [Windowing](../34-windowing/index.md). Window state, pointer capture, fullscreen control, and browser event routing are part of the same runtime path, even if they live in different packages. Input is the package that makes the device stack available to the app; windowing is the package that gives that stack a browser surface to live on.

## What It Is Not

It is not the place for input commands, gameplay bindings, or custom interaction policy. Those belong in systems that read the input state. The bundle only makes the device stack available and keeps the runtime wiring in one place.
