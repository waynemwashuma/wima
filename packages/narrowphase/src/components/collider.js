/** @import {Vector2Like} from '@wimaengine/math' */
/** @import {GeometrySerial} from '../core' */

import { Vector2 } from '@wimaengine/math'
import { Geometry } from '../core'
import { ShapeType } from '../settings'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Defines the 2D collision-shape component attached to an entity.
 *
 * A collider stores the shape's current vertices, its polygon geometry, and
 * its current angle in radians. Polygon vertices begin as local-space values
 * and can be transformed in place by {@linkcode Collider2D.update}; circle
 * colliders store their center in the first vertex.
 *
 * Use {@linkcode Collider2D.rectangle}, {@linkcode Collider2D.triangle}, or {@linkcode Collider2D.line} for polygon shapes. Use
 * {@linkcode Collider2D.circle} for the special circle representation.
 * The polygon factories leave `type` as {@linkcode ShapeType.POLYGON}; the
 * circle factory sets it to {@linkcode ShapeType.Circle}.
 *
 * @category component
 * @example
 * ```js
 * import { World } from '@wimaengine/ecs'
 * import { Collider2D } from '@wimaengine/narrowphase'
 *
 * const world = new World()
 * const body = world.spawn([
 *   Collider2D.rectangle(2, 1)
 * ])
 *
 * const collider = world.get(body, Collider2D)
 * console.log(collider.type === Collider2D.POLYGON)
 * ```
 */
export class Collider2D {

  /**
   * Numeric discriminator for the collider's shape representation.
   *
   * Polygon colliders use {@linkcode ShapeType.POLYGON} (`1`), while circle
   * colliders use {@linkcode ShapeType.Circle} (`0`). {@linkcode Collider2D.POLYGON}
   * and {@linkcode Collider2D.Circle} are numeric aliases for those values. The
   * field is writable; copy and
   * deserialization preserve it, and the circle factory changes it from the
   * polygon default.
   *
   * @type {number}
   */
  type = ShapeType.POLYGON

  /**
   * Current angle of the collider in radians.
   *
   * Constructors and factories initialize this to `0`. Each call to
   * {@linkcode Collider2D.update} replaces it, while copy and
   * deserialization restore the stored value.
   *
   * @type {number}
   */
  angle = 0

  /**
   * Vertices describing the collider's current shape.
   *
   * Polygon constructors copy the supplied local-space vectors. For polygon
   * colliders, {@linkcode Collider2D.update} overwrites these vectors with
   * transformed coordinates. For a circle, `vertices[0]` is its center and
   * `vertices[1].x` is its radius; the circle factory also initializes
   * `vertices[1].y` to that radius.
   *
   * @type {Vector2[]}
   */
  vertices

  /**
   * Polygon geometry used for normals and transformations.
   *
   * It is built from the constructor's input vertices and is not updated when
   * `vertices` is edited directly. Polygon updates use this geometry as their
   * source. Copying or deserializing a collider replaces the geometry object.
   *
   * @type {Geometry}
   */
  geometry

  /**
   * Creates a polygon collider from local-space vertices.
   *
   * The values are copied into `vertices`, while `geometry` is constructed
   * from the supplied vertex array. The constructor does not validate vertex
   * count, order, finiteness, or winding, so empty and degenerate polygons are
   * accepted.
   *
   * @param {Vector2[]} vertices - Vertices in local-space coordinates.
   */
  constructor(vertices) {

    // @ts-ignore
    this.vertices = vertices.map((v) => Vector2.copy(v))
    this.geometry = new Geometry(vertices)
  }

  /**
   * Copies a collider into a new or supplied output collider.
   *
   * The current vertex values, `type`, and `angle` are copied. A fresh
   * {@linkcode Geometry} is built from the source's current vertices, so the
   * result does not share the source's vertex array or geometry object. A
   * supplied `target` is mutated and returned.
   *
   * @param {Collider2D} source - Collider to copy.
   * @param {Collider2D} [target] - Collider to update and return.
   * @returns {Collider2D} The new or updated collider.
   */
  static copy(source, target = new Collider2D(source.vertices.map((v) => Vector2.copy(v)))) {
    const vertices = source.vertices.map((v) => Vector2.copy(v))

    target.vertices = vertices
    target.geometry = new Geometry(vertices)

    // @ts-ignore
    target.type = source.type
    target.angle = source.angle

    return target
  }

