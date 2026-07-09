# Shared README Conventions

## Purpose

These conventions capture the README rules established in earlier iterations of the skill. Use them as the baseline before applying root-specific or package-specific notes.

## Shared Rules

- Keep README drafts feature-first.
- Avoid usage, installation, or tutorial steps unless the user explicitly asks for them.
- Use YAML frontmatter `title` instead of a top-level `#` heading.
- Prefer concise prose and link to the authoritative package README or guide page when deeper detail is needed.
- When a package has multiple distinct primitives, explain each one under its own heading.

## Root README

- Summarize the engine by domain rather than by package.
- Write feature bullets in the form `domain: description. See more in [package](./packages/package/README.md)`.
- Add a `## Compatibility` table before `## Getting Started` that covers Browser, Node.js, Deno, and Bun.
- Link Getting Started to `guide/01-getting-started/index.md`.
- Link Contributing to `guide/04-contributing/index.md`.

## Subpackage READMEs

- Focus on capabilities, architecture, exported surface, and notable behavior.
- Include a short `## Installation` section after the summary with `npm i @wimaengine/<package>`.
- Use `## Capability Highlights`, `## Core Concepts`, and `## Notes` when they fit the package.
- Expand `Core Concepts` into headings for major primitives when the package has several distinct building blocks.

## ECS Package

- For ECS-specific docs, turn the core building blocks into headings and explain what each one does in detail.
