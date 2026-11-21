/** @import {Vector3Like} from '@wimaengine/math' */

import { Vector3 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores an entity's local scale in 3D space as an ECS component. Its
 * coordinates default to `(1, 1, 1)` when omitted, preserving the entity's
 * original size on every axis.
 *
 * Use it with {@linkcode World} and {@linkcode Query} when an entity needs a
 * mutable 3D scale. It extends {@linkcode Vector3}.
 *
 * @category component
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import { Scale3D } from '@wimaengine/transform'
 *
 * const world = new World()
 * world.spawn([new Scale3D(2, 1, 0.5)])
 *
 * const scales = new Query(world, [Scale3D])
 * scales.each(([scale]) => {
 *   scale.set(scale.x * 0.5, scale.y * 0.5, scale.z * 0.5)
 * })
 * ```
 */
export class Scale3D extends Vector3 {

  /**
   * Creates a local 3D scale.
   *
   * @param {number} [x=1] - Scale along the local x-axis.
   * @param {number} [y=1] - Scale along the local y-axis.
   * @param {number} [z=1] - Scale along the local z-axis.
   */
  constructor(x = 1, y = 1, z = 1) {
    super(x, y, z)
  }

  static default() {
    return new Scale3D()
  }

  /**
   * @inheritdoc
   * @param {Scale3D} source
   * @param {Scale3D} [target=new Scale3D()]
   * @returns {Scale3D}
   */
  static copy(source, target = new Scale3D()) {
    return super.copy(source, target)
  }

  /**
   * @inheritdoc
   * @param {Scale3D} target
   * @returns {Scale3D}
   */
  static clone(target) {
    return Scale3D.copy(target)
  }

  /**
   * @inheritdoc
   * @param {Scale3D} value
   * @returns {Vector3Like}
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   * @param {Vector3Like} value
   * @param {Scale3D} [out=new Scale3D()]
   * @returns {Scale3D}
   */
  static deserialize(value, out = new Scale3D()) {
    return super.deserialize(value, out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
