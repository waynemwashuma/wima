---
title: Storage
---

`@wimaengine/storage` provides session, cookie, and storage resources for persistence.

## Installation

```sh
npm i @wimaengine/storage
```

## Capability Highlights

- Session and cookie resources for browser persistence.
- General storage resource helpers.
- Systems and plugin wiring for ECS use.

## Core Concepts

### Session

The session resource keeps session-scoped persistence available to the runtime.

### Cookie

The cookie resource models cookie-backed storage state.

### Storage Resource

The storage resource exposes the shared persistence layer to ECS consumers.

## Notes

- Use this package when runtime state needs to survive across page interactions.
