---
name: library-readme
description: Feature-first README drafting for libraries and packages. Use when creating or rewriting package READMEs, module overviews, or library docs that should describe capabilities, exports, architecture, and notable behavior instead of usage walkthroughs.
---

# Library Readme

## Overview

Draft README files for the repo root and for package submodules. Keep the output feature-focused and avoid installation or usage guidance unless the user explicitly asks for it. Use YAML frontmatter `title` for the project or package name instead of a top-level `#` heading.

## Routing

- If the request depends on repo-wide README conventions established in earlier turns, read `references/previous-instructions.md` first.
- If the target is a guide page under `guide/`, read `references/guides.md` first.
- If the target is the repo root `README.md`, read `references/root.md` first.
- If the target is a subpackage README under `packages/`, read `references/subpackage.md` first.
- If a package-specific note exists in `references/packages/`, read that too before drafting.

## Output Shape

For package READMEs, prefer this outline unless the package clearly needs a different one:

- YAML frontmatter `title: Package Name`
- One-sentence summary
- `## Installation`
- `## Capability Highlights`
- `## Core Concepts`
- Expand `## Core Concepts` into separate subheadings for major primitives when the package has multiple distinct building blocks, and explain each one in a short paragraph
- `## Exported Surface` if the package has many public symbols
- `## Notes` for constraints, integration points, or implementation traits
