/** @import {Vector3Like} from '@wimaengine/math' */

import { Vector3 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores an entity's linear velocity in 3D as an ECS component.
 *
 * A new component starts at `(0, 0, 0)` and extends {@linkcode Vector3}. Use it
 * with {@linkcode Position3D} and {@linkcode Acceleration3D}.
 *
 * @category component
 * @example
 * ```js
 * import { Velocity3D } from '@wimaengine/movable'
 * import { Query, World } from '@wimaengine/ecs'
 *
 * const world = new World()
 * world.spawn([new Velocity3D(2, 0, -1)])
 *
 * new Query(world, [Velocity3D]).each(([velocity]) => {
 *   velocity.x = 3
 *   velocity.z = 0
 * })
 * ```
 */
export class Velocity3D extends Vector3 {

  /**
   * @inheritdoc
   * @param {Velocity3D} source
   * @param {Velocity3D} [target=new Velocity3D()]
   * @returns {Velocity3D}
   */
  static copy(source, target = new Velocity3D()) {
    return super.copy(source, target)
  }

  /**
   * @inheritdoc
   * @param {Velocity3D} target
   * @returns {Velocity3D}
   */
  static clone(target) {
    return Velocity3D.copy(target)
  }

  /**
   * @inheritdoc
   * @param {Velocity3D} value
   * @returns {Vector3Like}
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   * @param {Vector3Like} value
   * @param {Velocity3D} [out=new Velocity3D()]
   * @returns {Velocity3D}
   */
  static deserialize(value, out = new Velocity3D()) {
    return super.deserialize(/** @type {any} */ (value), out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
