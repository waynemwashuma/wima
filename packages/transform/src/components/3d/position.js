/** @import {Vector3Like} from '@wimaengine/math' */

import { Vector3 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores an entity's local position in 3D space as an ECS component. Its
 * coordinates default to `(0, 0, 0)` when omitted.
 *
 * Use it with {@linkcode World} and {@linkcode Query} when an entity needs a
 * mutable 3D position. It extends {@linkcode Vector3}.
 *
 * @category component
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import { Position3D } from '@wimaengine/transform'
 *
 * const world = new World()
 * world.spawn([new Position3D(10, 20, 30)])
 *
 * const positions = new Query(world, [Position3D])
 * positions.each(([position]) => {
 *   position.z += 1
 * })
 * ```
 */
export class Position3D extends Vector3 {

  /**
   * @inheritdoc
   * @param {Position3D} source
   * @param {Position3D} [target=new Position3D()]
   * @returns {Position3D}
   */
  static copy(source, target = new Position3D()) {
    return super.copy(source, target)
  }

  /**
   * @inheritdoc
   * @param {Position3D} target
   * @returns {Position3D}
   */
  static clone(target) {
    return Position3D.copy(target)
  }

  /**
   * @inheritdoc
   * @param {Position3D} value
   * @returns {Vector3Like}
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   * @param {Vector3Like} value
   * @param {Position3D} [out=new Position3D()]
   * @returns {Position3D}
   */
  static deserialize(value, out = new Position3D()) {
    return super.deserialize(value, out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
