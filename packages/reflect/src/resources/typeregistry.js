/** @import { TypeId, Constructor } from '@wimaengine/type' */
/** @import { TypeInfoSerial } from '../core' */
/** @import { ReflectPlugin } from '../plugin' */
import { setTypeId, typeid } from '@wimaengine/type'
import {
  ArrayInfo,
  EnumInfo,
  FunctionInfo,
  MapInfo,
  OpaqueInfo,
  SetInfo,
  StructInfo,
  TupleInfo,
  TypeInfo
} from '../core'

/* eslint-disable jsdoc/check-tag-names */
/**
 * World resource that stores reflection metadata keyed by a stable type ID.
 *
 * A registry is installed by {@linkcode ReflectPlugin}. Use
 * {@linkcode TypeRegistry#register} when a runtime constructor represents the
 * type, or {@linkcode TypeRegistry#registerTypeId} for enums, function
 * signatures, generic types, and other types that need an explicit ID. Each
 * entry contains its {@linkcode TypeInfo} and can also retain the
 * constructor used during registration.
 *
 * {@linkcode TypeRegistry#get} and {@linkcode TypeRegistry#getByTypeId} return a
 * {@linkcode TypeEntry} or `undefined`. Registering an ID replaces its existing
 * entry; the matching `unregister` methods remove it.
 *
 * Serialization produces an object keyed by type ID and stores each entry's
 * type-info serial form. Constructor functions are not serialized, so entries
 * restored with {@linkcode TypeRegistry.deserialize} contain metadata without a
 * `constructorFn` unless a constructor is registered again.
 *
 * @example
 * ```js
 * import { App } from '@wimaengine/app'
 * import { OpaqueInfo, ReflectPlugin, TypeRegistry } from '@wimaengine/reflect'
 *
 * class MainWorld {}
 * class SaveData {}
 *
 * const app = new App()
 * app
 *   .setWorld(MainWorld)
 *   .defaultWorld(MainWorld)
 *   .registerPlugin(new ReflectPlugin())
 *   .setRunner(() => {})
 *   .run()
 *
 * const registry = app.getWorld().getResource(TypeRegistry)
 * registry.register(SaveData, OpaqueInfo.default())
 * const entry = registry.get(SaveData)
 * ```
 *
 * @category resource
 */
export class TypeRegistry {

  /**
   * @private
   * @type {Map<TypeId,TypeEntry>}
   */
  inner = new Map()

  /**
   * Registers metadata under the type ID derived from a runtime constructor.
   * The resulting {@linkcode TypeEntry} retains `type` as its `constructorFn`.
   * Registering the same constructor again replaces its existing entry.
   *
   * @template T
   * @param {Constructor<T>} type
   * @param {TypeInfo} info
   * @returns {void}
   */
  register(type, info) {
    const typeId = typeid(type)

    this.registerTypeId(typeId, info, type)
  }

  /**
   * Registers metadata under an explicit type ID.
   *
   * Use this for types without a runtime constructor, such as enums, or when
   * the type ID is composed manually. A supplied constructor is retained on
   * the resulting {@linkcode TypeEntry}; registering an existing ID replaces its
   * entry.
   *
   * @param {TypeId} typeId
   * @param {TypeInfo} info
   * @param {Constructor | undefined} [constructorFn]
   * @returns {void}
   */
  registerTypeId(typeId, info, constructorFn) {
    const entry = new TypeEntry(info, constructorFn)

    this.inner.set(typeId, entry)
  }

  /**
   * Removes the entry registered for a runtime constructor, if present.
   *
   * @template T
   * @param {Constructor<T>} type
   * @returns {void}
   */
  unregister(type) {
    const typeId = typeid(type)

    this.unregisterTypeId(typeId)
  }

  /**
   * Removes the entry registered for an explicit type ID, if present.
   *
   * @param {TypeId} typeId
   * @returns {void}
   */
  unregisterTypeId(typeId) {
    this.inner.delete(typeId)
  }

  /**
   * Looks up the metadata entry for a runtime constructor.
   *
   * @template T
   * @param {Constructor<T>} type
   * @returns {TypeEntry | undefined} The registered entry or `undefined` if absent.
   */
  get(type) {
    return this.getByTypeId(typeid(type))
  }

  /**
   * Looks up the metadata entry for an explicit type ID.
   *
   * @param {TypeId} typeId
   * @returns {TypeEntry | undefined} The registered entry or `undefined` if absent.
   */
  getByTypeId(typeId) {
    return this.inner.get(typeId)
  }

