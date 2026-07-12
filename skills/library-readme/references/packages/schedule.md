# Schedule Feature Notes

`@wimaengine/schedule` is the engine's ordered system execution layer, turning labeled schedules, grouped systems, and runtime policy into deterministic work pipelines.

## Preferred README Shape

- YAML frontmatter `title: Schedule`
- One-sentence summary centered on ordered system execution
- `## Installation`
- `## Capability Highlights`
- `## Core Concepts`
- `## Exported Surface` when the module exposes several public symbols
- `## Notes`

## Capability Highlights

- Defines the scheduling layer for grouping systems, ordering them, and executing them at runtime.
- Separates schedule definition from schedule execution so orchestration code can build plans before they run.
- Includes `SchedulerBuilder` for assembling system groups and configuration into runnable schedules.
- Provides a `Runner` that executes configured schedules against a world.
- Publishes both a package root entry and a `./src` subpath, which suggests a compact public surface with a source-oriented import path.
- Ships as ESM-only (`type: module`) with generated type declarations under `dist`.

## Core Concepts

### Scheduler

`Scheduler` is the runtime orchestration primitive. It owns execution ordering and keeps system runs predictable once a schedule has been assembled. Future README copy should treat it as the thing that makes the package an execution system rather than just a data container.

### Schedule

`Schedule` is the concrete execution plan. The package README positions it as the thing that gets built and run, so future docs should describe it as the package's unit of ordered work rather than as a generic config object.

### SchedulerBuilder

`SchedulerBuilder` is the assembly primitive. It takes system configs, group structure, and execution options and turns them into schedules the runtime can consume. Future README copy should emphasize that this is the composition layer, not the low-level execution API.

### Runner

`Runner` is the execution primitive. It applies configured schedules against a world, which makes it the bridge between schedule definition and live runtime behavior. This should stay visible in future docs because it is the most runtime-facing part of the package.

### Public Entrypoints

The package publishes a root entry (`.`) and a `./src` subpath. That split implies two import styles: a normal package import and a source-oriented import path. Future README text should describe the published surface carefully so it does not imply multiple unrelated APIs.

## Notes

- The package depends on `@wimaengine/datastructures`, `@wimaengine/ecs`, `@wimaengine/logger`, `@wimaengine/type`, and `vifaa`, which signals that it sits inside the engine's internal coordination stack rather than acting as a standalone utility.
- The existing `README.md` is intentionally sparse, so this note should carry the extra detail needed for future docs around the separation between schedule definition, assembly, and execution.
- The package metadata publishes `index.js` and `src` only, so future README copy should avoid promising extra top-level artifacts.
- If a future README needs API examples, they should be organized around `Scheduler`, `Schedule`, `SchedulerBuilder`, and `Runner` rather than around file layout.
