/** @import { TypeId } from '@wimaengine/type' */

/**
 * Defines the base contract for serializable reflection metadata.
 *
 * Concrete metadata classes such as {@linkcode OpaqueInfo}, {@linkcode StructInfo},
 * and {@linkcode EnumInfo} provide metadata-specific serialization,
 * deserialization, and validation. This base class defines no serial shape:
 * its instance and static hooks throw a {@linkcode TypeError} until a concrete
 * subtype implements the operation.
 *
 * @example
 * ```js
 * TypeInfo.serialize(new TypeInfo())
 * // throws TypeError: TypeInfo is abstract and cannot be serialized directly
 * ```
 */
export class TypeInfo {

  /**
   * Serializes this metadata through the base contract.
   *
   * Concrete metadata classes override this method with a subtype-specific
   * serial shape. Calling the inherited method directly delegates to the
   * abstract {@linkcode TypeInfo.serialize} implementation and throws.
   *
   * @returns {TypeInfoSerial}
   * @throws {TypeError} If this method is used without a concrete subtype implementation.
   */
  serialize() {
    return /** @type {TypeInfoSerial} */ (/** @type {unknown} */ (TypeInfo.serialize(this)))
  }

  /**
   * Abstract serialization hook for reflection metadata.
   *
   * This base implementation never returns a serial value. Concrete
   * subclasses should override it with their own serial shape.
   *
   * @param {TypeInfo} _value
   * @throws {TypeError} Always; `TypeInfo` is abstract and cannot be serialized directly.
   */
  static serialize(_value) {
    throw new TypeError('TypeInfo is abstract and cannot be serialized directly')
  }

  /**
   * Abstract deserialization hook for reflection metadata.
   *
   * Concrete subclasses use the serial value to create or update metadata.
   * The base implementation does not inspect either argument and always
   * throws.
   *
   * @param {TypeInfoSerial} _value
   * @param {TypeInfo} [_out]
   * @throws {TypeError} Always; `TypeInfo` is abstract and cannot be deserialized directly.
   */
  static deserialize(_value, _out) {
    throw new TypeError('TypeInfo is abstract and cannot be deserialized directly')
  }

  /**
   * Abstract serial-shape validator for reflection metadata.
   *
   * Concrete subclasses return a boolean type guard for their own serial
   * shape. The base implementation does not validate the value and always
   * throws.
   *
   * @param {unknown} _value
   * @throws {TypeError} Always; `TypeInfo` is abstract and cannot validate serials directly.
   */
  static validateSerial(_value) {
    throw new TypeError('TypeInfo is abstract and cannot validate serials directly')
  }

  /**
   * Abstract serial-shape validator alias contract for reflection metadata.
   *
   * Concrete subclasses may provide their own implementation. This base
   * implementation does not validate the value and always throws, just like
   * {@linkcode TypeInfo.validateSerial}.
   *
   * @param {unknown} _value
   * @throws {TypeError} Always; `TypeInfo` is abstract and cannot validate serials directly.
   */
  static validSerial(_value) {
    throw new TypeError('TypeInfo is abstract and cannot validate serials directly')
  }
}

/**
 * Describes one typed field in structured reflection metadata.
 *
 * A field associates the registered {@linkcode TypeId} for a value with whether
 * the field may be omitted. Its serial form is always an object with `type`
 * and `optional` properties.
 *
 * @example
 * ```js
 * const required = new Field('position')
 * const optional = new Field('velocity', true)
 *
 * required.serialize() // { type: 'position', optional: false }
 * optional.serialize() // { type: 'velocity', optional: true }
 * ```
 */
export class Field {

  /**
   * Registered type ID expected for this field's value.
   *
   * @type {TypeId}
   */
  type

  /**
   * Whether this field may be omitted. The constructor defaults this to
   * `false`, so fields are required unless explicitly marked optional.
   *
   * @type {boolean}
   */
  optional

  /**
   * Creates a field descriptor.
   *
   * @param {TypeId} type
   * @param {boolean} [optional=false] - Whether the field may be omitted.
   */
  constructor(type, optional = false) {
    this.type = type
    this.optional = optional
  }

  /**
   * Serializes this descriptor as its current `type` and `optional` values.
   * No validation or copying of the type ID is performed.
   *
   * @returns {FieldSerial}
   */
  serialize() {
    return Field.serialize(this)
  }

