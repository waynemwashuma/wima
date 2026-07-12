# Utils Package Reference

## Package Role

`@wimaengine/utils` is the shared utility layer for Wima engine packages, bundling reusable runtime helpers, abstract-class guards, filename string helpers, and shared typedefs.

## README Conventions

- Use YAML frontmatter `title: Utils` instead of a top-level heading.
- Keep the lead sentence feature-first and follow it with `## Installation`.
- Include `## Capability Highlights`, `## Core Concepts`, `## Exported Surface`, and `## Notes` for this package.
- Describe the actual exported modules and symbols, not generic utility language.
- Avoid tutorial steps or usage walkthroughs unless the user explicitly asks for them.

## Package Surface

- `common`: `generateIDBasic`, `swapRemove`, `formatString`, `noop`
- `errors`: `AbstractClassError`, `abstractMethod`, `abstractClass`
- `file`: `getFileName`, `getFileExtension`
- `typedef`: `Defaultable`, `TypeArray`
- Public entry points: `.` and `./src`

## Notes

- `errors` centralizes the shared abstract-class wording and currently throws formatted strings rather than `Error` objects.
- `file` helpers are simple string parsers and do not resolve actual filesystem paths.
- `typedef` is the type-sharing layer for lightweight cross-package shapes such as `Defaultable` and typed-array unions.
