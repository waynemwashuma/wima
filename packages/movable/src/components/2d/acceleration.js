/** @import {Vector2Like} from '@wimaengine/math' */
import { Vector2 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Represents an entity's linear acceleration in 2D as an ECS component.
 * A new component starts at `(0, 0)`. Use it with {@linkcode Velocity2D} and
 * {@linkcode Position2D}.
 *
 * @category component
 * @example
 * ```js
 * import { Query, World } from '@wimaengine/ecs'
 * import { Acceleration2D } from '@wimaengine/movable'
 *
 * const world = new World()
 * world.spawn([new Acceleration2D(0, -9.8)])
 *
 * new Query(world, [Acceleration2D]).each(([acceleration]) => {
 *   acceleration.x += 2
 * })
 * ```
 */
export class Acceleration2D extends Vector2 {

  /**
   * @inheritdoc
   * @param {Acceleration2D} source
   * @param {Acceleration2D} [target=new Acceleration2D()]
   * @returns {Acceleration2D}
   */
  static copy(source, target = new Acceleration2D()) {
    return super.copy(source, target)
  }

  /**
   * Creates a new {@linkcode Acceleration2D} with the same coordinates as another one.
   *
   * @param {Acceleration2D} target
   * @returns {Acceleration2D}
   */
  static clone(target) {
    return Acceleration2D.copy(target)
  }

  /**
   * @inheritdoc
   * @param {Acceleration2D} value
   * @returns {Vector2Like}
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   * @param {Vector2Like} value
   * @param {Acceleration2D} [out=new Acceleration2D()]
   * @returns {Acceleration2D}
   */
  static deserialize(value, out = new Acceleration2D()) {
    return super.deserialize(/** @type {any} */ (value), out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