  /**
   * Converts a field descriptor to a plain serial object.
   *
   * The returned object contains exactly `{ type: value.type, optional:
   * value.optional }`.
   *
   * @param {Field} value
   * @returns {FieldSerial}
   */
  static serialize(value) {
    return {
      type: value.type,
      optional: value.optional
    }
  }

  /**
   * Deserializes a field serial into a {@linkcode Field} instance.
   *
   * When `out` is omitted, a new `Field` is created with the serial's values.
   * When `out` is supplied, its `type` and `optional` properties are replaced
   * in place and the same instance is returned. This method assigns the
   * supplied properties directly and does not call
   * {@linkcode Field.validateSerial}.
   *
   * @param {FieldSerial} value
   * @param {Field} [out]
   * @returns {Field}
   */
  static deserialize(value, out = new Field(value.type, value.optional)) {
    out.type = value.type
    out.optional = value.optional

    return out
  }

  /**
   * Checks whether a value has the serialized field descriptor shape.
   *
   * Returns `true` only for a non-null, non-array object with `type` and
   * `optional` properties whose values are a string and boolean respectively.
   * Extra properties are allowed; this method does not create a `Field`.
   *
   * @param {unknown} value
   * @returns {value is FieldSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('type' in value) || !('optional' in value)) {
      return false
    }

    return typeof value.type === 'string' && typeof value.optional === 'boolean'
  }

}

/**
 * Describes metadata for a reflected type with an intentionally opaque
 * structure.
 *
 * Opaque metadata records only the `opaque` kind. It does not describe fields
 * or validate values of the reflected type. Use {@linkcode OpaqueInfo.default}
 * for the standard metadata instance.
 *
 * @example
 * ```js
 * import { OpaqueInfo } from '@wimaengine/reflect'
 *
 * const info = OpaqueInfo.default()
 * info.serialize() // { kind: 'opaque' }
 * OpaqueInfo.validateSerial({ kind: 'opaque' }) // true
 * ```
 */
export class OpaqueInfo extends TypeInfo {

  /**
   * Returns the opaque metadata serial for this instance.
   *
   * The instance has no fields to inspect, so serialization always returns a
   * new object with only `kind: 'opaque'`.
   *
   * @returns {OpaqueInfoSerial}
   */
  serialize() {
    return OpaqueInfo.serialize(this)
  }

  /**
   * Serializes opaque metadata.
   *
   * The supplied instance is not inspected because all `OpaqueInfo` instances
   * have the same serial form.
   *
   * @param {OpaqueInfo} _value
   * @returns {OpaqueInfoSerial}
   */
  static serialize(_value) {
    return {
      kind: 'opaque'
    }
  }

  /**
   * Creates the default opaque metadata instance.
   *
   * @returns {OpaqueInfo}
   */
  static default() {
    return new OpaqueInfo()
  }

  /**
   * Restores opaque metadata into an instance.
   *
   * Opaque metadata has no state to restore, so this method returns the
   * supplied `out` instance unchanged, or creates and returns a new instance.
   * It does not inspect `_value`; callers should validate the serial first.
   *
   * @param {OpaqueInfoSerial} _value
   * @param {OpaqueInfo} [out]
   * @returns {OpaqueInfo}
   */
  static deserialize(_value, out = new OpaqueInfo()) {
    return out
  }

  /**
   * Checks whether a value has the opaque metadata serial shape.
   *
   * Validation accepts a non-null, non-array object whose `kind` property is
   * exactly `'opaque'`. It validates metadata shape, not a runtime value, and
   * permits additional properties on the serial object.
   *
   * @param {unknown} value
   * @returns {value is OpaqueInfoSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value)) {
      return false
    }

    return value.kind === 'opaque'
  }
}

/**
 * Describes the named fields in structured reflection metadata.
 *
 * The constructor turns a field record into ordered metadata: each property
 * name is mapped to the corresponding {@linkcode Field} position in `fields`.
 * Look up metadata by name with {@linkcode StructInfo#get}, by position with
 * {@linkcode StructInfo#getByIndex}, or inspect the complete field layout with
 * the other accessors. The record's property order becomes the field order
 * used by serialization and index lookups.
 *
 * @example
 * ```js
 * import { Field, StructInfo } from '@wimaengine/reflect'
 * import { typeid } from '@wimaengine/type'
 *
 * const info = new StructInfo({
 *   id: new Field(typeid(Number)),
 *   label: new Field(typeid(String), true)
 * })
 *
 * info.get('id') === info.getByIndex(0) // true
 * info.size() // 2
 * info.serialize() // { kind: 'struct', fields: ... }
 * ```
 */
export class StructInfo extends TypeInfo {

