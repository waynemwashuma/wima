# Subpackage README Instructions

## Use This For

- Package READMEs under `packages/*`
- Module overviews that describe a library slice rather than the repo root

## Workflow

1. Inspect `package.json`, public exports, source modules, and tests.
2. Derive the package's actual capabilities from code and test coverage.
3. Group the document around capability highlights, core concepts, and notable implementation traits.
4. Use the package's own symbols and module names in the prose.
5. Omit tutorial steps, setup instructions, and API walkthroughs unless the user explicitly asks for them.

## Writing Rules

- Lead with capabilities, not instructions.
- Include a short `## Installation` section after the summary with the package's npm install command.
- Keep each bullet concrete and package-specific.
- Mention implementation details only when they help explain the package's value, such as dense storage, lifecycle hooks, aliasing, or typed registries.
- Prefer short declarative sections over long narratives.
- If the package has several core primitives, turn each primitive into its own heading and explain its role in prose instead of leaving it as a flat bullet.
- Read any package-specific note in `references/packages/` before drafting, such as `references/packages/ecs.md`.
- Do not write a usage section unless the user explicitly asks for one.
- Use YAML frontmatter `title` for the package name instead of a top-level `#` heading.

## Recommended Structure

Use this outline unless the package clearly needs a different one:

- YAML frontmatter `title: Package Name`
- One-sentence summary
- `## Installation`
- `## Capability Highlights`
- `## Core Concepts`
- Expand `## Core Concepts` into separate subheadings for major primitives when the package has multiple distinct building blocks, and explain each one in a short paragraph
- `## Exported Surface` if the package has many public symbols
- `## Notes` for constraints, integration points, or implementation traits
