---
title: Input Core
---

`@wimaengine/input-core` is the shared low-level button-state layer for Wima input packages, centered on a generic `Buttons` container.

## Installation

```sh
npm i @wimaengine/input-core
```

## Capability Highlights

- Tracks held, newly pressed, and newly released buttons in separate `Set`s.
- Distinguishes sustained button state from transient frame transitions.
- Provides single-button queries and variadic `any*` helpers for polling groups of buttons.
- Exposes clearing methods for both transient transition sets and the held set.
- Supplies the common button model used by keyboard, mouse, and touch packages.

## Core Concepts

### Buttons

`Buttons<T>` is the package's only concrete primitive. It accepts any button token type and keeps three internal sets in sync: `pressed` for currently held buttons, `justPressed` for buttons that transitioned into the held state during the current frame, and `justReleased` for buttons that transitioned out of the held state during the current frame. `press()` and `release()` are transition-aware, so repeated presses do not duplicate edge events and releases only register when a button was actually held.

### Queries

`pressed()`, `justPressed()`, and `justReleased()` answer state for a single button token. The `anyPressed()`, `anyJustPressed()`, and `anyJustReleased()` helpers collapse the same checks across a list of candidate buttons, which makes it easy for downstream input layers to treat several tokens as equivalent.

### Clearing State

`clearJustPressed()` and `clearJustReleased()` reset the transient frame sets after consumers have observed them. `clearPressed()` clears the held set itself, which is the full reset path when an input source is lost, reinitialized, or deliberately discarded.

## Exported Surface

- `Buttons<T>` is defined in `src/core/buttons.js` and re-exported through `src/core`, `src`, and the package root.
- The package keeps the public surface narrow: the root entry mirrors the core state model instead of layering on extra abstractions.
- `./src` is also published for source-oriented imports, but it exposes the same API shape as the root entry.

## Notes

- The package is intentionally device-agnostic; it models button transitions without encoding keyboard, mouse, or touch semantics.
- `@wimaengine/keyboard`, `@wimaengine/mouse`, and `@wimaengine/touch` build on this layer for their higher-level input state.
- Because the transient sets are frame-oriented, downstream code should clear them once per update cycle after polling.
- The root package entry re-exports the same core surface, so consumers do not need to reach into nested modules for the main API.
