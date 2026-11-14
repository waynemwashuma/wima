/** @import {AngleLike} from '@wimaengine/math' */
import { Angle } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Represents an entity's angular motion in 2D as an ECS component.
 *
 * Store the angular rate in radians, using positive and negative values for
 * opposite directions. Use it with {@linkcode Orientation2D} when an entity
 * needs both angular motion and a current orientation. The component follows
 * the radian representation and default value supplied by {@linkcode Angle}.
 *
 * @category component
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import { Rotation2D } from '@wimaengine/movable'
 *
 * const world = new World()
 * world.spawn([new Rotation2D(Math.PI / 2)])
 *
 * const rotations = new Query(world, [Rotation2D])
 * rotations.each(([rotation]) => {
 *   // Set the entity's angular rate to one quarter turn per second.
 *   rotation.value = Math.PI / 2
 * })
 * ```
 */
export class Rotation2D extends Angle {

  /**
   * Copies the angular motion value from one {@linkcode Rotation2D} to another.
   *
   * @param {Rotation2D} source - Component to copy.
   * @param {Rotation2D} [target=new Rotation2D()] - Component to update.
   * @returns {Rotation2D} The updated target component.
   */
  static copy(source, target = new Rotation2D()) {
    target.value = source.value

    return target
  }

  /**
   * Creates a new {@linkcode Rotation2D} with the same angular motion value as
   * the supplied component.
   *
   * @param {Rotation2D} target - Component to copy.
   * @returns {Rotation2D} A new component with the copied value.
   */
  static clone(target) {
    return Rotation2D.copy(target)
  }

  /**
   * Serializes a {@linkcode Rotation2D} to its scalar radian representation.
   *
   * @param {Rotation2D} value - Component to serialize.
   * @returns {AngleLike} The serialized radian value.
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * Creates or updates a {@linkcode Rotation2D} from a serialized radian value.
   *
   * @param {AngleLike} value - Serialized radian value.
   * @param {Rotation2D} [out=new Rotation2D()] - Component to update.
   * @returns {Rotation2D} The updated component.
   */
  static deserialize(value, out = new Rotation2D()) {
    return super.deserialize(/** @type {any} */ (value), out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
