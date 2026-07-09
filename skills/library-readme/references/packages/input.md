---
title: Input package reference
---

`@wimaengine/input` is the app-facing input aggregation package for Wima. It combines keyboard, mouse, and touch into one runtime entry point so application code can wire the full input stack in one place instead of coordinating device packages separately.

## Package Role

- Top-level input bundle for Wima applications.
- Integration layer over `@wimaengine/app` and the device packages.
- Thin composition package rather than a low-level input implementation.

## Capability Highlights

- Bundles keyboard, mouse, and touch input behind a single package.
- Keeps app runtime wiring centralized.
- Exposes a small published surface with a root entry point and a `./src` entry point.
- Ships as an ES module package with generated type declarations.
- Aligns with the rest of the `0.3.0` Wima package set.

## Core Concepts

### Plugin

The package is presented as a plugin-style module. Its purpose is to register the input stack with the app runtime, not to expose direct device handling as the main user-facing abstraction.

### Input Bundle

The bundle is the package’s primary value: a single input layer assembled from the keyboard, mouse, and touch packages. Future README copy should keep this aggregation framing front and center.

### Keyboard

Keyboard support is part of the composite input layer, but the package is not meant to replace the dedicated keyboard package. Its role is to make keyboard integration available as part of the unified bundle.

### Mouse

Mouse support follows the same pattern as keyboard support. It is included so app code can work with pointer input through the same entry point as the rest of the input stack.

### Touch

Touch support completes the device set exposed by the package. This makes the package suitable for apps that need both pointer and touch-aware input wiring.

### Package Exports

The published API is intentionally narrow:

- `.` maps to `./index.js` for the normal public entry point.
- `./src` maps to `./src/index.js` for source-level imports.

Future README drafts should call out these entry points if they discuss architecture or package boundaries.

## Notes For Future README Drafts

- Lead with the aggregate role before describing any individual device package.
- Emphasize that this package is for app-level wiring, not standalone input primitives.
- Call out that it combines keyboard, mouse, and touch under one entry point.
- Mention the small export surface so readers understand where public imports come from.
- Note the direct dependency on `@wimaengine/app` because the package is tied to runtime integration.
- Keep the tone feature-first; avoid sinking into implementation detail unless the architecture section needs it.
- If a later README includes installation or usage, place those after the capability summary and core concepts.
