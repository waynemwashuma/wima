/** @import {Affine2Like} from '@wimaengine/math' */

import { Affine2 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores an entity's resolved 2D world-space transform as an ECS component.
 *
 * Use {@linkcode GlobalTransform2D} with {@linkcode Position2D},
 * {@linkcode Orientation2D}, and {@linkcode Scale2D} when an entity needs a
 * computed world-space pose. A root entity's value reflects its local
 * transform; a child entity's value also includes the transforms above it in
 * the {@linkcode Parent}/{@linkcode Children} hierarchy. The component extends
 * {@linkcode Affine2} for affine 2D transform data and operations.
 *
 * @category component
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import {
 *   GlobalTransform2D,
 *   Orientation2D,
 *   Position2D,
 *   Scale2D
 * } from '@wimaengine/transform'
 *
 * const world = new World()
 * world.spawn([
 *   new Position2D(),
 *   new Orientation2D(),
 *   new Scale2D(),
 *   new GlobalTransform2D()
 * ])
 *
 * // In an app with Transform2DPlugin, this value is the entity's resolved
 * // world-space transform once its transform has been updated.
 * const transforms = new Query(world, [GlobalTransform2D])
 * transforms.each(([transform]) => {
 *   console.log(transform.x, transform.y)
 * })
 * ```
 */
export class GlobalTransform2D extends Affine2 {

  /**
   * @inheritdoc
   * @param {GlobalTransform2D} source
   * @param {GlobalTransform2D} [target=new GlobalTransform2D()]
   * @returns {GlobalTransform2D}
   */
  static copy(source, target = new GlobalTransform2D()) {
    return super.copy(source, target)
  }

  static default() {
    return new GlobalTransform2D()
  }

  /**
   * @inheritdoc
   * @param {GlobalTransform2D} target
   * @returns {GlobalTransform2D}
   */
  static clone(target) {
    return GlobalTransform2D.copy(target)
  }

  /**
   * @inheritdoc
   * @param {GlobalTransform2D} value
   * @returns {Affine2Like}
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   * @param {Affine2Like} value
   * @param {GlobalTransform2D} [out=new GlobalTransform2D()]
   * @returns {GlobalTransform2D}
   */
  static deserialize(value, out = new GlobalTransform2D()) {
    return super.deserialize(value, out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
