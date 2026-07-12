# Datastructures package reference

## Package Role

`@wimaengine/datastructures` re-exports common dense data-structure primitives from `vifaa`.

## Capability Highlights

- Re-exports common dense data-structure utilities used for engine storage.
- Centers on compact list-style storage and reusable numeric slot allocation.
- Keeps consumers on the engine package name while delegating implementation to `vifaa`.
- Exposes both a root entry point and a `./src` entry point as ESM imports.

## Core Concepts

### Dense Storage Primitives

The package is about dense, engine-friendly storage rather than general-purpose containers. Future README copy should emphasize compactness, slot reuse, and the usefulness of these primitives in subsystems that need predictable storage patterns.

### Index Allocation

Index allocation is the other core idea called out by the package README. This suggests the package is useful when a subsystem needs stable numeric handles or reusable positions in a dense structure, not just ordered iteration.

### Re-export Boundary

The package does not appear to add a bespoke abstraction layer; it forwards `vifaa` primitives through the Wima package namespace. Future documentation should treat this as an integration package and avoid implying novel algorithms or deep engine-specific behavior.

### Public Entry Points

`package.json` advertises a root import path and a `./src` path. A future README should mention the package boundary at a high level if direct source imports matter, but it should not turn into a usage guide.

## Notes

- Keep the future README short and feature-first; installation can stay as a single command section.
- Avoid listing API details until the actual exported symbols are needed.
- Frame the package as shared engine infrastructure for data layout and slot management.
- The package description is intentionally narrow: "datastructures package" is less helpful than "dense storage and index-allocation primitives backed by `vifaa`."
- Because the package is ESM-only at the package level, any README examples should assume `import` semantics rather than CommonJS.
