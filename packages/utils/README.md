---
title: Utils
---

`@wimaengine/utils` is the shared utility layer for Wima engine packages, bundling reusable runtime helpers, abstract-class guards, filename string helpers, and shared typedefs.

## Installation

```sh
npm i @wimaengine/utils
```

## Capability Highlights

- Reusable helper functions for IDs, dense-array removal, string templating, and no-op callbacks.
- Centralized abstract-class and abstract-method checks with shared message templates.
- Lightweight filename and extension parsing for path-like strings.
- Shared typedefs for typed-array unions and defaultable value shapes.
- A narrow public surface that exposes the four utility modules plus a direct `./src` entry point.

## Core Concepts

### Common

`common` is the runtime helper bucket for small utilities that show up across the engine. It exports `generateIDBasic` for module-local ID generation, `swapRemove` for constant-time removal when order does not matter, `formatString` for numbered placeholder substitution, and `noop` for callback slots that intentionally do nothing.

### Errors

`errors` keeps the package's abstract-class conventions in one place. `AbstractClassError` stores the shared wording, while `abstractClass` and `abstractMethod` enforce construction and override rules by throwing formatted messages that include the concrete class and method names.

### File

`file` contains simple filename helpers for string inputs. `getFileName` extracts the last path segment's base name, and `getFileExtension` returns the trailing dot-delimited segment. They are intentionally lightweight string utilities rather than filesystem parsers.

### Typedefs

`typedef` publishes shared utility types that other packages can reuse without duplicating shape definitions. `Defaultable` describes objects with a lazy `default()` factory, and `TypeArray` aliases the built-in typed-array family used by buffer-oriented APIs.

## Exported Surface

- `common`: `generateIDBasic`, `swapRemove`, `formatString`, `noop`
- `errors`: `AbstractClassError`, `abstractMethod`, `abstractClass`
- `file`: `getFileName`, `getFileExtension`
- `typedef`: `Defaultable`, `TypeArray`
- `.`: package root re-export of the full utility surface
- `./src`: direct source entry point exposed by `package.json`

## Notes

- The package is deliberately small and cross-cutting; it exists so higher-level engine packages can stay focused on domain logic.
- The abstract helpers currently throw formatted strings, not `Error` instances, so downstream code should preserve that contract if it wraps them.
- The `./src` export is intentionally published alongside the package root for consumers that import from the source entry point.
