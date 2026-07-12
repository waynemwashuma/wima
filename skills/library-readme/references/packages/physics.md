# Physics Package Notes

`@wimaengine/physics` composes the broadphase, narrowphase, integrator, movable, and transform packages into a physics runtime.

## Package Role

This package sits above the lower-level physics packages and turns them into a usable physics runtime. The current README frames it as the top-level composition layer, so future documentation should emphasize orchestration, integration, and inspection support over individual collision algorithms.

## Capability Highlights

- Composes `broadphase`, `narrowphase`, `integrator`, `movable`, and `transform` into one physics runtime.
- Ships physics systems for simulation and debugging.
- Provides rigid-body prefab helpers for common entity setups.
- Wires in debugger support so runtime physics state can be inspected during execution.
- Integrates with the broader engine stack through `app`, `ecs`, `core`, `window`, `render-canvas2d`, `logger`, `math`, `reflect`, and `type`.
- Exports both the package root and a `./src` subpath, so consumers can choose the public bundle or source-level entry.

## Core Concepts

### Runtime Composition

The defining behavior of `@wimaengine/physics` is composition. It does not own the low-level math of broadphase or narrowphase itself; instead, it assembles the lower-level packages into a runnable physics layer. Future README copy should treat this as the package's central value proposition.

### Plugins

The README's plugin language suggests the package exposes modules that register physics behavior into the wider app lifecycle. One plugin path is likely for normal runtime setup, and another for debugger support. The important point is that physics is installed through the engine's plugin composition model, not through an isolated constructor-heavy API.

### Prefabs

Prefab helpers provide reusable rigid-body entity setups. This is a convenience layer for consistent physics entity creation, which is useful to call out because it signals that the package is not just simulation infrastructure; it also provides starting points for common game objects.

### Systems

The systems layer is where the simulation work actually runs. These systems likely bridge ECS state, integration, movement, and collision resolution, and they also provide the debugger-facing hooks the README already mentions. In future docs, this is the place to describe the ongoing per-frame work of the package.

### Debugger Integration

Debugger support is a first-class part of the package story, not an afterthought. The package README already calls out debugger plugin wiring, so future documentation should keep this visible and explain it as runtime inspection or visualization support for physics state.

## Notes

- Keep the README tone feature-first. There is enough engine context here to explain what the package does without walking through setup or usage.
- The package is an integration layer, so mention the lower-level physics packages by role rather than reproducing their internals.
- The manifest shows ESM packaging with a root `index.js` entry and a `./src` subpath; if a future README includes an exports section, those are the only public entry points worth naming from the manifest alone.
- Dependency names indicate the package sits at the intersection of ECS, application orchestration, rendering/debugging, and type infrastructure. That makes "physics runtime" a better framing than "collision math library."
- If the future README grows beyond the current short form, the first sections should probably stay aligned with the existing structure: package role, capability highlights, then the three concrete primitives of plugins, prefabs, and systems.
