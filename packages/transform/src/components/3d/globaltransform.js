/** @import {Affine3Like} from '@wimaengine/math' */

import { Affine3 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores an entity's resolved 3D world-space transform as an ECS component.
 *
 * Use {@linkcode GlobalTransform3D} with {@linkcode Position3D},
 * {@linkcode Orientation3D}, and {@linkcode Scale3D} when an entity needs a
 * computed world-space pose. A root entity's value reflects its local
 * transform; a child entity's value also includes the transforms above it in
 * the {@linkcode Parent}/{@linkcode Children} hierarchy. The component extends
 * {@linkcode Affine3} for affine 3D transform data and operations.
 *
 * @category component
 *
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import { Vector3 } from '@wimaengine/math'
 * import {
 *   GlobalTransform3D,
 *   Orientation3D,
 *   Position3D,
 *   Scale3D
 * } from '@wimaengine/transform'
 *
 * const world = new World()
 * world.spawn([
 *   new Position3D(),
 *   new Orientation3D(),
 *   new Scale3D(),
 *   new GlobalTransform3D()
 * ])
 *
 * const transforms = new Query(world, [GlobalTransform3D])
 * transforms.each(([global]) => {
 *   const worldOrigin = global.transform(new Vector3())
 *   console.log(worldOrigin.x, worldOrigin.y, worldOrigin.z)
 * })
 * ```
 */
export class GlobalTransform3D extends Affine3 {

  /**
   * @inheritdoc
   * @param {GlobalTransform3D} source
   * @param {GlobalTransform3D} [target=new GlobalTransform3D()]
   * @returns {GlobalTransform3D}
   */
  static copy(source, target = new GlobalTransform3D()) {
    return super.copy(source, target)
  }

  /**
   * @inheritdoc
   * @param {GlobalTransform3D} target
   * @returns {GlobalTransform3D}
   */
  static clone(target) {
    return GlobalTransform3D.copy(target)
  }

  /**
   * @inheritdoc
   * @param {GlobalTransform3D} value
   * @returns {Affine3Like}
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   * @param {Affine3Like} value
   * @param {GlobalTransform3D} [out=new GlobalTransform3D()]
   * @returns {GlobalTransform3D}
   */
  static deserialize(value, out = new GlobalTransform3D()) {
    return super.deserialize(value, out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
