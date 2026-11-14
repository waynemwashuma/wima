/** @import {Vector3Like} from '@wimaengine/math' */

import { Vector3 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Represents an entity's linear acceleration in 3D as an ECS component.
 *
 * Use it to describe how an entity's velocity changes over time. It extends
 * {@linkcode Vector3} and starts at `(0, 0, 0)`. Pair it with
 * {@linkcode Velocity3D} and {@linkcode Position3D}.
 *
 * @category component
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import { Acceleration3D } from '@wimaengine/movable'
 *
 * const world = new World()
 * world.spawn([new Acceleration3D(0, -9.8, 0)])
 *
 * new Query(world, [Acceleration3D]).each(([acceleration]) => {
 *   acceleration.x += 1
 * })
 * ```
 */
export class Acceleration3D extends Vector3 {

  /**
   * @inheritdoc
   * @param {Acceleration3D} source
   * @param {Acceleration3D} [target=new Acceleration3D()]
   * @returns {Acceleration3D}
   */
  static copy(source, target = new Acceleration3D()) {
    return super.copy(source, target)
  }

  /**
   * @inheritdoc
   * @param {Acceleration3D} target
   * @returns {Acceleration3D}
   */
  static clone(target) {
    return Acceleration3D.copy(target)
  }

  /**
   * @inheritdoc
   * @param {Acceleration3D} value
   * @returns {Vector3Like}
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   * @param {Vector3Like} value
   * @param {Acceleration3D} [out=new Acceleration3D()]
   * @returns {Acceleration3D}
   */
  static deserialize(value, out = new Acceleration3D()) {
    return super.deserialize(/** @type {any} */ (value), out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
