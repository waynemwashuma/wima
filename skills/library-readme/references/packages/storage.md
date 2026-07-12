# Storage

`@wimaengine/storage` provides session, cookie, and storage resources for persistence.

## Role Summary

- Provides persistence-focused resources rather than a general-purpose data store.
- Sits at the application, ECS, and reflection boundary through `@wimaengine/app`, `@wimaengine/core`, `@wimaengine/ecs`, and `@wimaengine/reflect`.
- Keeps runtime state available across page interactions when the engine needs browser-backed persistence.

## Capability Highlights

- Session-scoped persistence for runtime state that should outlive a single interaction but remain bounded to the current session.
- Cookie-backed persistence for browser state with cookie semantics.
- A shared storage resource that ECS consumers can treat as the central persistence abstraction.
- Systems and plugin wiring that register the storage layer into the wider engine runtime.
- Small public surface with root and `./src` entry points, which keeps the README focused on concepts instead of a large API catalog.

## Core Concepts

### Session

The session resource represents state tied to a runtime session. It is the right abstraction when data should persist for the current session without implying long-term application storage.

### Cookie

The cookie resource models browser cookie state. In README prose, it should be framed as browser-backed persistence with the scope and lifecycle constraints that cookies imply.

### Storage Resource

The storage resource is the package's shared persistence layer. This is the central primitive for ECS consumers that need a common abstraction over stored runtime state.

### Systems

The systems layer keeps the resource layer active inside the engine's execution flow. It is part of the package's runtime integration story, not just its data model.

### Plugin Wiring

The plugin is the bridge that registers storage resources and systems with the wider engine. This is what makes the package feel native to the app and ECS stack.

## Exported Surface

- Root entry: `@wimaengine/storage`
- Source entry: `@wimaengine/storage/src`
- The package metadata suggests a minimal surface, so a future README can stay centered on the major concepts unless additional exports need to be called out.

## Notes

- Lead with persistence-first framing, not with installation or a usage walkthrough.
- "Runtime state survives across page interactions" is a good concise summary line for the package.
- Keep the package positioned as browser-oriented storage, not as a generic back-end persistence API.
- The package's dependencies imply that it should be described in engine context rather than as a standalone utility.
- If a future README needs more detail, the next layer should be the behavior of each resource and how the plugin wires them into the runtime.
- Stay aligned with the current README's emphasis on session, cookie, storage, systems, and plugin wiring.
