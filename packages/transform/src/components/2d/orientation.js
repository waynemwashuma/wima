/** @import {RotaryLike} from '@wimaengine/math' */

import { Rotary } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores an entity's local 2D orientation as an ECS component.
 *
 * A new orientation has the identity value `(1, 0)`, representing zero
 * rotation. Keep the value normalized when it represents a pure rotation.
 *
 * Use {@linkcode Position2D}, {@linkcode Scale2D}, and {@linkcode GlobalTransform2D}
 * for an entity's local 2D transform. It extends {@linkcode Rotary}.
 *
 * @category component
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import { Orientation2D } from '@wimaengine/transform'
 *
 * const world = new World()
 * world.spawn([
 *   new Orientation2D(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4))
 * ])
 *
 * const orientations = new Query(world, [Orientation2D])
 * orientations.each(([orientation]) => {
 *   // Rotary.rotate returns a rotary result; copy it into the component.
 *   orientation.copy(orientation.rotate(0.1))
 * })
 * ```
 */
export class Orientation2D extends Rotary {

  /**
   * @inheritdoc
   * @param {Orientation2D} source - Orientation to copy.
   * @param {Orientation2D} [target=new Orientation2D()] - Orientation to populate.
   * @returns {Orientation2D} The populated orientation.
   */
  static copy(source, target = new Orientation2D()) {
    return super.copy(source, target)
  }

  /**
   * @inheritdoc
   * @param {Orientation2D} target - Orientation to clone.
   * @returns {Orientation2D} A new orientation with the same value.
   */
  static clone(target) {
    return Orientation2D.copy(target)
  }

  /**
   * @inheritdoc
   * @param {Orientation2D} value - Orientation to serialize.
   * @returns {RotaryLike} The serialized orientation value.
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   * @param {RotaryLike} value - Serialized orientation value.
   * @param {Orientation2D} [out=new Orientation2D()] - Orientation to populate.
   * @returns {Orientation2D} The populated or newly created orientation.
   */
  static deserialize(value, out = new Orientation2D()) {
    return super.deserialize(value, out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
