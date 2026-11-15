import { GlDataType } from './gldatatype'

/**
 * Represents a mesh-attribute value describing its name and vertex layout.
 *
 * @example
 * ```js
 * import { GlDataType, MeshAttribute } from '@wimaengine/render-core'
 * import { AttributeMap } from '@wimaengine/render-webgl'
 *
 * const attributes = new AttributeMap()
 * attributes.set('weights', new MeshAttribute('weights', 9, GlDataType.Float, 1))
 * ```
 */
export class MeshAttribute {

  /**
   * Name used to match this descriptor with a named mesh attribute and shader
   * input.
   *
   * @readonly
   * @type {string}
   */
  name = ''

  /**
   * Numeric location assigned to this vertex attribute.
   *
   * @readonly
   * @type {number}
   */
  id = 0

  /**
   * WebGL scalar type used for each attribute component.
   *
   * Use a value from {@linkcode GlDataType}.
   *
   * @readonly
   * @type {GlDataType}
   */
  type = 0

  /**
   * Number of components in each vertex attribute.
   *
   * @readonly
   * @type {number}
   */
  size = 0

  /**
   * Creates a mesh-attribute descriptor from its name and vertex layout.
   *
   * The supplied `location` is stored as {@linkcode MeshAttribute#id}; all four
   * values are stored directly without validation or normalization.
   *
   * @param {string} name - Mesh and shader attribute name.
   * @param {number} location - Numeric vertex-attribute location.
   * @param {GlDataType} type - WebGL scalar type for each component.
   * @param {number} size - Number of components per vertex.
   */
  constructor(name, location, type, size) {
    this.name = name
    this.id = location
    this.type = type
    this.size = size
  }

  /**
   * Converts a descriptor to its plain serialized representation.
   *
   * The returned object contains `name`, `id`, `type`, and `size` copied from
   * the descriptor. Serialization creates a new object and does not mutate the
   * descriptor.
   *
   * @param {MeshAttribute} value - Descriptor to serialize.
   * @returns {MeshAttributeSerial} Plain descriptor data.
   */
  static serialize(value) {
    return {
      name: value.name,
      id: value.id,
      type: value.type,
      size: value.size
    }
  }

  /**
   * Restores descriptor fields from plain serialized data.
   *
   * When `out` is supplied, this method writes all four fields into that same
   * descriptor and returns it. Without `out`, it creates a zero-value
   * descriptor first and then populates it. The input is assumed to have the
   * serialized shape; this method does not call
   * {@linkcode MeshAttribute.validateSerial} or perform validation
   * itself.
   *
   * @param {MeshAttributeSerial} value - Serialized descriptor data.
   * @param {MeshAttribute} [out] - Descriptor to populate in place.
   * @returns {MeshAttribute} The populated descriptor.
   */
  static deserialize(value, out = new MeshAttribute('', 0, 0, 0)) {
    const target = /** @type {any} */ (out)

    target.name = value.name
    target.id = value.id
    target.type = value.type
    target.size = value.size

    return out
  }

  /**
   * Checks whether a value has the serialized descriptor shape.
   *
   * The check requires `name`, `id`, `type`, and `size` properties with types
   * `string`, `number`, `number`, and `number`. It does not require finite
   * numbers, check that `type` is one of {@linkcode GlDataType}, enforce layout
   * ranges, or construct a {@linkcode MeshAttribute}.
   *
   * @param {unknown} value - Value to check.
   * @returns {value is MeshAttributeSerial} Whether the value has the accepted shape.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('name' in value) || !('id' in value) || !('type' in value) || !('size' in value)) {
      return false
    }

    return typeof value.name === 'string' &&
      typeof value.id === 'number' &&
      typeof value.type === 'number' &&
      typeof value.size === 'number'
  }

  /**
   * Built-in 2D position descriptor: `position2d`, location `0`, float type,
   * and two components per vertex.
   *
   * @type {MeshAttribute}
   */
  static Position2D = new MeshAttribute(
    'position2d',
    0,
    GlDataType.Float,
    2
  )

  /**
   * Built-in 3D position descriptor: `position3d`, location `1`, float type,
   * and three components per vertex.
   *
   * @type {MeshAttribute}
   */
  static Position3D = new MeshAttribute(
    'position3d',
    1,
    GlDataType.Float,
    3
  )

  /**
   * Built-in UV descriptor: `uv`, location `2`, float type, and two components
   * per vertex.
   *
   * @type {MeshAttribute}
   */
  static UV = new MeshAttribute(
    'uv',
    2,
    GlDataType.Float,
    2
  )

  /**
   * Built-in secondary UV descriptor: `uvb`, location `3`, float type, and two
   * components per vertex.
   *
   * @type {MeshAttribute}
   */
  static UVB = new MeshAttribute(
    'uvb',
    3,
    GlDataType.Float,
    2
  )

  /**
   * Built-in 2D normal descriptor: `normal2d`, location `4`, float type, and
   * two components per vertex.
   *
   * @type {MeshAttribute}
   */
  static Normal2D = new MeshAttribute(
    'normal2d',
    4,
    GlDataType.Float,
    2
  )

  /**
   * Built-in 3D normal descriptor: `normal3d`, location `5`, float type, and
   * three components per vertex.
   *
   * @type {MeshAttribute}
   */
  static Normal3D = new MeshAttribute(
    'normal3d',
    5,
    GlDataType.Float,
    3
  )

  /**
   * Built-in 2D tangent descriptor: `tangent2d`, location `6`, float type, and
   * two components per vertex.
   *
   * @type {MeshAttribute}
   */
  static Tangent2D = new MeshAttribute(
    'tangent2d',
    6,
    GlDataType.Float,
    2
  )

  /**
   * Built-in 3D tangent descriptor: `tangent3d`, location `7`, float type, and
   * three components per vertex.
   *
   * @type {MeshAttribute}
   */
  static Tangent3D = new MeshAttribute(
    'tangent3d',
    7,
    GlDataType.Float,
    3
  )

  /**
   * Built-in color descriptor: `color`, location `8`, float type, and four
   * components per vertex.
   *
   * @type {MeshAttribute}
   */
  static Color = new MeshAttribute(
    'color',
    8,
    GlDataType.Float,
    4
  )
}

/**
 * @typedef MeshAttributeSerial
 * @property {string} name
 * @property {number} id
 * @property {number} type
 * @property {number} size
 */
