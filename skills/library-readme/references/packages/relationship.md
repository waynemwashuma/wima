# `@wimaengine/relationship` reference

## Package Role
`@wimaengine/relationship` provides relationship queries and traversal helpers over entity graphs.

## Capability Highlights
- Provides relationship-aware lookup helpers on top of the ECS stack.
- Offers traversal utilities for walking entity graphs and connected structures.
- Groups lower-level relationship logic into a shared package instead of scattering graph rules across callers.
- Ships as an ESM package with both the package root and a `./src` subpath entry.

## Core Concepts

### Relationship Queries
The current README frames the query side of the package as entity filtering that takes relationship state into account. This is the primary user-facing idea to preserve in a future README: the package is not just querying components, it is querying entities in the context of how they are related to other entities.

### Entity Traversal
Traversal is the second major primitive. The package exists to walk entity graphs for callers, which suggests that traversal semantics should be treated as a first-class capability rather than as a helper detail. Future README copy should explain that this reduces repeated graph-walking code in downstream packages.

### Relationship Logic Helpers
The README also calls out "core helpers for relationship logic." That implies there is a lower-level layer of shared behavior underneath the query and traversal APIs. A future README should keep this bucket separate from the higher-level features so the package reads as structured and intentional, not as an undifferentiated utility dump.

### Package Surface
The metadata confirms two public import paths:
- `@wimaengine/relationship`
- `@wimaengine/relationship/src`

That split suggests the package exposes a supported root entry and a source-oriented subpath. A future README should be careful to describe the root package as the main API and only mention `./src` if the docs intend to support direct source imports.

## Notes For A Future README
- Keep the package positioned as an ECS adjunct, not a standalone graph library.
- Replace the current generic package description with concrete language about connected entities, relationship-aware lookup, and traversal.
- Preserve the feature-first structure already present in the README: a short summary, capability highlights, then core concepts.
- The package depends on `@wimaengine/ecs`, `@wimaengine/type`, and `@wimaengine/utils`, so its documentation should assume shared engine conventions and types.
- Avoid overselling the API surface. The existing README only confirms broad categories of behavior, so future prose should stay high-level unless the source docs expose more specific primitives.
- Because the package is ESM-first, any future README examples should use import syntax that matches the package metadata.
