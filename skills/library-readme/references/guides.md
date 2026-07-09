# Guide Page Instructions

## Use This For

- Pages under `guide/` that explain the engine conceptually or walk through setup and onboarding
- Beginner-facing docs that should help the reader understand how to approach the engine, not just what APIs exist

## Workflow

1. Identify the reader's goal and keep the page anchored to that goal.
2. Choose the right level of detail for beginners. Start with the mental model, not implementation detail.
3. Organize the page around how the reader uses the concept in practice.
4. Include short code snippets only when they clarify an idea or connect a concept to a concrete shape.
5. End with a small summary or next-step link when the page is part of a sequence.

## Writing Rules

- Lead with what the reader should understand or be able to do after reading.
- Keep the tone direct, simple, and accessible.
- Prefer high-level relationships over low-level engine internals.
- Use short snippets as examples, not as full tutorials.
- Avoid listing every API surface or implementation trait unless the guide is explicitly about that topic.
- Keep the section count small and the progression clear.
- Do not force README-specific patterns like feature bullets, export inventories, or installation tables onto guide pages.
- For conceptual guides, favor sections such as overview, main ideas, how the pieces fit together, and a rule of thumb.
- For setup guides, favor sections such as what you need, install paths, minimal import example, and what to read next.

## Recommended Structure

Use the outline that best fits the guide type:

- Title
- One-sentence orientation
- Core concept sections or setup steps
- One or two short snippets if they add clarity
- A brief summary or next step

## Notes

- Guides should stay beginner-friendly even when they mention technical terms.
- The goal is comprehension first, not completeness.
- If a guide page is only meant to introduce a concept, it can remain fully conceptual and omit code entirely.
