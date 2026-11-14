/** @import {Vector2Like} from '@wimaengine/math' */

import { Vector2 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores an entity's local 2D scale as an ECS component. Its coordinates
 * default to `(1, 1)` when omitted, preserving the entity's original size on
 * both axes.
 *
 * Use {@linkcode Scale2D} with {@linkcode World} and {@linkcode Query} when an entity
 * needs a mutable 2D scale. It extends {@linkcode Vector2}.
 *
 * @category component
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import { Scale2D } from '@wimaengine/transform'
 *
 * const world = new World()
 * world.spawn([new Scale2D(2, 0.5)])
 *
 * const scales = new Query(world, [Scale2D])
 * scales.each(([scale]) => {
 *   scale.x *= 0.5
 *   scale.y *= 2
 * })
 * ```
 */
export class Scale2D extends Vector2 {

  /**
   * Creates a local 2D scale.
   *
   * @param {number} [x=1] - Scale along the local x-axis.
   * @param {number} [y=1] - Scale along the local y-axis.
   */
  constructor(x = 1, y = 1) {
    super(x, y)
  }

  /**
   * @inheritdoc
   * @param {Scale2D} source
   * @param {Scale2D} [target=new Scale2D()]
   * @returns {Scale2D}
   */
  static copy(source, target = new Scale2D()) {
    return super.copy(source, target)
  }

  /**
   * @inheritdoc
   * @param {Scale2D} target
   * @returns {Scale2D}
   */
  static clone(target) {
    return Scale2D.copy(target)
  }

  /**
   * @inheritdoc
   * @param {Scale2D} value
   * @returns {Vector2Like}
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   * @param {Vector2Like} value
   * @param {Scale2D} [out=new Scale2D()]
   * @returns {Scale2D}
   */
  static deserialize(value, out = new Scale2D()) {
    return super.deserialize(value, out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
