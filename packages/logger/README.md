---
title: Logger
---

`@wimaengine/logger` is the engine's shared diagnostics layer for prefixed console output, runtime assertions, one-time warnings, and deprecation notices.

## Installation

```sh
npm i @wimaengine/logger
```

## Capability Highlights

- `log()`, `warn()`, and `error()` write engine-prefixed output through the native console channels.
- `warnOnce()` suppresses repeated warnings for the same message.
- `throws()` raises prefixed `Error` instances for fatal conditions.
- `assert()` guards against `null` and `undefined` values with a non-nullable assertion signature.
- `deprecate()` emits a one-time deprecation warning and can include a replacement suggestion.
- The package is intentionally small and is used as shared runtime diagnostics infrastructure across the engine.

## Core Concepts

### Prefixed Console Output

All outward-facing messages share the same engine marker prefix before they reach `console.log`, `console.warn`, or `console.error`. That keeps diagnostics easy to scan and makes engine messages visually distinct from application noise.

### One-Time Warnings

`warnOnce()` tracks emitted messages in module memory and skips repeats. This is useful for recurring but non-fatal conditions that should be reported once per process instead of flooding the console.

### Assertions and Throws

`assert()` is a nullish guard, not a general truthiness check: `false`, `0`, and empty strings are allowed. When the value is `null` or `undefined`, the helper delegates to `throws()` so the failure is raised with the same engine prefix as every other diagnostic.

### Deprecation Notices

`deprecate()` is the migration helper for API churn. It emits a warning only once for a given message, and when a replacement name is supplied it includes that suggestion in the notice so callers can move to the new symbol quickly.

## Exported Surface

The package publishes a single root surface and a matching `./src` subpath. There are no deeper feature modules.

- `log(message)`: write a prefixed message to `console.log`.
- `warn(message)`: write a prefixed message to `console.warn`.
- `warnOnce(message)`: write a prefixed warning once per unique string.
- `error(message)`: write a prefixed message to `console.error`.
- `throws(message)`: throw a prefixed `Error`.
- `assert(test, message)`: throw when `test` is `null` or `undefined`.
- `deprecate(original, replacement?)`: emit a one-time deprecation warning and optionally point to a replacement symbol.

## Notes

- The package is ESM-only and ships `type: module` metadata.
- `warnOnce()` deduplicates by exact message string and keeps that state in memory for the lifetime of the module instance.
- The published entrypoints are the root package export and `./src`; the README should not imply a larger module tree.