  /**
   * Maps each field name to its zero-based position in `fields`.
   *
   * @private
   * @type {Map<string,number>}
   */
  names = new Map()

  /**
   * Stores field metadata in the same insertion order used by `names`.
   *
   * @private
   * @type {Field[]}
   */
  fields = []

  /**
   * Creates structured metadata from a name-to-field record.
   *
   * Property insertion order determines each field's index. The record is
   * read immediately; later changes to it do not change this metadata.
   *
   * @param {Record<string,Field>} record
   */
  constructor(record) {
    super()

    for (const [name, value] of Object.entries(record)) {
      const position = this.fields.length

      this.names.set(name, position)
      this.fields.push(value)
    }
  }

  /**
   * Returns the field metadata registered under a name.
   *
   * @param {string} name
   * @returns {Field | undefined} The field, or `undefined` when the name is not registered.
   */
  get(name) {
    const index = this.names.get(name)

    if (index === undefined) return undefined

    return this.getByIndex(index)
  }

  /**
   * Returns the field metadata at a zero-based position.
   *
   * @param {number} index
   * @returns {Field | undefined} The field at the position, or `undefined` outside the field array.
   */
  getByIndex(index) {
    return this.fields[index]
  }

  /**
   * Returns the internal ordered field array.
   *
   * The returned array is live, so callers that need to preserve the metadata
   * layout should treat it as read-only.
   *
   * @returns {Field[]}
   */
  getFields() {
    return this.fields
  }

  /**
   * Returns an iterator over field names in insertion order.
   *
   * @returns {MapIterator<string>}
   */
  fieldNames() {
    return this.names.keys()
  }

  /**
   * Returns the number of fields in the metadata.
   *
   * @returns {number}
   */
  size() {
    return this.fields.length
  }

  /**
   * Serializes the ordered field metadata into a named field record.
   *
   * @returns {StructInfoSerial}
   */
  serialize() {
    return StructInfo.serialize(this)
  }

  /**
   * Creates empty structured metadata.
   *
   * @returns {StructInfo}
   */
  static default() {
    return new StructInfo({})
  }

  /**
   * Serializes structured metadata, including each field's type ID and
   * optional flag.
   *
   * @param {StructInfo} value
   * @returns {StructInfoSerial}
   */
  static serialize(value) {

    /** @type {Record<string, FieldSerial>} */
    const fields = {}

    for (const name of value.fieldNames()) {
      const field = value.get(name)

      if (field !== undefined) {
        fields[name] = Field.serialize(field)
      }
    }

    return {
      kind: 'struct',
      fields
    }
  }

  /**
   * Restores structured metadata from its serialized field record.
   *
   * The target instance is cleared and repopulated in serialized property
   * order. Pass `out` to reuse an existing instance; otherwise a new empty
   * `StructInfo` is created. The serial is assumed to have been validated.
   *
   * @param {StructInfoSerial} value
   * @param {StructInfo} [out]
   * @returns {StructInfo}
   */
  static deserialize(value, out = new StructInfo({})) {
    out.names.clear()
    out.fields.length = 0

    for (const [name, fieldSerial] of Object.entries(value.fields)) {
      out.names.set(name, out.fields.length)
      out.fields.push(Field.deserialize(fieldSerial))
    }

    return out
  }

  /**
   * Checks whether a value has the structured metadata serial shape.
   *
   * Validation requires a non-null, non-array object with `kind: 'struct'` and
   * a non-null, non-array `fields` object. Every field entry must pass
   * {@linkcode Field.validateSerial}.
   *
   * @param {unknown} value
   * @returns {value is StructInfoSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value) || !('fields' in value)) {
      return false
    }

    if (value.kind !== 'struct' ||
      typeof value.fields !== 'object' ||
      value.fields === null ||
      Array.isArray(value.fields)) {
      return false
    }

    for (const field of Object.values(value.fields)) {
      if (!Field.validateSerial(field)) {
        return false
      }
    }

    return true
  }
}

/**
 * Describes the named numeric variants in enum reflection metadata.
 *
 * `EnumInfo` stores each variant name with its numeric discriminant. It is
 * reflection metadata only: it does not hold an enum value or enforce how a
 * runtime value uses the discriminants. Its serialized form is an object with
 * `kind: 'enum'` and a `variants` record.
 *
 * @example
 * ```js
 * const info = new EnumInfo({ Idle: 0, Running: 1 })
 * info.get('Running') // 1
 * info.serialize() // { kind: 'enum', variants: { Idle: 0, Running: 1 } }
 * ```
 */
export class EnumInfo extends TypeInfo {