  /**
   * Creates a detached copy of a collider.
   *
   * @param {Collider2D} target - Collider to clone.
   * @returns {Collider2D} A new collider with copied vertices, geometry, type, and angle.
   */
  static clone(target) {
    return Collider2D.copy(target)
  }

  /**
   * Converts a collider to its serialized field object.
   *
   * The result contains the numeric `type`, `angle`, serialized current
   * vertices, and serialized geometry. The geometry field is preserved as
   * part of the serialized representation.
   *
   * @param {Collider2D} value - Collider to serialize.
   * @returns {Collider2DSerial} The serialized collider fields.
   */
  static serialize(value) {
    return {
      type: value.type,
      angle: value.angle,
      vertices: value.vertices.map((vertex) => Vector2.serialize(vertex)),
      geometry: Geometry.serialize(value.geometry)
    }
  }

  /**
   * Deserializes collider fields into a new or supplied output collider.
   *
   * The method assigns `type`, `angle`, and newly deserialized vertex and
   * geometry objects. It does not call
   * {@linkcode Collider2D.validateSerial} and does not rebuild
   * geometry from `vertices`, so the
   * serialized fields are restored as provided.
   *
   * @param {Collider2DSerial} value - Serialized collider fields.
   * @param {Collider2D} [out] - Collider to update and return.
   * @returns {Collider2D} The new or updated collider.
   */
  static deserialize(value, out = new Collider2D([])) {
    const target = /** @type {any} */ (out)

    target.type = value.type
    target.angle = value.angle
    target.vertices = value.vertices.map((vertex) => Vector2.deserialize(vertex))
    target.geometry = Geometry.deserialize(value.geometry)

    return out
  }

  /**
   * Checks the structure and primitive types of serialized collider fields.
   *
   * The check requires `type`, `angle`, `vertices`, and `geometry`; every
   * vertex must pass {@linkcode Vector2.validateSerial}, and
   * geometry must pass {@linkcode Geometry.validateSerial}. It does
   * not restrict `type` to the two
   * {@linkcode ShapeType} values, require finite numbers, enforce polygon size or
   * winding, compare geometry with the vertices, or validate circle radius
   * encoding. Deserialization does not perform this validation.
   *
   * @param {unknown} value - Candidate serialized value.
   * @returns {value is Collider2DSerial} `true` when the required structure and types are present.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('type' in value) || !('angle' in value) || !('vertices' in value) || !('geometry' in value)) {
      return false
    }

    if (!Array.isArray(value.vertices)) {
      return false
    }

    return typeof value.type === 'number' &&
      typeof value.angle === 'number' &&
      value.vertices.every((vertex) => Vector2.validateSerial(vertex)) &&
      Geometry.validateSerial(value.geometry)
  }

  /**
   * Creates a four-vertex polygon centered on the origin.
   *
   * The vertices are ordered as `(-width / 2, -height / 2)`,
   * `(-width / 2, height / 2)`, `(width / 2, height / 2)`, and
   * `(width / 2, -height / 2)`. The result has polygon type and angle `0`.
   * Dimensions are used as supplied without range or finiteness checks.
   *
   * @param {number} width - Width along the x axis.
   * @param {number} height - Height along the y axis.
   * @returns {Collider2D} A polygon collider with four vertices.
   */
  static rectangle(width, height) {
    const v1 = new Vector2(-width / 2, -height / 2)
    const v2 = new Vector2(-width / 2, height / 2)
    const v3 = new Vector2(width / 2, height / 2)
    const v4 = new Vector2(width / 2, -height / 2)

    return new Collider2D([v1, v2, v3, v4])
  }

  /**
   * Creates a three-vertex polygon centered around its centroid.
   *
   * `base` and `height` define the construction dimensions, and `angle`
   * controls the second side's direction. When omitted, `angle` defaults to
   * `Math.asin(height / base)`. The factory performs no range checks, so zero
   * lengths, invalid ratios, or an angle with a zero sine can produce `NaN` or
   * infinite vertex coordinates.
   *
   * @param {number} base - Length of one side.
   * @param {number} height - Length of a second side.
   * @param {number} [angle=Math.asin(height / base)] - Angle between the sides in radians.
   * @returns {Collider2D} A polygon collider with three vertices.
   */
  static triangle(base, height, angle = Math.asin(height / base)) {
    const l1 = new Vector2(base)
    const l2 = Vector2.fromAngle(angle)

    Vector2.multiplyScalar(l2, -height / Math.sin(angle), l2)

    const center = new Vector2(-(l1.x + l2.x) / 3, -l2.y / 3)

    return new Collider2D([
      center,

      // @ts-ignore
      Vector2.add(l1, center, l1),

      // @ts-ignore
      Vector2.add(l2, center, l2)
    ])
  }

