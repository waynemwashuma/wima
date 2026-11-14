/** @import {Vector3Like} from '@wimaengine/math' */

import { Vector3 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores an entity's accumulated angular input in 3D as an ECS component. Its
 * coordinates represent angular contributions around the corresponding axes,
 * in radians. A new component starts at `(0, 0, 0)`. Use it with
 * {@linkcode Rotation3D} for an entity's angular motion.
 *
 * @category component
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import { Rotation3D, Torque3D } from '@wimaengine/movable'
 *
 * const world = new World()
 * world.spawn([new Rotation3D(), new Torque3D()])
 *
 * new Query(world, [Rotation3D, Torque3D]).each(([rotation, torque]) => {
 *   torque.y += 1
 *   // Accumulate angular input around the y axis.
 *   console.log(rotation, torque)
 * })
 * ```
 */
export class Torque3D extends Vector3 {

  /**
   * @inheritdoc
   *
   * @param {Torque3D} source
   * @param {Torque3D} [target=new Torque3D()]
   * @returns {Torque3D}
   */
  static copy(source, target = new Torque3D()) {
    return super.copy(source, target)
  }

  /**
   * @inheritdoc
   *
   * @param {Torque3D} target
   * @returns {Torque3D}
   */
  static clone(target) {
    return Torque3D.copy(target)
  }

  /**
   * @inheritdoc
   * @param {Torque3D} value
   * @returns {Vector3Like}
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   * @param {Vector3Like} value
   * @param {Torque3D} [out=new Torque3D()]
   * @returns {Torque3D}
   */
  static deserialize(value, out = new Torque3D()) {
    return super.deserialize(/** @type {any} */ (value), out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
