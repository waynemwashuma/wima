/** @import {Broadphase2D} from '@wimaengine/broadphase' */
/** @import {intersectAABB2DvsCircle, intersectCircle} from './overlap' */
/** @import {Vector2Like} from '@wimaengine/math' */

import { Vector2 } from '@wimaengine/math'
import { BoundType } from './boundtype'

/**
 * Represents a circular 2D bounds value for circle-shaped regions.
 *
 * Use {@linkcode BoundingCircle} as a standalone geometry value when an API
 * needs a circle-shaped region, such as {@linkcode Broadphase2D#queryCircle}.
 * Use {@linkcode intersectCircle} or {@linkcode intersectAABB2DvsCircle} to test
 * overlap with another geometry value.
 *
 * {@linkcode BoundingCircle#translate} changes the current center in
 * place. The static translation helper can write a center into a supplied
 * output value, while {@linkcode BoundingCircle.copy} copies the center and
 * radius. Serialization stores only the persisted geometry; the runtime type
 * discriminator is supplied by construction and is not serialized.
 *
 * @example
 * ```js
 * import { BoundingCircle, intersectCircle } from '@wimaengine/geometry'
 *
 * const region = new BoundingCircle(10, 20, 5)
 * region.translate(2, -1)
 * const copy = BoundingCircle.copy(region)
 * console.log(intersectCircle(region, copy)) // true
 * // A Broadphase2D resource can use `region` with queryCircle(region).
 * ```
 */
export class BoundingCircle {

  /**
   * Bound discriminator for circular geometry.
   *
   * @readonly
   * @type {number}
   */
  type = BoundType.Circle

  /**
   * Circle radius.
   *
   * @type {number}
   */
  r = 0

  /**
   * Circle center.
   *
   * @type {Vector2}
   */
  pos

  /**
   * Creates a circular bound with a center and radius.
   *
   * @param {number} [x=0] - Center x-coordinate.
   * @param {number} [y=0] - Center y-coordinate.
   * @param {number} [r=0] - Radius.
   */
  constructor(x = 0, y = 0, r = 0) {
    this.r = r
    this.pos = new Vector2(x, y)
  }

  /**
   * Translates this circle's center in place.
   *
   * The radius and type discriminator are unchanged. This instance method
   * returns no value; use {@linkcode BoundingCircle.translate} when a returned
   * output value is preferred.
   *
   * @param {number} x - Offset to add to the center's x-coordinate.
   * @param {number} y - Offset to add to the center's y-coordinate.
   * @returns {void}
   */
  translate(x, y) {
    BoundingCircle.translate(this, x, y, this)
  }

  /**
   * Copies another circle's center and radius into this instance.
   *
   * The type discriminator is left unchanged. This instance method returns no
   * value; use {@linkcode BoundingCircle.copy} when a returned output value is
   * preferred.
   *
   * @param {BoundingCircle} bound - Source circle.
   * @returns {void}
   */
  copy(bound) {
    BoundingCircle.copy(bound, this)
  }

  /**
   * Writes a translated center into an output circle.
   *
   * Only the output position is changed; the source radius and type are not
   * copied. Pass an existing output to update it in place, or omit `out` to
   * receive a new `BoundingCircle` with the translated center.
   *
   * @param {BoundingCircle} bound - Source circle whose center is translated.
   * @param {number} x - Offset to add to the center's x-coordinate.
   * @param {number} y - Offset to add to the center's y-coordinate.
   * @param {BoundingCircle} [out] - Circle whose position is updated.
   * @returns {BoundingCircle} The updated output circle.
   */
  static translate(bound, x, y, out = new BoundingCircle()) {
    out.pos.x = bound.pos.x + x
    out.pos.y = bound.pos.y + y

    return out
  }

  /**
   * Copies a circle's center and radius to an output circle.
   *
   * The destination's type discriminator is preserved. When `out` is omitted,
   * a new circular bound is created and returned.
   *
   * @param {BoundingCircle} bound - Source circle.
   * @param {BoundingCircle} [out] - Circle to update in place.
   * @returns {BoundingCircle} The updated output circle.
   */
  static copy(bound, out = new BoundingCircle()) {
    out.pos.x = bound.pos.x
    out.pos.y = bound.pos.y
    out.r = bound.r

    return out
  }

  /**
   * Converts a circle to its serializable radius and position.
   *
   * The returned object contains `r` and the serialized `pos`; it does not
   * contain the `type` discriminator.
   *
   * @param {BoundingCircle} value - Circle to serialize.
   * @returns {BoundingCircleSerial} Serialized circle data.
   */
  static serialize(value) {
    return {
      r: value.r,
      pos: Vector2.serialize(value.pos)
    }
  }

  /**
   * Restores a circle from serialized radius and position data.
   *
   * When `out` is supplied, its radius and position are updated in place and
   * its type discriminator is preserved. Otherwise a new circle is returned.
   *
   * @param {BoundingCircleSerial} value - Serialized circle data.
   * @param {BoundingCircle} [out] - Circle to update in place.
   * @returns {BoundingCircle} The restored circle.
   */
  static deserialize(value, out = new BoundingCircle()) {
    out.r = value.r
    Vector2.deserialize(value.pos, out.pos)

    return out
  }

  /**
   * Checks whether a value has the serialized circle shape.
   *
   * Validation requires a non-null object with numeric `r` and valid vector
   * data in `pos`. It does not require or validate the `type` discriminator,
   * and it does not enforce a radius range or finiteness.
   *
   * @param {unknown} value - Value to validate.
   * @returns {value is BoundingCircleSerial} Whether the value is valid serialized data.
   */
  static validateSerial(value) {
    if (!value || typeof value !== 'object') {
      return false
    }

    if (!('r' in value) || !('pos' in value)) {
      return false
    }

    return typeof value.r === 'number' &&
      Vector2.validateSerial(value.pos)
  }
}

/**
 * @typedef BoundingCircleSerial
 * @property {number} r - Circle radius.
 * @property {Vector2Like} pos - Circle center.
 */
