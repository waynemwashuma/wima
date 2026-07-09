---
title: Type
---

`@wimaengine/type` provides the engine's runtime identity helpers and shared type aliases for packages that need to turn constructors into stable ids.

## Installation

```sh
npm i @wimaengine/type
```

## Capability Highlights

- Derives branded `TypeId` values from runtime constructors.
- Offers an unsafe escape hatch for synthesized ids when no runtime constructor exists.
- Composes generic and function-shaped type ids from constructor lists and signature types.
- Centralizes the `Constructor`, `TupleConstructor`, `Copy`, and `Clone` typedefs used across the workspace.
- Exposes the same core surface through the package root and the `./src` subpath.

## Core Concepts

### Runtime Type Identity

`typeid()` turns a constructor into a branded `TypeId` by using the constructor name. `typeidGeneric()` extends that idea to generic-looking identities by combining a base constructor name with the names of the type arguments. When no type arguments are supplied, it falls back to the base constructor id so callers do not need a separate code path for arity zero.

### Function-Shaped Ids

`typeidFunction()` derives an identity for callable shapes from constructor information rather than from the function body. The helper formats the id from the parameter constructors and the return constructor, which keeps function identity in the same runtime-id system as class and generic ids. The `_func` argument exists to carry the function type through the type system; the runtime id itself comes from the constructor inputs.

### Unsafe Branding

`setTypeId()` exists for the cases where the runtime has no constructor to inspect, such as enums, unions, or other synthesized identities. It intentionally brands arbitrary strings as `TypeId` without validation, so it should be treated as an escape hatch rather than the default path.

### Shared Typedefs

The typedef module publishes the package's shared runtime shapes: `TypeId` as a branded string, `Constructor` as a newable runtime type, `TupleConstructor` for typed constructor tuples, and `Copy`/`Clone` for the common value-copy contracts used by other engine packages.

## Exported Surface

The package root and `./src` subpath both expose the same `core` helpers; the list below names the public symbols.

### Runtime Helpers

- `setTypeId(name)`: brands an arbitrary string as a `TypeId`.
- `typeid(type)`: derives a `TypeId` from a constructor name.
- `typeidGeneric(type, types)`: composes a generic-style `TypeId` from a base constructor and zero or more type constructors.
- `typeidFunction(_func, input, output)`: builds a function-shaped `TypeId` from parameter and return constructors.

### Typedefs

- `TypeId`: branded string type for runtime identities.
- `Constructor<T>`: constructor type alias for newable values.
- `TupleConstructor<T>`: mapped constructor tuple alias for parameter lists.
- `Copy<T>`: copy contract with `copy(value, out?)`.
- `Clone<T>`: clone contract with `clone(value)`.

## Notes

- `packages/type/index.js` re-exports `src`, and `packages/type/src/index.js` re-exports `core`, so the package keeps a very shallow export graph.
- `package.json` exposes both the package root and `./src`, with types resolving to the built declarations in `dist/`.
- This package is infrastructure for reflection and registry-style code elsewhere in the engine, so the README stays focused on the identity model instead of usage examples.
