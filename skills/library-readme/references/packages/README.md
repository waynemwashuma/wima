# Package Reference Notes

## Purpose

Use this directory for package-specific reference files that should be read before drafting a package README.

## File Naming

- Use the package directory name as the reference file name.
- Example: `packages/ecs` maps to `references/packages/ecs.md`.

## What To Capture

- The package's role in the engine.
- The concrete primitives, resources, systems, or types it exposes.
- Any package-specific implementation traits worth calling out in the README.
- Constraints or integration points that shape how the package is described.

## Workflow

1. Read the package's `package.json`, README, source, and tests.
2. Write the package reference note before touching the package README.
3. Use the reference note as the source of truth when drafting the README.
