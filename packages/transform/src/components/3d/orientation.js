/** @import {QuaternionLike} from '@wimaengine/math' */

import { Quaternion } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores an entity's local 3D orientation as an ECS component.
 *
 * `Orientation3D` extends {@linkcode Quaternion} to represent local rotation in
 * 3D space. New instances use the identity orientation, leaving the entity's
 * local rotation unchanged until the component is updated.
 *
 * @category component
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import { Quaternion } from '@wimaengine/math'
 * import { Orientation3D } from '@wimaengine/transform'
 *
 * const world = new World()
 * world.spawn([new Orientation3D()])
 *
 * const orientations = new Query(world, [Orientation3D])
 * const turn = Quaternion.fromEuler(0, Math.PI / 2, 0)
 * orientations.each(([orientation]) => {
 *   orientation.copy(orientation.multiply(turn).normalize())
 * })
 * ```
 */
export class Orientation3D extends Quaternion {

  /**
   * @inheritdoc
   * @param {Orientation3D} source
   * @param {Orientation3D} [target=new Orientation3D()]
   * @returns {Orientation3D}
   */
  static copy(source, target = new Orientation3D()) {
    return super.copy(source, target)
  }

  /**
   * @inheritdoc
   * @param {Orientation3D} target
   * @returns {Orientation3D}
   */
  static clone(target) {
    return Orientation3D.copy(target)
  }

  /**
   * @inheritdoc
   * @param {Orientation3D} value
   * @returns {QuaternionLike}
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   * @param {QuaternionLike} value
   * @param {Orientation3D} [out=new Orientation3D()]
   * @returns {Orientation3D}
   */
  static deserialize(value, out = new Orientation3D()) {
    return super.deserialize(value, out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