  /**
   * Serializes a registry's type metadata into a type-ID keyed object.
   * Constructor functions and runtime method registrations are not included;
   * only each entry's {@linkcode TypeInfo} serial form is written.
   *
   * @param {TypeRegistry} value
   * @returns {TypeRegistrySerial}
   */
  static serialize(value) {

    /** @type {TypeRegistrySerial} */
    const serial = {}

    for (const [typeId, entry] of value.inner) {
      serial[typeId] = entry.serialize()
    }

    return serial
  }

  /**
   * Restores type metadata from a serialized registry.
   *
   * `out` is cleared before the serialized entries are added. If it is not
   * supplied, a new registry is created. Deserialized entries do not have
   * constructor functions because constructors are not part of the serial
   * format.
   *
   * @param {TypeRegistrySerial} value
   * @param {TypeRegistry} [out]
   * @returns {TypeRegistry}
   * @throws {TypeError} If an entry contains an unsupported type-info serial.
   */
  static deserialize(value, out = new TypeRegistry()) {
    out.inner.clear()

    for (const [typeId, info] of Object.entries(value)) {
      out.registerTypeId(setTypeId(typeId), TypeEntry.deserialize(info))
    }

    return out
  }

  /**
   * Checks whether a value has the supported serialized registry shape.
   *
   * @param {unknown} value
   * @returns {value is TypeRegistrySerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return false
    }

    for (const info of Object.values(value)) {
      if (!TypeEntry.validateSerial(info)) {
        return false
      }
    }

    return true
  }
}

/* eslint-enable jsdoc/check-tag-names */
/**
 * Registry entry that groups reflection metadata and runtime method hooks for
 * one registered type.
 *
 * {@linkcode TypeRegistry} creates one entry for each registered type ID. The
 * entry keeps the exact {@linkcode TypeInfo} instance supplied to its
 * constructor; it does not clone the metadata. `constructorFn` is optional
 * because entries registered by an explicit type ID do not need a runtime
 * constructor, and deserialized entries never restore one.
 *
 * Methods are process-local hooks keyed by each function's `name`. Register a
 * hook with {@linkcode TypeEntry#setMethod}, inspect one with
 * {@linkcode TypeEntry#getMethod}, or invoke one with {@linkcode TypeEntry#call}. A
 * missing method is not an error: `getMethod` returns `undefined` and `call`
 * also returns `undefined` without invoking a function. Methods and
 * `constructorFn` are not included by {@linkcode TypeEntry#serialize};
 * serialization only delegates to the stored {@linkcode TypeInfo}. Attributes
 * are process-local metadata as well and are not included in the type-info
 * serial form.
 *
 * @example
 * ```js
 * import { OpaqueInfo, TypeEntry } from '@wimaengine/reflect'
 *
 * class SaveData {}
 * const info = OpaqueInfo.default()
 * const entry = new TypeEntry(info, SaveData)
 *
 * entry.setMethod(function describe(value) {
 *   return value.constructor.name
 * })
 *
 * entry.info === info // true: the metadata reference is retained
 * entry.call('describe', [new SaveData()]) // 'SaveData'
 * entry.getMethod('missing') // undefined
 * entry.call('missing', []) // undefined
 * entry.serialize() // { kind: 'opaque' }
 * ```
 */
export class TypeEntry {

  /**
   * Reflection metadata associated with this entry. The reference is retained
   * as supplied; it is not copied when the entry is constructed.
   *
   * @type {TypeInfo}
   */
  info

  /**
   * Runtime constructor associated with the type, when one is available.
   * Explicit type-ID registrations and deserialized entries may leave this
   * value `undefined`.
   *
   * @type {Constructor | undefined}
   */
  constructorFn

  /**
   * @private
   * @type {Map<string, MethodEntry>}
   */
  methods = new Map()

  /**
   * Metadata objects keyed by their attribute type ID.
   *
   * @private
   * @type {Map<TypeId, object>}
   */
  attributes = new Map()

  /**
   * Creates an entry around type metadata and an optional runtime constructor.
   *
   * @param {TypeInfo} info
   * @param {Constructor | undefined} [constructorFn]
   */
  constructor(info, constructorFn) {
    this.info = info
    this.constructorFn = constructorFn
  }

  /**
   * Serializes only the stored type metadata.
   *
   * Runtime constructors and methods are process-local references, so they are
   * omitted from the result. The returned value is the result of calling
   * {@linkcode TypeInfo.serialize} on `info`.
   *
   * @returns {TypeInfoSerial}
   */
  serialize() {
    return this.info.serialize()
  }