  /**
   * Maps each enum variant name to its numeric discriminant.
   *
   * The map preserves the variant order copied from the constructor record.
   * Use {@linkcode EnumInfo#get} for one variant, {@linkcode EnumInfo#getVariants}
   * for names, or iterate the instance for name/discriminant pairs.
   *
   * @type {Map<string,number>}
   */
  variants

  /**
   * Creates enum reflection metadata from variant names and discriminants.
   *
   * The record is copied into a new map; later changes to the record do not
   * change this metadata. `EnumInfo` has no default factory, so provide the
   * complete variant record when constructing it.
   *
   * @param {Record<string,number>} variants
   */
  constructor(variants) {
    super()
    const map = new Map()

    for (const variant in variants) {
      map.set(variant, variants[variant])
    }

    this.variants = map
  }

  /**
   * Returns the numeric discriminant for a variant name.
   *
   * @param {string} variant
   * @returns {number | undefined} The discriminant, or `undefined` when the
   * variant is not registered.
   */
  get(variant) {
    return this.variants.get(variant)
  }

  /**
   * Returns an iterator over variant names in metadata order.
   *
   * @returns {Iterable<string>}
   */
  getVariants() {
    return this.variants.keys()
  }

  /**
   * Iterates over `[variant, discriminant]` pairs in metadata order.
   *
   * @returns {MapIterator<[string,number]>}
   */
  [Symbol.iterator]() {
    return this.variants.entries()
  }

  /**
   * Serializes this metadata as an enum kind with a plain variant record.
   *
   * The serial contains exactly `{ kind: 'enum', variants }`, where each
   * variant name maps to its numeric discriminant.
   *
   * @returns {EnumInfoSerial}
   */
  serialize() {
    return EnumInfo.serialize(this)
  }

  /**
   * Serializes enum metadata without mutating the source instance.
   *
   * `variants` is converted from the internal map to a plain object. For
   * example, `new EnumInfo({ Idle: 0, Running: 1 }).serialize()` returns
   * `{ kind: 'enum', variants: { Idle: 0, Running: 1 } }`.
   *
   * @param {EnumInfo} value
   * @returns {EnumInfoSerial}
   */
  static serialize(value) {
    return {
      kind: 'enum',
      variants: Object.fromEntries(value.variants)
    }
  }

  /**
   * Restores enum metadata from a serialized variant record.
   *
   * Without `out`, this creates a new instance. With `out`, it clears the
   * existing variant map, copies the serialized entries in order, and returns
   * the same instance. The serial is assumed to have been validated first.
   *
   * @param {EnumInfoSerial} value
   * @param {EnumInfo} [out]
   * @returns {EnumInfo}
   */
  static deserialize(value, out = new EnumInfo(value.variants)) {
    out.variants.clear()

    for (const [variant, discriminant] of Object.entries(value.variants)) {
      out.variants.set(variant, discriminant)
    }

    return out
  }

  /**
   * Checks whether a value has the serialized enum metadata shape.
   *
   * Validation requires a non-null, non-array object with `kind: 'enum'` and a
   * non-null, non-array `variants` object whose values are all numbers. Extra
   * properties are allowed; this method validates the serial shape and does
   * not create an `EnumInfo`.
   *
   * @param {unknown} value
   * @returns {value is EnumInfoSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value) || !('variants' in value)) {
      return false
    }

    if (value.kind !== 'enum' ||
      typeof value.variants !== 'object' ||
      value.variants === null ||
      Array.isArray(value.variants)) {
      return false
    }

    for (const discriminant of Object.values(value.variants)) {
      if (typeof discriminant !== 'number') {
        return false
      }
    }

    return true
  }
}

/**
 * Describes the parameter and return type IDs in function reflection metadata.
 *
 * `FunctionInfo` records parameter types in call order and one return type;
 * it describes a function signature rather than a callable function. Its
 * serialized form is an object with `kind: 'function'`, a `parameterTypes`
 * array, and a `returnType`.
 *
 * @example
 * ```js
 * const info = new FunctionInfo(['number', 'number'], 'number')
 * info.getParameter(0) // 'number'
 * info.serialize() // { kind: 'function', parameterTypes: [...], returnType: 'number' }
 * ```
 */
export class FunctionInfo extends TypeInfo {

