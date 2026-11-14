/** @import {Vector2Like} from '@wimaengine/math' */
import { Vector2 } from '@wimaengine/math'

/**
 * Stores the local-space polygon data used by a {@linkcode Collider2D}.
 *
 * A geometry owns the source {@linkcode Vector2} vertices and the normalized face
 * normals derived from them. {@linkcode Geometry.transform} uses the
 * source vertices to update an output vertex array, while
 * {@linkcode Geometry.getNormals} returns rotated normal copies for a
 * collider's current orientation.
 *
 * @example
 * ```js
 * import { Collider2D, Geometry } from '@wimaengine/narrowphase'
 * import { Vector2 } from '@wimaengine/math'
 *
 * const collider = new Collider2D([
 *   new Vector2(-1, -1),
 *   new Vector2(1, -1),
 *   new Vector2(0, 1)
 * ])
 *
 * const normals = Geometry.getNormals(collider.geometry, collider.angle)
 * console.log(normals.length)
 * ```
 */
export class Geometry {

  /**
   * Source vertices for the polygon in local-space order.
   *
   * The constructor stores the supplied array directly. Polygon transforms
   * read these vertices and write transformed values into the collider's
   * separate current-vertices array.
   *
   * @private
   * @type {Vector2[]}
   */
  vertices

  /**
   * Normalized face-normal axes calculated from {@linkcode Geometry#vertices}.
   *
   * These are the base normals. {@linkcode Geometry.getNormals} creates
   * rotated copies instead of changing this array.
   *
   * @private
   * @type {Vector2[]}
   */
  normals

  /**
   * Separate copies of the calculated face normals.
   *
   * The copies are initialized when the geometry is constructed or
   * deserialized and are kept separate from {@linkcode Geometry#normals}.
   *
   * @private
   * @type {Vector2[]}
   */
  dynNormals

  /**
   * Creates polygon geometry from an ordered list of local-space vertices.
   *
   * The supplied array becomes {@linkcode Geometry#vertices}. Face normals are
   * calculated immediately, and {@linkcode Geometry#dynNormals} is initialized
   * with copies of those normals.
   *
   * @param {Vector2[]} vertices - Polygon vertices in local-space order.
   */
  constructor(vertices) {
    this.vertices = vertices
    this.normals = Geometry.calcFaceNormals(vertices)
    this.dynNormals = this.normals.map((e) => Vector2.copy(e))
  }

  /**
   * Converts geometry to its serialized vertex representation.
   *
   * Derived normal arrays are omitted because deserialization calculates them
   * again from the serialized vertices.
   *
   * @param {Geometry} value - Geometry to serialize.
   * @returns {GeometrySerial} Serialized geometry vertices.
   */
  static serialize(value) {
    return {
      vertices: value.vertices.map((vertex) => Vector2.serialize(vertex))
    }
  }

  /**
   * Restores geometry from serialized vertices.
   *
   * The method replaces `out.vertices`, recalculates its base normals, and
   * reinitializes its dynamic-normal copies. It does not validate `value`
   * before reading it. When `out` is supplied, that geometry is mutated and
   * returned.
   *
   * @param {GeometrySerial} value - Serialized geometry vertices.
   * @param {Geometry} [out] - Geometry to update.
   * @returns {Geometry} The new or updated geometry.
   */
  static deserialize(value, out = new Geometry([])) {
    out.vertices = value.vertices.map((vertex) => Vector2.deserialize(vertex))
    out.normals = Geometry.calcFaceNormals(out.vertices)
    out.dynNormals = out.normals.map((vertex) => Vector2.copy(vertex))

    return out
  }

  /**
   * Checks whether a value has the serialized geometry shape expected by
   * {@linkcode Geometry.deserialize}.
   *
   * The check requires an object with a `vertices` array whose entries pass
   * {@linkcode Vector2.validateSerial}. It does not check polygon size, winding, or
   * whether the vertices describe a non-degenerate polygon.
   *
   * @param {unknown} value - Value to check.
   * @returns {value is GeometrySerial} `true` when the serialized vertex data is valid.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('vertices' in value)) {
      return false
    }

    if (!Array.isArray(value.vertices)) {
      return false
    }

    return value.vertices.every((vertex) => Vector2.validateSerial(vertex))
  }

  /**
   * Appends the geometry's face normals rotated by an angle.
   *
   * Existing values in `out` are preserved. A new vector is appended for each
   * base normal, and the supplied output array is returned.
   *
   * @param {Geometry} geometry - Geometry whose base normals are used.
   * @param {number} angle - Rotation angle in radians.
   * @param {Vector2[]} [out=[]] - Array to which rotated normals are appended.
   * @returns {Vector2[]} The supplied or newly created output array.
   */
  static getNormals(geometry, angle, out = []) {
    for (let i = 0; i < geometry.normals.length; i++) {
      const normal = Vector2.rotate(geometry.normals[i], angle)

      // @ts-ignore
      out.push(normal)
    }

    return out
  }

  /**
   * Calculates normalized face-normal axes for polygon vertices.
   *
   * Edges are evaluated from each vertex to the preceding vertex, including
   * the closing edge from the first vertex to the last. Axes that the
   * implementation considers equivalent are included only once.
   *
   * @param {Vector2[]} vertices - Polygon vertices in winding order.
   * @returns {Vector2[]} The calculated normal axes.
   */
  static calcFaceNormals(vertices) {
    const axes = []
    let previous = vertices[vertices.length - 1]

    for (let i = 0; i < vertices.length; i++) {
      const current = vertices[i]
      const axis = Vector2.subtract(previous, current)

      Vector2.normal(axis, axis)
      Vector2.normalize(axis, axis)

      previous = current

      if (!checkifEquals(axis, axes)) axes.push(axis)
    }

    return axes
  }

  /**
   * Transforms the source vertices into an output vertex array.
   *
   * Each source vertex is rotated, multiplied by `scale`, and translated by
   * `pos`. The method writes into the existing `Vector2` at each matching
   * index in `out`; it does not allocate output vectors or return the array.
   *
   * @param {Geometry} geometry - Geometry whose source vertices are transformed.
   * @param {Vector2} pos - Translation to add after rotation and scaling.
   * @param {number} angle - Rotation angle in radians.
   * @param {Vector2} scale - Per-axis scale to apply after rotation.
   * @param {Vector2[]} out - Preallocated output vectors to update.
   * @returns {void}
   */
  static transform(geometry, pos, angle, scale, out) {
    const { vertices } = geometry
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)

    for (let i = 0; i < vertices.length; i++) {
      const vertex = out[i]

      Vector2.rotateFast(vertices[i], cos, sin, vertex)
      Vector2.multiply(vertex, scale, vertex)
      Vector2.add(vertex, pos, vertex)
    }
  }
}

/**
 * Serialized form of {@linkcode Geometry}.
 *
 * @typedef GeometrySerial
 * @property {Vector2Like[]} vertices - Serialized polygon vertices.
 */

/**
 * @param {Vector2} axis
 * @param {Vector2[]} axes
 */
function checkifEquals(axis, axes) {
  for (let i = 0; i < axes.length; i++) if (absEquals(axis, axes[i])) return true

  return false
}

/**
 * @param {Vector2} v1
 * @param {Vector2} v2
 */
function absEquals(v1, v2) {
  return (
    Math.abs(v1.x) === Math.abs(v2.x) ||
    Math.abs(v1.y) === Math.abs(v2.y)
  )
}
