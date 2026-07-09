---
title: Animation
---

`@wimaengine/animation` is the engine package for animation playback and runtime animation state. It centers on clip assets, track-level control, repeat behavior, and ECS-backed player/target state so animation can be updated as part of the engine loop.

## Installation

```sh
npm i @wimaengine/animation
```

## Capability Highlights

- Provides animation playback and track control rather than authoring tools.
- Models repeat behavior and effector logic as part of the runtime core.
- Uses ECS components for player and target state.
- Ships clip assets and alias resources for reusable animation data.
- Includes systems and plugin wiring so animation updates plug into the app/runtime lifecycle.

## Core Concepts

### Playback

The playback layer is the runtime control surface for animation. It is responsible for advancing animation state, coordinating track behavior, and applying the package's repeat rules and effector logic.

### Tracks

Tracks are the unit of animation control. The package frames track control as a first-class concept, which suggests track-level coordination is part of the public mental model rather than a hidden implementation detail.

### Repeat

Repeat handling is treated separately from generic playback so looping and repeat semantics can be described and controlled explicitly in the package docs.

### Components

Player and target components hold ECS animation state. The README already frames these as the main component-level primitives, so a future README should explain them as the bridge between animation runtime data and entity state.

### Assets

Clip assets are the reusable data container for animation content. They are the package's asset-facing primitive and should be presented as the reusable source of animation playback data.

### Resources

Alias resources hold shared animation metadata. They are a supporting primitive for mapping or reusing animation data without duplicating clip definitions.

### Systems and Plugin

The package exposes systems and plugin wiring for runtime integration. This is the package's integration layer: systems perform the update work, and the plugin hooks the package into the app lifecycle.

## Notes

- Keep the README feature-first and avoid tutorial-style setup steps unless explicitly requested.
- Describe the package as runtime animation support, not as an editor or content pipeline.
- Call out the ECS boundary clearly: player and target are components, while clips and aliases are data-oriented assets/resources.
- Mention repeat handling and track control as distinct concepts, because they are part of the package's value proposition.
- Note the integration point with `@wimaengine/app` and the surrounding transform-oriented motion stack when explaining where the package fits.
- If the exported surface is documented later, group it by runtime primitives rather than by file path.