  /**
   * Type IDs for the function's parameters, in call order.
   *
   * @type {TypeId[]}
   */
  parameterTypes

  /**
   * Type ID produced by the function.
   *
   * @type {TypeId}
   */
  returnType

  /**
   * Creates function-signature metadata.
   *
   * The constructor stores the supplied parameter array directly, so later
   * mutations to that array are reflected by this metadata. The serialized
   * form uses a copied parameter array and records the return type separately.
   * `FunctionInfo` has no default factory; provide both parts of the
   * signature.
   *
   * @param {TypeId[]} parameterTypes
   * @param {TypeId} returnType
   */
  constructor(parameterTypes, returnType) {
    super()
    this.parameterTypes = parameterTypes
    this.returnType = returnType
  }

  /**
   * Returns the parameter type ID at an index.
   *
   * @param {number} index
   * @returns {TypeId | undefined} The type ID, or `undefined` outside the
   * parameter array.
   */
  getParameter(index) {
    return this.parameterTypes[index]
  }

  /**
   * Returns the live parameter type array.
   *
   * The API exposes it as read-only in its type annotation, but the returned
   * array is the instance's underlying array at runtime.
   *
   * @returns {ReadonlyArray<TypeId>}
   */
  getParameters() {
    return this.parameterTypes
  }

  /**
   * Returns the function's return type ID.
   *
   * @returns {TypeId}
   */
  getReturnType() {
    return this.returnType
  }

  /**
   * Serializes this signature as a function kind with parameter and return
   * type IDs.
   *
   * @returns {FunctionInfoSerial}
   */
  serialize() {
    return FunctionInfo.serialize(this)
  }

  /**
   * Serializes function metadata without exposing its parameter array.
   *
   * The serial contains exactly `{ kind: 'function', parameterTypes,
   * returnType }`. `parameterTypes` is a shallow copy, while each type ID and
   * `returnType` is preserved as-is.
   *
   * @param {FunctionInfo} value
   * @returns {FunctionInfoSerial}
   */
  static serialize(value) {
    return {
      kind: 'function',
      parameterTypes: [...value.parameterTypes],
      returnType: value.returnType
    }
  }

  /**
   * Restores a function signature from its serialized type IDs.
   *
   * Without `out`, this creates a new instance. With `out`, it clears and
   * repopulates the existing parameter array, assigns the return type, and
   * returns the same instance. The serial is assumed to have been validated
   * first.
   *
   * @param {FunctionInfoSerial} value
   * @param {FunctionInfo} [out]
   * @returns {FunctionInfo}
   */
  static deserialize(value, out = new FunctionInfo([...value.parameterTypes], value.returnType)) {
    out.parameterTypes.length = 0
    out.parameterTypes.push(...value.parameterTypes)
    out.returnType = value.returnType

    return out
  }

  /**
   * Checks whether a value has the serialized function metadata shape.
   *
   * Validation requires a non-null, non-array object with
   * `kind: 'function'`, an array of string `parameterTypes`, and a string
   * `returnType`. Extra properties are allowed; this method validates the
   * serial shape and does not create a `FunctionInfo`.
   *
   * @param {unknown} value
   * @returns {value is FunctionInfoSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value) || !('parameterTypes' in value) || !('returnType' in value)) {
      return false
    }

    if (value.kind !== 'function') {
      return false
    }

    if (!Array.isArray(value.parameterTypes)) {
      return false
    }

    if (typeof value.returnType !== 'string') {
      return false
    }

    return value.parameterTypes.every((typeId) => typeof typeId === 'string')
  }
}

/**
 * Describes the element type in array reflection metadata.
 *
 * `ArrayInfo` records the registered {@linkcode TypeId} for every array element.
 * It describes the array type, not the values currently stored in an array,
 * and its serial form uses the `array` kind discriminator.
 *
 * @example
 * ```js
 * const info = new ArrayInfo(typeid(Number))
 * info.getElementType() // the registered number type ID
 * info.serialize() // { kind: 'array', elementType: info.elementType }
 * ```
 */
export class ArrayInfo extends TypeInfo {

  /**
   * Registered type ID expected for each array element.
   *
   * @type {TypeId}
   */
  elementType

  /**
   * Creates array metadata for one registered element type.
   *
   * @param {TypeId} elementType - Type ID shared by every array element.
   */
  constructor(elementType) {
    super()
    this.elementType = elementType
  }

  /**
   * Returns the type ID recorded for each array element.
   *
   * @returns {TypeId} The registered element type ID.
   */
  getElementType() {
    return this.elementType
  }

