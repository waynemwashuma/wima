/** @import {Vector2Like} from '@wimaengine/math' */

import { deprecate } from '@wimaengine/logger'
import { Vector2 } from '@wimaengine/math'
import { BoundType } from './boundtype'

/**
 * Represents a 2D axis-aligned bounds value for rectangular regions.
 *
 * Use {@linkcode BoundingBox2D} as a standalone geometry value when an API needs
 * a box-shaped region.
 *
 * Use the static helpers to copy, translate, or combine boxes without
 * changing the source values. The deprecated instance wrappers remain for
 * compatibility but log warnings when called.
 *
 * @example
 * ```js
 * import { BoundingBox2D } from '@wimaengine/geometry'
 *
 * const local = new BoundingBox2D(-1, -1, 1, 1)
 * const search = BoundingBox2D.translate(local, 10, 0)
 * // `search` is a translated box with coordinates from 9 to 11 on x.
 * ```
 */
export class BoundingBox2D {

  /**
   * Identifies this bound as a 2D axis-aligned box.
   *
   * @type {number}
   */
  type = BoundType.Box2D

  /**
   * The upper coordinate on each axis.
   *
   * @type {Vector2}
   */
  max

  /**
   * The lower limit of the bounding box.
   *
   * @type {Vector2}
   */
  min

  /**
   * Creates a 2D axis-aligned bounding box.
   *
   * The constructor stores the supplied coordinates directly: `minX` and
   * `minY` initialize {@linkcode BoundingBox2D#min}, while `maxX` and `maxY`
   * initialize {@linkcode BoundingBox2D#max}. All four coordinates default
   * to `0`; the constructor does not reorder them or enforce that `min` is
   * below `max`.
   *
   * @param {number} [minX=0] - Lower x coordinate.
   * @param {number} [minY=0] - Lower y coordinate.
   * @param {number} [maxX=0] - Upper x coordinate.
   * @param {number} [maxY=0] - Upper y coordinate.
   */
  constructor(minX = 0, minY = 0, maxX = 0, maxY = 0) {
    this.max = new Vector2(maxX, maxY)
    this.min = new Vector2(minX, minY)
  }

  /**
   * Translates this box in place.
   *
   * Prefer the static {@linkcode BoundingBox2D.translate} helper. This
   * deprecated wrapper logs a deprecation warning and returns this box after
   * applying the offset.
   *
   * @deprecated Use {@linkcode BoundingBox2D.translate}.
   * @param {number} x - Offset on the x axis.
   * @param {number} y - Offset on the y axis.
   * @returns {BoundingBox2D} This box after translation.
   */
  translate(x, y) {
    deprecate('BoundingBox2D().translate()', 'BoundingBox2D.translate()')

    return BoundingBox2D.translate(this, x, y, this)
  }

  /**
   * Creates a deep copy of this box.
   *
   * Prefer {@linkcode BoundingBox2D.copy}. This deprecated wrapper logs a
   * deprecation warning and returns a new box with copied `min` and `max`
   * vectors.
   *
   * @deprecated Use {@linkcode BoundingBox2D.copy}.
   * @returns {BoundingBox2D} A new box with the same coordinates.
   */
  clone() {
    deprecate('BoundingBox2D().clone()', 'BoundingBox2D.copy()')

    return BoundingBox2D.copy(this)
  }

  /**
   * Copies another box into this box in place.
   *
   * Prefer {@linkcode BoundingBox2D.copy}. This deprecated wrapper logs a
   * deprecation warning and returns `undefined`.
   *
   * @deprecated Use {@linkcode BoundingBox2D.copy}.
   * @param {BoundingBox2D} bounds - Source box.
   * @returns {void}
   */
  copy(bounds) {
    deprecate('BoundingBox2D().copy()', 'BoundingBox2D.copy()')
    BoundingBox2D.copy(bounds, this)
  }

