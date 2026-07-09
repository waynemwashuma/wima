# Root README Instructions

## Use This For

- The repo root `README.md`
- High-level project overviews that summarize the engine by domain

## Workflow

1. Summarize the engine at a domain level rather than listing every package individually.
2. Group the features by major engine area such as runtime, rendering, physics, input, assets, scene, math, and tooling.
3. Use bullets in the format `\`domain\`: description. See more in [package](./packages/package/README.md)`.
4. Link to the most representative package README for each domain, and include extra links only when they clarify the domain.
5. Add a `## Compatibility` table before `## Getting Started` that covers Browser, Node.js, Deno, and Bun.
6. Keep the getting-started and contributing sections linked to the actual guide pages, especially `guide/01-getting-started/index.md` and `guide/04-contributing/index.md`.

## Writing Rules

- Lead with the engine's major domains, not low-level details.
- Keep the overview concise.
- Use the package README links as the authoritative detail source.
- Use YAML frontmatter `title` for the project name instead of a top-level `#` heading.

## Recommended Structure

- YAML frontmatter `title: Wima Engine`
- One-sentence project summary
- `## Features`
- `## Compatibility`
- `## Getting Started`
- `## Contributing`