  /**
   * Serializes this metadata to its `{ kind: 'array', elementType }` shape.
   * The result contains type metadata only; array values are not serialized.
   *
   * @returns {ArrayInfoSerial} The array metadata serial.
   */
  serialize() {
    return ArrayInfo.serialize(this)
  }

  /**
   * Converts array metadata to a plain serial object.
   *
   * @param {ArrayInfo} value - Metadata to serialize.
   * @returns {ArrayInfoSerial} An object with `kind: 'array'` and the current
   * element type ID.
   */
  static serialize(value) {
    return {
      kind: 'array',
      elementType: value.elementType
    }
  }

  /**
   * Restores array metadata from a serial object.
   *
   * If `out` is omitted, a new {@linkcode ArrayInfo} is created. If supplied, its
   * `elementType` is replaced in place and the same instance is returned. This
   * method assigns the serial value directly and does not call
   * {@linkcode ArrayInfo.validateSerial}.
   *
   * @param {ArrayInfoSerial} value - Serialized array metadata.
   * @param {ArrayInfo} [out] - Existing metadata instance to update.
   * @returns {ArrayInfo} A new or updated array metadata instance.
   */
  static deserialize(value, out = new ArrayInfo(value.elementType)) {
    out.elementType = value.elementType

    return out
  }

  /**
   * Checks whether a value has the serial shape for array metadata.
   *
   * The value must be a non-null, non-array object with `kind: 'array'` and a
   * string `elementType`. Additional properties are allowed.
   *
   * @param {unknown} value - Value to validate.
   * @returns {value is ArrayInfoSerial} `true` when the value is an array
   * metadata serial.
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value) || !('elementType' in value)) {
      return false
    }

    return value.kind === 'array' && typeof value.elementType === 'string'
  }
}

/**
 * Describes the element type in set reflection metadata.
 *
 * `SetInfo` records the registered {@linkcode TypeId} for every set element. It
 * describes the set type, not the values currently stored in a set, and its
 * serial form uses the `set` kind discriminator.
 *
 * @example
 * ```js
 * const info = new SetInfo(typeid(String))
 * info.getElementType() // the registered string type ID
 * info.serialize() // { kind: 'set', elementType: info.elementType }
 * ```
 */
export class SetInfo extends TypeInfo {

  /**
   * Registered type ID expected for each set element.
   *
   * @type {TypeId}
   */
  elementType

  /**
   * Creates set metadata for one registered element type.
   *
   * @param {TypeId} elementType - Type ID shared by every set element.
   */
  constructor(elementType) {
    super()
    this.elementType = elementType
  }

  /**
   * Returns the type ID recorded for each set element.
   *
   * @returns {TypeId} The registered element type ID.
   */
  getElementType() {
    return this.elementType
  }

  /**
   * Serializes this metadata to its `{ kind: 'set', elementType }` shape.
   * The result contains type metadata only; set values are not serialized.
   *
   * @returns {SetInfoSerial} The set metadata serial.
   */
  serialize() {
    return SetInfo.serialize(this)
  }

  /**
   * Converts set metadata to a plain serial object.
   *
   * @param {SetInfo} value - Metadata to serialize.
   * @returns {SetInfoSerial} An object with `kind: 'set'` and the current
   * element type ID.
   */
  static serialize(value) {
    return {
      kind: 'set',
      elementType: value.elementType
    }
  }

  /**
   * Restores set metadata from a serial object.
   *
   * If `out` is omitted, a new {@linkcode SetInfo} is created. If supplied, its
   * `elementType` is replaced in place and the same instance is returned. This
   * method assigns the serial value directly and does not call
   * {@linkcode SetInfo.validateSerial}.
   *
   * @param {SetInfoSerial} value - Serialized set metadata.
   * @param {SetInfo} [out] - Existing metadata instance to update.
   * @returns {SetInfo} A new or updated set metadata instance.
   */
  static deserialize(value, out = new SetInfo(value.elementType)) {
    out.elementType = value.elementType

    return out
  }

