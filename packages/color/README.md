---
title: Color
---

`@wimaengine/color` provides a mutable RGBA color primitive plus the runtime type-registration hooks the engine uses to treat color as structured data.

## Installation

```sh
npm i @wimaengine/color
```

## Capability Highlights

- Mutable `Color` values with copy, clone, add, darken, lighten, lerp, and random helpers.
- Static helpers for `set`, `copy`, `add`, `subtract`, `darken`, `lighten`, `lerp`, `random`, `serialize`, `deserialize`, and `validateSerial` workflows.
- Named presets for common colors, including `BLACK`, `WHITE`, `RED`, `GREEN`, `BLUE`, `YELLOW`, `PURPLE`, and `CYAN`.
- `registerColorTypes` registers `Color` with the reflection/type registry as a structured record with `r`, `g`, `b`, and `a` fields.
- `ColorPlugin` installs that registration during app startup so color metadata is ready before runtime systems run.
- The package root exposes `core`, `systems`, and `plugin`, and `./src` is also published for source-level imports.

## Core Concepts

### Color

`Color` is the package's main mutable primitive. It stores channel data directly on the instance and supports in-place mutation through instance methods such as `set`, `copy`, `clone`, `add`, `darken`, `lighten`, `lerp`, and `random`, while static helpers cover out-parameter workflows and channel math. `serialize`, `deserialize`, and `validateSerial` cover the plain-object boundary, while `Symbol.iterator` yields the four channels in RGBA order for code that wants to treat a color as a component sequence. The class also ships reusable presets such as `BLACK`, `WHITE`, `RED`, `GREEN`, `BLUE`, `YELLOW`, `PURPLE`, and `CYAN`.

### Type Registration

`registerColorTypes` is the package's reflection hook. It registers `Color` as a `StructInfo` record in the world's `TypeRegistry`, declares the four numeric channel fields, and binds the copy, serialize, and deserialize methods so the registry can reason about color data as a structured runtime type.

### Plugin Integration

`ColorPlugin` is the app-facing integration layer. It registers `registerColorTypes` on `AppSchedule.Startup`, which means downstream packages do not need to manually seed color metadata before using the type registry.

## Exported Surface

- `core` exports `Color`.
- `systems` exports `registerColorTypes`.
- `plugin` exports `ColorPlugin`.
- The package root re-exports `core`, `systems`, and `plugin`.
- The manifest also exposes `./src` for source-level access to the same module tree.

## Notes

- The package is ESM-only and publishes `index.js` at the root plus `src/index.js` through `./src`.
- `Color` is intentionally mutable and the helpers operate on stored channel values directly; the implementation does not clamp or normalize channels.
- The package depends on `@wimaengine/app`, `@wimaengine/core`, `@wimaengine/ecs`, `@wimaengine/math`, `@wimaengine/reflect`, and `@wimaengine/type`.
- This package is part of the engine's runtime metadata path as well as its color utility surface, so the reflection and plugin pieces are not incidental.
