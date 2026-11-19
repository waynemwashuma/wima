/** @import {Vector2Like} from '@wimaengine/math' */
import { Vector2 } from '@wimaengine/math'

/* eslint-disable jsdoc/check-tag-names */
/**
 * Stores an entity's linear velocity in 2D as an ECS component.
 *
 * Its `x` and `y` values describe movement along the two axes in coordinate
 * units per second. A new component starts at `(0, 0)`. Pair it with
 * {@linkcode Position2D} for an entity's 2D position and {@linkcode Acceleration2D}
 * for a change in velocity.
 *
 * @category component
 * @example
 * ```js
 * import { Velocity2D } from '@wimaengine/movable'
 * import { Query, World } from '@wimaengine/ecs'
 *
 * const world = new World()
 * world.spawn([new Velocity2D(2, -1)])
 *
 * new Query(world, [Velocity2D]).each(([velocity]) => {
 *   velocity.x = 3
 *   velocity.y = 0
 * })
 * ```
 */
export class Velocity2D extends Vector2 {

  /**
   * @inheritdoc
   * @param {Velocity2D} source
   * @param {Velocity2D} [target=new Velocity2D()]
   * @returns {Velocity2D}
   */
  static copy(source, target = new Velocity2D()) {
    return super.copy(source, target)
  }

  /**
   * Creates a new {@linkcode Velocity2D} with the same coordinates as another one.
   *
   * @param {Velocity2D} target
   * @returns {Velocity2D}
   */
  static clone(target) {
    return Velocity2D.copy(target)
  }

  static default() {
    return new Velocity2D()
  }

  /**
   * @inheritdoc
   * @param {Velocity2D} value
   * @returns {Vector2Like}
   */
  static serialize(value) {
    return super.serialize(value)
  }

  /**
   * @inheritdoc
   * @param {Vector2Like} value
   * @param {Velocity2D} [out=new Velocity2D()]
   * @returns {Velocity2D}
   */
  static deserialize(value, out = new Velocity2D()) {
    return super.deserialize(/** @type {any} */ (value), out)
  }
}
/* eslint-enable jsdoc/check-tag-names */