  /**
   * Checks whether a value has the serial shape for set metadata.
   *
   * The value must be a non-null, non-array object with `kind: 'set'` and a
   * string `elementType`. Additional properties are allowed.
   *
   * @param {unknown} value - Value to validate.
   * @returns {value is SetInfoSerial} `true` when the value is a set metadata
   * serial.
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value) || !('elementType' in value)) {
      return false
    }

    return value.kind === 'set' && typeof value.elementType === 'string'
  }
}

/**
 * Describes the key and value types in map reflection metadata.
 *
 * `MapInfo` records type metadata for map entries; it does not contain a map
 * or validate map values. Its serialized form is an object with `kind: 'map'`,
 * `keyType`, and `valueType` properties.
 * It does not provide a `default()` factory; construct it with both type IDs.
 *
 * @example
 * ```js
 * import { MapInfo } from '@wimaengine/reflect'
 * import { typeid } from '@wimaengine/type'
 *
 * const info = new MapInfo(typeid(String), typeid(Number))
 *
 * info.getKeyType() // typeid(String)
 * info.getValueType() // typeid(Number)
 * info.serialize() // { kind: 'map', keyType: ..., valueType: ... }
 * ```
 */
export class MapInfo extends TypeInfo {

  /**
   * Type ID expected for each map key.
   *
   * @type {TypeId}
   */
  keyType

  /**
   * Type ID expected for each map value.
   *
   * @type {TypeId}
   */
  valueType

  /**
   * Creates map metadata for one key type and one value type.
   *
   * The supplied type IDs are stored directly without copying or normalization.
   *
   * @param {TypeId} keyType
   * @param {TypeId} valueType
   */
  constructor(keyType, valueType) {
    super()
    this.keyType = keyType
    this.valueType = valueType
  }

  /**
   * Returns the type ID recorded for map keys.
   *
   * @returns {TypeId}
   */
  getKeyType() {
    return this.keyType
  }

  /**
   * Returns the type ID recorded for map values.
   *
   * @returns {TypeId}
   */
  getValueType() {
    return this.valueType
  }

  /**
   * Serializes this metadata to the `map` serial shape.
   *
   * The returned object contains the current key and value type IDs and does
   * not mutate this instance.
   *
   * @inheritdoc
   * @returns {MapInfoSerial}
   */
  serialize() {
    return MapInfo.serialize(this)
  }

  /**
   * Converts map metadata to a plain serial object.
   *
   * The result contains exactly `kind: 'map'`, the current `keyType`, and the
   * current `valueType`.
   *
   * @inheritdoc
   * @param {MapInfo} value
   * @returns {MapInfoSerial}
   */
  static serialize(value) {
    return {
      kind: 'map',
      keyType: value.keyType,
      valueType: value.valueType
    }
  }

  /**
   * Restores map metadata from a serialized map description.
   *
   * Without `out`, this creates a new {@linkcode MapInfo}. With `out`, it assigns
   * both type IDs to that instance and returns the same instance. The serial
   * is assumed to have been validated before this method is called.
   *
   * @inheritdoc
   * @param {MapInfoSerial} value
   * @param {MapInfo} [out]
   * @returns {MapInfo}
   */
  static deserialize(value, out = new MapInfo(value.keyType, value.valueType)) {
    out.keyType = value.keyType
    out.valueType = value.valueType

    return out
  }

  /**
   * Checks whether a value has the serialized map metadata shape.
   *
   * Validation accepts a non-null, non-array object with `kind: 'map'` and
   * string `keyType` and `valueType` properties. Extra properties are allowed;
   * this method validates the serial shape and does not create a `MapInfo`.
   *
   * @param {unknown} value
   * @returns {value is MapInfoSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value) || !('keyType' in value) || !('valueType' in value)) {
      return false
    }

    return value.kind === 'map' &&
      typeof value.keyType === 'string' &&
      typeof value.valueType === 'string'
  }
}

/**
 * Describes the ordered element types in tuple reflection metadata.
 *
 * `TupleInfo` records one type ID for each tuple position; it does not contain
 * a tuple or validate tuple values. Its serialized form is an object with
 * `kind: 'tuple'` and an `elementTypes` array.
 * It does not provide a `default()` factory; construct it with the complete
 * ordered type list.
 *
 * @example
 * ```js
 * import { TupleInfo } from '@wimaengine/reflect'
 * import { typeid } from '@wimaengine/type'
 *
 * const info = new TupleInfo([typeid(Number), typeid(String)])
 *
 * info.getElement(0) // typeid(Number)
 * info.getElements() // [typeid(Number), typeid(String)]
 * info.serialize() // { kind: 'tuple', elementTypes: [...] }
 * ```
 */
export class TupleInfo extends TypeInfo {

  /**
   * Type IDs in tuple-position order.
   *
   * The array is the one supplied to the constructor, so it remains live and
   * can be changed through the instance. Treat it as read-only when using the
   * metadata as a type description.
   *
   * @type {TypeId[]}
   */
  elementTypes

