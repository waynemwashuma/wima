# Device Feature Notes

`@wimaengine/device` is the ECS-facing browser and platform detection layer for Wima. It packages runtime environment facts as world-readable state and provides the registration plumbing needed to seed that state during app startup.

## Package Role

- Runtime environment layer for browser and platform checks.
- ECS integration package rather than a direct DOM, input, or rendering API.
- Shared source of truth for device state used by higher-level engine packages.
- Small public surface with a root entry point and a `./src` entry point.

## Capability Highlights

- Captures browser-specific metadata for feature detection.
- Captures platform-level environment details for branching logic.
- Exposes device state as an ECS resource for downstream systems.
- Includes plugin and systems wiring so the resource can be registered consistently.
- Depends on `@wimaengine/app`, `@wimaengine/core`, `@wimaengine/ecs`, `@wimaengine/reflect`, and `@wimaengine/type`, which places it on the engine's runtime and type-registration path.
- Ships as an ES module package with generated type declarations.

## Core Concepts

### Browser

The browser concept covers browser-specific facts that other packages can use when they need to branch on features or runtime behavior. Future README copy should keep this focused on environment metadata, not DOM manipulation.

### Platform

The platform concept represents host-level environment information. It is distinct from browser metadata and should be described that way so readers understand the package separates user agent-style details from broader platform checks.

### Device Resource

The device resource is the ECS-visible snapshot of the resolved runtime device state. It lets systems read environment information from the world instead of coupling directly to detection code.

### Plugin and Systems

The plugin and systems layer is the package's integration glue. Its job is to register device state with the runtime so the resource is available when the app starts and remains aligned with the ECS world.

## Notes For Future README Drafts

- Lead with "browser and platform detection" before using the package name alone.
- Frame the package as runtime environment infrastructure, not a feature domain with user-facing behavior.
- Mention the ECS resource model early so readers understand why the package depends on app, core, ecs, reflect, and type.
- Keep the distinction between browser facts, platform facts, and the device resource explicit.
- Call out the two entry points, `.` and `./src`, if the README discusses package boundaries or architecture.
- Keep the README concise; this package appears to be a thin integration layer, so a long walkthrough would overstate its scope.
