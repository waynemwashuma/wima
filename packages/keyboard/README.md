---
title: Keyboard
---

`@wimaengine/keyboard` provides keyboard state, key/location primitives, and ECS integration.

## Installation

```sh
npm i @wimaengine/keyboard
```

## Capability Highlights

- Keyboard resource state for current key presses.
- Key and location helpers for mapping hardware input.
- Systems and plugin registration for ECS runtime use.

## Core Concepts

### Key

The key module models keyboard keys in a stable engine-friendly form.

### Location

The location module captures where a key lives on the keyboard layout.

### Keyboard Resource

The keyboard resource tracks live input state for other systems to query.

## Notes

- `@wimaengine/input-core` provides the button model used by this package's higher-level state.