  /**
   * Creates tuple metadata from an ordered list of element type IDs.
   *
   * The supplied array is stored directly rather than copied.
   *
   * @param {TypeId[]} elementTypes
   */
  constructor(elementTypes) {
    super()
    this.elementTypes = elementTypes
  }

  /**
   * Returns the type ID recorded at a tuple position.
   *
   * @param {number} index - Zero-based tuple position.
   * @returns {TypeId | undefined} The type ID, or `undefined` when the index is
   * outside the current element array.
   */
  getElement(index) {
    return this.elementTypes[index]
  }

  /**
   * Returns the live array of tuple element type IDs.
   *
   * The return type presents the array as read-only, but the returned value is
   * the instance's underlying array at runtime.
   *
   * @returns {ReadonlyArray<TypeId>}
   */
  getElements() {
    return this.elementTypes
  }

  /**
   * Serializes this metadata to the `tuple` serial shape.
   *
   * The returned `elementTypes` array is a shallow copy, so changing the
   * serial does not change this instance's element array.
   *
   * @inheritdoc
   * @returns {TupleInfoSerial}
   */
  serialize() {
    return TupleInfo.serialize(this)
  }

  /**
   * Converts tuple metadata to a plain serial object.
   *
   * The result contains exactly `kind: 'tuple'` and a shallow copy of the
   * current `elementTypes` array.
   *
   * @inheritdoc
   * @param {TupleInfo} value
   * @returns {TupleInfoSerial}
   */
  static serialize(value) {
    return {
      kind: 'tuple',
      elementTypes: [...value.elementTypes]
    }
  }

  /**
   * Restores tuple metadata from a serialized tuple description.
   *
   * Without `out`, this creates a new {@linkcode TupleInfo} with a copied element
   * array. With `out`, it clears that instance's existing array, appends the
   * serialized type IDs, and returns the same instance. The serial is assumed
   * to have been validated before this method is called.
   *
   * @inheritdoc
   * @param {TupleInfoSerial} value
   * @param {TupleInfo} [out]
   * @returns {TupleInfo}
   */
  static deserialize(value, out = new TupleInfo([...value.elementTypes])) {
    out.elementTypes.length = 0
    out.elementTypes.push(...value.elementTypes)

    return out
  }

  /**
   * Checks whether a value has the serialized tuple metadata shape.
   *
   * Validation accepts a non-null, non-array object with `kind: 'tuple'` and
   * an array whose present entries are string type IDs. Extra properties are
   * allowed; this method validates the serial shape and does not create a
   * `TupleInfo`.
   *
   * @param {unknown} value
   * @returns {value is TupleInfoSerial}
   */
  static validateSerial(value) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !('kind' in value) || !('elementTypes' in value)) {
      return false
    }

    if (value.kind !== 'tuple') {
      return false
    }

    return Array.isArray(value.elementTypes) &&
      value.elementTypes.every((typeId) => typeof typeId === 'string')
  }
}

/**
 * @typedef OpaqueInfoSerial
 * @property {'opaque'} kind
 */

/**
 * @typedef FieldSerial
 * @property {TypeId} type
 * @property {boolean} optional
 */

/**
 * @typedef StructInfoSerial
 * @property {'struct'} kind
 * @property {Record<string, FieldSerial>} fields
 */

/**
 * @typedef EnumInfoSerial
 * @property {'enum'} kind
 * @property {Record<string, number>} variants
 */

/**
 * @typedef FunctionInfoSerial
 * @property {'function'} kind
 * @property {TypeId[]} parameterTypes
 * @property {TypeId} returnType
 */

/**
 * @typedef ArrayInfoSerial
 * @property {'array'} kind
 * @property {TypeId} elementType
 */

/**
 * @typedef SetInfoSerial
 * @property {'set'} kind
 * @property {TypeId} elementType
 */

/**
 * @typedef MapInfoSerial
 * @property {'map'} kind
 * @property {TypeId} keyType
 * @property {TypeId} valueType
 */

/**
 * @typedef TupleInfoSerial
 * @property {'tuple'} kind
 * @property {TypeId[]} elementTypes
 */

/**
 * @typedef {OpaqueInfoSerial | StructInfoSerial | EnumInfoSerial | FunctionInfoSerial | ArrayInfoSerial | SetInfoSerial | MapInfoSerial | TupleInfoSerial} TypeInfoSerial
 */
