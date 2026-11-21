/** @import { World } from '@wimaengine/ecs' */
/** @import { AppSchedule, CoreSystems } from '../core' */
/** @import { CorePlugin } from '../plugin' */
/** @import { TypeId } from '@wimaengine/type' */
import { EntityHandle } from '@wimaengine/ecs'
import { ArrayInfo, Field, MapInfo, MethodEntry, OpaqueInfo, StructInfo, TypeEntry, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid, typeidGeneric } from '@wimaengine/type'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers the core reflection metadata needed to serialize
 * {@linkcode EntityHandle} values.
 *
 * {@linkcode CorePlugin} registers this function directly as a one-shot system in
 * {@linkcode AppSchedule.Startup}.
 * The registration does not specify a system group, so it runs in that
 * schedule's default group, {@linkcode CoreSystems.Main}; {@linkcode CoreSystems.Start}
 * is the first named phase in the same startup schedule.
 *
 * When the system runs, it looks up the world's {@linkcode TypeRegistry} and
 * registers {@linkcode EntityHandle} with {@linkcode StructInfo} fields for its
 * numeric `index` and `generation`. It then adds the handle's `serialize` and
 * `deserialize` methods to the registered {@linkcode TypeEntry} through
 * `setMethod`, allowing reflection-based snapshots to encode and restore
 * handles.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .run()
 * // CorePlugin runs registerCoreTypes during Startup automatically.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry}.
 * @returns {void}
 * @category system
 */
export function registerCoreTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(EntityHandle, new StructInfo({
    index: new Field(typeid(Number)),
    generation: new Field(typeid(Number))
  }))
  registry.get(EntityHandle)?.setMethod(EntityHandle.serialize)
  registry.get(EntityHandle)?.setMethod(EntityHandle.deserialize)
}
/* eslint-enable jsdoc/check-tag-names */

/* eslint-disable jsdoc/check-tag-names */
/**
 * Registers primitive and reflection-container metadata in the world's
 * {@linkcode TypeRegistry}.
 *
 * {@linkcode CorePlugin} registers this function directly as a one-shot system in
 * {@linkcode AppSchedule.Startup} without a `systemGroup`. Because CorePlugin sets
 * {@linkcode CoreSystems.Main} as Startup's default group, this system runs in
 * {@linkcode CoreSystems.Main}, not in {@linkcode CoreSystems.Start}.
 *
 * When it runs, the system registers the primitive and typed-array
 * constructors with {@linkcode OpaqueInfo}, adds explicit `BigInt` and
 * {@linkcode TypeId} metadata, and registers the
 * typed container IDs needed by reflection: `Map<String, Number>`,
 * `Array<TypeId>`, `Array<Field>`, `Map<TypeId, TypeEntry>`, and
 * `Map<TypeId, MethodEntry>`. Their metadata uses {@linkcode MapInfo} and
 * {@linkcode ArrayInfo}; {@linkcode TypeRegistry} itself is also registered with
 * {@linkcode OpaqueInfo}.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { CorePlugin } from '@wimaengine/core'
 * import { ReflectPlugin } from '@wimaengine/reflect'
 *
 * new App()
 *   .registerPlugin(new ReflectPlugin())
 *   .registerPlugin(new CorePlugin())
 *   .run()
 * // CorePlugin runs registerPrimitiveTypes in Startup/CoreSystems.Main.
 * ```
 *
 * @param {World} world - Startup world containing the {@linkcode TypeRegistry}.
 * @returns {void}
 * @category system
 */
export function registerPrimitiveTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(String, new OpaqueInfo())
  registry.register(Number, new OpaqueInfo())
  registry.register(Boolean, new OpaqueInfo())
  registry.register(Function, new OpaqueInfo())
  registry.register(Object, new OpaqueInfo())
  registry.register(ArrayBuffer, new OpaqueInfo())
  registry.register(Int8Array, new OpaqueInfo())
  registry.register(Uint8Array, new OpaqueInfo())
  registry.register(Uint8ClampedArray, new OpaqueInfo())
  registry.register(Int16Array, new OpaqueInfo())
  registry.register(Uint16Array, new OpaqueInfo())
  registry.register(Int32Array, new OpaqueInfo())
  registry.register(Uint32Array, new OpaqueInfo())
  registry.register(Float32Array, new OpaqueInfo())
  registry.register(Float64Array, new OpaqueInfo())
  registry.register(BigInt64Array, new OpaqueInfo())
  registry.register(BigUint64Array, new OpaqueInfo())
  registry.registerTypeId(setTypeId('BigInt'), new OpaqueInfo())

  const typeIdId = setTypeId('TypeId')

  registry.registerTypeId(typeIdId, new OpaqueInfo())

  registry.get(String)?.setMethod(({ default() { return '' } }).default)
  registry.get(Number)?.setMethod(({ default() { return 0 } }).default)
  registry.get(Boolean)?.setMethod(({ default() { return false } }).default)
  registry.get(Object)?.setMethod(({ default() { return {} } }).default)
  registry.get(ArrayBuffer)?.setMethod(({ default() { return new ArrayBuffer(0) } }).default)
  registry.get(Int8Array)?.setMethod(({ default() { return new Int8Array() } }).default)
  registry.get(Uint8Array)?.setMethod(({ default() { return new Uint8Array() } }).default)
  registry.get(Uint8ClampedArray)?.setMethod(({ default() { return new Uint8ClampedArray() } }).default)
  registry.get(Int16Array)?.setMethod(({ default() { return new Int16Array() } }).default)
  registry.get(Uint16Array)?.setMethod(({ default() { return new Uint16Array() } }).default)
  registry.get(Int32Array)?.setMethod(({ default() { return new Int32Array() } }).default)
  registry.get(Uint32Array)?.setMethod(({ default() { return new Uint32Array() } }).default)
  registry.get(Float32Array)?.setMethod(({ default() { return new Float32Array() } }).default)
  registry.get(Float64Array)?.setMethod(({ default() { return new Float64Array() } }).default)
  registry.get(BigInt64Array)?.setMethod(({ default() { return new BigInt64Array() } }).default)
  registry.get(BigUint64Array)?.setMethod(({ default() { return new BigUint64Array() } }).default)
  registry.getByTypeId(setTypeId('BigInt'))?.setMethod(({ default() { return 0n } }).default)
  registry.getByTypeId(typeIdId)?.setMethod(({ default() { return '' } }).default)

  const mapStringNumberId = typeidGeneric(Map, [String, Number])
  const typeIdArrayId = setTypeId('Array<TypeId>')
  const fieldArrayId = typeidGeneric(Array, [Field])
  const typeEntryMapId = setTypeId('Map<TypeId,TypeEntry>')
  const methodEntryMapId = setTypeId(`Map<TypeId,${MethodEntry.name}>`)

  registry.registerTypeId(mapStringNumberId, new MapInfo(typeid(String), typeid(Number)))
  registry.registerTypeId(typeIdArrayId, new ArrayInfo(typeIdId))
  registry.registerTypeId(fieldArrayId, new ArrayInfo(typeid(Field)))
  registry.registerTypeId(typeEntryMapId, new MapInfo(typeIdId, typeid(TypeEntry)))
  registry.registerTypeId(methodEntryMapId, new MapInfo(typeIdId, typeid(MethodEntry)))

  registry.register(TypeRegistry, new OpaqueInfo())
}
/* eslint-enable jsdoc/check-tag-names */
