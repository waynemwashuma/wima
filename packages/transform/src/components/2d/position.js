/** @import {Vector2Like} from '@wimaengine/math' */

import { Vector2 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores an entity's local position in 2D space as an ECS component. Its
 * coordinates default to `(0, 0)` when omitted.
 *
 * Use {@linkcode Position2D} with {@linkcode World} and {@linkcode Query} when an
 * entity needs a mutable 2D position. It extends {@linkcode Vector2}.
 *
 * @category component
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import { Position2D } from '@wimaengine/transform'
 *
 * const world = new World()
 * world.spawn([new Position2D(10, 20)])
 *
 * function moveRight(world) {
 *   const positions = new Query(world, [Position2D])
 *
 *   positions.each(([position]) => {
 *     position.x += 1
 *   })
 * }
 *
 * moveRight(world)
 * ```
 */
export class Position2D extends Vector2 {

  /**
   * @inheritdoc
   * @param {Position2D} source - Position to copy.
   * @param {Position2D} [target=new Position2D()] - Position to populate.
   * @returns {Position2D} The populated position.
   */
  static copy(source, target = new Position2D()) {
    return super.copy(source, target)
  }

  /**
   * @inheritdoc
   * @param {Position2D} target - Position to clone.
   * @returns {Position2D} A new position with the same coordinates.
   */
  static clone(target) {
    return Position2D.copy(target)
  }

  /**
   * @inheritdoc
   * @param {Position2D} value - Position to serialize.
   * @returns {Vector2Like} The serialized position coordinates.
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   * @param {Vector2Like} value - Serialized position coordinates.
   * @param {Position2D} [out=new Position2D()] - Position to populate.
   * @returns {Position2D} The populated or newly created position.
   */
  static deserialize(value, out = new Position2D()) {
    return super.deserialize(value, out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