  /**
   * Copies the coordinates of a box into an output box.
   *
   * Only the `min` and `max` coordinates are copied. The source is not
   * modified, and `out` defaults to a new {@linkcode BoundingBox2D}.
   *
   * @param {BoundingBox2D} bound - Source box.
   * @param {BoundingBox2D} [out=new BoundingBox2D()] - Output box to mutate.
   * @returns {BoundingBox2D} The output box.
   */
  static copy(bound, out = new BoundingBox2D()) {
    out.min.x = bound.min.x
    out.min.y = bound.min.y
    out.max.x = bound.max.x
    out.max.y = bound.max.y

    return out
  }

  /**
   * Serializes a box to its plain coordinate representation.
   *
   * The result contains `max` and `min` vector data. It does not include the
   * runtime `type` field.
   *
   * @param {BoundingBox2D} value - Box to serialize.
   * @returns {BoundingBox2DSerial} Serialized coordinate data.
   */
  static serialize(value) {
    return {
      max: Vector2.serialize(value.max),
      min: Vector2.serialize(value.min)
    }
  }

  /**
   * Restores box coordinates from serialized data.
   *
   * `max` and `min` are written into the supplied output, or into a new box
   * when `out` is omitted. Any serialized `type` property is ignored.
   *
   * @param {BoundingBox2DSerial} value - Serialized coordinate data.
   * @param {BoundingBox2D} [out=new BoundingBox2D()] - Output box to mutate.
   * @returns {BoundingBox2D} The restored output box.
   */
  static deserialize(value, out = new BoundingBox2D()) {
    out.max = Vector2.deserialize(value.max, out.max)
    out.min = Vector2.deserialize(value.min, out.min)

    return out
  }

  /**
   * Checks whether a value contains valid serialized box coordinates.
   *
   * The check requires an object with valid `max` and `min` vector data. It
   * does not validate a `type` field, coordinate ordering, or extra fields.
   *
   * @param {unknown} value - Value to validate.
   * @returns {value is BoundingBox2DSerial} Whether the value is valid.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('max' in value) || !('min' in value)) {
      return false
    }

    return Vector2.validateSerial(value.max) &&
      Vector2.validateSerial(value.min)
  }

  /**
   * Translates a box by an x/y offset.
   *
   * The source is not modified unless it is also supplied as `out`. All four
   * coordinates are written to `out`, which defaults to a new box.
   *
   * @param {BoundingBox2D} bound - Source box.
   * @param {number} x - Offset on the x axis.
   * @param {number} y - Offset on the y axis.
   * @param {BoundingBox2D} [out=new BoundingBox2D()] - Output box to mutate.
   * @returns {BoundingBox2D} The translated output box.
   */
  static translate(bound, x, y, out = new BoundingBox2D()) {
    out.min.x = bound.min.x + x
    out.min.y = bound.min.y + y
    out.max.x = bound.max.x + x
    out.max.y = bound.max.y + y

    return out
  }

  /**
   * Combines two bounds to create a new one that covers the previous two.
   *
   * The output takes the component-wise minimum of the two `min` vectors and
   * the component-wise maximum of the two `max` vectors. Inputs are not
   * modified, and `out` defaults to a new box.
   *
   * @param {BoundingBox2D} bound1 - First source box.
   * @param {BoundingBox2D} bound2 - Second source box.
   * @param {BoundingBox2D} [out=new BoundingBox2D()] - Output box to mutate.
   * @returns {BoundingBox2D} The union output box.
   */
  static union(bound1, bound2, out = new BoundingBox2D()) {
    out.max.x = bound1.max.x > bound2.max.x ? bound1.max.x : bound2.max.x
    out.max.y = bound1.max.y > bound2.max.y ? bound1.max.y : bound2.max.y
    out.min.x = bound1.min.x < bound2.min.x ? bound1.min.x : bound2.min.x
    out.min.y = bound1.min.y < bound2.min.y ? bound1.min.y : bound2.min.y

    return out
  }
}

/**
 * @typedef BoundingBox2DSerial
 * @property {Vector2Like} max - Serialized upper coordinate.
 * @property {Vector2Like} min - Serialized lower coordinate.
 */