  /**
   * Creates a two-vertex polygon along the x axis.
   *
   * The vertices are `(length / 2, 0)` and `(-length / 2, 0)`. The result
   * keeps {@linkcode ShapeType.POLYGON} and angle `0`.
   *
   * @param {number} length - Distance between the endpoints.
   * @returns {Collider2D} A two-vertex polygon collider.
   */
  static line(length) {
    const start = new Vector2(length / 2)
    const end = new Vector2(-length / 2)

    return new Collider2D([start, end])
  }

  /**
   * Creates a circle collider using the component's two-vertex encoding.
   *
   * `vertices[0]` starts at `(0, 0)` and stores the center. `vertices[1]` is
   * initialized to `(radius, radius)`, and the returned collider's type is set
   * to {@linkcode ShapeType.Circle}. Shape calculations use `vertices[1].x` as the
   * radius. No radius validation is performed. The circle's angle remains `0`
   * until {@linkcode Collider2D.update} changes it.
   *
   * @param {number} radius - Circle radius.
   * @returns {Collider2D} A circle collider.
   */
  static circle(radius) {

    // the first vertex is position
    // the second vertex x-position is radius
    //
    const shape = new Collider2D([
      new Vector2(),
      new Vector2(radius, radius)
    ])

    // @ts-ignore
    shape.type = Collider2D.Circle

    return shape
  }

  /**
   * Appends separating axes for a pair of colliders to an output array.
   *
   * For a polygon `shapeA`, it appends its face normals rotated by
   * `shapeA.angle`. For a non-polygon `shapeA`, it appends one normalized
   * vector from `shapeA.vertices[0]` to a vertex of `shapeB`. With ordinary
   * finite inputs, the current selection resolves to `shapeB.vertices[0]`.
   *
   * Existing values in `out` are preserved; new normals are appended.
   *
   * @param {Collider2D} shapeA - First collider.
   * @param {Collider2D} shapeB - Second collider.
   * @param {Vector2[]} [out=[]] - Array to which normals are appended.
   * @returns {Vector2[]} The supplied or newly created output array.
   */
  static getNormals(shapeA, shapeB, out = []) {
    if (shapeA.type === Collider2D.POLYGON) return Geometry.getNormals(shapeA.geometry, shapeA.angle, out)

    let vertex = shapeB.vertices[0]

    if (shapeB.type === Collider2D.POLYGON) vertex = shapeB.vertices[getNearVertex(shapeA.vertices[0], shapeA.vertices)]

    const normal = Vector2.copy(vertex)

    Vector2.subtract(normal, shapeA.vertices[0], normal)
    Vector2.normalize(normal, normal)

    // @ts-ignore
    out.push(normal)

    return out
  }

  /**
   * Updates a collider's angle and current vertex coordinates.
   *
   * The angle is always assigned. For a circle, only `vertices[0]` is copied
   * from `position`; `scale` is ignored, the stored radius is not changed, and
   * `geometry` is untouched. For every other type, the base geometry is
   * transformed by `angle`, `scale`, and `position` into the existing
   * `vertices` objects. The method returns `undefined`.
   *
   * Polygon transforms read from `geometry.vertices`, so editing the current
   * `vertices` array does not change the local shape used by the next update.
   * Malformed or inconsistent deserialized data can cause the transform to
   * fail when its geometry and output arrays have different lengths.
   *
   * @param {Collider2D} shape - Collider to update.
   * @param {Vector2} position - World position of the body.
   * @param {number} angle - Body orientation in radians.
   * @param {Vector2} scale - Body scale for polygon vertices.
   * @returns {void}
   */
  static update(shape, position, angle, scale) {
    shape.angle = angle

    if (shape.type === ShapeType.Circle) {
      Vector2.copy(position, shape.vertices[0])

      return
    }

    Geometry.transform(
      shape.geometry,
      position,
      angle,
      scale,
      shape.vertices
    )
  }

