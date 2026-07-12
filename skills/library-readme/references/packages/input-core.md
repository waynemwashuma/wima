---
title: Input Core
---

`@wimaengine/input-core` is the shared low-level button-state layer for Wima input packages, centered on a generic `Buttons` container.

## Capability Highlights

- Tracks held, newly pressed, and newly released buttons in separate `Set`s.
- Distinguishes sustained button state from transient frame transitions.
- Provides single-button queries and variadic `any*` helpers for polling groups of buttons.
- Exposes clearing methods for both transient transition sets and the held set.
- Supplies the common button model used by keyboard, mouse, and touch packages.

## Core Concepts

### Buttons

The package centers on a buttons model that represents discrete input controls and their state transitions. This is the main primitive future docs should explain first, because it is the shared abstraction every downstream input package consumes.

### Frame State

Input is described in frame-oriented terms rather than as isolated events. The important distinction is between buttons that are currently pressed and buttons that changed state during the current frame, which makes the package suitable for deterministic update loops.

### State Sets

The README already exposes the three key sets the package cares about: pressed, just-pressed, and just-released. These sets are the clearest user-facing vocabulary for the package and should stay prominent in any future README or module overview.

### Shared Input Layer

The package is intentionally narrow in scope. It does not try to interpret keyboard, mouse, or touch semantics itself; instead, it gives those packages a common substrate for button tracking and query helpers.

## Notes

- Future README drafts should lead with the shared-button-model role, not with setup or usage steps.
- The package is best described as cross-device infrastructure for input normalization.
- Keep examples and terminology centered on state transitions and frame queries.
- Mention the downstream relationship explicitly: `@wimaengine/keyboard`, `@wimaengine/mouse`, and `@wimaengine/touch` rely on this layer.
- The package is ESM-only (`type: module`) and publishes both the root entry and a `./src` export, so README copy should distinguish the public import path from the source alias.
