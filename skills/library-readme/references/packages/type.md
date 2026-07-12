---
title: Type
---

`@wimaengine/type` provides the engine's runtime identity helpers and shared type aliases for packages that need to turn constructors into stable ids.

## Capability Highlights

- Provides stable `TypeId` generation from constructors so engine code can compare runtime types without ad hoc string labels.
- Includes generic type-id helpers for broader runtime symbols when constructor-based identity is not enough.
- Includes function type-id helpers for callable values that need a stable runtime identity path.
- Publishes shared constructor and copy/clone typedefs that other packages can reuse without duplicating type aliases.

## Core Concepts

### TypeId

`TypeId` is the core runtime-identity primitive in the package. It maps constructors to engine-safe identifiers so reflection-heavy code can work with a stable, shared representation instead of raw constructor references or class names.

### Generic Type Identifiers

The generic helpers extend the `TypeId` idea beyond constructors. The package README frames them as a more specific runtime-signal layer, so future docs should present them as a companion to the core constructor mapping rather than as a separate subsystem.

### Function Type Id Helpers

Function-oriented helpers cover callable or function-shaped runtime symbols that need their own identifier behavior. They belong to the same identity system as `TypeId`, which makes them part of the package's reflection support story.

### Typedefs

The typedef surface centralizes constructor aliases plus copy/clone helper types. This makes `@wimaengine/type` useful as monorepo glue even in packages that only need shared types and do not consume the runtime helpers directly.

## Notes

- The package is infrastructure for other engine packages, especially ones that need stable runtime identifiers during reflection or registry lookups.
- The documented public entry points are `@wimaengine/type` and `@wimaengine/type/src`.
- The package ships `index.js` and `src`, with package types pointing at `./dist/index.d.ts`.
- Future README drafts should stay feature-first and avoid usage walkthroughs unless explicitly requested.
- If a later draft needs concrete symbol names, the next step is to inspect the public exports directly.