  /**
   * @param {TypeInfo} value
   * @returns {TypeInfoSerial}
   * @throws {TypeError} If `value` is not a supported `TypeInfo` subtype.
   */
  static serialize(value) {
    if (value instanceof OpaqueInfo) {
      return OpaqueInfo.serialize(value)
    }

    if (value instanceof StructInfo) {
      return StructInfo.serialize(value)
    }

    if (value instanceof EnumInfo) {
      return EnumInfo.serialize(value)
    }

    if (value instanceof FunctionInfo) {
      return FunctionInfo.serialize(value)
    }

    if (value instanceof ArrayInfo) {
      return ArrayInfo.serialize(value)
    }

    if (value instanceof SetInfo) {
      return SetInfo.serialize(value)
    }

    if (value instanceof MapInfo) {
      return MapInfo.serialize(value)
    }

    if (value instanceof TupleInfo) {
      return TupleInfo.serialize(value)
    }

    throw new TypeError(`Unsupported TypeInfo: ${value?.constructor?.name || 'unknown'}`)
  }

  /**
   * @param {TypeInfoSerial} value
   * @param {TypeInfo} [out]
   * @returns {TypeInfo}
   * @throws {TypeError} If `value` is not a supported `TypeInfoSerial` kind.
   */
  static deserialize(value, out) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value)) {
      throw new TypeError('Unsupported TypeInfo serial kind')
    }

    switch (value.kind) {
      case 'opaque':
        return out instanceof OpaqueInfo ?
          OpaqueInfo.deserialize(value, out) :
          OpaqueInfo.deserialize(value)

      case 'struct':
        return out instanceof StructInfo ?
          StructInfo.deserialize(value, out) :
          StructInfo.deserialize(value)

      case 'enum':
        return out instanceof EnumInfo ?
          EnumInfo.deserialize(value, out) :
          EnumInfo.deserialize(value)

      case 'function':
        return out instanceof FunctionInfo ?
          FunctionInfo.deserialize(value, out) :
          FunctionInfo.deserialize(value)

      case 'array':
        return out instanceof ArrayInfo ?
          ArrayInfo.deserialize(value, out) :
          ArrayInfo.deserialize(value)

      case 'set':
        return out instanceof SetInfo ?
          SetInfo.deserialize(value, out) :
          SetInfo.deserialize(value)

      case 'map':
        return out instanceof MapInfo ?
          MapInfo.deserialize(value, out) :
          MapInfo.deserialize(value)

      case 'tuple':
        return out instanceof TupleInfo ?
          TupleInfo.deserialize(value, out) :
          TupleInfo.deserialize(value)

      default:
        throw new TypeError('Unsupported TypeInfo serial kind')
    }
  }

  /**
   * @param {unknown} value
   * @returns {value is TypeInfoSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value)) {
      return false
    }

    switch (value.kind) {
      case 'opaque':
        return OpaqueInfo.validateSerial(value)

      case 'struct':
        return StructInfo.validateSerial(value)

      case 'enum':
        return EnumInfo.validateSerial(value)

      case 'function':
        return FunctionInfo.validateSerial(value)

      case 'array':
        return ArrayInfo.validateSerial(value)

      case 'set':
        return SetInfo.validateSerial(value)

      case 'map':
        return MapInfo.validateSerial(value)

      case 'tuple':
        return TupleInfo.validateSerial(value)

      default:
        return false
    }
  }

  /**
   * Invokes a registered method by its exact name.
   *
   * `args` is spread into the registered function in order. If no method is
   * registered under `name`, nothing is invoked and `undefined` is returned.
   * A registered method that returns `undefined` has the same return value, so
   * use {@linkcode TypeEntry#getMethod} to distinguish a missing method
   * from a method that returned `undefined`.
   *
   * @template {unknown[]} T
   * @param {string} name
   * @param {[...T]} [args] - Arguments passed to the registered function.
   * @returns {unknown}
   */
  call(name, args) {
    const method = this.getMethod(name)

    if (method) {
      return method.call(args)
    }

    return undefined

  }

  /**
   * Returns the method registered under an exact function name, if any.
   *
   * The lookup does not derive a name from an alias or constructor; it uses the
   * same `Function.name` value that {@linkcode TypeEntry#setMethod} used
   * when the method was registered.
   *
   * @param {string} name
   * @returns {MethodEntry | undefined}
   */
  getMethod(name) {
    return this.methods.get(name)
  }

  /**
   * Registers a function under its `name` property.
   *
   * Registering another function with the same name replaces the previous
   * method. The function reference is wrapped in a {@linkcode MethodEntry} for
   * later calls; it is not copied or serialized.
   *
   * @param {Function} method
   * @returns {void}
   */
  setMethod(method) {
    this.methods.set(method.name, new MethodEntry(method))
  }

  /**
   * Returns the live map of registered methods.
   *
   * Keys are the functions' `name` values and values are the corresponding
   * {@linkcode MethodEntry} wrappers. The returned map is the entry's actual map,
   * so changes made through it affect subsequent lookups and calls.
   *
   * @returns {Map<string, MethodEntry>}
   */
  getMethods() {
    return this.methods
  }

  /**
   * Registers an attribute under an explicit type ID.
   *
   * Registering another value under the same type ID replaces the previous
   * attribute. The value is retained by reference and is not cloned.
   *
   * @template {object} T
   * @param {TypeId} typeId
   * @param {T} attribute
   * @returns {this}
   */
  setAttributeByTypeId(typeId, attribute) {
    this.attributes.set(typeId, attribute)

    return this
  }

  /**
   * Registers an attribute using the runtime constructor's type ID.
   *
   * Attribute values are non-null objects with a runtime constructor.
   * Plain objects are therefore keyed as `Object`; use
   * {@linkcode TypeEntry#setAttributeByTypeId} when an explicit attribute type
   * ID is required.
   *
   * @template {object} T
   * @param {T} attribute
   * @returns {this}
   */
  setAttribute(attribute) {

    // SAFETY: The generic constraint guarantees a non-null object attribute.
    return this.setAttributeByTypeId(
      typeid(/** @type {Constructor<T>} */ (attribute.constructor)),
      attribute
    )
  }

  /**
   * Returns an attribute by explicit type ID.
   *
   * @template {object} T
   * @param {TypeId} typeId
   * @returns {T | undefined}
   */
  getAttributeByTypeId(typeId) {
    return /** @type {T | undefined} */ (this.attributes.get(typeId))
  }

  /**
   * Returns an attribute by its runtime constructor.
   *
   * @template {object} T
   * @param {Constructor<T>} type
   * @returns {T | undefined}
   */
  getAttribute(type) {
    return this.getAttributeByTypeId(typeid(type))
  }

  /**
   * Checks whether an attribute is registered under an explicit type ID.
   *
   * @param {TypeId} typeId
   * @returns {boolean}
   */
  hasAttributeByTypeId(typeId) {
    return this.attributes.has(typeId)
  }

  /**
   * Checks whether an attribute is registered for a runtime constructor.
   *
   * @param {Constructor} type
   * @returns {boolean}
   */
  hasAttribute(type) {
    return this.hasAttributeByTypeId(typeid(type))
  }

  /**
   * Removes an attribute registered under an explicit type ID.
   *
   * @param {TypeId} typeId
   * @returns {boolean} Whether an attribute was removed.
   */
  removeAttributeByTypeId(typeId) {
    return this.attributes.delete(typeId)
  }

  /**
   * Removes an attribute registered for a runtime constructor.
   *
   * @param {Constructor} type
   * @returns {boolean} Whether an attribute was removed.
   */
  removeAttribute(type) {
    return this.removeAttributeByTypeId(typeid(type))
  }
}

/**
 * Entry that wraps one function registered as runtime behavior for a
 * {@linkcode TypeEntry}.
 *
 * A method entry retains the original function reference. The
 * {@linkcode MethodEntry#call} method invokes that function with an optional
 * positional argument list; the
 * wrapper does not add serialization or lookup metadata of its own.
 *
 * @example
 * ```js
 * function add(a, b) {
 *   return a + b
 * }
 *
 * const method = new MethodEntry(add)
 * method.method === add // true
 * method.call([2, 3]) // 5
 * ```
 */
export class MethodEntry {

  /**
   * The function invoked by {@linkcode MethodEntry#call}.
   *
   * @type {Function}
   */
  method

  /**
   * Creates a method entry around a function reference.
   *
   * @param {Function} method
   */
  constructor(method) {
    this.method = method
  }

  /**
   * Calls the stored function with `args` spread as positional arguments.
   *
   * Omitting `args` invokes the function with no arguments. The return value
   * and thrown errors come directly from the stored function.
   *
   * @template {unknown[]} T
   * @param {[...T]} [args]
   * @returns {unknown}
   */
  call(args) {
    return this.method(...(args || []))
  }
}

/**
 * @typedef {Record<string, TypeInfoSerial>} TypeRegistrySerial
 */
