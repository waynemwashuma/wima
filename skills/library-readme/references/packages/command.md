# @wimaengine/command

`@wimaengine/command` provides deferred world mutation through commands and queues. It keeps mutation logic separate from the systems that request it.

## Capability Highlights

- Defers command execution so world changes can be batched and applied at a controlled point.
- Provides queue-backed storage for pending commands.
- Defines typed command function shapes for helpers and consumers that need to create or accept commands safely.
- Keeps the package surface small and ESM-first, with both package-root and `./src` entry points.
- Ships TypeScript declarations from `dist`, which makes the public contract easier to document in a future README.

## Core Concepts

### Command

A command is the unit of deferred mutation. It captures what should happen without performing the change immediately, which keeps request generation separate from application and makes system code easier to reason about.

### Queue

The queue is the ordered holding area for pending commands. It is the package's coordination point for accumulating work and later flushing world changes in sequence.

### Typedefs

The typedef layer describes command function signatures in a typed way. It supports packages and helpers that build or consume command-shaped callbacks without depending on runtime internals.

## Notes

- The package is marked `"type": "module"`, so the published JavaScript entrypoints are ESM.
- `@wimaengine/command` resolves from `./index.js`, with a `./src` subpath export for source-level imports.
- Published files are limited to `index.js` and `src`, while declarations are emitted from `dist`.
- Runtime dependencies are `@wimaengine/app` and `@wimaengine/ecs`, so this package should be framed as engine infrastructure rather than a standalone feature module.
- The current package README already frames the package as separating mutation logic from the systems that request it; future README drafts should keep that separation front and center.
- The `build`, `test`, and `types` scripts suggest the package has a clear build-and-contract story, but the future README should still avoid a usage walkthrough unless explicitly requested.