  /**
   * Returns the vertices used to project the collider on an axis.
   *
   * Polygon colliders return their live `shape.vertices` array directly and
   * ignore `out`. For non-polygon types, it creates two vectors by adding and
   * subtracting `shape.vertices[1].x * axis` from `shape.vertices[0]`, writes
   * them to `out[0]` and `out[1]`, and returns `out`. It does not clear extra
   * entries in a reused output array, and it uses the axis as supplied without
   * normalizing it.
   *
   * @template {Collider2D} T
   * @param {T} shape - Collider whose vertices are requested.
   * @param {Vector2} axis - Projection axis or direction vector.
   * @param {Vector2[]} [out=[]] - Output array for non-polygon shapes.
   * @returns {Vector2[]} The live polygon vertices or supplied output array.
   */
  static getVertices(shape, axis, out = []) {
    if (shape.type === Collider2D.POLYGON) return shape.vertices

    const v1 = Vector2.multiplyScalar(axis, -shape.vertices[1].x)
    const v2 = Vector2.multiplyScalar(axis, shape.vertices[1].x)

    Vector2.add(v1, shape.vertices[0], v1)
    Vector2.add(v2, shape.vertices[0], v2)

    // @ts-ignore
    out[0] = v1

    // @ts-ignore
    out[1] = v2

    return out
  }

  /**
   * Returns the collider area value.
   *
   * Area calculation is not implemented; this method currently returns `0`
   * for both polygon and non-polygon shapes.
   *
   * @param {Collider2D} shape - Collider whose area would be calculated.
   * @returns {number} Always `0` in the current implementation.
   */
  static getArea(shape) {
    if (shape.type === Collider2D.POLYGON) {
      return 0
    }

    return 0
  }

  /**
   * Calculates a collider's moment of inertia for a supplied mass.
   *
   * Circles use `0.5 * mass * radius ** 2`, where radius is
   * `shape.vertices[1].x`. Polygon-like shapes use the current vertex array
   * and a polygon summation; `angle`, `geometry`, and world position are not
   * consulted. There is no input validation. Empty, collinear, or otherwise
   * zero-area polygon data normally produces `NaN`.
   *
   * @param {Collider2D} shape - Collider whose inertia is calculated.
   * @param {number} mass - Mass multiplier.
   * @returns {number} The calculated inertia, or the arithmetic result for degenerate input.
   */
  static calcInertia(shape, mass) {
    const { vertices } = shape

    if (shape.type === Collider2D.Circle) {
      const radius = vertices[1].x

      return mass * (radius * radius) * 0.5
    }

    const vertexCount = vertices.length
    let numerator = 0.0
    let denominator = 0.0
    let i = vertexCount - 1

    for (let j = 0; j < vertexCount; ++j) {
      const v1 = vertices[i]
      const v2 = vertices[j]
      const crs = Math.abs(Vector2.cross(v1, v2))

      numerator += crs * (Vector2.dot(v2, v2) + Vector2.dot(v1, v2) + Vector2.dot(v1, v1))
      denominator += crs
      i = j
    }

    return mass * numerator / (denominator * 6.0)
  }

  /** Numeric alias for {@linkcode ShapeType.Circle} (`0`). */
  static Circle = 0

  /** Numeric alias for {@linkcode ShapeType.POLYGON} (`1`). */
  static POLYGON = 1
}

/**
 * Serialized field object consumed by {@linkcode Collider2D.deserialize}.
 *
 * @typedef {object} Collider2DSerial
 * @property {number} type - Numeric shape discriminator.
 * @property {number} angle - Collider angle in radians.
 * @property {Vector2Like[]} vertices - Serialized current vertices.
 * @property {GeometrySerial} geometry - Serialized polygon geometry.
 */

/**
 * @param {Vector2} position
 * @param {Vector2[]} vertices
 */
function getNearVertex(position, vertices) {
  let vertex = 0
  let min = -Infinity

  for (let i = 0; i < vertices.length; i++) {
    const a = Vector2.distanceToSquared(vertices[i], position)

    if (min > a) {
      vertex = i
      min = a
    }
  }

  return vertex
}
