/** @import {Vector3Like} from '@wimaengine/math' */

import { Vector3 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */

/**
 * Represents an entity's angular motion in 3D as an ECS component.
 *
 * Use it to describe how an entity rotates around each axis over time. It
 * extends {@linkcode Vector3} and starts at `(0, 0, 0)`. Pair it with
 * {@linkcode Orientation3D} when an entity needs both angular motion and a
 * current 3D orientation.
 *
 * @category component
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import { Rotation3D } from '@wimaengine/movable'
 *
 * const world = new World()
 * world.spawn([new Rotation3D(0, 0.25, 0)])
 *
 * const rotations = new Query(world, [Rotation3D])
 * rotations.each(([rotation]) => {
 *   rotation.y += 0.1
 * })
 * ```
 */
export class Rotation3D extends Vector3 {

  /**
   * @inheritdoc
   *
   * @param {Rotation3D} source
   * @param {Rotation3D} [target=new Rotation3D()]
   * @returns {Rotation3D}
   */
  static copy(source, target = new Rotation3D()) {
    return super.copy(source, target)
  }

  /**
   * @inheritdoc
   *
   * @param {Rotation3D} target
   * @returns {Rotation3D}
   */
  static clone(target) {
    return Rotation3D.copy(target)
  }

  /**
   * @inheritdoc
   *
   * @param {Rotation3D} value
   * @returns {Vector3Like}
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   *
   * @param {Vector3Like} value
   * @param {Rotation3D} [out=new Rotation3D()]
   * @returns {Rotation3D}
   */
  static deserialize(value, out = new Rotation3D()) {
    return super.deserialize(/** @type {any} */ (value), out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
