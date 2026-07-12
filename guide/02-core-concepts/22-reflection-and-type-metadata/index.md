---
title: Reflection and type metadata
---

This chapter is about the metadata layer that lets ECS state stay descriptive at runtime. It connects constructors, component ids, and snapshot-friendly type information.

## The Two Type Layers

The ECS side and the reflection side solve different problems:

- `TypeStore` in [World](../13-world/index.md) maps constructors to compact component ids and stores `ComponentInfo`
- `TypeRegistry` in `@wimaengine/reflect` maps type ids to richer `TypeEntry` records and `TypeInfo` shapes

`TypeStore` is about ECS bookkeeping. `TypeRegistry` is about describing the type itself.

## Runtime Identity

`@wimaengine/type` is the bridge between constructors and type ids. `typeid()` turns a constructor into a stable `TypeId`, `typeidGeneric()` builds generic-looking ids from constructor lists, and `setTypeId()` exists for synthetic cases where no runtime constructor exists.

That is why the engine can talk about `EntityHandle`, `Array<Field>`, or `Map<TypeId, MethodEntry>` at runtime without falling back to ad hoc strings.

## TypeInfo Shapes

`@wimaengine/reflect` provides the actual metadata forms:

- `OpaqueInfo` for values that are treated as atomic
- `StructInfo` for named fields
- `EnumInfo` for named numeric variants
- `FunctionInfo` for callable signatures
- `ArrayInfo`, `SetInfo`, `MapInfo`, and `TupleInfo` for container and tuple shapes

```js
registry.register(EntityHandle, new StructInfo({
  index: new Field(typeid(Number)),
  generation: new Field(typeid(Number))
}))
```

That is the pattern used by `registerCoreTypes()` in the core package: register the type, describe its shape, and attach methods when the type needs custom runtime behavior.

## Why Snapshots Depend On This

Snapshot code and scene loading need a way to ask, "what is this value?" without hard-coding every package's classes. Reflection metadata gives them that answer.

When a type entry also exposes methods like `serialize`, `deserialize`, `toSnapshot`, `fromSnapshot`, `clone`, or `patch`, higher-level systems can move data between live ECS state and serialized data without guessing at the value's shape.

That is the connection to [Snapshots](../25-snapshots/index.md): reflection tells snapshot code how to read and rebuild state.
