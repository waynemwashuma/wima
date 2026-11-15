/**
 * Represents the numeric vertex data for a mesh attribute.
 *
 * @example
 * ```js
 * import { Mesh, MeshAttributeData } from '@wimaengine/render-core'
 *
 * const mesh = new Mesh()
 * mesh.setAttribute('uv', new MeshAttributeData(new Float32Array([
 *   0, 0, 1, 0, 1, 1
 * ])))
 * ```
 */
export class MeshAttributeData {

  /**
   * Numeric values supplied to the named mesh attribute.
   *
   * The constructor stores the supplied typed array directly, so mutations to
   * that array are visible through this value and to a mesh using it.
   *
   * @type {Float32Array}
   */
  data

  /**
   * Creates a mesh attribute buffer value.
   *
   * @param {Float32Array} data
   */
  constructor(data) {
    this.data = data
  }

  /**
   * Converts the attribute buffer to its plain serial representation.
   *
   * The returned object contains a new number array made from `data`; the
   * typed array and the value are not mutated.
   *
   * @param {MeshAttributeData} value
   * @returns {MeshAttributeDataSerial}
   */
  static serialize(value) {
    return {
      data: Array.from(value.data)
    }
  }

  /**
   * Restores an attribute buffer from its plain serial representation.
   *
   * When `out` is supplied, its `data` field is replaced with a new
   * `Float32Array`. Without `out`, the method creates an empty target first.
   * The populated target is returned.
   *
   * @param {MeshAttributeDataSerial} value
   * @param {MeshAttributeData} [out]
   * @returns {MeshAttributeData}
   */
  static deserialize(value, out = new MeshAttributeData(new Float32Array())) {
    out.data = new Float32Array(value.data)

    return out
  }

  /**
   * Checks whether a value has the serialized attribute-buffer shape.
   *
   * This requires an object with a `data` property whose value is an array.
   * It does not inspect the array's elements or construct a
   * {@linkcode MeshAttributeData} instance.
   *
   * @param {unknown} value
   * @returns {value is MeshAttributeDataSerial}
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('data' in value)) {
      return false
    }

    return Array.isArray(value.data)
  }
}

/**
 * Plain serialized representation accepted by
 * {@linkcode MeshAttributeData.deserialize}.
 *
 * @typedef MeshAttributeDataSerial
 * @property {number[]} data
 */
