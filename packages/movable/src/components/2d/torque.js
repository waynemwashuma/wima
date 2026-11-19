/** @import {AngleLike} from '@wimaengine/math' */
import { Angle } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Represents an entity's accumulated angular input in 2D as an ECS component.
 *
 * Its scalar value follows {@linkcode Angle} and is expressed in radians. A new
 * component starts at `0` radians. Use it with {@linkcode Rotation2D}.
 *
 * @category component
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import { Torque2D } from '@wimaengine/movable'
 *
 * const world = new World()
 * world.spawn([new Torque2D()])
 *
 * new Query(world, [Torque2D]).each(([torque]) => {
 *   // Accumulate a one-degree angular input.
 *   torque.value += Math.PI / 180
 * })
 * ```
 */
export class Torque2D extends Angle {

  /**
   * Copies the scalar value from one {@linkcode Torque2D} into another.
   *
   * @param {Torque2D} source - Component to copy.
   * @param {Torque2D} [target=new Torque2D()] - Component to update.
   * @returns {Torque2D} The updated target component.
   */
  static copy(source, target = new Torque2D()) {
    target.value = source.value

    return target
  }

  /**
   * Creates a new {@linkcode Torque2D} with the same scalar value as the source.
   *
   * @param {Torque2D} target - Component to copy.
   * @returns {Torque2D} A new component with the copied value.
   */
  static clone(target) {
    return Torque2D.copy(target)
  }

  static default() {
    return new Torque2D()
  }

  /**
   * Serializes a {@linkcode Torque2D} to its scalar radian value.
   *
   * @param {Torque2D} value - Component to serialize.
   * @returns {AngleLike} The serialized radian value.
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * Creates or updates a {@linkcode Torque2D} from a serialized scalar radian value.
   *
   * @param {AngleLike} value - Serialized radian value.
   * @param {Torque2D} [out=new Torque2D()] - Component to update.
   * @returns {Torque2D} The updated component.
   */
  static deserialize(value, out = new Torque2D()) {
    return super.deserialize(/** @type {any} */ (value), out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
