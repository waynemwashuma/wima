---
title: Logger
---

`@wimaengine/logger` is the engine's shared diagnostics layer for prefixed logs, runtime assertions, warnings, and deprecation notices.

## Package Role Summary

This package centralizes guardrails so engine modules can report issues in a consistent format without inventing their own logging conventions. It is small, but it sits on the critical path for runtime visibility, validation, and API migration across the engine.

## Capability Highlights

- Normal, warning, and error output all use the engine marker prefix.
- Assertion and throw helpers cover fail-fast runtime checks.
- One-time warnings prevent repeated conditions from flooding the console.
- Deprecation helpers provide a controlled path for API evolution.
- The package is shared infrastructure, not a feature-specific utility.

## Core Concepts

### Logging

The logging surface is the default path for diagnostic output. Future README copy should present it as a consistent formatter for engine-branded messages rather than as a generic console wrapper.

### Assertions and Throw Helpers

Assertions enforce required values and invariants. The README should frame them as fail-fast helpers that turn invalid state into immediate errors, with throw helpers called out as the explicit escape hatch when a condition must abort execution.

### Warnings

Warnings are for recoverable or advisory conditions. The important detail from the current package README is that warning output can be limited to a single emission, which makes this package suitable for recurring but non-fatal states.

### Deprecation Notices

Deprecation helpers belong next to warnings, but they deserve their own README section because they communicate migration intent. Future docs should emphasize that they are for transition periods and should not be treated as ordinary status messages.

## Notes

- Package metadata says `@wimaengine/logger` is ESM-only (`type: module`) and ships a root entrypoint plus a `./src` subpath.
- The published surface is intentionally small, so future README copy should stay feature-led instead of drifting into a long API catalog.
- The current package README already names the major feature groups. Reuse those terms in future prose to keep the docs aligned with the package's public language.
- If a future README needs examples, keep them minimal and secondary to the feature summary. The package's value is in guardrails, consistency, and reduced log spam.
- Treat this package as a dependency used by other engine modules for runtime diagnostics and validation.
- Avoid promising more than the docs state: the verified surface here is logging, warnings, assertions, and deprecation helpers.
