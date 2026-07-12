# @wimaengine/hierarchy Reference Note

## Package Role

`@wimaengine/hierarchy` provides parent and children components plus the hooks that keep entity trees consistent.

## Capability Highlights

- Represents hierarchy links with dedicated parent and children components.
- Keeps tree state synchronized when entities are reparented, moved, or removed.
- Ships ECS-oriented hooks and system/plugin wiring for automatic maintenance.
- Acts as a structural dependency for scene and transform-related packages.
- Exposes both the package root entry point and a `./src` subpath for direct source-level imports.

## Core Concepts

### Parent

The parent primitive is the upward link in the hierarchy. It identifies the entity that owns a node in the tree and provides the reference point used when descendants are attached, detached, or moved.

### Children

The children primitive tracks the downward edge of the hierarchy. It records descendant entity ids and serves as the local view of a node’s subtree, which is what makes traversal and consistency checks possible.

### Hooks

The hooks layer is responsible for keeping the hierarchy coherent as the ECS changes. It reacts to structural updates so that parent and children data stay in sync instead of drifting apart across separate systems.

### ECS and Plugin Wiring

The package is not just a data container. Its README and dependencies indicate it is meant to plug into the wider engine runtime, with systems and plugin wiring handling the ongoing maintenance work that keeps tree relationships correct.

## Notes for a Future README

- Keep the framing feature-first: describe the package as the hierarchy/structural layer before getting into exported pieces.
- Emphasize consistency guarantees rather than implementation mechanics. The most important behavior is that the package maintains parent/child relationships automatically.
- Treat `Parent`, `Children`, and `Hooks` as the primary conceptual anchors for the docs.
- Mention that scene and transform packages depend on this package for structural relationships, since that explains why it matters in the wider engine.
- Call out the dual entry surface from `package.json`: the package root (`.`) and `./src`.
- The dependency set suggests this package belongs to the engine’s ECS and relationship infrastructure, so future docs should present it as integrated runtime plumbing rather than a standalone utility.
- Avoid usage walkthroughs unless they are specifically requested later; this note is meant to support a concise, capability-oriented README.
